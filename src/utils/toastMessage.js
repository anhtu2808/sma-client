import toast from "react-hot-toast";

const toastMessage = {
  success: (msg) => toast.success(msg),
  error: (msg) => toast.error(msg),
  warning: (msg) =>
    toast(msg, {
      icon: "⚠️",
      style: {
        background: "#fffbeb",
        color: "#92400e",
        border: "1px solid #fde68a",
      },
    }),
  info: (msg) =>
    toast(msg, {
      icon: "ℹ️",
      style: {
        background: "#eff6ff",
        color: "#1e40af",
        border: "1px solid #bfdbfe",
      },
    }),
  loading: (msg) => toast.loading(msg),
};

export default toastMessage;
