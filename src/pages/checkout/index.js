import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { notification } from "antd";
import { useCreateSubscriptionMutation } from "@/apis/subscriptionApi";
import { useGetPaymentStatusQuery } from "@/apis/paymentApi";
import QRPaymentSection from "./components/QRPaymentSection";
import OrderSummarySection from "./components/OrderSummarySection";
import CheckoutSuccess from "./components/CheckoutSuccess";
import CheckoutFailed from "./components/CheckoutFailed";

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Retrieve plan details from the state passed via navigation
    const { plan, selectedDuration } = location.state || {};

    // API logic
    const [createSubscription, { isLoading: isApiLoading }] = useCreateSubscriptionMutation();
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [paymentId, setPaymentId] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState("PENDING"); // PENDING, SUCCESS, FAILED

    const { data: statusRes } = useGetPaymentStatusQuery(paymentId, {
        skip: !paymentId || paymentStatus === 'SUCCESS' || paymentStatus === 'FAILED',
        pollingInterval: 3000,
    });

    useEffect(() => {
        if (statusRes?.data) {
            const status = statusRes.data.toUpperCase();
            if (status === "SUCCESS") {
                setPaymentStatus("SUCCESS");
                notification.success({
                    message: "Payment Successful",
                    description: `Your subscription has been activated successfully.`,
                    placement: "topRight"
                });
            } else if (status === "FAILED") {
                setPaymentStatus("FAILED");
                notification.error({
                    message: "Payment Failed",
                    description: `We were unable to process your payment.`,
                    placement: "topRight"
                });
            }
        }
    }, [statusRes]);

    const generateSubscription = async () => {
        if (!plan) return;
        setPaymentStatus("PENDING");
        setQrCodeUrl(null);
        setPaymentId(null);

        const duration = plan.durations?.find((d) => d.key === selectedDuration);
        const planId = plan.id;
        const planPriceId = duration ? Number(selectedDuration) : Number(plan.priceId);

        try {
            const payload = { planId, planPriceId };
            const res = await createSubscription(payload).unwrap();

            if (res?.data?.payment) {
                if (res.data.payment.qr) setQrCodeUrl(res.data.payment.qr);
                if (res.data.payment.id) setPaymentId(res.data.payment.id);
            } else if (typeof res?.data === 'string') {
                setQrCodeUrl(res.data);
            }
        } catch (error) {
            notification.error({
                message: "Error Generating Payment",
                description: "We couldn't generate the QR code at this time.",
                placement: "topRight"
            });
        }
    };

    // Initial load handler to generate QR
    useEffect(() => {
        generateSubscription();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [plan, selectedDuration]);

    // If no plan is passed, redirect to pricing
    if (!plan) {
        return <Navigate to="/pricing" replace />;
    }

    const duration = plan.durations?.find((d) => d.key === selectedDuration);
    const planName = plan.name;
    const totalPrice = duration ? duration.total : `${plan.basePriceLabel} ${plan.baseUnit}`;
    const planDescription = duration
        ? `${duration.months} months subscription`
        : "Lifetime / Standard subscription";

    return (
        <div className="flex justify-center w-full min-h-screen pt-12 pb-24 px-4 bg-[#f8f9fa]">
            {paymentStatus === "SUCCESS" ? (
                <CheckoutSuccess
                    planName={planName}
                    totalPrice={totalPrice}
                    durationMonths={duration?.months}
                />
            ) : paymentStatus === "FAILED" ? (
                <CheckoutFailed
                    planName={planName}
                    totalPrice={totalPrice}
                    onRetry={generateSubscription}
                />
            ) : (
                <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-[#f1f3f9] p-6 sm:p-10 lg:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-16 items-stretch">
                        <OrderSummarySection
                            planName={planName}
                            planDescription={planDescription}
                            totalPrice={totalPrice}
                            durationMonths={duration?.months}
                            isLoadingQR={isApiLoading}
                        />

                        <QRPaymentSection
                            planName={planName}
                            totalPrice={totalPrice}
                            isLoading={isApiLoading}
                            qrCodeUrl={qrCodeUrl}
                            onBack={() => navigate(-1)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
