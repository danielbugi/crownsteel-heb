// src/components/shop/price-range-input.tsx
'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { FILTER_CONSTANTS } from '@/lib/filter-constants';

interface PriceRangeInputProps {
  value: [number, number];
  onChange: (value: [number, number]) => void;
  label: string;
  currency?: string;
}

export function PriceRangeInput({
  value,
  onChange,
  label,
  currency = '₪',
}: PriceRangeInputProps) {
  const [minInput, setMinInput] = useState(value[0].toString());
  const [maxInput, setMaxInput] = useState(value[1].toString());

  useEffect(() => {
    setMinInput(value[0].toString());
    setMaxInput(value[1].toString());
  }, [value]);

  const handleMinChange = (inputValue: string) => {
    setMinInput(inputValue);
    const numValue = parseInt(inputValue) || FILTER_CONSTANTS.PRICE.MIN;
    const clampedValue = Math.max(
      FILTER_CONSTANTS.PRICE.MIN,
      Math.min(numValue, value[1])
    );
    onChange([clampedValue, value[1]]);
  };

  const handleMaxChange = (inputValue: string) => {
    setMaxInput(inputValue);
    const numValue = parseInt(inputValue) || FILTER_CONSTANTS.PRICE.MAX;
    const clampedValue = Math.min(
      FILTER_CONSTANTS.PRICE.MAX,
      Math.max(numValue, value[0])
    );
    onChange([value[0], clampedValue]);
  };

  const handleSliderChange = (sliderValue: number[]) => {
    onChange([sliderValue[0], sliderValue[1]]);
  };

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <Label className="text-sm font-light uppercase tracking-wider text-foreground">
          {label}
        </Label>

        {/* Price Display */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="min-price"
              className="text-xs text-muted-foreground uppercase tracking-wide"
            >
              Min
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {currency}
              </span>
              <Input
                id="min-price"
                type="number"
                value={minInput}
                onChange={(e) => handleMinChange(e.target.value)}
                onBlur={() => setMinInput(value[0].toString())}
                min={FILTER_CONSTANTS.PRICE.MIN}
                max={value[1]}
                step={FILTER_CONSTANTS.PRICE.STEP}
                className="pl-8 h-10 font-light"
                aria-label={`Minimum price ${value[0]} ${currency}`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="max-price"
              className="text-xs text-muted-foreground uppercase tracking-wide"
            >
              Max
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                {currency}
              </span>
              <Input
                id="max-price"
                type="number"
                value={maxInput}
                onChange={(e) => handleMaxChange(e.target.value)}
                onBlur={() => setMaxInput(value[1].toString())}
                min={value[0]}
                max={FILTER_CONSTANTS.PRICE.MAX}
                step={FILTER_CONSTANTS.PRICE.STEP}
                className="pl-8 h-10 font-light"
                aria-label={`Maximum price ${value[1]} ${currency}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Slider */}
      <Slider
        min={FILTER_CONSTANTS.PRICE.MIN}
        max={FILTER_CONSTANTS.PRICE.MAX}
        step={FILTER_CONSTANTS.PRICE.STEP}
        value={value}
        onValueChange={handleSliderChange}
        className="w-full"
        aria-label={`Price range ${value[0]} to ${value[1]}`}
      />
    </div>
  );
}
