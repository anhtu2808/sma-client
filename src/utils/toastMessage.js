import { toast } from "react-toastify";

const toastMessage = {
  success: (msg) => toast.success(msg),
  error: (msg) => toast.error(msg),
  warning: (msg) => toast.warning(msg),
  info: (msg) => toast.info(msg),
  loading: (msg) => toast.loading(msg),
};

export default toastMessage;
