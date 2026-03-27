// similar products
const similarItems = (currentItem: any, allItems: any[]) => {
  let categories: string[] = [];

  // set categories
  if (currentItem?.data?.categories && currentItem.data.categories.length > 0) {
    categories = currentItem.data.categories;
  } else if (
    currentItem?.frontmatter?.categories &&
    currentItem.frontmatter.categories.length > 0
  ) {
    categories = currentItem.frontmatter.categories;
  }

  // If no categories are available, return empty array
  if (categories.length === 0) {
    return [];
  }

  // filter by categories
  const filterByCategories = allItems.filter((item: any) => {
    // Check if categories exist in item.data or item.frontmatter
    const itemCategories =
      item?.data?.categories || item?.frontmatter?.categories || [];
    return (
      itemCategories.length > 0 &&
      categories.some((category) => itemCategories.includes(category))
    );
  });

  // merged after filter
  const mergedItems = [...new Set([...filterByCategories])];

  // filter by slug
  const filterBySlug = mergedItems.filter(
    (post) => post.id !== currentItem.id && post.slug !== currentItem.slug,
  );

  return filterBySlug;
};

export default similarItems;
