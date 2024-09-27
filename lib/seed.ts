import fs from 'fs';
import path from 'path';
import { client } from "@/sanity/lib/client";
import { inventory } from "@/config/inventory";

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
  
  await transaction.commit();
  await seedSanityImages();
  console.log("Sanity data seeded");
}

async function seedSanityImages() {
  const imagesDir = path.join(process.cwd(), 'public/cards'); // Adjust this path if needed

  for (const item of inventory) {
    const images: unknown[] = [];
    for (const image of item.images) {
      if (image.asset && image.asset._ref) {
        const imagePath = path.join(imagesDir, `${image.asset._ref}.jpg`); // Adjust the extension if needed
        if (fs.existsSync(imagePath)) {
          const imageAssetBuffer = fs.readFileSync(imagePath);
          const imageAsset = await client.assets.upload("image", imageAssetBuffer);
          images.push({
            _key: imageAsset._id,
            _type: "image",
            asset: {
              _type: "reference",
              _ref: imageAsset._id,
            },
          });
        } else {
          console.warn(`Image file not found: ${imagePath}`);
        }
      } else {
        console.warn(`Image asset is undefined for image: ${JSON.stringify(image)}`);
      }
    }
    await client.patch(item.id).set({ "slug.current": slugify(item.name), images }).commit();
  }
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}
