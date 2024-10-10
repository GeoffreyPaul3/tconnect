import { NextResponse } from 'next/server';
import crypto from 'crypto';

// Your secret hash for verifying webhook signatures
const PAYCHANGU_SECRET = process.env.PAYCHANGU_SECRET_KEY;

interface WebhookPayload {
    type: string;
    reference: string;  // Transaction reference
    amount: number;     // Amount of the transaction
    currency: string;   // Currency of the transaction
    // Add other properties as needed
}


export async function POST(request: Request) {
    const signature = request.headers.get('X-Paychangu-Signature');
    const payload: WebhookPayload = await request.json();

    // Verify webhook signature
    if (!verifySignature(payload, signature)) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Handle the webhook event
    const eventType = payload.type;

    switch (eventType) {
        case 'payment.success':
            await handleSuccessfulPayment(payload);
            break;
        case 'payment.failed':
            await handleFailedPayment(payload);
            break;
        // Handle other event types as necessary
        default:
            console.warn(`Unhandled event type: ${eventType}`);
            break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
}

// Function to verify the webhook signature
function verifySignature(payload: WebhookPayload, signature: string | null): boolean {
    const expectedSignature = createHMAC(payload);
    return signature === expectedSignature;
}

// Create HMAC for signature verification
function createHMAC(payload: WebhookPayload): string {
    const hmac = crypto.createHmac('sha256', PAYCHANGU_SECRET!);
    hmac.update(JSON.stringify(payload));
    return hmac.digest('hex');
}

// Handle successful payment
async function handleSuccessfulPayment(payload: WebhookPayload) {
    console.log('Payment was successful:', payload);

}

// Handle failed payment
async function handleFailedPayment(payload: WebhookPayload) {
    console.error('Payment failed:', payload);
    // Implement your logic to handle failed payments here
}
