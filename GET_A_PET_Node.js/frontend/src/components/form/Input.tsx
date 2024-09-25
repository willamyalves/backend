import styles from "./Input.module.css";

interface InputProps {
  type: "text" | "email" | "password" | "file";
  text: string;
  name: string;
  placeholder?: string;
  handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string | number | readonly string[];
  multiple?: boolean;
}

function Input({
  type,
  text,
  name,
  placeholder = "",
  handleOnChange,
  value,
  multiple,
}: InputProps) {
  return (
    <div className={styles.form_control}>
      <label htmlFor={name}>{text}:</label>
      <input
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        onChange={handleOnChange}
        value={value}
        {...(multiple ? { multiple } : "")}
      />
    </div>
  );
}

export default Input;
