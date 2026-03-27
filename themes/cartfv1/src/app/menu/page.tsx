import ImageFallback from "@/helpers/ImageFallback";
import { getListPage } from "@/lib/contentParser";
import { markdownify } from "@/lib/utils/textConverter";
import Menus from "@/partials/Menus";
import { TMenu } from "@/types";

export default function MenuPage() {
  const menuData = getListPage("menu/_index.md") as TMenu;
  const { title, description, foods, food_apps } = menuData.frontmatter;

  return (
    <>
      <section className="section pt-16 xl:pt-20">
        <div className="container">
          <div className="row justify-center">
            <div className="md:col-8 sm:col-10 lg:col-6 text-center capitalize">
              <h1
                className="mb-6 xl:text-[100px] font-normal"
                dangerouslySetInnerHTML={markdownify(title)}
              />
              {description && (
                <p
                  className="text-balance"
                  dangerouslySetInnerHTML={markdownify(description)}
                />
              )}
            </div>
          </div>

          <Menus foods={foods} />
        </div>
      </section>

      <section className="section bg-primary/5">
        <div className="container">
          <div className="row items-center max-xl:justify-center max-xl:text-center g-4">
            <div className="col-10 xl:col-4">
              <h2
                className="mb-4"
                dangerouslySetInnerHTML={markdownify(food_apps?.title)}
              />
              <p
                className="text-sm text-text/90 text-balance"
                dangerouslySetInnerHTML={markdownify(food_apps?.description)}
              />
            </div>
            <div className="col-11 xl:col-8">
              <div className="space-y-6 md:space-y-8 max-xl:mt-10">
                {/* First row - closer spacing */}
                <div className="flex flex-wrap justify-center items-center gap-3 md:gap-5">
                  {food_apps?.images.slice(0, 3).map((image, i) => (
                    <ImageFallback
                      key={`food-app-${i}`}
                      src={image}
                      alt={`food-app-${i}`}
                      className="rounded-lg object-cover w-[30%] sm:w-[150px] md:w-[180px] xl:w-[222px]"
                      width={222}
                      height={91}
                      style="box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05), 0 2px 30px rgba(0, 0, 0, 0.05);"
                    />
                  ))}
                </div>

                {/* Middle row - regular spacing */}
                <div className="flex flex-wrap justify-center items-center gap-3 md:gap-5">
                  {food_apps?.images.slice(3, 6).map((image, i) => (
                    <ImageFallback
                      key={`food-app-${i + 3}`}
                      src={image}
                      alt={`food-app-${i + 3}`}
                      className="rounded-lg object-cover w-[30%] sm:w-[150px] md:w-[200px] lg:w-[255px]"
                      width={255}
                      height={91}
                      style="box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05), 0 2px 30px rgba(0, 0, 0, 0.05);"
                    />
                  ))}
                </div>

                {/* Last row - closer spacing */}
                <div className="flex flex-wrap justify-center items-center gap-3 md:gap-5">
                  {food_apps?.images.slice(6, 9).map((image, i) => (
                    <ImageFallback
                      key={`food-app-${i + 6}`}
                      src={image}
                      alt={`food-app-${i + 6}`}
                      className="rounded-lg object-cover w-[30%] sm:w-[150px] md:w-[180px] xl:w-[222px]"
                      width={222}
                      height={91}
                      style="box-shadow: 0 8px 30px rgba(0, 0, 0, 0.05), 0 2px 30px rgba(0, 0, 0, 0.05);"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
