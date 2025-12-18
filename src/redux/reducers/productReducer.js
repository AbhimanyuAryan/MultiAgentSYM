/*
 ** Author: Santosh Kumar Dash
 ** Author URL: http://santoshdash.epizy.com/
 ** Github URL: https://github.com/quintuslabs/fashion-cube
 */

import {
  GET_ALL_PRODUCTS_BEGIN,
  GET_ALL_PRODUCTS_SUCCESS,
  GET_ALL_PRODUCTS_FAIL,
  GET_PRODUCT_BEGIN,
  GET_PRODUCT_SUCCESS,
  GET_PRODUCT_FAIL,
  GET_PRODUCTS_BY_CATEGORY_BEGIN,
  GET_PRODUCTS_BY_CATEGORY_SUCCESS,
  GET_PRODUCTS_BY_CATEGORY_FAIL,
  SEARCH_BEGIN,
  SEARCH_SUCCESS,
  SEARCH_FAIL,
  APPLY_FILTERS_BEGIN,
  APPLY_FILTERS_SUCCESS,
  APPLY_FILTERS_FAIL
} from "../actions/productAction";

// Generate 1000 fun products with emojis
const generateProducts = () => {
  const productTemplates = [
    // Men's clothing
    { emoji: "👕", title: "T-Shirt", category: "men", basePrice: 29.99, descriptions: ["Classic cotton", "Vintage style", "Modern fit", "Comfortable daily wear", "Premium quality"] },
    { emoji: "👖", title: "Jeans", category: "men", basePrice: 79.99, descriptions: ["Slim fit", "Regular cut", "Distressed style", "Classic blue", "Comfortable stretch"] },
    { emoji: "🧥", title: "Jacket", category: "men", basePrice: 149.99, descriptions: ["Leather style", "Denim classic", "Bomber jacket", "Windbreaker", "Warm winter"] },
    { emoji: "👔", title: "Tie", category: "men", basePrice: 39.99, descriptions: ["Silk elegance", "Striped pattern", "Solid color", "Designer style", "Business formal"] },
    { emoji: "🩳", title: "Shorts", category: "men", basePrice: 44.99, descriptions: ["Athletic style", "Cargo pockets", "Beach vibes", "Casual comfort", "Summer essential"] },
    { emoji: "🧢", title: "Cap", category: "men", basePrice: 24.99, descriptions: ["Baseball style", "Trucker hat", "Snapback cool", "Dad hat vibes", "Street style"] },

    // Women's clothing
    { emoji: "👗", title: "Dress", category: "women", basePrice: 89.99, descriptions: ["Elegant evening", "Summer floral", "Cocktail party", "Casual day", "Maxi style"] },
    { emoji: "👚", title: "Blouse", category: "women", basePrice: 54.99, descriptions: ["Silk elegance", "Casual cotton", "Office chic", "Romantic lace", "Flowy style"] },
    { emoji: "👙", title: "Bikini", category: "women", basePrice: 64.99, descriptions: ["Beach ready", "Tropical vibes", "Classic style", "Sporty fit", "Designer pattern"] },
    { emoji: "🩱", title: "Swimsuit", category: "women", basePrice: 69.99, descriptions: ["One-piece elegance", "Athletic style", "Retro vibes", "Modern cut", "High fashion"] },
    { emoji: "🧣", title: "Scarf", category: "women", basePrice: 34.99, descriptions: ["Silk luxury", "Wool warmth", "Patterned beauty", "Solid elegance", "Vintage style"] },
    { emoji: "👠", title: "Heels", category: "women", basePrice: 99.99, descriptions: ["Classic pumps", "Stiletto style", "Wedge comfort", "Platform height", "Designer look"] },

    // Shoes
    { emoji: "👟", title: "Sneakers", category: "shoes", basePrice: 119.99, descriptions: ["Running style", "Basketball cool", "Street fashion", "Athletic comfort", "Designer brand"] },
    { emoji: "👞", title: "Dress Shoes", category: "shoes", basePrice: 139.99, descriptions: ["Oxford style", "Loafer comfort", "Derby classic", "Business formal", "Italian leather"] },
    { emoji: "🥾", title: "Boots", category: "shoes", basePrice: 159.99, descriptions: ["Combat style", "Chelsea chic", "Hiking ready", "Winter warmth", "Western vibes"] },
    { emoji: "🩴", title: "Sandals", category: "shoes", basePrice: 49.99, descriptions: ["Beach flip-flops", "Casual slides", "Strappy summer", "Comfort fit", "Sporty style"] },
    { emoji: "👡", title: "Formal Shoes", category: "shoes", basePrice: 129.99, descriptions: ["Evening elegance", "Party ready", "Wedding style", "Designer brand", "Luxury comfort"] },

    // Accessories
    { emoji: "👜", title: "Handbag", category: "accessories", basePrice: 149.99, descriptions: ["Leather luxury", "Crossbody style", "Tote spacious", "Designer brand", "Evening clutch"] },
    { emoji: "🎒", title: "Backpack", category: "accessories", basePrice: 89.99, descriptions: ["School ready", "Laptop safe", "Travel sized", "Sporty style", "Designer look"] },
    { emoji: "👛", title: "Wallet", category: "accessories", basePrice: 59.99, descriptions: ["Leather classic", "Minimalist style", "Bifold design", "Card holder", "Luxury brand"] },
    { emoji: "🕶️", title: "Sunglasses", category: "accessories", basePrice: 79.99, descriptions: ["Aviator style", "Wayfarer classic", "Cat-eye chic", "Sport wrap", "Designer frames"] },
    { emoji: "⌚", title: "Watch", category: "accessories", basePrice: 199.99, descriptions: ["Digital smart", "Analog classic", "Sport chronograph", "Luxury timepiece", "Fashion statement"] },
    { emoji: "💍", title: "Ring", category: "accessories", basePrice: 299.99, descriptions: ["Diamond sparkle", "Gold band", "Silver style", "Statement piece", "Minimalist design"] },
    { emoji: "📿", title: "Necklace", category: "accessories", basePrice: 129.99, descriptions: ["Pearl elegance", "Chain style", "Pendant beauty", "Statement piece", "Delicate charm"] },
    { emoji: "👓", title: "Glasses", category: "accessories", basePrice: 149.99, descriptions: ["Reading style", "Prescription fit", "Blue light blocking", "Fashion frames", "Designer look"] },
    { emoji: "🧤", title: "Gloves", category: "accessories", basePrice: 44.99, descriptions: ["Leather luxury", "Wool warmth", "Touchscreen compatible", "Winter essential", "Elegant style"] },
    { emoji: "🎩", title: "Hat", category: "accessories", basePrice: 69.99, descriptions: ["Fedora style", "Beanie warmth", "Sun protection", "Fashion statement", "Classic design"] }
  ];

  const colors = ["Red", "Blue", "Green", "Black", "White", "Pink", "Yellow", "Purple", "Orange", "Brown", "Gray", "Navy"];
  const styles = ["Classic", "Modern", "Vintage", "Trendy", "Elegant", "Casual", "Sporty", "Luxury", "Minimal", "Bold"];

  const products = [];

  for (let i = 1; i <= 1000; i++) {
    const template = productTemplates[i % productTemplates.length];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const style = styles[Math.floor(Math.random() * styles.length)];
    const description = template.descriptions[i % template.descriptions.length];

    const priceVariation = (Math.random() * 50) - 25; // Random variation between -25 and +25
    const price = parseFloat((template.basePrice + priceVariation).toFixed(2));
    const discounted_price = parseFloat((price * (0.7 + Math.random() * 0.2)).toFixed(2)); // 20-30% discount

    products.push({
      _id: i,
      title: `${style} ${color} ${template.title}`,
      price: price,
      discounted_price: discounted_price,
      emoji: template.emoji,
      imagePath: template.emoji, // Using emoji as imagePath
      image_2: template.emoji,
      description: `${description} ${template.title.toLowerCase()} in ${color.toLowerCase()}`,
      category: template.category,
      thumbnail: template.emoji
    });
  }

  return products;
};

