import React from "react";
import Loading from "@/components/Loading";
import Button from "@/components/Button";

const QRPaymentSection = ({
    totalPrice,
    isLoading,
    qrCodeUrl,
    onBack,
}) => {
    return (
        <div className="lg:col-span-6 flex flex-col items-center justify-center text-center relative py-4 lg:py-8 lg:px-12">
            <h2 className="text-[#111e3b] text-[1.35rem] font-extrabold mb-8 tracking-tight">Scan to Pay</h2>
            <p className="text-[#8492a6] text-[14px] mb-8 font-medium">
                Open your banking or e-wallet app
            </p>

            {/* QR Card Container */}
            <div className="bg-white p-3 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-50 mb-8 w-full max-w-[340px] aspect-square flex items-center justify-center">
                <div className="bg-[#fc9c82] w-full h-full rounded-2xl flex items-center justify-center p-8">
                    {isLoading ? (
                        <div className="text-white flex flex-col items-center justify-center gap-2">
                            <span className="material-icons-round animate-spin">refresh</span>
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
                            <span className="material-icons-round text-3xl">qr_code_scanner</span>
                            <span className="text-[13px] font-medium text-center">QR Code not available</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Scan to Pay Target */}
            <div className="flex items-center gap-2 text-[#fc9c82] font-semibold bg-[#fff1ed] px-4 py-2 rounded-lg mb-8">
                <span className="material-icons-round text-xl">qr_code_scanner</span>
                <span>Scan to pay {totalPrice}</span>
            </div>

            {/* Back Button */}
            <Button
                onClick={onBack}
                mode="primary"
                shape="round"
                size="lg"
                className="text-[#8492a6] hover:text-[#3b4356] text-[13.5px] font-semibold flex items-center gap-1.5 transition-colors mt-auto pt-6 mb-8"
            >
                <span className="material-icons-round text-[16px]">arrow_back</span>
                Cancel & Go back
            </Button>

            {/* Need Help Box */}
            <div className="w-full bg-[#fff8f5] border border-[#ffeedd] rounded-2xl p-5 flex gap-3 text-left">
                <div className="w-6 h-6 shrink-0 rounded-full bg-[#f46a2a] text-white flex items-center justify-center mt-0.5">
                    <span className="material-icons-round text-[14px]">question_mark</span>
                </div>
                <div>
                    <h4 className="text-[#3b4356] font-bold text-[14px] mb-1">Need help?</h4>
                    <p className="text-[#8492a6] text-[12.5px] leading-relaxed pr-2">
                        Contact our 24/7 support team if you encounter any issues with the payment.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default QRPaymentSection;
