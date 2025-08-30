// 
import { toast as hotToast } from 'react-hot-toast';

export const useToast = () => {
  const toast = {
    success: (message) => hotToast.success(message),
    error: (message) => hotToast.error(message),
    info: (message) => hotToast(message),
    loading: (message) => hotToast.loading(message),
  };

  return { toast };
};