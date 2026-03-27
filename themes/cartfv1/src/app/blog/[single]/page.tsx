import BlogCard from "@/components/BlogCard";
import Share from "@/components/Share";
import ImageFallback from "@/helpers/ImageFallback";
import MDXContent from "@/helpers/MDXContent";
import { getSinglePage } from "@/lib/contentParser";
import similarItems from "@/lib/utils/similarItems";
import { markdownify } from "@/lib/utils/textConverter";
import SeoMeta from "@/partials/SeoMeta";
import { TBlog } from "@/types";
import { notFound } from "next/navigation";

// remove dynamicParams
export const dynamicParams = false;

// generate static params
export async function generateStaticParams() {
  const posts = getSinglePage("blog") as TBlog[];
  return posts.map((post) => ({
    single: post.slug!,
  }));
}

const PostSingle = async (props: { params: Promise<{ single: string }> }) => {
  const posts = getSinglePage("blog") as TBlog[];
  // Use await to properly resolve the Promise and get the single parameter
  const params = await props.params;
  const post = posts.find((page) => page.slug === params.single);

  if (!post) return notFound();

  // Add a try/catch block around similar items to prevent build failures
  let similarPosts: TBlog[] = [];
  try {
    similarPosts = similarItems(post, posts)?.slice(0, 3) || [];
  } catch (error) {
    console.error("Error finding similar posts:", error);
    // Continue with empty similar posts array
  }

  return (
    <>
      <SeoMeta {...post.frontmatter} />
      <section className="section bg-primary/5 pt-7">
        <div className="container">
          <div className="row justify-center">
            <article className="lg:col-10">
              <h1
                dangerouslySetInnerHTML={markdownify(post.frontmatter.title)}
                className="h2 mt-8 mb-14 text-center"
                data-aos="fade-up-sm"
                data-aos-delay="200"
              />
              {post.frontmatter.image && (
                <div
                  className="mb-10"
                  data-aos="zoom-in-sm"
                  data-aos-delay="200"
                >
                  <ImageFallback
                    src={post.frontmatter.image}
                    height={500}
                    width={1200}
                    alt={post.frontmatter.title}
                    className="w-full rounded"
                  />
                </div>
              )}

              <div
                className="content mb-10"
                data-aos="fade-up-sm"
                data-aos-delay="200"
              >
                <MDXContent content={post.content} />
              </div>
              <div className="row items-start justify-between">
                <div
                  className="flex items-center lg:col-4"
                  data-aos="fade-up-sm"
                  data-aos-delay="200"
                >
                  <h5 className="mr-3">Share :</h5>
                  <Share
                    className="social-icons-footer"
                    title={post.frontmatter.title}
                    description={post.frontmatter.description}
                    slug={post.slug!}
                  />
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {similarPosts.length > 0 && (
        <section className="section">
          <div className="container">
            <div>
              <h2 className="h3 mb-12 text-center">Read More Articles</h2>
              <div className="row justify-center g-4">
                {similarPosts.map((post) => (
                  <div className="lg:col-3 md:col-6" key={post.slug}>
                    <BlogCard hideContent data={post} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default PostSingle;
