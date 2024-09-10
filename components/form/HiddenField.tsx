import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

interface HiddenFieldProps {
  name: string;
  value?: any;
}

export const HiddenField: React.FC<HiddenFieldProps> = ({ name, value }) => {
  const { register, setValue } = useFormContext();

  useEffect(() => {
    setValue(name, value);
  }, [name, value, setValue]);

  return <input type="hidden" value={value} {...register(name)} />;
};
