import React from "react";

type TextProps = {
  children?: React.ReactNode;
  type?: "title" | "subtitle" | "normal" | "small" | "caption";
  color?: "default" | "primary" | "secondary" | "muted" | "light";
  weight?: "normal" | "medium" | "semibold" | "bold"|"light";
  align?: "left" | "center" | "right";
  className?: string;
  dangerouslySetInnerHTML?:any
};

const typeStyles = {
  title: "text-2xl md:text-3xl",
  subtitle: "text-xl md:text-2xl",
  normal: "text-base",
  small: "text-sm",
  caption: "text-xs",
};

const colorStyles = {
  default: "", // <- comportamento que você pediu
  primary: "text-blue-600 dark:text-blue-400",
  secondary: "text-purple-600 dark:text-purple-400",
  muted: "text-gray-500 dark:text-gray-400",
  light: "text-white",
};

const weightStyles = {
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  light:'font-light'
};

const alignStyles = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

export const Text: React.FC<TextProps> = ({
  children,
  type = "normal",
  color = "default",
  weight = "normal",
  align = "left",
  className = "",
  dangerouslySetInnerHTML
}) => {
  const classes = [
    typeStyles[type],
    colorStyles[color],
    weightStyles[weight],
    alignStyles[align],
    className,
  ].join(" ");

  return <p className={classes} dangerouslySetInnerHTML={dangerouslySetInnerHTML}>{children}</p>;
};
