import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'placeholder_key', {
  apiVersion: '2023-10-16',
});

export async function POST(request) {
  try {
    const { cart, userId, userEmail, shippingAddress, discountApplied } = await request.json();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Formulate verified line structures line items matrix
    const lineItems = cart.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.images,
        },
        unit_amount: Math.round(item.price * 100), // convert completely to cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${appUrl}/checkout/success`,
      cancel_url: `${appUrl}/checkout/cancel`,
      customer_email: userEmail,
      metadata: {
        userId,
        discountApplied: discountApplied.toString(),
        shippingAddress: JSON.stringify(shippingAddress),
        cartData: JSON.stringify(cart.map(i => ({ id: i.id, qty: i.quantity, price: i.price }))),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe pipeline generation collapse:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
