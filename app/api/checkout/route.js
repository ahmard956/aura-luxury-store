import { supabase } from '@/lib/supabase';
export async function POST(request) {
    try {
      const {
        cart,
        userId,
        userEmail,
        shippingAddress,
        discountApplied
      } = await request.json();
  
      if (!cart || cart.length === 0) {
        return NextResponse.json(
          { error: 'Cart is empty' },
          { status: 400 }
        );
      }
  
      const productIds = cart.map(item => item.id);
  
      const { data: products, error: productError } =
        await supabase
          .from('products')
          .select('*')
          .in('id', productIds);
  
      if (productError || !products) {
        return NextResponse.json(
          { error: 'Unable to verify products' },
          { status: 400 }
        );
      }
  
      const verifiedLineItems = [];
  
      for (const cartItem of cart) {
        const product = products.find(
          p => p.id === cartItem.id
        );
  
        if (!product) {
          return NextResponse.json(
            {
              error: `Product not found: ${cartItem.id}`
            },
            { status: 400 }
          );
        }
  
        const qty = Number(cartItem.quantity);
  
        if (!qty || qty < 1) {
          return NextResponse.json(
            {
              error: `Invalid quantity for ${product.name}`
            },
            { status: 400 }
          );
        }
  
        if (
          product.stock !== null &&
          product.stock !== undefined &&
          qty > product.stock
        ) {
          return NextResponse.json(
            {
              error: `${product.name} has insufficient stock`
            },
            { status: 400 }
          );
        }
  
        verifiedLineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              images: product.images || []
            },
            unit_amount: Math.round(
              Number(product.price) * 100
            )
          },
          quantity: qty
        });
      }
  
      const appUrl =
        process.env.NEXT_PUBLIC_APP_URL ||
        'http://localhost:3000';
  
      const session =
        await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
  
          line_items: verifiedLineItems,
  
          mode: 'payment',
  
          success_url: `${appUrl}/checkout/success`,
          cancel_url: `${appUrl}/checkout/cancel`,
  
          customer_email:
            userEmail || 'guest@auraluxury.com',
  
          metadata: {
            userId: userId || 'guest',
            discountApplied:
              String(discountApplied || 0),
  
            shippingAddress: JSON.stringify(
              shippingAddress || {}
            ),
  
            cartData: JSON.stringify(
              cart.map(item => ({
                id: item.id,
                qty: item.quantity
              }))
            )
          }
        });
  
      return NextResponse.json({
        url: session.url
      });
    } catch (error) {
      console.error(
        'Checkout creation error:',
        error
      );
  
      return NextResponse.json(
        {
          error:
            error.message ||
            'Checkout session failed'
        },
        { status: 500 }
      );
    }
  }