import { humanize, markdownify } from "@/lib/utils/textConverter";

interface Props {
  title?: string;
  description?: string;
  backgroundColor?: string;
  height?: string;
}

const PageHeader: React.FC<Props> = ({
  title = "",
  description = "",
  backgroundColor = "bg-primary/5",
  height = "h-[575px]",
}) => {
  return (
    <section className={`pt-20 ${backgroundColor} ${height}`}>
      <div className="container text-center">
        <div className="max-w-xl mx-auto text-balance">
          <h1
            className="xl:text-[100px] font-normal"
            dangerouslySetInnerHTML={{ __html: humanize(title) }}
            data-aos="fade-up-sm"
            data-aos-delay="100"
          />
          <p
            className="mt-4"
            data-aos="fade-up-sm"
            data-aos-delay="150"
            dangerouslySetInnerHTML={markdownify(description)}
          />
        </div>
      </div>
    </section>
  );
};

export default PageHeader;
