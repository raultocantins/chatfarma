import { toast } from "react-toastify";

function ToastSuccess(text) {
  toast.success(text, {
    style: { backgroundColor: "#64A764" },
  });
}

export default ToastSuccess;
