import React from "react"
import { cn } from "@shared/lib/utils"

interface ToastContextValue {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

interface Toast {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success" | "warning"
  duration?: number
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

let toastCount = 0

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const addToast = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = (++toastCount).toString()
    const newToast = { ...toast, id }
    
    setToasts((prev) => [...prev, newToast])

    // Auto remove after duration
    const duration = toast.duration || 5000

    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, duration)
    }
  }, [])

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  )
}

const useToast = () => {
  const context = React.useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return context
}

const Toaster = () => {
  const { toasts, removeToast } = useToast()

  return (
    <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}

interface ToastComponentProps {
  toast: Toast
  onClose: () => void
}

const ToastComponent = ({ toast, onClose }: ToastComponentProps) => {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    setIsVisible(true)

    return () => setIsVisible(false)
  }, [])

  const variantClasses = {
    default: "border bg-background text-foreground",
    destructive: "destructive border-destructive bg-destructive text-destructive-foreground",
    success: "border-green-500 bg-green-50 text-green-900 dark:bg-green-900/10 dark:text-green-400",
    warning: "border-yellow-500 bg-yellow-50 text-yellow-900 dark:bg-yellow-900/10 dark:text-yellow-400"
  }

  return (
    <div
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all",
        variantClasses[toast.variant || "default"],
        isVisible
          ? "animate-in slide-in-from-right-full"
          : "animate-out slide-out-to-right-full"
      )}
    >
      <div className="grid gap-1">
        {toast.title && (
          <div className="text-sm font-semibold">
            {toast.title}
          </div>
        )}
        {toast.description && (
          <div className="text-sm opacity-90">
            {toast.description}
          </div>
        )}
      </div>
      <button
        className="absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
        onClick={onClose}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  )
}

// Helper functions for easy toast creation
// Note: These functions should be used within React components that have access to ToastContext
export const createToastHelpers = (context: ToastContextValue) => ({
  success: (title: string, description?: string) => {
    context.addToast({ title, description, variant: "success" })
  },
  error: (title: string, description?: string) => {
    context.addToast({ title, description, variant: "destructive" })
  },
  warning: (title: string, description?: string) => {
    context.addToast({ title, description, variant: "warning" })
  },
  info: (title: string, description?: string) => {
    context.addToast({ title, description, variant: "default" })
  },
})

export { Toaster, ToastProvider, useToast }
export type { Toast } 