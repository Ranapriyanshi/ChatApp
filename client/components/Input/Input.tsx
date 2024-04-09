import React from "react";
import Image, { StaticImageData } from "next/image";
import styles from "./input.module.scss";

interface InputProps {
  type: string;
  placeholder: string;
  prefix: StaticImageData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  suffix?: StaticImageData;
  onEyeClick?: () => void;
}

const Input: React.FC<InputProps> = ({
  type,
  placeholder,
  prefix,
  onChange,
  value,
  suffix,
  onEyeClick,
}) => {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e);
  }

  return (
    <div className={styles.inputContainer}>
      <Image src={prefix} alt="prefix" width={20} height={20} />
      <input
        type={type}
        placeholder={placeholder}
        onChange={handleChange}
        value={value}
      />
      {suffix && (
        <Image
          src={suffix}
          alt="suffix"
          width={20}
          height={20}
          className={styles.suffix}
          onClick={onEyeClick}
        />
      )}
    </div>
  );
};

export default Input;
