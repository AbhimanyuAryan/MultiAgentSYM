/*
 ** Author: Santosh Kumar Dash
 ** Author URL: http://santoshdash.epizy.com/
 ** Github URL: https://github.com/quintuslabs/fashion-cube
 */

import API from "../../axios/API";
import Auth from "../../modules/Auth";

// Helper functions for localStorage cart
const getCartFromStorage = (userId) => {
  const cartKey = `cart_${userId}`;
  const cart = localStorage.getItem(cartKey);
  return cart ? JSON.parse(cart) : { items: {}, totalQty: 0, totalPrice: 0, userId };
};

const saveCartToStorage = (userId, cart) => {
  const cartKey = `cart_${userId}`;
  localStorage.setItem(cartKey, JSON.stringify(cart));
};

const addToCart = (cart, product) => {
  const productId = product._id;

  if (cart.items[productId]) {
    // Product already in cart, increase quantity
    cart.items[productId].qty += 1;
  } else {
    // Add new product to cart
    cart.items[productId] = {
      item: product,
      qty: 1,
      price: product.discounted_price || product.price
    };
  }

  // Recalculate totals
  cart.totalQty = Object.values(cart.items).reduce((sum, item) => sum + item.qty, 0);
  cart.totalPrice = Object.values(cart.items).reduce((sum, item) => sum + (item.price * item.qty), 0);

  return cart;
};

const updateCartQuantity = (cart, productId, increase, decrease) => {
  if (!cart.items[productId]) return cart;

  if (increase) {
    cart.items[productId].qty += 1;
  } else if (decrease) {
    cart.items[productId].qty -= 1;
    if (cart.items[productId].qty <= 0) {
      delete cart.items[productId];
    }
  }

  // Recalculate totals
  cart.totalQty = Object.values(cart.items).reduce((sum, item) => sum + item.qty, 0);
  cart.totalPrice = Object.values(cart.items).reduce((sum, item) => sum + (item.price * item.qty), 0);

  return cart;
};

export const getCartByUserId = () => dispatch => {
  let userId = Auth.getUserId();
  dispatch({
    type: GET_CART_BY_USERID_BEGIN
  });

  return API({
    method: "GET",
    url: `users/${userId}/cart`
  })
    .then(res => {
      dispatch({
        type: GET_CART_BY_USERID_SUCCESS,
        payload: res
      });
      return res;
    })
    .catch(error => {
      console.log('API getCart failed, using localStorage fallback');

      // Fallback to localStorage
      const cart = getCartFromStorage(userId);

      dispatch({
        type: GET_CART_BY_USERID_SUCCESS,
        payload: { data: { cart } }
      });

      return { data: { cart } };
    });
};

export const postCart = (productId, increase, decrease) => (dispatch, getState) => {
  let userId = Auth.getUserId();
  dispatch({
    type: POST_CART_BEGIN
  });

  return API({
    method: "POST",
    url: `users/${userId}/cart`,
    data: {
      userId,
      productId,
      increase,
      decrease
    }
  })
    .then(res => {
      dispatch({
        type: POST_CART_SUCCESS,
        payload: res
      });
      return res;
    })
    .catch(error => {
      console.log('API postCart failed, using localStorage fallback');

      // Fallback to localStorage
      let cart = getCartFromStorage(userId);

      if (increase || decrease) {
        // Update quantity
        cart = updateCartQuantity(cart, productId, increase, decrease);
      } else {
        // Add new item
        const products = getState().product.products;
        const product = products.find(p => p._id == productId);

        if (product) {
          cart = addToCart(cart, product);
        }
      }

      saveCartToStorage(userId, cart);

      dispatch({
        type: POST_CART_SUCCESS,
        payload: { data: { cart } }
      });

      return { data: { cart } };
    });
};

export const POST_CART_BEGIN = "POST_CART_BEGIN";
export const POST_CART_SUCCESS = "POST_CART_SUCCESS";
export const POST_CART_FAIL = "POST_CART_FAIL";

export const GET_CART_BY_USERID_BEGIN = "GET_CART_BY_USERID_BEGIN";
export const GET_CART_BY_USERID_SUCCESS = "GET_CART_BY_USERID_SUCCESS";
export const GET_CART_BY_USERID_FAIL = "GET_CART_BY_USERID_FAIL";
