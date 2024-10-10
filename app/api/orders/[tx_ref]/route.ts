import { fetchOrderDetails } from "@/lib/paychangu";
import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { tx_ref: string } }) {
    const { tx_ref } = params;

    try {
        const orderDetails = await fetchOrderDetails(tx_ref);
        if (!orderDetails) {
            return NextResponse.json({ message: "Order not found." }, { status: 404 });
        }
        return NextResponse.json(orderDetails, { status: 200 });
    } catch (error) {
        console.error("Error fetching order:", error);
        return NextResponse.json({ message: "Internal server error." }, { status: 500 });
    }
}
