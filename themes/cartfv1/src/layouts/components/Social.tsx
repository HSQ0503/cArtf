import DynamicIcon from "@/helpers/DynamicIcon";

interface Props {
  source: {
    name: string;
    icon: string;
    link: string;
  }[];
  className: string;
}

const Social = ({ source, className }: Props) => {
  return (
    <ul className={className}>
      {source.map((social) => (
        <li key={social.name}>
          <a
            aria-label={social.name}
            href={social.link}
            target={social.link.startsWith("http") ? "_blank" : "_self"}
            rel="noopener noreferrer nofollow"
          >
            <span className="sr-only">{social.name}</span>
            <DynamicIcon className="inline-block" icon={social.icon} />
          </a>
        </li>
      ))}
    </ul>
  );
};

export default Social;