const initialState = {
  products: generateProducts(),
  product: null,
  loading: false,
  error: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_PRODUCTS_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };
    case GET_ALL_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload.data.products
      };
    case GET_ALL_PRODUCTS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload.error.response.data
      };
    case GET_PRODUCT_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };
    case GET_PRODUCT_SUCCESS:
      // Check if response has product, otherwise find from state
      let product = action.payload.data?.product;
      if (!product && action.payload.productId) {
        product = state.products.find(p => p._id == action.payload.productId);
      }
      return {
        ...state,
        loading: false,
        product: product || null
      };
    case GET_PRODUCT_FAIL:
      // On failure, try to find product in local state
      const productId = action.payload.productId;
      const localProduct = productId ? state.products.find(p => p._id == productId) : null;
      return {
        ...state,
        loading: false,
        product: localProduct,
        error: localProduct ? null : (action.payload.error?.response?.data || 'Product not found')
      };
    case GET_PRODUCTS_BY_CATEGORY_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };
    case GET_PRODUCTS_BY_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload.data.products
      };
    case GET_PRODUCTS_BY_CATEGORY_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload.error.response.data
      };
    case SEARCH_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };
    case SEARCH_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload.data.products
      };
    case SEARCH_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload.error.response.data
      };
    case APPLY_FILTERS_BEGIN:
      return {
        ...state,
        loading: true,
        error: null
      };
    case APPLY_FILTERS_SUCCESS:
      return {
        ...state,
        loading: false,
        products: action.payload.data.products
      };
    case APPLY_FILTERS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload.error.response.data
      };
    default:
      return state;
  }
};
