import React from "react";
import Button from "@/components/Button";
import { useNavigate } from "react-router-dom";

const CheckoutSuccess = ({ planName, totalPrice, durationMonths }) => {
    const navigate = useNavigate();

    return (
        <div className="w-full max-w-2xl bg-white rounded-[2rem] shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-[#f1f3f9] p-8 sm:p-12 text-center mx-auto mt-12">
            <div className="w-20 h-20 rounded-full bg-green-100 text-green-500 flex items-center justify-center mx-auto mb-6">
                <span className="material-icons-round text-4xl">check_circle</span>
            </div>

            <h2 className="text-3xl font-extrabold text-[#111e3b] mb-4 tracking-tight">Payment Successful!</h2>
            <p className="text-[#8492a6] text-base mb-8">
                Thank you. Your subscription for <strong className="text-[#3b4356]">{planName}</strong> has been successfully processed.
            </p>

            <div className="bg-[#f8f9fa] rounded-2xl p-6 mb-8 text-left border border-[#f1f3f9]">
                <h3 className="font-bold text-[#3b4356] mb-4 text-sm uppercase tracking-wider">Transaction Details</h3>
                <div className="flex justify-between items-center mb-3 text-sm">
                    <span className="text-[#8492a6]">Plan</span>
                    <span className="font-medium text-[#3b4356]">{planName}</span>
                </div>
                {durationMonths && (
                    <div className="flex justify-between items-center mb-3 text-sm">
                        <span className="text-[#8492a6]">Duration</span>
                        <span className="font-medium text-[#3b4356]">{durationMonths} Months</span>
                    </div>
                )}
                <div className="flex justify-between items-center mb-3 text-sm">
                    <span className="text-[#8492a6]">Amount Paid</span>
                    <span className="font-medium text-[#3b4356]">{totalPrice}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-3 border-t border-[#e5e9f2]">
                    <span className="text-[#8492a6]">Status</span>
                    <span className="font-bold text-green-500">Completed</span>
                </div>
            </div>

            <Button
                onClick={() => navigate("/dashboard")}
                mode="primary"
                shape="rounded"
                size="lg"
                className="w-full font-bold text-base bg-primary hover:bg-primary-dark text-white py-4 shadow-lg shadow-orange-500/20"
            >
                Go to Dashboard
            </Button>
        </div>
    );
};

export default CheckoutSuccess;
