import { defineQuery } from "next-sanity";

const carProjection = /* groq */ `
  "slug": slug.current,
  make,
  model,
  variant,
  year,
  price,
  mileage,
  transmission,
  fuel,
  bodyType,
  category,
  engine,
  power,
  colour,
  description,
  highlights,
  "images": images[].asset->url,
  "videos": videos[] {
    title,
    "videoFile": videoFile.asset->url,
    videoUrl,
  },
  "legacyVideoFile": video.asset->url,
  "legacyVideoUrl": videoUrl,
  featured,
  status
`;

export const allCarsQuery = defineQuery(`
  *[_type == "car"] | order(year desc, _createdAt desc) {
    ${carProjection}
  }
`);

export const featuredCarsQuery = defineQuery(`
  *[_type == "car" && featured == true] | order(year desc) {
    ${carProjection}
  }
`);

export const carBySlugQuery = defineQuery(`
  *[_type == "car" && slug.current == $slug][0] {
    ${carProjection}
  }
`);

export const allCarSlugsQuery = defineQuery(`
  *[_type == "car" && defined(slug.current)].slug.current
`);

export const siteSettingsQuery = defineQuery(`*[_type == "siteSettings"][0]`);

export const homePageQuery = defineQuery(`*[_type == "homePage"][0]`);

export const servicesPageQuery = defineQuery(`*[_type == "servicesPage"][0]`);

export const whoWeArePageQuery = defineQuery(`*[_type == "whoWeArePage"][0]`);

export const curatedSalesPageQuery = defineQuery(`*[_type == "curatedSalesPage"][0]`);

export const bespokeSourcingPageQuery = defineQuery(`*[_type == "bespokeSourcingPage"][0]`);

export const storagePageQuery = defineQuery(`*[_type == "storagePage"][0]`);

export const merchPageQuery = defineQuery(`*[_type == "merchPage"][0]`);

export const detailingPageQuery = defineQuery(`*[_type == "detailingPage"][0] {
  ...,
  "beforeAfterGallery": beforeAfterGallery[] {
    label,
    serviceTag,
    "beforeImage": beforeImage.asset->url,
    "beforeVideo": beforeVideo.asset->url,
    "afterImage": afterImage.asset->url,
    "afterVideo": afterVideo.asset->url,
  },
  "gallery": gallery[] {
    caption,
    serviceTag,
    "image": image.asset->url,
  },
  "videos": videos[] {
    title,
    caption,
    orientation,
    "videoFile": videoFile.asset->url,
    videoUrl,
  }
}`);

export const merchProductsQuery = defineQuery(`
  *[_type == "merchProduct" && status != "hidden"] | order(coalesce(sortOrder, 100) asc, _createdAt desc) {
    _id,
    title,
    description,
    priceLabel,
    tiktokShopUrl,
    status,
    "image": image.asset->url
  }
`);
