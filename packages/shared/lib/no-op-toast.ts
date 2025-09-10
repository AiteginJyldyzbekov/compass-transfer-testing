/**
 * No-op toast functions for terminal app to disable notifications
 * These functions do nothing but prevent errors when toast is called
 */

export const noOpToast = {
  success: (message: string, options?: any) => {
    // No-op: do nothing
    console.log('[Terminal] Toast disabled - Success:', message);
  },
  error: (message: string, options?: any) => {
    // No-op: do nothing
    console.log('[Terminal] Toast disabled - Error:', message);
  },
  warning: (message: string, options?: any) => {
    // No-op: do nothing
    console.log('[Terminal] Toast disabled - Warning:', message);
  },
  info: (message: string, options?: any) => {
    // No-op: do nothing
    console.log('[Terminal] Toast disabled - Info:', message);
  },
  loading: (message: string, options?: any) => {
    // No-op: do nothing
    console.log('[Terminal] Toast disabled - Loading:', message);
  },
  dismiss: (toastId?: string) => {
    // No-op: do nothing
    console.log('[Terminal] Toast disabled - Dismiss:', toastId);
  },
  promise: (promise: Promise<any>, messages: any) => {
    // No-op: do nothing, just return the promise
    console.log('[Terminal] Toast disabled - Promise:', messages);
    return promise;
  },
  custom: (jsx: any, options?: any) => {
    // No-op: do nothing
    console.log('[Terminal] Toast disabled - Custom:', jsx);
  },
};

// Export as default to match sonner's export pattern
export default noOpToast;
