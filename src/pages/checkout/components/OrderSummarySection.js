import React from "react";
import Button from "@/components/Button";

const OrderSummarySection = ({
    planName,
    planDescription,
    totalPrice,
    durationMonths,
    isSubmitting,
    onCompletePayment,
    isLoadingQR
}) => {
    return (
        <div className="lg:col-span-5">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                <div className="flex justify-between items-start mb-4 pb-4 border-b border-gray-100">
                    <div>
                        <h3 className="font-bold text-gray-800 text-lg">{planName}</h3>
                        <p className="text-sm text-gray-500 mt-1">{planDescription}</p>
                    </div>
                    <div className="text-right">
                        <span className="font-bold text-gray-900">{totalPrice}</span>
                    </div>
                </div>

                {durationMonths && (
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Billing Cycle</span>
                        <span className="font-medium text-gray-800">{durationMonths} months</span>
                    </div>
                )}

                <div className="flex justify-between text-sm text-gray-600 mb-6">
                    <span>Taxes & Fees</span>
                    <span className="font-medium text-gray-800">Included</span>
                </div>

                <div className="flex justify-between items-center py-4 border-t border-gray-100 mb-6">
                    <span className="text-gray-800 font-bold">Total Due Now</span>
                    <span className="text-2xl font-extrabold text-primary">{totalPrice}</span>
                </div>

                <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
                    <span className="material-icons-round text-[14px]">lock</span>
                    Payments are secure and encrypted
                </p>
            </div>
        </div>
    );
};

export default OrderSummarySection;
