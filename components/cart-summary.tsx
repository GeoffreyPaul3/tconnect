"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { formatCurrencyString, useShoppingCart } from "use-shopping-cart";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

export function CartSummary() {
  const {
    formattedTotalPrice,
    totalPrice,
    cartCount,
  } = useShoppingCart();
  const { user } = useUser(); // Get user information from Clerk
  const [isLoading, setIsLoading] = useState(false);
  const isDisabled = isLoading || cartCount! === 0;

  async function onCheckout() {
    setIsLoading(true);

    // Generate a unique transaction reference
    const txRef = '' + Math.floor((Math.random() * 1000000000) + 1);

    // Prepare payment data
    const paymentData = {
      amount: totalPrice || 0, // Use the total price as the amount, default to 0
      currency: "MWK",
      email: user?.emailAddresses[0]?.email || "customer@example.com", // Use customer's email or a default value
      first_name: user?.firstName || "Customer", // Use customer's first name or a default value
      last_name: user?.lastName || "Name", // Use customer's last name or a default value
      callback_url: "https://yourdomain.com/callback", // Replace with your callback URL
      return_url: "https://yourdomain.com/return", // Replace with your return URL
      tx_ref: txRef,
      customization: {
        title: "Order Payment",
        description: "Payment for order details.",
      },
    };

    // Make the API call to PayChangu
    const response = await fetch("https://api.paychangu.com/payment", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer {secret_key}`, // Replace with your PayChangu secret key
        "Content-Type": "application/json"
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();

    // Check if the checkout URL was generated successfully
    if (data.status === "success") {
      // Redirect the user to the PayChangu checkout page
      window.location.href = data.data.checkout_url;
    } else {
      console.error("Payment link generation failed:", data.message);
    }
    
    setIsLoading(false);
  }

  return (
    <section
      aria-labelledby="summary-heading"
      className="mt-16 rounded-lg border-2 border-gray-200 bg-gray-50 px-4 py-6 shadow-md dark:border-gray-900 dark:bg-black sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
    >
      <h2 id="summary-heading" className="text-lg font-medium">
        Order Summary
      </h2>

      <dl className="mt-6 space-y-4">
        <div className="flex items-center justify-between">
          <dt className="text-sm">Subtotal</dt>
          <dd className="text-sm font-medium">{formattedTotalPrice}</dd>
        </div>
        <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-600">
          <dt className="text-base font-medium">Order total</dt>
          <dd className="text-base font-medium">
            {formatCurrencyString({ value: totalPrice || 0, currency: "MWK" })}
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        <Button onClick={onCheckout} className="w-full" disabled={isDisabled}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Loading..." : "Checkout"}
        </Button>
      </div>
    </section>
  );
}
