import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 text-xs uppercase tracking-widest2 transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-gold disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-ink text-paper hover:bg-gold',
        outline: 'border border-ink text-ink hover:bg-ink hover:text-paper',
        ghost: 'text-ink underline-offset-8 hover:underline',
        inverted: 'border border-paper text-paper hover:bg-paper hover:text-ink',
      },
      size: {
        default: 'px-8 py-4',
        sm: 'px-5 py-3',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  ),
);
Button.displayName = 'Button';

export { buttonVariants };
