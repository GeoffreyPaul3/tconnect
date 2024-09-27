import { Image } from "sanity";

interface InventoryProduct {
  id: string;
  name: string;
  slug: string; // This property is required
  images: Image[];
  categories: string[];
  availability: string;
  validityPeriod: string;
  description: string;
  sku: string;
  price: number;
  currency: string;
}

export interface SanityProduct extends Omit<InventoryProduct, "images"> {
  _id: string;
  _createdAt: Date;
  slug: string; // This property is also included here
  images: Image[];
}

export const inventory: InventoryProduct[] = [
  {
    id: "64da6006-a4bb-4555-af78-3467853eb75e",
    sku: "canvas_tote_bag_1",
    name: "Canvas Tote Bag",
    slug: "canvas-tote-bag",
    description: `Meet your new favorite carry-on...`,
    price: 16800,
    images: [
      { _type: "image", asset: { _ref: "card4", _type: "reference" } },
      { _type: "image", asset: { _ref: "image-abc", _type: "reference" } },
      { _type: "image", asset: { _ref: "image-def", _type: "reference" } },
    ],
    categories: ["bags"],
    availability: "in stock",
    validityPeriod: "30 days",
    currency: "USD",
  },
  // Gift Cards
  {
    id: "64da6006-a4bb-4555-af78-3467853eb75f",
    sku: "gift_card_25",
    name: "Gift Card - $25",
    slug: "gift-card-25",
    description: "A perfect gift for any occasion, worth $25.",
    price: 2500, // Price in cents
    images: [
      {
        _type: "image",
        asset: { _ref: "card1", _type: "reference" },
      },
    ],
    categories: ["gift cards"],
    availability: "in stock",
    validityPeriod: "365 days",
    currency: "USD",
  },
  {
    id: "64da6006-a4bb-4555-af78-3467853eb75g",
    sku: "gift_card_50",
    name: "Gift Card - $50",
    slug: "gift-card-50",
    description: "A perfect gift for any occasion, worth $50.",
    price: 5000, // Price in cents
    images: [
      {
        _type: "image",
        asset: { _ref: "card2", _type: "reference" },
      },
    ],
    categories: ["gift cards"],
    availability: "in stock",
    validityPeriod: "365 days",
    currency: "USD",
  },
  {
    id: "64da6006-a4bb-4555-af78-3467853eb75h",
    sku: "gift_card_100",
    name: "Gift Card - $100",
    slug: "gift-card-100",
    description: "A perfect gift for any occasion, worth $100.",
    price: 10000, // Price in cents
    images: [
      {
        _type: "image",
        asset: { _ref: "card3", _type: "reference" },
      },
    ],
    categories: ["gift cards"],
    availability: "in stock",
    validityPeriod: "365 days",
    currency: "USD",
  },
  // More products can be added here with the 'slug' property included
];
