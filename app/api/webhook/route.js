import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY');
}

if (!process.env.STRIPE_WEBHOOK_SECRET) {
  throw new Error('Missing STRIPE_WEBHOOK_SECRET');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
}

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY,
  {
    apiVersion: '2023-10-16'
  }
);

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  const body = await request.text();

  const signature =
    request.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error(
      'Webhook signature validation failed:',
      error.message
    );

    return NextResponse.json(
      {
        error: error.message
      },
      {
        status: 400
      }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;

        const paymentIntentId =
          session.payment_intent;

        // Prevent duplicate orders
        const {
          data: existingOrder
        } = await supabaseAdmin
          .from('orders')
          .select('id')
          .eq(
            'payment_intent_id',
            paymentIntentId
          )
          .maybeSingle();

        if (existingOrder) {
          console.log(
            'Duplicate webhook ignored:',
            paymentIntentId
          );

          return NextResponse.json({
            received: true
          });
        }

        const userId =
          session.metadata?.userId || null;

        const discountApplied =
          Number(
            session.metadata
              ?.discountApplied || 0
          );

        const shippingAddress =
          JSON.parse(
            session.metadata
              ?.shippingAddress || '{}'
          );

        const cartData =
          JSON.parse(
            session.metadata
              ?.cartData || '[]'
          );

        const totalAmount =
          Number(session.amount_total || 0) /
          100;

        const productIds =
          cartData.map(item => item.id);

        const {
          data: products,
          error: productsError
        } = await supabaseAdmin
          .from('products')
          .select(
            'id,name,price,stock'
          )
          .in('id', productIds);

        if (productsError) {
          console.error(
            'Product verification failed:',
            productsError
          );

          return NextResponse.json(
            {
              error:
                'Unable to verify products'
            },
            {
              status: 500
            }
          );
        }

        const {
          data: order,
          error: orderError
        } = await supabaseAdmin
          .from('orders')
          .insert({
            user_id: userId,
            total_amount: totalAmount,
            discount_applied:
              discountApplied,
            shipping_address:
              shippingAddress,
            status: 'Processing',
            payment_intent_id:
              paymentIntentId
          })
          .select()
          .single();

        if (orderError) {
          console.error(
            'Order creation failed:',
            orderError
          );

          return NextResponse.json(
            {
              error:
                'Failed to create order'
            },
            {
              status: 500
            }
          );
        }

        const orderItems =
          cartData.map(item => {
            const product =
              products.find(
                p =>
                  p.id === item.id
              );

            return {
              order_id: order.id,
              product_id: item.id,
              quantity: item.qty,
              price:
                product?.price || 0
            };
          });

        const {
          error: itemsError
        } = await supabaseAdmin
          .from('order_items')
          .insert(orderItems);

        if (itemsError) {
          console.error(
            'Order items insert failed:',
            itemsError
          );
        }

        for (const item of cartData) {
          const {
            error: inventoryError
          } = await supabaseAdmin.rpc(
            'decrement_inventory',
            {
              row_id: item.id,
              qty: item.qty
            }
          );

          if (inventoryError) {
            console.error(
              'Inventory update failed:',
              inventoryError
            );
          }
        }

        console.log(
          'Order processed successfully:',
          order.id
        );

        break;
      }

      default:
        console.log(
          `Unhandled event type: ${event.type}`
        );
    }

    return NextResponse.json({
      received: true
    });
  } catch (error) {
    console.error(
      'Webhook processing error:',
      error
    );

    return NextResponse.json(
      {
        error:
          'Webhook processing failed'
      },
      {
        status: 500
      }
    );
  }
}