import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { IconProps } from "./icons";
import { typographyVariants } from "./typography";

const buttonVariants = cva(
  " items-center w-fit justify-center  duration-200 transition-all active:scale-95 inline-flex shadow-sm",
  {
    variants: {
      variant: {
        default: cn(
          "bg-primary disabled:bg-blue-400 disabled:cursor-not-allowed  hover:bg-blue-500 text-white"
        ),
        outline: cn("btn-primary", typographyVariants({ variant: "primary" })),
        ghost: cn(
          "border-[#39f] border hover:border-slate-100 ",
          typographyVariants({ variant: "ghost" })
        ),
        normal: "hover:bg-slate-200 bg-slate-100 ",
        white: "bg-white text-life-2",
        categoryBtn: cn(
          "bg-[#f4f7ff]  hover:bg-slate-200 border border-slate-300",
          typographyVariants({ variant: "lifeText" })
        ),
        productsListBtn:
          "bg-white w-full hover:bg-slate-200 text-black justify-start text-left",
        closeBtn: "!p-0 ltr:ml-auto rtl:mr-auto rounded-full ",
        primaryLink:
          "text-primary disabled:bg-blue-400 disabled:cursor-not-allowed  hover:text-blue-500 !p-0",
        footerLink: "hover:text-blue-500 text-gray-500 underline-tra !p-0 !text-[14px] !font-[300] leading-normal",
      },
      size: {
        default: cn(
          typographyVariants({ size: "sm" }),
          "sm:py-2.5 px-5  py-1.5 leading-[1]"
        ),
        sm: cn(typographyVariants({ size: "sm" }), "px-3 py-1"),
        lg: cn(typographyVariants({ size: "default" }), "py-1.5 px-12 !text-[14px]"),
        xs: cn(typographyVariants({ size: "xs" }), "px-1.5 py-[2.5px] "),
      },
      position: {
        inputLeftBtn: "flex items-center  !rounded-r-none ",
        inputRightBtn: "flex items-center  !rounded-l-none ",
      },
      rounded: {
        full: "rounded-full",
        md: "rounded",
        lg: "rounded-lg",
        sm: "rounded-sm",
        xl: "rounded-xl",
        xxl: "rounded-2xl",
        txl: "rounded-3xl",
        none: "rounded-none",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      rounded: "sm",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  disableBtn?: boolean;
  iconLeft?: React.ReactNode;
  iconType?: IconProps["type"];
  iconRight?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      children,
      isLoading,
      disableBtn,
      iconLeft,
      iconType,
      iconRight,
      position,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, rounded, className, position })
        )}
        ref={ref}
        {...props}
        disabled={isLoading || disableBtn}
      >
        {iconLeft && iconLeft}
        {children}
        {iconRight && iconRight}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
