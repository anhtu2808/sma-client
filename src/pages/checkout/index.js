import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { notification } from "antd";
import { useCreateSubscriptionMutation } from "@/apis/subscriptionApi";
import QRPaymentSection from "./components/QRPaymentSection";
import OrderSummarySection from "./components/OrderSummarySection";

const Checkout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Retrieve plan details from the state passed via navigation
    const { plan, selectedDuration } = location.state || {};

    // API logic
    const [createSubscription, { isLoading: isApiLoading }] = useCreateSubscriptionMutation();
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initial load handler to generate QR
    useEffect(() => {
        const generateSubscription = async () => {
            if (!plan) return;
            const duration = plan.durations?.find((d) => d.key === selectedDuration);
            // We need a valid planId and planPriceId to send
            const planId = plan.id;
            // If there's a selected duration, use it; otherwise use the plan's base priceId (for lifetime plans)
            const planPriceId = duration ? Number(selectedDuration) : Number(plan.priceId);

            try {
                const payload = {
                    planId: planId,
                    planPriceId: planPriceId
                };

                const res = await createSubscription(payload).unwrap();
                if (res?.data) {
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

        generateSubscription();
    }, [plan, selectedDuration, createSubscription]);

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

    const handlePayment = async () => {
        setIsSubmitting(true);
        // Simulate API call for checking payment status or user confirming payment
        setTimeout(() => {
            setIsSubmitting(false);
            notification.success({
                message: "Payment Successful",
                description: `You have successfully subscribed to the ${planName}.`,
                placement: "topRight"
            });
            navigate("/dashboard");
        }, 1500);
    };

    return (
        <div className="flex justify-center w-full min-h-screen pt-12 pb-24 px-4 bg-[#f8f9fa]">
            <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-[#f1f3f9] p-6 sm:p-10 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-12 lg:gap-x-16 items-stretch">
                    <OrderSummarySection
                        planName={planName}
                        planDescription={planDescription}
                        totalPrice={totalPrice}
                        durationMonths={duration?.months}
                        isSubmitting={isSubmitting}
                        onCompletePayment={handlePayment}
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
        </div>
    );
};

export default Checkout;
