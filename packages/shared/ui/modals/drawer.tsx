import React from "react"
import { cn } from "@shared/lib/utils"

interface DrawerContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const DrawerContext = React.createContext<DrawerContextValue | null>(null)

interface DrawerProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const Drawer = ({ children, open = false, onOpenChange }: DrawerProps) => {
  const [isOpen, setIsOpen] = React.useState(open)

  React.useEffect(() => {
    setIsOpen(open)
  }, [open])

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen)
    onOpenChange?.(newOpen)
  }

  return (
    <DrawerContext.Provider value={{ open: isOpen, onOpenChange: handleOpenChange }}>
      {children}
    </DrawerContext.Provider>
  )
}

const DrawerTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, ...props }, ref) => {
  const context = React.useContext(DrawerContext)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    context?.onOpenChange(true)
    onClick?.(event)
  }

  return (
    <button
      ref={ref}
      className={className}
      onClick={handleClick}
      {...props}
    />
  )
})

DrawerTrigger.displayName = "DrawerTrigger"

interface DrawerContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: "top" | "right" | "bottom" | "left"
}

const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(
  ({ className, side = "right", children, ...props }, ref) => {
    const context = React.useContext(DrawerContext)

    if (!context?.open) return null

    const sideClasses = {
      top: "top-0 left-0 right-0 h-1/2 border-b",
      right: "top-0 right-0 bottom-0 w-1/3 min-w-[300px] border-l",
      bottom: "bottom-0 left-0 right-0 h-1/2 border-t",
      left: "top-0 left-0 bottom-0 w-1/3 min-w-[300px] border-r"
    }

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={() => context.onOpenChange(false)}
        />
        {/* Drawer */}
        <div
          ref={ref}
          className={cn(
            "fixed z-50 bg-background shadow-lg transition-transform duration-300",
            sideClasses[side],
            className
          )}
          {...props}
        >
          {children}
        </div>
      </>
    )
  }
)

DrawerContent.displayName = "DrawerContent"

const DrawerHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2 text-center sm:text-left p-6", className)}
    {...props}
  />
))

DrawerHeader.displayName = "DrawerHeader"

const DrawerFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-6", className)}
    {...props}
  />
))

DrawerFooter.displayName = "DrawerFooter"

const DrawerTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))

DrawerTitle.displayName = "DrawerTitle"

const DrawerDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))

DrawerDescription.displayName = "DrawerDescription"

const DrawerClose = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, ...props }, ref) => {
  const context = React.useContext(DrawerContext)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    context?.onOpenChange(false)
    onClick?.(event)
  }

  return (
    <button
      ref={ref}
      className={cn(
        "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      <span className="sr-only">Close</span>
      ✕
    </button>
  )
})

DrawerClose.displayName = "DrawerClose"

export {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} 