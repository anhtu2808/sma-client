import React, { useEffect, useState } from "react";
import { useCreateSubscriptionMutation } from "@/apis/subscriptionApi";
import { useGetPaymentStatusQuery } from "@/apis/paymentApi";
import Loading from "@/components/Loading";
import Button from "@/components/Button";

const PaymentModal = ({ isOpen, onClose, plan, selectedDuration }) => {
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
            } else if (status === "FAILED") {
                setPaymentStatus("FAILED");
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
            console.error("Error generating subscription:", error);
        }
    };

    // Generate subscription when modal opens
    useEffect(() => {
        if (isOpen && plan) {
            generateSubscription();
        }
    }, [isOpen, plan, selectedDuration]);

    if (!isOpen || !plan) return null;

    const duration = plan.durations?.find((d) => d.key === selectedDuration);
    const planName = plan.name;
    const totalPrice = duration ? duration.total : plan.price;
    const months = duration?.months || 0;
    const durationLabel = months >= 12
        ? `${Math.round(months / 12)} year${Math.round(months / 12) > 1 ? 's' : ''}`
        : months > 0
            ? `${months} month${months > 1 ? 's' : ''}`
            : '';

    const handleClose = () => {
        setPaymentStatus("PENDING");
        setQrCodeUrl(null);
        setPaymentId(null);
        onClose();
    };

    const handleBack = () => {
        handleClose();
    };

    // Show success state
    if (paymentStatus === "SUCCESS") {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" onClick={handleClose}>
                <div
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden pb-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                            <span className="material-icons-round text-5xl text-green-500">check_circle</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                        <p className="text-gray-500 mb-8">Your subscription to {planName} has been activated.</p>
                        <Button mode="primary" onClick={handleClose} className="px-8">
                            Continue
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Show failed state
    if (paymentStatus === "FAILED") {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" onClick={handleClose}>
                <div
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden pb-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
                        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
                            <span className="material-icons-round text-5xl text-red-500">error</span>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Failed</h2>
                        <p className="text-gray-500 mb-8">We were unable to process your payment.</p>
                        <div className="flex gap-4">
                            <Button mode="outline" onClick={handleClose} className="px-8">
                                Cancel
                            </Button>
                            <Button mode="primary" onClick={generateSubscription} className="px-8">
                                Try Again
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50" onClick={handleClose}>
            <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden pb-6"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-end p-4 pb-0">
                    <button
                        onClick={handleClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <span className="material-icons-round text-gray-400">close</span>
                    </button>
                </div>

                {/* Main Content - 2 Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-10">
                    {/* Left Column - Plan Details */}
                    <div className="flex flex-col">
                        <h2 className="text-[#3b4356] text-xl font-extrabold mb-6 tracking-tight">Order Summary</h2>

                        {/* Plan Name - Green */}
                        <h3 className="text-primary font-bold text-xl mb-2">{planName}</h3>

                        {/* Price */}
                        <div className="mb-2">
                            <span className="text-3xl font-extrabold text-[#111e3b]">{totalPrice}</span>
                        </div>
                        {durationLabel && (
                            <p className="text-[#8492a6] text-sm mb-6">Duration: {durationLabel}</p>
                        )}

                        {/* Terms */}
                        <div className="mt-auto pt-6 space-y-3">
                            <div className="flex items-center gap-2">
                                <span className="material-icons-round text-primary text-sm">check_circle</span>
                                <span className="text-primary font-medium text-sm">Cancel anytime</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="material-icons-round text-[#8492a6] text-sm">security</span>
                                <span className="text-[#8492a6] text-sm">7-day money-back guarantee</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - QR Payment */}
                    <div className="flex flex-col items-center justify-center text-center">
                        <h2 className="text-[#111e3b] text-xl font-extrabold mb-2 tracking-tight">Scan to Pay</h2>
                        <p className="text-[#8492a6] text-sm mb-6">
                            Open your banking or e-wallet app
                        </p>

                        {/* QR Code Container */}
                        <div className="bg-white p-3 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-50 mb-6 w-full max-w-[280px] aspect-square flex items-center justify-center">
                            <div className="bg-[#fc9c82] w-full h-full rounded-2xl flex items-center justify-center p-6">
                                {isApiLoading ? (
                                    <div className="text-white flex flex-col items-center justify-center gap-2">
                                        <span className="material-icons-round animate-spin">refresh</span>
                                        <span className="text-sm font-medium">Loading QR...</span>
                                    </div>
                                ) : qrCodeUrl ? (
                                    <img
                                        src={qrCodeUrl}
                                        alt="Payment QR Code"
                                        className="w-full h-full object-contain bg-white p-3 rounded-xl shadow-sm"
                                    />
                                ) : (
                                    <div className="bg-white w-full h-full rounded-xl flex flex-col items-center justify-center text-gray-400 gap-2 p-4">
                                        <span className="material-icons-round text-3xl">qr_code_scanner</span>
                                        <span className="text-[13px] font-medium text-center">QR Code not available</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Scan to Pay Target */}
                        <div className="flex items-center gap-2 text-[#fc9c82] font-semibold bg-[#fff1ed] px-4 py-2 rounded-lg mb-6">
                            <span className="material-icons-round text-xl">qr_code_scanner</span>
                            <span>Scan to pay {totalPrice}</span>
                        </div>

                        {/* Cancel Button */}
                        <Button
                            onClick={handleBack}
                            mode="outline"
                            shape="round"
                            size="lg"
                            className="text-[#8492a6] hover:text-[#3b4356] text-sm font-semibold flex items-center gap-1.5 mb-6"
                        >
                            <span className="material-icons-round text-[16px]">arrow_back</span>
                            Cancel & Go back
                        </Button>

                        {/* Payment Instructions */}
                        <div className="w-full text-left bg-[#fff8f5] border border-[#ffeedd] rounded-2xl p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-[#3b4356] font-bold text-sm">Payment Instructions</span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex gap-3 items-start">
                                    <div className="w-5 h-5 shrink-0 rounded-full bg-[#faebe6] text-[#fc9c82] flex items-center justify-center font-bold text-[11px] mt-0.5">1</div>
                                    <p className="text-[#8492a6] text-xs">Open your banking app</p>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <div className="w-5 h-5 shrink-0 rounded-full bg-[#faebe6] text-[#fc9c82] flex items-center justify-center font-bold text-[11px] mt-0.5">2</div>
                                    <p className="text-[#8492a6] text-xs">Scan the QR code</p>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <div className="w-5 h-5 shrink-0 rounded-full bg-[#faebe6] text-[#fc9c82] flex items-center justify-center font-bold text-[11px] mt-0.5">3</div>
                                    <p className="text-[#8492a6] text-xs">Confirm the payment</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
