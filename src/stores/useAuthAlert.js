
import { ref } from "vue";

export const alertMessage = ref("");
export const alertType = ref("");

export const useAuthAlert = () => ({
  alertMessage,
  alertType,
});
