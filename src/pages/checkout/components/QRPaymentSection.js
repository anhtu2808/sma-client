import React, { useEffect } from "react";
import Button from "@/components/Button";
import Loading from "@/components/Loading";

const QRPaymentSection = ({
    planName,
    totalPrice,
    isLoading,
    qrCodeUrl,
    onBack,
}) => {
    return (
        <div className="lg:col-span-7 bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center relative min-h-[500px]">
            <div className="w-full mb-8 flex items-center justify-between absolute top-8 left-8">
                <Button
                    mode="ghost"
                    className="text-gray-500 hover:text-gray-700 px-0 flex items-center gap-1"
                    onClick={onBack}
                >
                    <span className="material-icons-round text-sm">arrow_back</span>
                    Back
                </Button>
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 mb-4 mt-8">Pay via QR Code</h1>
            <p className="text-gray-500 mb-8 max-w-md">
                Open your banking app or e-wallet and scan the QR code below to complete your payment.
            </p>

            <div className="bg-white p-4 border-2 border-dashed border-gray-300 rounded-2xl mb-8 flex items-center justify-center relative overflow-hidden group w-64 h-64">
                {isLoading ? (
                    <Loading />
                ) : qrCodeUrl ? (
                    <img
                        src={qrCodeUrl}
                        alt="Payment QR Code"
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="text-gray-400 text-sm flex flex-col items-center gap-2">
                        <span className="material-icons-round text-3xl">error_outline</span>
                        <span>Failed to generate QR Code</span>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 text-primary font-medium bg-orange-50 px-4 py-2 rounded-lg">
                <span className="material-icons-round text-xl">qr_code_scanner</span>
                <span>Scan to pay {totalPrice}</span>
            </div>
        </div>
    );
};

export default QRPaymentSection;
