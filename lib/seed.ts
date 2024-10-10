import { client } from "@/sanity/lib/client";
import { inventory } from "@/config/inventory";

// Function to seed sanity data
export async function seedSanityData() {
  const transaction = client.transaction();
  
  inventory.forEach((item) => {
    const product = {
      _type: "product",
      _id: item.id,
      name: item.name,
      currency: item.currency,
      description: item.description,
      price: item.price,
      sku: item.sku,
      availability: item.availability,
      validityPeriod: item.validityPeriod,
      categories: item.categories,
    };
    transaction.createOrReplace(product);
  });
  
  await transaction.commit();  // Commit the transaction for product creation/replacement
  await seedSanityImages();     // Seed the images for these products
  console.log("Sanity data seeded");
}

// Function to upload and set images for each product
async function seedSanityImages() {
  await Promise.all(inventory.map(async (item) => {
    // Map through the images and process them concurrently
    const images = await Promise.all(item.images.map(async (image) => {
      const imageAssetResponse = await fetch(image); // Fetch the image from URL
      const imageAssetBuffer = await imageAssetResponse.arrayBuffer(); // Convert to ArrayBuffer
      const imageAsset = await client.assets.upload(
        "image",
        Buffer.from(imageAssetBuffer) // Convert ArrayBuffer to Buffer
      );
      return {
        _key: imageAsset._id,
        _type: "image",
        asset: {
          _type: "reference",
          _ref: imageAsset._id,
        },
      };
    }));

    // Patch the product with images and slug
    await client
      .patch(item.id)
      .set({ "slug.current": slugify(item.name), images })
      .commit();  // Commit the patch
  }));
}

// Function to slugify product names
function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}
