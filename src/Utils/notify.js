// utils/notify.js
import { toast } from "react-toastify";

export const notifySuccess = (msg) => toast.success(msg, {
  style: { background: "#7C42F0", color: "#fff", fontFamily: "Fredoka" },
});
export const notifyError = (msg) => toast.error(msg, {
  style: { background: "#7C42F0", color: "#fff", fontFamily: "Fredoka" },
});
