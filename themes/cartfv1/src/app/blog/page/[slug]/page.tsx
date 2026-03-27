import BlogCard from "@/components/BlogCard";
import Breadcrumbs from "@/components/Breadcrumbs";
import Pagination from "@/components/Pagination";
import config from "@/config/config.json";
import SeoMeta from "@/partials/SeoMeta";
import { getListPage, getSinglePage } from "@/lib/contentParser";
import { sortByDate } from "@/lib/utils/sortFunctions";
import { markdownify } from "@/lib/utils/textConverter";
import { TBlog } from "@/types";

const BLOG_FOLDER = "blog";

export async function generateStaticParams() {
  const posts = getSinglePage(BLOG_FOLDER) as TBlog[];
  const totalPages = Math.ceil(posts.length / config.settings.pagination);
  const paths = [];

  for (let i = 1; i <= totalPages; i++) {
    paths.push({
      params: {
        slug: i.toString(),
      },
    });
  }
  return paths;
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const indexPage = getListPage("blog/_index.md") as TBlog;
  const posts = getSinglePage(BLOG_FOLDER) as TBlog[];
  const sortedPosts = sortByDate(posts);
  const totalPages = Math.ceil(posts.length / config.settings.pagination);
  const currentPage = slug && !isNaN(Number(slug)) ? Number(slug) : 1;
  const indexOfLastPost = currentPage * config.settings.pagination;
  const indexOfFirstPost = indexOfLastPost - config.settings.pagination;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <>
      <SeoMeta {...indexPage.frontmatter} />
      <section className="section pt-12 bg-primary/5">
        <div className="container">
          <div className="row justify-center">
            <div className="col-10 text-center capitalize">
              <h1
                className="mb-4 xl:text-[100px] font-normal"
                dangerouslySetInnerHTML={markdownify(
                  indexPage.frontmatter.title,
                )}
                data-aos="fade-up-sm"
                data-aos-delay="150"
              />
              <Breadcrumbs />
            </div>
          </div>

          <div className="mt-14">
            <div className="row g-4">
              {currentPosts.map((post, i) => (
                <div
                  className="md:col-4"
                  key={post.slug}
                  data-aos="fade-up-sm"
                  data-aos-delay={i * 150}
                >
                  <BlogCard hideContent data={post} />
                </div>
              ))}
            </div>
            <Pagination
              section={"blog"}
              totalPages={totalPages}
              currentPage={currentPage}
            />
          </div>
        </div>
      </section>
    </>
  );
}
