import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const NotificationToast = ({ icon, title, message }) => {
    return (
        <div className="flex gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 shrink-0">
                <FontAwesomeIcon icon={icon} className="text-gray-700" />
            </div>

            <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm">
                    {title}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default NotificationToast;
