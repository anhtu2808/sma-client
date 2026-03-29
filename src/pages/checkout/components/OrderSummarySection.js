import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '../../../utils/icons';

const OrderSummarySection = ({
    planName,
    planDescription,
    totalPrice
}) => {
    const formattedTotal = totalPrice?.toString().replace("₫", "đ");

    return (
        <div className="lg:col-span-6 flex flex-col items-start h-full bg-transparent py-4 lg:py-8 lg:px-12">
            <h2 className="text-[#3b4356] text-[1.35rem] font-extrabold mb-8 tracking-tight">Order Summary</h2>

            <div className="flex justify-between items-start w-full mb-12">
                <div>
                    <h3 className="text-[#3b4356] font-bold text-[1.1rem] mb-1">{planName}</h3>
                    <p className="text-[#8492a6] text-[13px]">{planDescription}</p>
                </div>
            </div>

            <div className="mb-12 w-full">
                <span className="text-[13px] font-bold text-[#8492a6] tracking-wide inline-block mb-1">Total Amount</span>
                <div className="text-[2rem] font-extrabold text-[#111e3b] tracking-tight">{formattedTotal}</div>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-[#ff7e5f] text-white flex items-center justify-center">
                        <FontAwesomeIcon icon={faCircleInfo} className="text-[13px]" />
                    </div>
                    <span className="text-[#3b4356] font-bold text-[14px]">Payment Instructions</span>
                </div>

                <div className="flex gap-4 items-start">
                    <div className="w-6 h-6 shrink-0 rounded-full bg-[#faebe6] text-[#fc9c82] flex items-center justify-center font-bold text-[12px] mt-0.5">1</div>
                    <div>
                        <h4 className="text-[#3b4356] font-bold text-[13px] mb-1">Open your banking app</h4>
                        <p className="text-[#8492a6] text-[12px] leading-relaxed">Launch your mobile banking application or crypto wallet and navigate to the "Scan to Pay" section.</p>
                    </div>
                </div>

                <div className="flex gap-4 items-start">
                    <div className="w-6 h-6 shrink-0 rounded-full bg-[#faebe6] text-[#fc9c82] flex items-center justify-center font-bold text-[12px] mt-0.5">2</div>
                    <div>
                        <h4 className="text-[#3b4356] font-bold text-[13px] mb-1">Scan the QR code</h4>
                        <p className="text-[#8492a6] text-[12px] leading-relaxed">Point your camera at the QR code on the right side of this screen. Ensure the entire code is visible.</p>
                    </div>
                </div>

                <div className="flex gap-4 items-start">
                    <div className="w-6 h-6 shrink-0 rounded-full bg-[#faebe6] text-[#fc9c82] flex items-center justify-center font-bold text-[12px] mt-0.5">3</div>
                    <div>
                        <h4 className="text-[#3b4356] font-bold text-[13px] mb-1">Confirm and notify</h4>
                        <p className="text-[#8492a6] text-[12px] leading-relaxed">Once the transfer is successful, click the "Cancel & Go back" button to return to the dashboard.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSummarySection;
