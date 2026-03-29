import React, { useEffect, useState } from "react";
import { Modal, Result } from "antd";
import { useCreateSubscriptionMutation } from "@/apis/subscriptionApi";
import { useGetPaymentStatusQuery } from "@/apis/paymentApi";
import Button from "@/components/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCircleCheck, faQrcode, faRotate } from '../../../../utils/icons';

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

    const duration = plan?.durations?.find((d) => d.key === selectedDuration);
    const planName = plan?.name;
    const totalPrice = duration ? duration.total : plan?.price;
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

    const renderContent = () => {
        if (paymentStatus === "SUCCESS") {
            return (
                <Result
                    status="success"
                    title="Payment Successful!"
                    subTitle={`Your subscription to ${planName} has been activated.`}
                    extra={[
                        <Button key="continue" mode="primary" onClick={handleClose} className="px-8">
                            Continue
                        </Button>,
                    ]}
                />
            );
        }

        if (paymentStatus === "FAILED") {
            return (
                <Result
                    status="error"
                    title="Payment Failed"
                    subTitle="We were unable to process your payment."
                    extra={[
                        <Button key="cancel" mode="outline" onClick={handleClose} className="px-8">
                            Cancel
                        </Button>,
                        <Button key="retry" mode="primary" onClick={generateSubscription} className="px-8">
                            Try Again
                        </Button>,
                    ]}
                />
            );
        }

        return (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-2 lg:p-6">
                {/* Left Column - Plan Details */}
                <div className="flex flex-col">
                    <h2 className="text-[#3b4356] text-xl font-extrabold mb-4 tracking-tight">Order Summary</h2>
                    <h3 className="text-primary font-bold text-xl mb-2">{planName}</h3>
                    <div className="mb-2">
                        <span className="text-3xl font-extrabold text-[#111e3b]">{totalPrice}</span>
                    </div>
                    {durationLabel && (
                        <p className="text-[#8492a6] text-sm mb-4">Duration: {durationLabel}</p>
                    )}
                    <div className="pt-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faCircleCheck} className="text-primary text-sm" />
                            <span className="text-primary font-medium text-sm">Cancel anytime</span>
                        </div>
                    </div>

                    {/* Payment Instructions */}
                    <div className="w-full text-left bg-[#fff8f5] border border-[#ffeedd] rounded-2xl p-4 mt-4">
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

                {/* Right Column - QR Payment */}
                <div className="flex flex-col items-center justify-center text-center">
                    <h2 className="text-[#111e3b] text-xl font-extrabold mb-2 tracking-tight">Scan to Pay</h2>
                    <p className="text-[#8492a6] text-sm mb-4">
                        Open your banking or e-wallet app
                    </p>

                    <div className="bg-white p-3 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-50 mb-4 w-full max-w-[280px] aspect-square flex items-center justify-center">
                        <div className="bg-[#fc9c82] w-full h-full rounded-2xl flex items-center justify-center p-6">
                            {isApiLoading ? (
                                <div className="text-white flex flex-col items-center justify-center gap-2">
                                    <FontAwesomeIcon icon={faRotate} className="animate-spin" />
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
                                    <FontAwesomeIcon icon={faQrcode} className="text-3xl" />
                                    <span className="text-[13px] font-medium text-center">QR Code not available</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-[#fc9c82] font-semibold bg-[#fff1ed] px-4 py-2 rounded-lg mb-4">
                        <FontAwesomeIcon icon={faQrcode} className="text-xl" />
                        <span>Scan to pay {totalPrice}</span>
                    </div>

                    <Button
                        onClick={handleClose}
                        mode="outline"
                        shape="round"
                        size="lg"
                        className="text-[#8492a6] hover:text-[#3b4356] text-sm font-semibold flex items-center gap-1.5"
                    >
                        <FontAwesomeIcon icon={faArrowLeft} className="text-[16px]" />
                        Cancel & Go back
                    </Button>
                </div>
            </div>
        );
    };

    return (
        <Modal
            open={isOpen && !!plan}
            onCancel={handleClose}
            footer={null}
            width={800}
            centered
            destroyOnClose
        >
            {renderContent()}
        </Modal>
    );
};

export default PaymentModal;
