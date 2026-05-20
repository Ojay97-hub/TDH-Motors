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
