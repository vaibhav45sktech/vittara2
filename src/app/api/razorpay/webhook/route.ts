import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import nodemailer from "nodemailer";
import prisma from "@/lib/prisma";

// Force Node.js runtime for crypto and nodemailer
export const runtime = "nodejs";

// Disable body parser to get raw body for signature verification
export const config = {
  api: {
    bodyParser: false,
  },
};

// Hardcoded for deployment
const RAZORPAY_WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || "your_webhook_secret_here";
const MAIL_USER = "adityajagrani8@gmail.com";
const MAIL_PASS = "hkck gafw almv szwn";
const STORE_OWNER_EMAIL = "adityajagrani8@gmail.com";

// Verify Razorpay signature
function verifySignature(body: string, signature: string, secret: string): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return expectedSignature === signature;
}

// Types for order data
interface OrderItem {
  title?: string;
  quantity?: number;
  price?: number;
  size?: string;
  fabric?: string;
  fit?: string;
}

interface OrderAddress {
  name?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
}

// Send email notification with order details
async function sendEmailNotification(paymentData: {
  paymentId: string;
  amount: number;
  email: string;
  contact: string;
  method: string;
  razorpayOrderId: string;
}) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: MAIL_USER,
      pass: MAIL_PASS,
    },
  });

  const timestamp = new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
  });

  // Fetch order details from database
  let orderDetails = null;
  let address: OrderAddress = {};
  let items: OrderItem[] = [];

  try {
    orderDetails = await prisma.order.findFirst({
      where: { razorpayOrderId: paymentData.razorpayOrderId }
    });

    if (orderDetails) {
      address = (orderDetails.address as OrderAddress) || {};
      items = (orderDetails.items as OrderItem[]) || [];
    }
  } catch (error) {
    console.error("Error fetching order details:", error);
  }

  // Build items HTML
  const itemsHtml = items.length > 0
    ? items.map((item: OrderItem) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.title || 'Item'}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.size || '-'}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.fabric || '-'}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.fit || '-'}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity || 1}</td>
          <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price || 0}</td>
        </tr>
      `).join('')
    : '<tr><td colspan="6" style="padding: 10px; text-align: center; color: #999;">No item details available</td></tr>';

  const mailOptions = {
    from: `"Fittara Store" <${MAIL_USER}>`,
    to: STORE_OWNER_EMAIL,
    subject: "🛒 New Order Received - Fittara",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px; background: #f9f9f9;">
        <div style="background: #000; color: #fff; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">🛒 New Order Received!</h1>
        </div>
        
        <div style="background: #fff; padding: 30px; border: 1px solid #eee; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #000; padding-bottom: 10px;">💳 Payment Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Amount</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold; text-align: right; font-size: 18px; color: #22c55e;">₹${(paymentData.amount / 100).toLocaleString("en-IN")}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Payment ID</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-family: monospace; text-align: right;">${paymentData.paymentId}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Order ID</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-family: monospace; text-align: right;">${paymentData.razorpayOrderId}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Payment Method</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; text-align: right; text-transform: capitalize;">${paymentData.method}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #666;">Timestamp</td>
              <td style="padding: 10px 0; text-align: right;">${timestamp}</td>
            </tr>
          </table>
        </div>

        <div style="background: #fff; padding: 30px; border: 1px solid #eee; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #000; padding-bottom: 10px;">📦 Order Items</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Item</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Size</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Fabric</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Fit</th>
                <th style="padding: 10px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                <th style="padding: 10px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
        </div>

        <div style="background: #fff; padding: 30px; border: 1px solid #eee; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0; border-bottom: 2px solid #000; padding-bottom: 10px;">🚚 Shipping Address</h2>
          <div style="line-height: 1.8;">
            <p style="margin: 0; font-weight: bold; font-size: 16px;">${orderDetails?.customerName || address.name || 'N/A'}</p>
            <p style="margin: 5px 0; color: #666;">${address.street || 'N/A'}</p>
            <p style="margin: 5px 0; color: #666;">${address.city || ''}, ${address.state || ''} - ${address.zip || ''}</p>
            <p style="margin: 10px 0 0 0;">
              <strong>📞 Phone:</strong> ${address.phone || paymentData.contact || 'N/A'}
            </p>
            <p style="margin: 5px 0 0 0;">
              <strong>📧 Email:</strong> ${paymentData.email || 'N/A'}
            </p>
          </div>
        </div>

        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p>This is an automated notification from Fittara Store.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);

  // Update order status to paid
  if (orderDetails) {
    try {
      await prisma.order.update({
        where: { id: orderDetails.id },
        data: { status: 'paid' }
      });
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    // Get raw body for signature verification
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      console.error("Webhook Error: Missing signature");
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // Verify signature
    if (!verifySignature(rawBody, signature, RAZORPAY_WEBHOOK_SECRET)) {
      console.error("Webhook Error: Invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    // Parse the payload
    const payload = JSON.parse(rawBody);
    const event = payload.event;

    console.log(`Webhook received: ${event}`);

    // Only process payment.captured events
    if (event === "payment.captured") {
      const payment = payload.payload.payment.entity;

      const paymentData = {
        paymentId: payment.id,
        amount: payment.amount,
        email: payment.email || "",
        contact: payment.contact || "",
        method: payment.method || "unknown",
        razorpayOrderId: payment.order_id || "",
      };

      console.log("Payment captured:", paymentData);

      // Send email notification
      await sendEmailNotification(paymentData);
      console.log("Email notification sent successfully");
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("Webhook Error:", error.message || error);
    return NextResponse.json(
      { error: "Webhook processing failed", details: error.message },
      { status: 500 }
    );
  }
}
