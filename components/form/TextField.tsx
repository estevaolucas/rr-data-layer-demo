import { Input } from "@/components/ui/input";
import { Controller, useFormContext } from "react-hook-form";

interface TextFieldProps {
  label: string;
  name: string;
  id: string;
  placeholder?: string;
  rules?: any;
}

export const TextField: React.FC<TextFieldProps> = ({
  label,
  name,
  id,
  placeholder,
  rules,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <>
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
            {...field}
          />
          {error && (
            <p className="text-sm text-red-500 mt-1">{error?.message}</p>
          )}
        </>
      )}
    ></Controller>
  );
};
