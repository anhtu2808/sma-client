import React from "react";
import Button from "@/components/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCircleCheck, faQrcode, faRotate } from '../../../utils/icons';
import formatCurrency from "@/utils/formatCurrency";

const QRPaymentSection = ({
    totalPrice,
    isLoading,
    qrCodeUrl,
    onBack,
    previewData,
    onScheduleConfirm,
}) => {
    if (previewData?.isScheduled && !qrCodeUrl && !isLoading) {
        return (
            <div className="lg:col-span-6 flex flex-col items-center justify-center text-center py-8">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                    <FontAwesomeIcon icon={faCircleCheck} className="text-3xl text-amber-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Plan Scheduled</h3>
                <p className="text-sm text-gray-500 mb-2">
                    Your current plan ({previewData.currentPlanName}) is still active.
                </p>
                <p className="text-sm text-gray-500">
                    {previewData.newPlanName} will start on{' '}
                    <span className="font-semibold">
                        {new Date(previewData.currentPlanEndDate).toLocaleDateString('vi-VN')}
                    </span>
                </p>
                <Button mode="primary" onClick={onScheduleConfirm || onBack} className="px-8 mt-6">
                    Got it
                </Button>
            </div>
        );
    }

    return (
        <div className="lg:col-span-6 flex flex-col items-center justify-center text-center relative py-4 lg:py-8 lg:px-12">
            <h2 className="text-[#111e3b] text-[1.35rem] font-extrabold mb-10 tracking-tight">Scan to Pay</h2>

            {/* QR Card Container */}
            <div className="bg-white p-3 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-50 mb-8 w-full max-w-[340px] aspect-square flex items-center justify-center">
                <div className="bg-[#fc9c82] w-full h-full rounded-2xl flex items-center justify-center p-8">
                    {isLoading ? (
                        <div className="text-white flex flex-col items-center justify-center gap-2">
                            <FontAwesomeIcon icon={faRotate} className="animate-spin" />
                            <span className="text-sm font-medium">Loading QR...</span>
                        </div>
                    ) : qrCodeUrl ? (
                        <img
                            src={qrCodeUrl}
                            alt="Payment QR Code"
                            className="w-full h-full object-contain bg-white p-3 rounded-xl shadow-sm transition-transform duration-300 hover:scale-[1.02]"
                        />
                    ) : (
                        <div className="bg-white w-full h-full rounded-xl flex flex-col items-center justify-center text-gray-400 gap-2 p-4">
                            <FontAwesomeIcon icon={faQrcode} className="text-3xl" />
                            <span className="text-[13px] font-medium text-center">QR Code not available</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Scan to Pay Target */}
            <div className="flex items-center gap-2 text-[#fc9c82] font-semibold bg-[#fff1ed] px-4 py-2 rounded-lg mb-8">
                <FontAwesomeIcon icon={faQrcode} className="text-xl" />
                <span>Scan to pay {previewData?.isUpgrade ? formatCurrency(previewData.upgradePrice) : totalPrice}</span>
            </div>

            {/* Back Button */}
            <Button
                onClick={onBack}
                mode="primary"
                shape="round"
                size="lg"
                className="text-[#8492a6] hover:text-[#3b4356] text-[13.5px] font-semibold flex items-center gap-1.5 transition-colors mt-auto pt-6 mb-8"
            >
                <FontAwesomeIcon icon={faArrowLeft} className="text-[16px]" />
                Cancel & Go back
            </Button>

        </div>
    );
};

export default QRPaymentSection;
