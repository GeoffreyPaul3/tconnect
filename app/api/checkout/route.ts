import { NextRequest, NextResponse } from "next/server"
import { clerkClient, getAuth } from "@clerk/nextjs/server"

interface CartItem {
  price: number; // Ensure this is already in MWK (integer)
  quantity: number;
}

const generateTxRef = () => `TX-${Math.floor(Math.random() * 1000000000) + 1}`;

export async function POST(req: NextRequest) {
  try {
    const { userId, sessionId } = getAuth(req); // Get Clerk session data

    // Ensure user is authenticated
    if (!userId || !sessionId) {
      return NextResponse.json(
        { message: "User not authenticated" },
        { status: 401 }
      );
    }

    // Fetch the full user object using the userId
    const user = await clerkClient.users.getUser(userId);

    // Parse cart details from request body
    const cartDetails: Record<string, CartItem> = await req.json();
    const tx_ref = generateTxRef();

    // Calculate total amount from cart details in MWK
    const amountInMWK = Object.values(cartDetails).reduce((total, item) => {
      return total + Math.round(item.price) * item.quantity; // Ensuring price is integer
    }, 0);

    // Ensure valid amount in MWK (positive and within the allowed range)
    if (amountInMWK <= 0 || amountInMWK > 178400000) {
      return NextResponse.json({ message: "Invalid amount" }, { status: 400 });
    }

    // Prepare payment data for PayChangu API
    const paymentData = {
      amount: amountInMWK, // MWK doesn't need further conversions to cents
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

    // Send the payment request to PayChangu
    const response = await fetch("https://api.paychangu.com/payment", {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.PAYCHANGU_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();

    // Handle PayChangu response
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
    console.error("Error creating PayChangu transaction:", error);
    return NextResponse.json(
      { message: "Server error. Please try again later." },
      { status: 500 }
    );
  }
}
