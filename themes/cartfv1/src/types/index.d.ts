export type Button = {
  enable: boolean;
  label: string;
  link: string;
};

export type Counter = {
  count: string;
  count_suffix: string;
  count_prefix: string;
  count_duration: number;
};

// Regular Pages
export type RegularPage = {
  frontmatter: {
    title: string;
    meta_title?: string;
    description?: string;
    image?: string;
    canonical?: string;
    noindex?: boolean;
    draft?: boolean;
  };
  slug?: string;
  content?: string;
};

// Homepage
export type THomepage = RegularPage & {
  frontmatter: {
    hero: {
      title: string;
      subtitle: string;
      image: string;
      buttons: Button[];
    };
    explore_menu: {
      enable: boolean;
      title: string;
      items: Array<{
        name: string;
        image: string;
        tutorials: number;
        link: string;
      }>;
    };
    services: {
      enable: boolean;
      title: string;
      items: Array<{
        name: string;
        description: string;
        image: string;
      }>;
    };
    features: {
      enable: boolean;
      title: string;
      content: string;
      images: string[];
      key_benefits: Array<{
        benefit: string;
        icon: string;
      }>;
    };
    blog_section: {
      enable: boolean;
      title: string;
      button: Button;
    };
  };
};

// About
export type TAbout = RegularPage & {
  frontmatter: {
    media: {
      title: string;
      image: string;
      link: string;
    };
    key_benefits: Array<{
      title: string;
      description: string;
      icon: string;
    }>;
    information: {
      title: string;
      description: string;
      image: string;
      metrics: Array<{
        name: string;
        counter: Counter;
      }>;
    };
  };
};

// Blog
export type TBlog = RegularPage & {
  frontmatter: {
    date: string;
    categories: string[];
    featured: boolean;
  };
};

// Book
export type TBook = RegularPage & {
  frontmatter: {
    google_map: string;
  };
};

// Contact
export type TContact = RegularPage & {
  frontmatter: {
    open_hours: string[];
  };
};

// Menu
export type TMenu = RegularPage & {
  frontmatter: {
    foods: Array<{
      name: string;
      image: string;
      description: string;
      currency: string;
      price: string;
      group: string;
    }>;
    food_apps: {
      enable: boolean;
      title: string;
      description: string;
      images: string[];
    };
  };
};

// Testimonial Section
export type TTestimonial = {
  frontmatter: {
    enable: boolean;
    title: string;
    testimonials: Array<{
      name: string;
      title: string;
      address: string;
      avatar: string;
      content: string;
    }>;
  };
  slug?: string;
  content?: string;
};
