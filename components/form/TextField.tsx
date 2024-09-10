import { Input } from "@/components/ui/input";
import { Controller, useFormContext } from "react-hook-form";
import { useState } from "react";

interface TextFieldProps {
  label: string;
  name: string;
  id: string;
  placeholder?: string;
  rules?: any;
  currency?: boolean; // Add a prop to indicate if this is a currency field
}

// Remove non-numeric characters and parse float
const parseCurrency = (value: string) => {
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ""));
  return isNaN(numericValue) ? 0 : numericValue;
};

// Format number as currency
const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export const TextField: React.FC<TextFieldProps> = ({
  label,
  name,
  id,
  placeholder,
  rules,
  currency = false, // Default to false, only format as currency if specified
}) => {
  const { control } = useFormContext();
  const [isFocused, setIsFocused] = useState(false);

  // Helper to format a number as currency
  const formatCurrency = (value: number) => formatter.format(value);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <div>
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
          <Input
            id={id}
            placeholder={placeholder}
            className="mt-1"
            value={
              currency && !isFocused
                ? formatCurrency(field.value || 0) // Format value as currency when not focused
                : field.value // Show raw number when focused
            }
            onFocus={() => setIsFocused(true)} // Switch to raw number display on focus
            onBlur={() => {
              setIsFocused(false); // Format as currency on blur
              if (currency) {
                field.onChange(parseCurrency(field.value)); // Ensure value is a number
              }
            }}
            onChange={(e) => {
              const value = e.target.value;
              const numericValue = currency ? parseCurrency(value) : value;
              field.onChange(numericValue); // Store the value as a number
            }}
          />
          {error && (
            <p className="text-sm text-red-500 mt-1">{error?.message}</p>
          )}
        </div>
      )}
    />
  );
};
