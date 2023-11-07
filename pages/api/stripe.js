////////////this is our BACKEND//BACKEND//BACKEND//////(Next.js allows both Fontend and Backend at a time)
//(IMPORTANT)This api Folder serves the entire back-end of our application.
//The part is written inside api folder(e.g. hello.js,stripe.js) is going to be our server(which is not going to be rendered on frontend)
//So inside of a Next.js app we don't have a need for a special node/express server
/////////////////(IMPORTANT)We getting this below code from https://stripe.com/docs/checkout/quickstart
// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import Stripe from 'stripe';
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log(req.body)
    try {
      const params = {
        submit_type: 'pay',
        mode: 'payment',
        payment_method_types: ['card'],
        billing_address_collection: 'required',
        shipping_options: [
            {shipping_rate: 'shr_1O9bWXSG9dpF2mge2FBPFy2O'},//create it inside https://dashboard.stripe.com/test/shipping-rates
            
        ],
        line_items: req.body.map((item) => {
          const img = item.image[0].asset._ref;
          //below line will replace (image-9fbb62343426e1f157144f26d9b59be1629ef7c1-600x600-webp) with (https://cdn.sanity.io/images/pen9cz45/production/9fbb62343426e1f157144f26d9b59be1629ef7c1-600x600.webp)
          const newImage = img.replace('image-','https://cdn.sanity.io/images/pen9cz45/production/').replace('-webp','.webp');//you also can do this for "png","jpg"
          
          return {
            price_data: {
              currency: 'inr',
              product_data: {
                name: item.name,
                images: [newImage]
              },
              unit_amount: item.price * 100,//*100 because the unit_amount has to be in paisa(INR)/cents(USD)
            },
            adjustable_quantity: {
              enabled:true,
              minimum: 1,
            },
            quantity: item.quantity
          }
        }),
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/canceled`,
      }

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);
      res.status(200).json(session)
    } catch (err) {
      res.status(err.statusCode || 500).json(err.message);
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
