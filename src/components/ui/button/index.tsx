import { ButtonHTMLAttributes, ReactNode } from "react";
import { buttonSizeClasses, buttonVariantClasses } from "./helprs";
import { LoaderCircle } from 'lucide-react';
interface ButtonProps {
  children: ReactNode; // Button text or content
  size?: "sm" | "md"; // Button size
  variant?: "primary" | "outline"; // Button variant
  startIcon?: ReactNode; // Icon before the text
  endIcon?: ReactNode; // Icon after the text
  onClick?: () => void; // Click handler
  disabled?: boolean; // Disabled state
  className?: string; // Disabled state
  loading?: boolean;
  type?: ButtonHTMLAttributes<HTMLButtonElement>['type']
}




const Button: React.FC<ButtonProps> = ({
  children,
  size = "md",
  variant = "primary",
  startIcon,
  endIcon,
  onClick,
  className = "",
  disabled = false,
  loading,
  type = 'button'
}) => {

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition ${className} ${
        buttonSizeClasses[size]
      } ${buttonVariantClasses[variant]} ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
   {loading?  <LoaderCircle className="animate-spin  size-5" /> : 
      <>
         {startIcon && <span className="flex items-center">{startIcon}</span>}
         {children}
         {endIcon && <span className="flex items-center">{endIcon}</span>}
      </>
   }
      
    </button>
  );
};

export default Button;
