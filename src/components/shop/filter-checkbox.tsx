// src/components/shop/filter-checkbox.tsx
'use client';

import { Checkbox } from '@/components/ui/checkbox';

interface FilterCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
}

export function FilterCheckbox({
  id,
  label,
  checked,
  onChange,
  ariaLabel,
}: FilterCheckboxProps) {
  return (
    <div className="flex items-center space-x-3 group cursor-pointer">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(checked) => onChange(checked as boolean)}
        className="border-2 data-[state=checked]:bg-foreground data-[state=checked]:border-foreground"
        aria-label={ariaLabel || label}
      />
      <label
        htmlFor={id}
        className="text-sm font-light leading-none cursor-pointer group-hover:text-foreground transition-colors select-none"
      >
        {label}
      </label>
    </div>
  );
}
