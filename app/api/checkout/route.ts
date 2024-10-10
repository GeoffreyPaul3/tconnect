import { NextRequest, NextResponse } from "next/server";
import { clerkClient, getAuth } from "@clerk/nextjs/server";

interface CartItem {
  price: number; // Price is assumed to be in MWK (integer)
  quantity: number;
}

// Function to generate a unique transaction reference
const generateTxRef = () => `TX-${Math.floor(Math.random() * 1000000000) + 1}`;

export async function POST(req: NextRequest) {
  try {
    const { userId, sessionId } = getAuth(req); // Clerk session data

    // Ensure the user is authenticated
    if (!userId || !sessionId) {
      console.error("Authentication error: User not authenticated");
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    // Fetch the user details using Clerk client
    const user = await clerkClient.users.getUser(userId);

    // Parse the cart details from the request body
    const cartDetails: Record<string, CartItem> = await req.json();
    const tx_ref = generateTxRef();

    // Calculate total amount in MWK
    const amountInMWK = Object.values(cartDetails).reduce((total, item) => {
      return total + Math.round(item.price) * item.quantity;
    }, 0);

    // Validate the total amount (now allowing up to 5,000,000 MWK)
    if (amountInMWK <= 0 || amountInMWK > 5000000) {
      console.error(`Invalid amount: ${amountInMWK} MWK`);
      return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
    }

    // Prepare the payment data to send to PayChangu
    const paymentData = {
      amount: amountInMWK,
      currency: "MWK",
      email: user.emailAddresses[0]?.emailAddress || "email@example.com",
      first_name: user.firstName || "N/A",
      last_name: user.lastName || "N/A",
      callback_url: `${process.env.NEXT_PUBLIC_CALLBACK_URL}/success?tx_ref=${tx_ref}`,
      return_url: `${process.env.NEXT_PUBLIC_RETURN_URL}/payment-failed`,
      tx_ref,
      customization: {
        title: "Order Payment",
        description: "Payment for items in cart",
      },
    };

    // Make the request to PayChangu API
    const response = await fetch("https://api.paychangu.com/payment", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.PAYCHANGU_SECRET_KEY}`, // Make sure your key is set properly
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();

    // Handle response from PayChangu API
    if (response.ok && data.status === "success") {
      return NextResponse.json({ url: data.data.checkout_url });
    } else {
      console.error("PayChangu error response:", data);
      return NextResponse.json(
        { message: data.message || "Payment failed" },
        { status: 400 }
      );
    }
  } catch (error) {
    // Catch any errors during the request
    console.error("Error creating PayChangu transaction:", error);
    return NextResponse.json(
      { message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
