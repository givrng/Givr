import React from "react";


type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  labelClassName?: string;
  error?: string;
};

const Input: React.FC<InputProps> = ({
  label,
  className = "",
    labelClassName = "",
    name = "",
  error,
  ...props
}) => {
    const borderClasses = error
      ? "border border-red-500 focus:ring-red-500"
      : "border-ui focus:ring-blue-500";

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <>
          <label
            htmlFor={name}
            className={`text-xs sm:text-sm   text-[#323338] ${labelClassName}`}
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </>
      )}

      <div className={` w-full ${className}`}>
              <input
                  {...props}
                  name={name}
                  id={name}
                  className={`  rounded-md pl-3 py-2 outline-none  w-full  ${borderClasses}
          } ${className}`}
        />
      </div>
    </div>
  );
};

export default Input;
