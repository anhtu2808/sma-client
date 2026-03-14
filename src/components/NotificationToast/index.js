import { useEffect, useState } from "react";

const NotificationToast = ({ t, icon, title, message }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
    }, []);

    return (
        <div
            style={{
                transform: visible ? "translate3d(0,0,0)" : "translate3d(80px,0,0)",
                opacity: visible ? 1 : 0,
                transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.35s ease",
                willChange: "transform, opacity"
            }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 w-[360px]"
        >
            <div className="flex gap-3">

                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-100">
                    <span className="material-symbols-outlined text-orange-500">
                        {icon}
                    </span>
                </div>

                <div className="flex-1">
                    <p className="font-bold text-gray-900">
                        {title}
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                        {message}
                    </p>
                </div>

            </div>
        </div>
    );
};


export default NotificationToast;
