import { Input } from "@heroui/react";
import { ReactNode } from "react";
import {
  
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

export interface CustomInputProps<T extends FieldValues = never> {
  name: Path<T>;
  label: string;
  placeholder?: string;
  error_message?: string;
  register: UseFormRegister<T>;
  
  type?: "text" | "email" | "password" | "number" | "date" | "url";
  icon?: ReactNode;
  readOnly?: boolean;
  defaultValue?:string
}

export function CustomInput<T extends FieldValues>({
  label,
  placeholder,
  register,
  name,
  error_message,
  type,
  readOnly,
  defaultValue
}: CustomInputProps<T>) {
 return (
    <Input
      {...register(name)}
      type={type}
      label={label}
      defaultValue={defaultValue}
      placeholder={placeholder}
      errorMessage={error_message}
      isInvalid={!!error_message}
      readOnly={readOnly}
    />
  );
}
