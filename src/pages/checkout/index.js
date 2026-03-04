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
        <div className="flex items-start justify-start w-full">
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
                <QRPaymentSection
                    planName={planName}
                    totalPrice={totalPrice}
                    isLoading={isApiLoading}
                    qrCodeUrl={qrCodeUrl}
                    onBack={() => navigate(-1)}
                />

                <OrderSummarySection
                    planName={planName}
                    planDescription={planDescription}
                    totalPrice={totalPrice}
                    durationMonths={duration?.months}
                    isSubmitting={isSubmitting}
                    onCompletePayment={handlePayment}
                    isLoadingQR={isApiLoading}
                />
            </div>
        </div>
    );
};

export default Checkout;
