import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Controller, useFormContext } from "react-hook-form";

interface SelectFieldProps {
  label: string;
  name: string;
  id: string;
  options: { label: string; value: string }[];
  rules?: any;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  id,
  options,
  rules,
}) => {
  const { control } = useFormContext();

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

          <Select defaultValue={field.value} onValueChange={field.onChange}>
            <SelectTrigger id={id}>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {error && (
            <p className="text-sm text-red-500 mt-1">{error.message}</p>
          )}
        </div>
      )}
    />
  );
};
