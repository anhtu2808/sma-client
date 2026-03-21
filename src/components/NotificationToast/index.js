import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

const NotificationToast = ({ t, icon, title, message }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        requestAnimationFrame(() => setVisible(true));
    }, []);

    const handleDismiss = useCallback(() => {
        setVisible(false);
        setTimeout(() => toast.dismiss(t.id), 300);
    }, [t.id]);

    return (
        <div
            style={{
                transform: visible ? "translate3d(0,0,0)" : "translate3d(80px,0,0)",
                opacity: visible ? 1 : 0,
                transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease",
                willChange: "transform, opacity",
            }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 w-[360px]"
        >
            <div className="flex gap-3">

                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 shrink-0">
                    <i className={`${icon} text-gray-700`} />
                </div>

                <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900">
                        {title}
                    </p>

                    <p className="text-sm text-gray-600 mt-1">
                        {message}
                    </p>
                </div>

                <button
                    onClick={handleDismiss}
                    className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 active:scale-90 transition-all cursor-pointer bg-transparent border-0 p-0 -mt-1 -mr-1"
                >
                    <i className="fa-solid fa-xmark text-sm" />
                </button>

            </div>
        </div>
    );
};


export default NotificationToast;
