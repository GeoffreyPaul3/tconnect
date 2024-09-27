"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatCurrencyString, useShoppingCart } from "use-shopping-cart";

import { SanityProduct } from "@/config/inventory"; // Ensure this imports the correct type
import { getValidityPeriodName } from "@/lib/utils"; 
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  product: SanityProduct | null; // Allow product to be null
}

export function ProductInfo({ product }: Props) {
  // Ensure product is not null before trying to access its properties
  const initialValidityPeriod = product && product.validityPeriod && product.validityPeriod.length > 0 
    ? product.validityPeriod[0] 
    : '';

  const [selectedValidityPeriod, setSelectedValidityPeriod] = useState<string>(initialValidityPeriod);
  const { addItem, incrementItem, cartDetails } = useShoppingCart();
  const isInCart = product ? !!cartDetails?.[product._id] : false; // Check for product and _id

  const { toast } = useToast();

  function addToCart() {
    if (!product) return; // Prevent adding to cart if product is null

    const item = {
      ...product,
      product_data: {
        validityPeriod: selectedValidityPeriod,
      },
    };

    if (isInCart) {
      incrementItem(item._id);
    } else {
      addItem(item);
    }

    toast({
      title: `${item.name} (${getValidityPeriodName(selectedValidityPeriod)})`,
      description: "Product added to cart",
      action: (
        <Link href="/cart">
          <Button variant="link" className="gap-x-2 whitespace-nowrap">
            <span>Open cart</span>
            <ArrowRight className="h-5 w-5" />
          </Button>
        </Link>
      ),
    });
  }

  // Render nothing or a loading state if product is null
  if (!product) {
    return <p>Loading product information...</p>; // Or a spinner/placeholder
  }

  return (
    <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
      <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>

      <div className="mt-3">
        <h2 className="sr-only">Product information</h2>
        <p className="text-3xl tracking-tight">
          {formatCurrencyString({
            value: product.price,
            currency: product.currency,
          })}
        </p>
      </div>

      <div className="mt-6">
        <h3 className="sr-only">Description</h3>
        <div className="space-y-6 text-base">{product.description}</div>
      </div>

      <div className="mt-4">
        <p>
          Validity Period: <strong>{getValidityPeriodName(selectedValidityPeriod)}</strong>
        </p>
        {/* Ensure product.validityPeriod is correctly typed as an array */}
        {Array.isArray(product.validityPeriod) && product.validityPeriod.map((period: string) => (
          <Button
            onClick={() => setSelectedValidityPeriod(period)}
            key={period}
            variant={selectedValidityPeriod === period ? "default" : "outline"}
            className="mr-2 mt-4"
          >
            {getValidityPeriodName(period)}
          </Button>
        ))}
      </div>

      <form className="mt-6">
        <div className="mt-4 flex">
          <Button
            type="button"
            onClick={addToCart}
            className="w-full bg-violet-600 py-6 text-base font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            Add to cart
          </Button>
        </div>
      </form>
    </div>
  );
}
