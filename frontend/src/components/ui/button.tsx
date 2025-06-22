import * as React from "react";

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className = "", ...props }, ref) => (
    <button
      ref={ref}
      className={
        "px-4 py-2 rounded bg-[#00D4FF] text-white font-semibold hover:bg-[#00B8E6] transition " +
        className
      }
      {...props}
    />
  )
);
Button.displayName = "Button"; 