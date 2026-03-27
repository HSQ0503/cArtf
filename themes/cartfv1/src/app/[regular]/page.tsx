import { getSinglePage } from "@/lib/contentParser";
import { markdownify } from "@/lib/utils/textConverter";
import MDXContent from "@/helpers/MDXContent";
import SeoMeta from "@/partials/SeoMeta";

// remove dynamicParams
export const dynamicParams = false;

// generate static params
export const generateStaticParams = () => {
  const getRegularPages = getSinglePage("pages");

  const regularPages = getRegularPages.map((page: any) => ({
    regular: page.slug,
  }));

  return regularPages;
};

// for all regular pages
const RegularPages = async (props: {
  params: Promise<{ regular: string }>;
}) => {
  const params = await props.params;
  const regularData = getSinglePage("pages");
  const page = regularData.filter(
    (page: any) => page.slug === params.regular,
  )[0];

  if (!page) {
    return null;
  }

  const { title, meta_title, description, image } = page.frontmatter;

  return (
    <>
      <SeoMeta
        title={title}
        meta_title={meta_title}
        description={description}
        image={image}
      />
      <section className="section bg-primary/5 text-center">
        <div className="container">
          <h1 dangerouslySetInnerHTML={markdownify(title)} />
        </div>
      </section>
      <section className="section-sm">
        <div className="container">
          <div className="row justify-center">
            <div className="lg:col-10">
              <div className="content">
                <MDXContent content={page.content} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default RegularPages;
