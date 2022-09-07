require('dotenv').config();
const express = require("express");
const products = require('./products.json');
const stripe = require('stripe')(process.env.STRIPE_API_SECRET);
const {validateCartItem} = require('use-shopping-cart/src/serverUtil');

module.exports = function getRoutes() {
  const router = express.Router();

  router.get('/products', getProducts);
  router.get('/products/:productId', getProduct);

  router.get('/checkout-session', createCheckoutSession);
  router.get('/checkout-session/:sessionId', getCheckoutSession)

  return router;
};

function getProducts(req, res) {
  res.status(200).json({products});
}

function getProduct(req, res) {
  const {productId} = req.params;
  const product = products.find(product => product.id === productId);
  try {
    if(!product) throw Error(`No product found for the id : ${productId}`);
    res.status(200).json({product});
  } catch (error) {
    return res.status(404).json({statusCode : 404, message : error.message})
  }
}

async function createCheckoutSession(req, res) {
  try {
    const cartItems = req.body;
    const line_items = validateCartItem(products, cartItems);

    const origin = process.env.NODE_ENV === 'production' ? req.header.origin : 'http://localhost:3000';
    const params = {
      submit_type : 'pay',
      payment_method_type : ['card'],
      billing_address_collection : 'auto',
      shipping_address_collection : {
        allowed_country : ['US', 'CA']
      },
      line_items,
      success_url : `${origin}/result?session_id={CHEKOUT_SESSION_ID}`,
      cancel_url : origin,
      mode : 'payment'
    }

    const checkoutSession = await stripe.checkout.sessions.create(params);

    res.status(200).json(checkoutSession);
  } catch (error) {
    res.status(500).json({statusCode : 500, message : error.message});
  }
}

async function getCheckoutSession(req, res) {
  const {sessionId} = req.params;

  try {
    if(!sessionId.startsWith('cs_')) {
      throw Error('Incorrect checkout session id');
    }
    const checkout_session = await stripe.checkout.sessions.retrieve(
      sessionId,
      {expand : ['payment_intent']}
    );
    res.status(200).json(checkout_session);
  } catch (error) {
    res.status(500).json({statusCode : 500, message : error.message})
  }
}