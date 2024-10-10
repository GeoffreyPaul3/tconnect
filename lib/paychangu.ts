const PAYCHANGU_BASE_URL = 'https://api.paychangu.com'; // Replace with the actual PayChangu API URL
const PAYCHANGU_API_KEY = process.env.PAYCHANGU_SECRET_KEY; // Ensure your API key is stored in an environment variable

// Function to fetch order details from PayChangu
export async function fetchOrderDetails(tx_ref: string) {
    const response = await fetch(`${PAYCHANGU_BASE_URL}/orders/${tx_ref}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${PAYCHANGU_API_KEY}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        console.error('Error fetching order details from PayChangu:', response.statusText);
        throw new Error('Unable to fetch order details');
    }

    const data = await response.json();
    return data; // Return the order details
}

// Function to store order details in your CMS (e.g., Sanity)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function storeOrderDetails(orderData: any) {
    const sanityResponse = await fetch(`${process.env.SANITY_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
    });

    if (!sanityResponse.ok) {
        console.error('Error storing order details in CMS:', sanityResponse.statusText);
        throw new Error('Unable to store order details');
    }

    const storedData = await sanityResponse.json();
    return storedData; // Return the stored data
}

// Function to sync PayChangu orders with your CMS
export async function syncOrders() {
    const response = await fetch(`${PAYCHANGU_BASE_URL}/orders`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${PAYCHANGU_API_KEY}`,
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        console.error('Error syncing orders from PayChangu:', response.statusText);
        throw new Error('Unable to sync orders');
    }

    const orders = await response.json();
    for (const order of orders) {
        await storeOrderDetails(order); // Store each order in your CMS
    }

    return orders; // Return all synced orders
}
