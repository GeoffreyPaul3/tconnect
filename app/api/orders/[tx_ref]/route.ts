// pages/api/orders/[tx_ref].ts

import { fetchOrderDetails } from "@/lib/paychangu";
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tx_ref } = req.query;

  try {
    const orderDetails = await fetchOrderDetails(tx_ref as string);
    if (!orderDetails) {
      return res.status(404).json({ message: "Order not found." });
    }
    res.status(200).json(orderDetails);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
