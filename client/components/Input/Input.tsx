import React from "react";
import Image, { StaticImageData } from "next/image";
import styles from "./input.module.scss";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prefixImg: StaticImageData;
  suffixImg?: StaticImageData;
  divClass?: string;
  onEyeClick?: () => void;
}

const Input: React.FC<InputProps> = ({
  prefixImg,
  suffixImg,
  divClass,
  onEyeClick,
  ...props
}) => {
  return (
    <div className={divClass ? divClass : styles.inputContainer}>
      <Image src={prefixImg} alt="prefix" width={20} height={20} />
      <input
        {...props}
      />
      {suffixImg && (
        <Image
          src={suffixImg}
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
