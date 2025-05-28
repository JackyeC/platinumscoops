const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  try {
    const { productId } = JSON.parse(event.body);

    // Map product IDs from shop.html to Stripe Price IDs (replace with real IDs)
    const priceLookup = {
      'oso-fresh': 'price_REPLACE_ME_OSO',
      'compost-bags': 'price_REPLACE_ME_BAGS'
    };

    if (!priceLookup[productId]) {
      return { statusCode: 400, body: JSON.stringify({ error: 'Invalid product' }) };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceLookup[productId],
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${process.env.URL}/thank-you`,
      cancel_url: `${process.env.URL}/shop`
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Server error' }) };
  }
};
