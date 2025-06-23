import { Textarea } from "@heroui/react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

export interface CustomInputProps<T extends FieldValues = never> {
  name: Path<T>;                    
  label: string;
  placeholder?: string;
  error_message?: string;
  register: UseFormRegister<T>;
}

export function CustomTextArea<T extends FieldValues>({
  label,
  placeholder,
  register,
  name,
  error_message,
}: CustomInputProps<T>) {
  return (
    <Textarea
      label={label}
      placeholder={placeholder}
      errorMessage={error_message}
      isInvalid={!!error_message}
      {...register(name)}
    />
  );
}
