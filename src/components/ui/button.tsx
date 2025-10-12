import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-light uppercase tracking-wide disabled:pointer-events-none disabled:opacity-50 outline-none cursor-pointer relative overflow-hidden',
  {
    variants: {
      variant: {
        // REGULAR - Transparent bg, white text/border, white fill slides in
        default:
          'bg-transparent text-white border border-white ' +
          "before:content-[''] before:absolute before:inset-0 before:w-[130%] before:h-full before:bg-white " +
          'before:left-[-100%] before:top-0 before:-z-10 ' +
          'before:skew-x-[-25deg] before:translate-x-[-50%] ' +
          'before:transition-[left] before:duration-300 before:ease-in-out ' +
          'hover:before:left-[50%]',

        // WHITE - White bg, dark text, dark fill slides in
        white:
          'bg-white text-black border border-white ' +
          "before:content-[''] before:absolute before:inset-0 before:w-[130%] before:h-full before:bg-black " +
          'before:left-[-100%] before:top-0 before:-z-10 ' +
          'before:skew-x-[-25deg] before:translate-x-[-50%] ' +
          'before:transition-[left] before:duration-500 before:ease-in-out ' +
          'hover:before:left-[50%]',

        // GOLD - White bg, dark text, gold fill slides in
        gold:
          'bg-white text-black border border-white ' +
          "before:content-[''] before:absolute before:inset-0 before:w-[130%] before:h-full before:bg-[#d4a574] " +
          'before:left-[-100%] before:top-0 before:-z-10 ' +
          'before:skew-x-[-25deg] before:translate-x-[-50%] ' +
          'before:transition-[left] before:duration-500 before:ease-in-out ' +
          'hover:before:left-[50%]',

        // CONTACT - White bg, black text, black background fill slides in
        contact:
          'bg-white text-black border border-white ' +
          "before:content-[''] before:absolute before:inset-0 before:w-[130%] before:h-full before:bg-gray-900 " +
          'before:left-[-100%] before:top-0 before:-z-10 ' +
          'before:skew-x-[-25deg] before:translate-x-[-50%] ' +
          'before:transition-[left] before:duration-500 before:ease-in-out ' +
          'hover:before:left-[50%]',

        // GHOST - For icon-only buttons (no animation)
        ghost: 'hover:bg-accent hover:text-accent-foreground',

        // LINK - For text links
        link: 'text-primary underline-offset-4 hover:underline',

        // OUTLINE - Same as white variant
        outline:
          'bg-white text-black border border-white ' +
          "before:content-[''] before:absolute before:inset-0 before:w-[130%] before:h-full before:bg-black " +
          'before:left-[-100%] before:top-0 before:-z-10 ' +
          'before:skew-x-[-25deg] before:translate-x-[-50%] ' +
          'before:transition-[left] before:duration-500 before:ease-in-out ' +
          'hover:before:left-[50%]',
      },
      size: {
        default: 'h-12 px-6 py-4 text-lg',
        sm: 'h-10 px-5 py-3 text-base',
        lg: 'h-14 px-8 py-5 text-xl',
        icon: 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// Helper function to determine text color change on hover
function getHoverTextColor(variant: string | null | undefined) {
  switch (variant) {
    case 'default':
      return 'hover:text-black'; // White bg slides in, text becomes black
    case 'white':
    case 'gold':
    case 'contact':
    case 'outline':
      return 'hover:text-white'; // Dark/gold bg slides in, text becomes white
    default:
      return '';
  }
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  children,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  // Get hover text color based on variant
  const hoverTextColor = getHoverTextColor(variant);

  // For ghost and link variants, don't wrap in span
  if (variant === 'ghost' || variant === 'link') {
    return (
      <Comp
        data-slot="button"
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </Comp>
    );
  }

  // For all other variants, wrap content in span for animation
  return (
    <Comp
      data-slot="button"
      className={cn(
        buttonVariants({ variant, size }),
        hoverTextColor,
        className
      )}
      {...props}
    >
      <span className="relative z-10 inline-flex items-center gap-2 transition-all duration-300 ease-in-out hover:tracking-[1.5px]">
        {children}
      </span>
    </Comp>
  );
}

export { Button, buttonVariants };
