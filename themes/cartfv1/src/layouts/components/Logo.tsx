import Link from "next/link";

interface LogoProps {
  src?: string;
  srcDarkmode?: string;
  isFooter?: boolean;
}

const Logo: React.FC<LogoProps> = ({ isFooter }) => {
  return (
    <Link href="/" className="navbar-brand inline-block group">
      <span
        className={`font-secondary text-[1.75rem] tracking-tight select-none relative inline-block ${
          isFooter ? "text-white/90" : "text-text-dark"
        }`}
      >
        <span className="font-light">c</span>
        <span
          className={`font-bold ${
            isFooter
              ? "text-white"
              : "bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent"
          }`}
        >
          A
        </span>
        <span className="font-light">rtf</span>
        <span
          className={`absolute -bottom-0.5 left-0 h-[2px] rounded-full transition-all duration-300 ${
            isFooter
              ? "w-full bg-white/20 group-hover:bg-white/40"
              : "w-0 group-hover:w-full bg-gradient-to-r from-primary to-secondary"
          }`}
        />
      </span>
    </Link>
  );
};

export default Logo;
