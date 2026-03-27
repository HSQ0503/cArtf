import ImageFallback from "@/helpers/ImageFallback";
import dateFormat from "@/lib/utils/dateFormat";
import { plainify } from "@/lib/utils/textConverter";
import { TBlog } from "@/types";

type BlogCardProps = {
  data: TBlog;
  hideContent?: boolean;
};

const BlogCard: React.FC<BlogCardProps> = ({ data, hideContent = false }) => {
  const { title, image, description, date } = data.frontmatter;

  return (
    <div
      className="bg-body rounded-lg overflow-hidden h-full group"
      style={{
        boxShadow:
          "0 8px 30px rgba(0, 0, 0, 0.05), 0 2px 30px rgba(0, 0, 0, 0.05)",
      }}
    >
      {image && (
        <div className="overflow-hidden">
          <ImageFallback
            className="w-full transition-transform duration-500 group-hover:scale-105"
            src={image}
            alt={title}
            width={650}
            height={500}
            format="webp"
          />
        </div>
      )}
      <div className={`${hideContent ? "p-6" : "py-10 px-8"}`}>
        <ul className="mb-3">
          {date && (
            <li className="inline-block text-xs text-text-light font-medium">
              {dateFormat(date)}
            </li>
          )}
        </ul>

        <h4 className="text-lg font-primary">
          <a className="u-underline" href={`/blog/${data.slug}`}>
            <span className="s-underline">{title}</span>
          </a>
        </h4>

        {!hideContent && description && (
          <p className="line-clamp-4 text-text/80 text-sm mt-3">
            {plainify(description)}
          </p>
        )}
      </div>
    </div>
  );
};

export default BlogCard;
