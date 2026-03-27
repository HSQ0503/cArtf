"use client";

import ImageFallback from "@/helpers/ImageFallback";
import { markdownify } from "@/lib/utils/textConverter";
import { TMenu } from "@/types";
import { useEffect, useRef } from "react";
import Shuffle from "shufflejs";

const MenuSection = ({ foods }: { foods: TMenu["frontmatter"]["foods"] }) => {
  const groups = [
    ...new Set(foods.map((food) => food.group.toLocaleLowerCase())),
  ];
  const shuffleContainerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (shuffleContainerRef.current) {
      const element = shuffleContainerRef.current;
      const shuffleInstance = new Shuffle(element, {
        itemSelector: "li",
      });

      const filterItems = document.querySelectorAll(".shuffle-filter li");
      filterItems.forEach((item) => {
        item.addEventListener("click", (e) => {
          e.preventDefault();
          const currentItem = e.currentTarget as HTMLElement;

          filterItems.forEach((item) => {
            (item as HTMLElement).classList.remove("bg-secondary");
            (item as HTMLElement).classList.remove("text-white");
            (item as HTMLElement).classList.add("hover:bg-secondary");
            (item as HTMLElement).classList.add("hover:text-white");
          });

          currentItem.classList.add("bg-secondary");
          currentItem.classList.add("text-white");
          currentItem.classList.remove("hover:bg-secondary");
          currentItem.classList.remove("hover:text-white");

          const keyword = currentItem.getAttribute("data-target");
          if (keyword) {
            shuffleInstance.filter(keyword);
          }
        });
      });
    }
  }, [shuffleContainerRef]);
  return (
    <div className="mt-6">
      <ul className="shuffle-filter flex gap-4 justify-center bg-body p-2 lg:py-1 mb-14 rounded-full">
        <li className="btn bg-secondary text-white py-2" data-target="all">
          All
        </li>
        {groups.map((group) => (
          <li
            key={group}
            data-target={group}
            className="btn py-2 hover:bg-secondary hover:text-white transition-all duration-300"
          >
            {group}
          </li>
        ))}
      </ul>

      <ul
        className="row justify-center gy-5 gx-4 shuffle-container mx-auto w-full"
        ref={shuffleContainerRef}
      >
        {foods.map((item, i) => (
          <li
            key={item.name}
            data-groups={`["${item.group}","all"]`}
            data-aos="fade-up"
            data-aos-delay={(i + 1) * 50 + 100}
            className="col-12 sm:col-6 lg:col-3 mx-auto"
          >
            <div className="border border-border rounded-xl overflow-hidden max-w-xs mx-auto">
              <ImageFallback
                src={item.image}
                alt={`member-${item.name}`}
                className="h-[230px] w-full object-cover"
                width={400}
                height={300}
                loading="lazy"
              />
              <div className="p-7 text-center">
                <h4 className="text-secondary font-primary h6 font-bold">
                  <span dangerouslySetInnerHTML={markdownify(item.currency)} />
                  <span dangerouslySetInnerHTML={markdownify(item.price)} />
                </h4>
                <h3
                  className="font-semibold text-lg font-primary my-4"
                  dangerouslySetInnerHTML={markdownify(item.name)}
                />
                <p
                  className="text-sm"
                  dangerouslySetInnerHTML={markdownify(item.description)}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuSection;
