import DynamicIcon from "@/helpers/DynamicIcon";
import React from "react";

const Button = ({
  label,
  link,
  variant,
  type,
  icon,
  className,
  data_aos,
  data_aos_delay,
  button_type = "submit",
}: {
  label: string;
  link?: string;
  variant?: "outline" | "solid" | "ghost";
  type?: string;
  icon?: string;
  className?: string;
  data_aos?: string;
  data_aos_delay?: string;
  button_type?: "button" | "submit" | "reset";
}) => {

  const baseClasses = `relative overflow-hidden group ${type ? type : "btn"} ${className} ${variant === "outline" ? "btn-outline" : variant === "solid" ? "btn-solid" : ""
    }`;

  const hoverEffectClasses = `absolute w-full h-full -right-full -bottom-full rounded-full group-hover:-right-1 group-hover:-bottom-1 group-hover:w-[150%] group-hover:h-[150%] transition-all duration-[550ms] ${variant === "outline"
    ? "bg-secondary"
    : variant === "solid"
      ? "bg-primary"
      : "bg-text"
    }`;

  return (
    <>
      {
        link ? (
          <a
            href={link}
            className={baseClasses}
            target={link.startsWith("http") ? "_blank" : "_self"}
            data-aos={data_aos}
            data-aos-delay={data_aos_delay}
          >
            {icon && (
              <DynamicIcon icon={icon} className="relative z-10 inline-block mr-2" />
            )}
            <span className="relative z-10">{label}</span>
            <div className={hoverEffectClasses} />
          </a>
        ) : (
          <button
            type={button_type}
            className={baseClasses}
            data-aos={data_aos}
            data-aos-delay={data_aos_delay}
          >
            {icon && (
              <DynamicIcon icon={icon} className="relative z-10 inline-block mr-2" />
            )}
            <span className="relative z-10">{label}</span>
            <div className={hoverEffectClasses} />
          </button>
        )
      }

    </>
  );
};

export default Button;
