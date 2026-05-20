// One-shot migration data — the original hardcoded inventory from src/lib/cars.ts.
// Consumed only by scripts/seed-sanity.ts. Safe to delete this file after the seed
// has run successfully and you've verified the cars in Sanity Studio.

export type SeedCar = {
  slug: string;
  make: string;
  model: string;
  variant?: string;
  year: number;
  price: number;
  mileage: number;
  transmission: "Manual" | "Automatic" | "PDK" | "DCT";
  fuel: "Petrol" | "Diesel" | "Electric" | "Hybrid";
  bodyType: "Coupe" | "Convertible" | "Saloon" | "Estate" | "SUV" | "Hatchback";
  category: "luxury" | "sports" | "performance" | "electric" | "classic";
  engine: string;
  power: string;
  colour: string;
  description: string;
  highlights: string[];
  images: string[];
  featured?: boolean;
  status: "available" | "reserved" | "sold";
};

export const seedCars: SeedCar[] = [
  {
    slug: "porsche-911-carrera-s-2021",
    make: "Porsche",
    model: "911",
    variant: "Carrera S",
    year: 2021,
    price: 89950,
    mileage: 12450,
    transmission: "PDK",
    fuel: "Petrol",
    bodyType: "Coupe",
    category: "sports",
    engine: "3.0L Twin-Turbo Flat-Six",
    power: "444 bhp",
    colour: "GT Silver Metallic",
    description:
      "An immaculate 992-generation Carrera S in striking GT Silver. Specified with Sport Chrono Package, sports exhaust, and 20/21\" Carrera S wheels. One owner from new with full Porsche main dealer service history.",
    highlights: [
      "Sport Chrono Package",
      "Sports Exhaust System",
      "20/21\" Carrera S Wheels",
      "Adaptive Sports Seats Plus",
      "BOSE Surround Sound",
      "Full Porsche Service History",
    ],
    images: [
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=85",
      "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1600&q=85",
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=1600&q=85",
    ],
    featured: true,
    status: "available",
  },
  {
    slug: "bentley-continental-gt-v8-2019",
    make: "Bentley",
    model: "Continental GT",
    variant: "V8",
    year: 2019,
    price: 119950,
    mileage: 24800,
    transmission: "Automatic",
    fuel: "Petrol",
    bodyType: "Coupe",
    category: "luxury",
    engine: "4.0L Twin-Turbo V8",
    power: "542 bhp",
    colour: "Glacier White",
    description:
      "A breathtaking third-generation Continental GT V8 finished in Glacier White over Beluga hide. Exquisitely specified with Mulliner Driving Specification and Naim for Bentley audio.",
    highlights: [
      "Mulliner Driving Specification",
      "Naim for Bentley Audio",
      "Rotating Display",
      "22\" Black-Painted Wheels",
      "Heated & Ventilated Seats",
      "Bentley Service History",
    ],
    images: [
      "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=1600",
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=1600",
    ],
    featured: true,
    status: "available",
  },
  {
    slug: "bmw-m4-competition-2022",
    make: "BMW",
    model: "M4",
    variant: "Competition",
    year: 2022,
    price: 74995,
    mileage: 8200,
    transmission: "Automatic",
    fuel: "Petrol",
    bodyType: "Coupe",
    category: "performance",
    engine: "3.0L Twin-Turbo Inline-6",
    power: "503 bhp",
    colour: "Isle of Man Green",
    description:
      "G82 M4 Competition in the iconic Isle of Man Green. M Carbon bucket seats, M Carbon exterior package, and M Driver's Package. A future classic.",
    highlights: [
      "M Carbon Bucket Seats",
      "M Carbon Exterior Package",
      "M Driver's Package",
      "Harman Kardon Audio",
      "Head-Up Display",
      "BMW Service History",
    ],
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1600",
      "https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=1600",
    ],
    featured: true,
    status: "available",
  },
  {
    slug: "porsche-boxster-986-s-2003",
    make: "Porsche",
    model: "Boxster",
    variant: "986 S",
    year: 2003,
    price: 14950,
    mileage: 68000,
    transmission: "Manual",
    fuel: "Petrol",
    bodyType: "Convertible",
    category: "classic",
    engine: "3.2L Flat-Six",
    power: "260 bhp",
    colour: "Seal Grey Metallic",
    description:
      "A beautifully preserved 986 Boxster S with the desirable 6-speed manual gearbox. Recently serviced and ready to drive. The perfect entry into Porsche ownership.",
    highlights: [
      "6-Speed Manual Gearbox",
      "Recent Major Service",
      "IMS Bearing Updated",
      "Bose Audio",
      "Full Leather Interior",
    ],
    images: [
      "https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=1600",
    ],
    status: "available",
  },
  {
    slug: "audi-rs6-avant-2021",
    make: "Audi",
    model: "RS6",
    variant: "Avant",
    year: 2021,
    price: 99950,
    mileage: 18500,
    transmission: "Automatic",
    fuel: "Petrol",
    bodyType: "Estate",
    category: "performance",
    engine: "4.0L Twin-Turbo V8",
    power: "591 bhp",
    colour: "Nardo Grey",
    description:
      "The ultimate Q-car. C8 RS6 Avant in Nardo Grey with Carbon Vorsprung pack, dynamic plus, and ceramic brakes. Devastatingly quick and family-practical.",
    highlights: [
      "Carbon Vorsprung Pack",
      "Dynamic Plus Package",
      "Ceramic Brake Discs",
      "RS Sports Exhaust",
      "Bang & Olufsen 3D Audio",
      "Panoramic Sunroof",
    ],
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1600",
    ],
    status: "available",
  },
  {
    slug: "tesla-model-s-plaid-2022",
    make: "Tesla",
    model: "Model S",
    variant: "Plaid",
    year: 2022,
    price: 79995,
    mileage: 14200,
    transmission: "Automatic",
    fuel: "Electric",
    bodyType: "Saloon",
    category: "electric",
    engine: "Tri-Motor Electric",
    power: "1,020 bhp",
    colour: "Pearl White Multi-Coat",
    description:
      "The fastest production saloon ever made. Model S Plaid with 0-60 in under 2 seconds, 396-mile range, and full self-driving capability.",
    highlights: [
      "Full Self-Driving Capability",
      "21\" Arachnid Wheels",
      "Carbon Fibre Décor",
      "Yoke Steering Wheel",
      "1,000+ HP Tri-Motor",
      "396-Mile Range",
    ],
    images: [
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1600",
    ],
    status: "available",
  },
  {
    slug: "mercedes-amg-c63-s-2020",
    make: "Mercedes-Benz",
    model: "AMG C63 S",
    year: 2020,
    price: 54995,
    mileage: 22000,
    transmission: "Automatic",
    fuel: "Petrol",
    bodyType: "Saloon",
    category: "performance",
    engine: "4.0L Twin-Turbo V8",
    power: "503 bhp",
    colour: "Obsidian Black",
    description:
      "The last of the V8 C-Class. AMG C63 S with Premium Plus Pack, AMG Carbon Pack, and AMG Performance Exhaust. A genuine modern muscle car.",
    highlights: [
      "AMG Performance Exhaust",
      "AMG Carbon Pack",
      "Premium Plus Package",
      "Burmester Audio",
      "AMG Track Pace",
      "Mercedes Service History",
    ],
    images: [
      "https://images.unsplash.com/photo-1617814065893-00757125efab?w=1600",
    ],
    status: "reserved",
  },
];
