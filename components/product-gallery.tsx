"use client";

import { useState } from "react";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/image";
import { SanityProduct } from "@/config/inventory";
import { shimmer, toBase64 } from "@/lib/image";

interface Props {
  product: SanityProduct;
}

export function ProductGallery({ product }: Props) {
  const [selectedImage, setSelectedImage] = useState(0);

  // Safety check if product.images exist
  if (!product?.images || product.images.length === 0) {
    return <div>No images available for this product.</div>;
  }

  return (
    <div className="flex flex-col-reverse">
      {/* Image Grid */}
      <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
        <ul className="grid grid-cols-4 gap-6">
          {product.images.map((image, index) => (
            <li key={image._key as string} className="relative">
              <div
                onClick={() => setSelectedImage(index)}
                className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white hover:bg-gray-50"
              >
                <span className="absolute inset-0 overflow-hidden rounded-md">
                  <Image
                    src={urlForImage(image).url() || "/fallback-image.jpg"} // Fallback in case the URL is invalid
                    width={200}
                    height={200}
                    alt={`Thumbnail ${index + 1}`}
                    className="h-full w-full object-cover object-center"
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(
                      shimmer(200, 200)
                    )}`}
                  />
                </span>
                {/* Ring around selected image */}
                {index === selectedImage && (
                  <span
                    className="pointer-events-none absolute inset-0 rounded-md ring-4 ring-indigo-500 ring-offset-2"
                    aria-hidden="true"
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Image */}
      <div className="aspect-h-1 aspect-w-1 w-full">
        {product.images[selectedImage] && (
          <Image
            priority
            src={urlForImage(product.images[selectedImage]).url() || "/fallback-image.jpg"}
            alt={`Main ${product.name} image`}
            width={600}
            height={750}
            className="h-full w-full border-2 border-gray-200 object-cover object-center shadow-sm dark:border-gray-800 sm:rounded-lg"
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(
              shimmer(600, 750)
            )}`}
          />
        )}
      </div>
    </div>
  );
}
