
import { useId } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

function Input({
  label,
  error,
  helperText,
  id,
  className = "",
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const messageId = `${inputId}-message`;

  return (
    <div className="da-input-group">
      {label && (
        <label className="da-input-label" htmlFor={inputId}>
          {label}
          {props.required && <span className="da-required"> *</span>}
        </label>
      )}

      <input
        id={inputId}
        className={`da-input ${error ? "da-input--error" : ""} ${className}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error || helperText ? messageId : undefined}
        {...props}
      />

      {(error || helperText) && (
        <p
          id={messageId}
          className={error ? "da-input-error" : "da-input-helper"}
          role={error ? "alert" : undefined}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}

export default Input;
