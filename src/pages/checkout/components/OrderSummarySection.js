import React from "react";

const parseAndCalculate = (formattedPrice) => {
    // Extract digits
    const digitsOnly = formattedPrice?.toString().replace(/[^\d]/g, '') || "";
    if (!digitsOnly) return { subtotal: formattedPrice, tax: "0 đ" };

    // Fix string representation due to possible "đ" character
    const formattedStr = formattedPrice.toString().replace("₫", "đ");

    const total = parseInt(digitsOnly, 10);
    const subtotal = Math.round(total / 1.1);
    const tax = total - subtotal;

    // Attempt to keep same currency symbol
    const currencyMatch = formattedStr.match(/[^\d.,\s]+/);
    const currency = currencyMatch ? currencyMatch[0] : 'đ';

    const format = (num) => new Intl.NumberFormat('vi-VN').format(num) + ' ' + currency;
    return { subtotal: format(subtotal), tax: format(tax) };
}

const OrderSummarySection = ({
    planName,
    planDescription,
    totalPrice,
    durationMonths
}) => {
    const { subtotal, tax } = parseAndCalculate(totalPrice);
    const formattedTotal = totalPrice?.toString().replace("₫", "đ");

    return (
        <div className="lg:col-span-6 flex flex-col items-start h-full bg-transparent py-4 lg:py-8 lg:px-12">
            <h2 className="text-[#3b4356] text-[1.35rem] font-extrabold mb-8 tracking-tight">Order Summary</h2>

            <div className="flex justify-between items-start w-full mb-12">
                <div>
                    <h3 className="text-[#3b4356] font-bold text-[1.1rem] mb-1">{planName}</h3>
                    <p className="text-[#8492a6] text-[13px]">{planDescription}</p>
                </div>
                {durationMonths && (
                    <span className="bg-[#fff1ed] text-[#ff7e5f] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        {durationMonths === 12 ? 'Annual' : durationMonths === 6 ? 'Semi-Annual' : durationMonths === 1 ? 'Monthly' : `${durationMonths} Months`}
                    </span>
                )}
            </div>

            <div className="space-y-4 mb-12 w-full">
                <div className="flex justify-between text-[14px] text-[#8492a6]">
                    <span>Subtotal</span>
                    <span className="font-medium text-[#3b4356]">{subtotal}</span>
                </div>
                <div className="flex justify-between text-[14px] text-[#8492a6]">
                    <span>Tax (10%)</span>
                    <span className="font-medium text-[#3b4356]">{tax}</span>
                </div>
            </div>

            <div className="mb-auto w-full">
                <span className="text-[13px] font-bold text-[#8492a6] tracking-wide inline-block mb-1">Total Amount</span>
                <div className="text-[2rem] font-extrabold text-[#111e3b] tracking-tight">{formattedTotal}</div>
            </div>

            <div className="mt-16 flex items-center gap-5 text-[10px] text-[#8492a6] font-bold tracking-widest uppercase pb-4 border-b border-[#f1f3f9] w-full mb-8">
                <div className="flex items-center gap-1.5 border-r border-[#e5e9f2] pr-5">
                    <span className="material-icons-round text-[15px] opacity-70">lock_outline</span>
                    <span>SSL SECURE</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="material-icons-round text-[15px] opacity-70">security</span>
                    <span>PCI-DSS</span>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-[#ff7e5f] text-white flex items-center justify-center">
                        <span className="material-icons-round text-[13px]">info</span>
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
