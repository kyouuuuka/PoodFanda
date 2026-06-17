import { useReducer, useEffect, useRef } from 'react';

// ─── Data ────────────────────────────────────────────────────────────────────

function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * f);
  const g = Math.round(((n >> 8) & 255) * f);
  const b = Math.round((n & 255) * f);
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function mkGrad(color) {
  return `linear-gradient(135deg, ${color} 0%, ${shade(color, 0.6)} 100%)`;
}

const RAW = [
  { id: 'jb', name: "Jollibee", emoji: '🐝', color: '#e21b24', tagline: 'Langhap-sarap favorites', rating: 4.8, time: '20–35 min', fee: 39, cuisines: ['Chicken', 'Burgers', 'Filipino'], menu: [
    { name: 'Chickenjoy (1pc w/ Rice)', desc: 'Crispylicious, juicylicious fried chicken with rice', price: 82, cat: 'Chickenjoy', emoji: '🍗', badge: 'Bestseller' },
    { name: 'Chickenjoy Bucket (6pc)', desc: 'Good for the whole barkada', price: 549, cat: 'Chickenjoy', emoji: '🍗' },
    { name: 'Jolly Spaghetti', desc: 'Sweet-style sauce with hotdog slices and cheese', price: 75, cat: 'Pasta', emoji: '🍝', badge: 'Popular' },
    { name: 'Yumburger', desc: 'Classic beef burger with special dressing', price: 40, cat: 'Burgers', emoji: '🍔' },
    { name: 'Champ Jr.', desc: 'Big flame-grilled beef patty with cheese', price: 110, cat: 'Burgers', emoji: '🍔' },
    { name: 'Burger Steak (1pc)', desc: 'Beef patty in mushroom gravy with rice', price: 85, cat: 'Rice Meals', emoji: '🍛' },
    { name: 'Jolly Crispy Fries', desc: 'Golden, crispy and lightly salted', price: 50, cat: 'Sides', emoji: '🍟' },
    { name: 'Peach Mango Pie', desc: 'Warm, crispy crust with peach-mango filling', price: 40, cat: 'Desserts', emoji: '🥧' },
    { name: 'Pineapple Juice', desc: 'Refreshing chilled pineapple juice', price: 50, cat: 'Drinks', emoji: '🧃' },
  ]},
  { id: 'mcdo', name: "McDonald's PH", emoji: '🍟', color: '#da291c', tagline: "I'm lovin' the classics", rating: 4.7, time: '15–30 min', fee: 0, cuisines: ['Burgers', 'Chicken'], menu: [
    { name: 'Big Mac', desc: 'Two beef patties, special sauce, lettuce, cheese', price: 180, cat: 'Burgers', emoji: '🍔', badge: 'Bestseller' },
    { name: 'Quarter Pounder w/ Cheese', desc: 'Quarter-pound beef patty with melty cheese', price: 195, cat: 'Burgers', emoji: '🍔' },
    { name: 'McChicken Sandwich', desc: 'Crispy chicken patty with creamy mayo', price: 120, cat: 'Burgers', emoji: '🍔' },
    { name: '1pc Chicken McDo w/ Rice', desc: 'Crispy fried chicken with garlic rice', price: 99, cat: 'Chicken', emoji: '🍗' },
    { name: '6pc Chicken McNuggets', desc: 'Tender bite-sized nuggets with dip', price: 150, cat: 'Chicken', emoji: '🍗' },
    { name: 'McSpaghetti', desc: 'Sweet sauce with McDo meatballs', price: 79, cat: 'Pasta', emoji: '🍝' },
    { name: 'World Famous Fries (Medium)', desc: 'Hot, golden and crispy fries', price: 75, cat: 'Sides', emoji: '🍟' },
    { name: 'Coke Float', desc: 'Ice-cold Coke topped with soft-serve', price: 65, cat: 'Desserts', emoji: '🥤', badge: 'Popular' },
    { name: 'Hot Fudge Sundae', desc: 'Soft-serve with warm chocolate fudge', price: 45, cat: 'Desserts', emoji: '🍦' },
  ]},
  { id: 'chowking', name: 'Chowking', emoji: '🥢', color: '#e4002b', tagline: 'Chinese-Filipino comfort', rating: 4.5, time: '25–40 min', fee: 49, cuisines: ['Filipino'], menu: [
    { name: 'Chinese-Style Fried Chicken Lauriat', desc: 'Fried chicken, chao fan, lumpia and soup', price: 195, cat: 'Lauriat', emoji: '🍱', badge: 'Bestseller' },
    { name: 'Lauriat Spareribs', desc: 'Honey-glazed spareribs lauriat platter', price: 215, cat: 'Lauriat', emoji: '🍱' },
    { name: 'Pork Chao Fan', desc: 'Wok-fried rice with savory pork bits', price: 99, cat: 'Rice & Noodles', emoji: '🍚' },
    { name: 'Beef Wonton Mami', desc: 'Hot noodle soup with beef and wontons', price: 135, cat: 'Rice & Noodles', emoji: '🍜' },
    { name: 'Siomai (4pc) w/ Rice', desc: 'Steamed pork siomai with chili-garlic', price: 105, cat: 'Dim Sum', emoji: '🥟' },
    { name: 'Lumpiang Shanghai', desc: 'Crispy pork spring rolls with sweet sauce', price: 120, cat: 'Dim Sum', emoji: '🥠' },
    { name: 'Halo-Halo Supreme', desc: 'Shaved ice piled high with sweet toppings', price: 99, cat: 'Desserts', emoji: '🍧', badge: 'Popular' },
    { name: 'Buchi (2pc)', desc: 'Sesame balls with sweet mung filling', price: 55, cat: 'Desserts', emoji: '🍡' },
  ]},
  { id: 'inasal', name: 'Mang Inasal', emoji: '🍗', color: '#c8102e', tagline: 'Unli rice, grilled goodness', rating: 4.6, time: '25–40 min', fee: 29, cuisines: ['Chicken', 'Filipino'], menu: [
    { name: 'Chicken Inasal Paa w/ Unli Rice', desc: 'Grilled chicken leg quarter, unlimited rice', price: 139, cat: 'Inasal', emoji: '🍗', badge: 'Unli rice' },
    { name: 'Chicken Inasal Pecho w/ Unli Rice', desc: 'Juicy grilled breast part, unlimited rice', price: 159, cat: 'Inasal', emoji: '🍗', badge: 'Unli rice' },
    { name: 'Pork BBQ (2 sticks)', desc: 'Sweet-smoky grilled pork skewers', price: 99, cat: 'Inasal', emoji: '🍢' },
    { name: 'Palabok', desc: 'Rice noodles in shrimp sauce with toppings', price: 99, cat: 'Filipino Faves', emoji: '🍤', badge: 'Popular' },
    { name: 'Dinuguan w/ Puto', desc: 'Pork blood stew with steamed rice cakes', price: 99, cat: 'Filipino Faves', emoji: '🍛' },
    { name: 'Sinigang na Baboy', desc: 'Sour tamarind pork soup with veggies', price: 159, cat: 'Filipino Faves', emoji: '🍲' },
    { name: 'Halo-Halo', desc: 'Classic Pinoy shaved-ice dessert', price: 75, cat: 'Desserts', emoji: '🍧' },
    { name: 'Leche Flan', desc: 'Silky caramel custard', price: 55, cat: 'Desserts', emoji: '🍮' },
  ]},
  { id: 'greenwich', name: 'Greenwich', emoji: '🍕', color: '#006341', tagline: 'Barkada pizza moments', rating: 4.4, time: '30–45 min', fee: 0, cuisines: ['Pizza'], menu: [
    { name: 'Hawaiian Overload Pizza', desc: 'Loaded with ham, pineapple and cheese', price: 299, cat: 'Pizza', emoji: '🍕', badge: 'Bestseller' },
    { name: 'Pepperoni Pizza', desc: 'Classic pepperoni with stretchy cheese', price: 279, cat: 'Pizza', emoji: '🍕' },
    { name: 'Lasagna Supreme', desc: 'Layered pasta with rich meat sauce', price: 135, cat: 'Pasta', emoji: '🍝' },
    { name: 'Baked Macaroni', desc: 'Cheesy oven-baked macaroni', price: 115, cat: 'Pasta', emoji: '🧀' },
    { name: 'Spaghetti Overload', desc: 'Sweet-style spaghetti loaded with toppings', price: 99, cat: 'Pasta', emoji: '🍝' },
    { name: 'Pizza Pockets', desc: 'Folded pizza pockets, perfect for sharing', price: 99, cat: 'Sides', emoji: '🥟' },
    { name: 'Garlic Overload Bread', desc: 'Toasted bread smothered in garlic', price: 85, cat: 'Sides', emoji: '🥖' },
    { name: 'Iced Tea (Regular)', desc: 'Sweet brewed iced tea', price: 49, cat: 'Drinks', emoji: '🧊' },
  ]},
  { id: 'kfc', name: 'KFC PH', emoji: '🍗', color: '#a3060f', tagline: "Finger lickin' bucket meals", rating: 4.7, time: '20–35 min', fee: 49, cuisines: ['Chicken'], menu: [
    { name: '6pc Bucket', desc: "Six pieces of the Colonel's secret recipe", price: 549, cat: 'Buckets & Meals', emoji: '🍗', badge: 'Bestseller' },
    { name: '2pc Chicken Meal', desc: 'Two pieces with rice and a drink', price: 215, cat: 'Buckets & Meals', emoji: '🍗' },
    { name: '1pc Chicken Meal', desc: 'One piece with rice and a drink', price: 129, cat: 'Buckets & Meals', emoji: '🍗' },
    { name: 'Zinger Burger', desc: 'Spicy crispy chicken fillet burger', price: 155, cat: 'Burgers', emoji: '🍔', badge: 'Popular' },
    { name: 'Cheese Fries', desc: 'Crispy fries with cheese sauce', price: 75, cat: 'Sides', emoji: '🍟' },
    { name: 'Mashed Potato', desc: 'Creamy mash with savory gravy', price: 45, cat: 'Sides', emoji: '🥔' },
    { name: 'Buttermilk Biscuit', desc: 'Soft, flaky biscuit with honey', price: 49, cat: 'Sides', emoji: '🧈' },
    { name: 'Mountain Dew (Regular)', desc: 'Ice-cold citrus soda', price: 55, cat: 'Drinks', emoji: '🥤' },
  ]},
  { id: 'maxs', name: "Max's Restaurant", emoji: '🍽️', color: '#6b1f2a', tagline: 'The house that fried chicken built', rating: 4.6, time: '30–45 min', fee: 59, cuisines: ['Filipino'], menu: [
    { name: "Max's Fried Chicken (Quarter)", desc: 'Sarap-to-the-bones golden fried chicken', price: 285, cat: 'Specialties', emoji: '🍗', badge: 'Bestseller' },
    { name: 'Kare-Kare (Beef)', desc: 'Oxtail in peanut sauce with bagoong', price: 365, cat: 'Specialties', emoji: '🍲' },
    { name: 'Crispy Pata', desc: 'Deep-fried pork leg, crackling skin', price: 545, cat: 'Specialties', emoji: '🍖' },
    { name: 'Sizzling Sisig', desc: 'Chopped pork on a sizzling plate', price: 255, cat: 'Specialties', emoji: '🔥', badge: 'Popular' },
    { name: 'Lumpiang Sariwa', desc: 'Fresh vegetable spring roll with peanut sauce', price: 155, cat: 'Appetizers', emoji: '🌯' },
    { name: 'Chicken Sotanghon Soup', desc: 'Comforting glass-noodle chicken soup', price: 145, cat: 'Appetizers', emoji: '🍜' },
    { name: 'Caramel Bar', desc: 'Signature layered caramel cake', price: 95, cat: 'Desserts', emoji: '🍰' },
    { name: 'Halo-Halo', desc: "Max's loaded shaved-ice classic", price: 125, cat: 'Desserts', emoji: '🍧' },
  ]},
  { id: 'goldi', name: 'Goldilocks', emoji: '🍰', color: '#8a1f3c', tagline: 'Cakes & Pinoy classics', rating: 4.5, time: '25–40 min', fee: 39, cuisines: ['Desserts', 'Filipino'], menu: [
    { name: 'Mocha Chiffon Cake (Slice)', desc: 'Light chiffon with mocha icing', price: 85, cat: 'Cakes', emoji: '🍰', badge: 'Bestseller' },
    { name: 'Ube Cake (Slice)', desc: 'Purple yam chiffon with ube icing', price: 95, cat: 'Cakes', emoji: '🎂' },
    { name: 'Brazo de Mercedes (Slice)', desc: 'Soft meringue roll with custard', price: 95, cat: 'Cakes', emoji: '🍮' },
    { name: 'Leche Flan', desc: 'Rich caramel custard', price: 99, cat: 'Cakes', emoji: '🍮' },
    { name: 'Polvoron (3pc)', desc: 'Buttery powdered milk candy', price: 65, cat: 'Pinoy Delicacies', emoji: '🍬' },
    { name: 'Pancit Bihon (Solo Bilao)', desc: 'Stir-fried rice noodles with veggies', price: 145, cat: 'Pinoy Eats', emoji: '🍜', badge: 'Popular' },
    { name: 'Dinuguan', desc: 'Savory pork blood stew', price: 125, cat: 'Pinoy Eats', emoji: '🍛' },
    { name: 'Embutido', desc: 'Filipino-style steamed meatloaf', price: 135, cat: 'Pinoy Eats', emoji: '🥩' },
  ]},
  { id: 'shakeys', name: "Shakey's", emoji: '🍕', color: '#d2122e', tagline: 'Pizza, Mojos & good times', rating: 4.6, time: '30–50 min', fee: 49, cuisines: ['Pizza'], menu: [
    { name: "Manager's Choice Pizza", desc: 'Loaded with all the best toppings', price: 489, cat: 'Pizza', emoji: '🍕', badge: 'Bestseller' },
    { name: 'Pepperoni Crrrunch Pizza', desc: 'Extra-crispy thin crust with pepperoni', price: 429, cat: 'Pizza', emoji: '🍕' },
    { name: "Chicken 'N' Mojos", desc: 'Fried chicken with the famous Mojos', price: 399, cat: 'Chicken & Mojos', emoji: '🍗', badge: 'Popular' },
    { name: 'Mojos Solo', desc: 'Seasoned potato slices, crispy outside', price: 159, cat: 'Chicken & Mojos', emoji: '🥔' },
    { name: 'Carbonara Supreme', desc: 'Creamy pasta with bacon and mushroom', price: 269, cat: 'Pasta', emoji: '🍝' },
    { name: 'Spaghetti w/ Meat Sauce', desc: 'Hearty Italian-style spaghetti', price: 199, cat: 'Pasta', emoji: '🍝' },
    { name: 'Garlic Bread', desc: 'Toasted garlic bread sticks', price: 109, cat: 'Starters', emoji: '🥖' },
    { name: 'Bottomless Iced Tea', desc: 'Refillable house-brewed iced tea', price: 99, cat: 'Drinks', emoji: '🧊' },
  ]},
  { id: 'armynavy', name: 'Army Navy', emoji: '🌯', color: '#1b3a2b', tagline: 'Burgers & burritos, soldier-sized', rating: 4.7, time: '20–35 min', fee: 39, cuisines: ['Burgers'], menu: [
    { name: 'Bully Boy Double Burger', desc: 'Two thick beef patties, fully loaded', price: 295, cat: 'Burgers', emoji: '🍔', badge: 'Bestseller' },
    { name: 'Liberty Burger', desc: 'Single beef patty with fresh fixings', price: 215, cat: 'Burgers', emoji: '🍔' },
    { name: 'Classic Burger', desc: 'No-frills juicy beef burger', price: 165, cat: 'Burgers', emoji: '🍔' },
    { name: 'Crispy Chicken Tacos (2)', desc: 'Crispy chicken with slaw in soft tacos', price: 195, cat: 'Tacos & Burritos', emoji: '🌮', badge: 'Popular' },
    { name: 'Burrito Especial', desc: 'Big stuffed burrito with rice and beans', price: 235, cat: 'Tacos & Burritos', emoji: '🌯' },
    { name: 'Loaded Nachos', desc: 'Tortilla chips piled with cheese and beef', price: 175, cat: 'Tacos & Burritos', emoji: '🧀' },
    { name: 'Freedom Fries', desc: 'Crispy seasoned fries', price: 99, cat: 'Sides', emoji: '🍟' },
    { name: 'Bottomless Iced Tea', desc: 'Refillable house iced tea', price: 89, cat: 'Drinks', emoji: '🧊' },
  ]},
  { id: 'bonchon', name: 'Bonchon', emoji: '🍗', color: '#b22222', tagline: 'Korean-style crispy chicken', rating: 4.8, time: '25–40 min', fee: 0, cuisines: ['Korean', 'Chicken'], menu: [
    { name: 'Soy Garlic Chicken (4pc)', desc: 'Double-fried wings glazed in soy garlic', price: 199, cat: 'Korean Chicken', emoji: '🍗', badge: 'Bestseller' },
    { name: 'Spicy Chicken (4pc)', desc: 'Crunchy wings in fiery Korean glaze', price: 199, cat: 'Korean Chicken', emoji: '🌶️' },
    { name: 'K-Pop Chicken Tenders', desc: 'Boneless tenders in your choice of sauce', price: 179, cat: 'Korean Chicken', emoji: '🍗' },
    { name: 'Chicken & Rice Bowl', desc: 'Glazed chicken over steamed rice', price: 169, cat: 'Rice Bowls', emoji: '🍚', badge: 'Popular' },
    { name: 'Bulgogi Rice Bowl', desc: 'Sweet-savory beef bulgogi over rice', price: 189, cat: 'Rice Bowls', emoji: '🥩' },
    { name: 'Japchae', desc: 'Stir-fried glass noodles with veggies', price: 165, cat: 'Sides', emoji: '🍜' },
    { name: 'Kimchi Coleslaw', desc: 'Tangy slaw with a kimchi kick', price: 65, cat: 'Sides', emoji: '🥬' },
    { name: 'Iced Tea', desc: 'Chilled brewed iced tea', price: 49, cat: 'Drinks', emoji: '🧊' },
  ]},
  { id: 'potato', name: 'Potato Corner', emoji: '🍟', color: '#ff6a13', tagline: 'Flavored fries, barkada size', rating: 4.5, time: '15–25 min', fee: 19, cuisines: ['Snacks'], menu: [
    { name: 'Jumbo Fries (Cheese)', desc: 'Crispy fries dusted in cheesy goodness', price: 95, cat: 'Flavored Fries', emoji: '🍟', badge: 'Bestseller' },
    { name: 'Giga Fries (BBQ)', desc: 'Giant serving in smoky BBQ flavor', price: 145, cat: 'Flavored Fries', emoji: '🍟' },
    { name: 'Mega Fries (Sour Cream)', desc: 'Tangy sour-cream flavored fries', price: 120, cat: 'Flavored Fries', emoji: '🍟' },
    { name: 'Fries Overload', desc: 'Loaded fries with cheese sauce on top', price: 175, cat: 'Flavored Fries', emoji: '🧀', badge: 'Popular' },
    { name: 'Regular Fries (Cheese)', desc: 'The original snack-size flavored fries', price: 65, cat: 'Flavored Fries', emoji: '🍟' },
    { name: 'Cheesy Hotdog', desc: 'Snappy hotdog with cheese', price: 85, cat: 'Snacks', emoji: '🌭' },
    { name: 'Choco Banana', desc: 'Frozen banana dipped in chocolate', price: 60, cat: 'Snacks', emoji: '🍌' },
    { name: 'Lemonade', desc: 'Freshly squeezed cold lemonade', price: 55, cat: 'Drinks', emoji: '🍋' },
  ]},
];

const ITEMS = {};
const RESTAURANTS = RAW.map(r => {
  const grad = mkGrad(r.color);
  const menu = r.menu.map((m, i) => {
    const item = { ...m, id: `${r.id}_${i}`, rid: r.id };
    ITEMS[item.id] = item;
    return item;
  });
  return { ...r, grad, menu };
});

const CHIPS = ['All', 'Chicken', 'Burgers', 'Pizza', 'Filipino', 'Korean', 'Snacks', 'Desserts'];

// ─── State ───────────────────────────────────────────────────────────────────

const init = {
  screen: 'home',
  activeRid: null,
  cart: {},
  cartRid: null,
  cartOpen: false,
  q: '',
  chip: 'All',
  menuCat: 'All',
  menuQ: '',
  payment: 'gcash',
  toast: null,
  pulse: 0,
  pending: null,
  lastOrder: null,
};

function reducer(s, a) {
  switch (a.type) {
    case 'SET_Q': return { ...s, q: a.v, screen: 'home' };
    case 'SET_CHIP': return { ...s, chip: a.v };
    case 'SET_MENU_Q': return { ...s, menuQ: a.v };
    case 'SET_MENU_CAT': return { ...s, menuCat: a.v };
    case 'SET_PAY': return { ...s, payment: a.v };
    case 'OPEN_REST': return { ...s, screen: 'restaurant', activeRid: a.id, menuCat: 'All', menuQ: '' };
    case 'GO_HOME': return { ...s, screen: 'home' };
    case 'RESET_HOME': return { ...s, screen: 'home', activeRid: null, q: '', chip: 'All', cartOpen: false };
    case 'OPEN_CART': return { ...s, cartOpen: true };
    case 'CLOSE_CART': return { ...s, cartOpen: false };
    case 'GO_CHECKOUT': return { ...s, screen: 'checkout', cartOpen: false };
    case 'BACK_CHECKOUT': return { ...s, screen: s.activeRid ? 'restaurant' : 'home' };
    case 'ADD': {
      const it = ITEMS[a.id];
      if (s.cartRid && s.cartRid !== it.rid && Object.keys(s.cart).length) {
        return { ...s, pending: a.id };
      }
      return { ...s, cart: { ...s.cart, [a.id]: (s.cart[a.id] || 0) + 1 }, cartRid: it.rid };
    }
    case 'INC': return { ...s, cart: { ...s.cart, [a.id]: (s.cart[a.id] || 0) + 1 } };
    case 'DEC': {
      const c = { ...s.cart };
      c[a.id] = (c[a.id] || 0) - 1;
      if (c[a.id] <= 0) delete c[a.id];
      return { ...s, cart: c, cartRid: Object.keys(c).length ? s.cartRid : null };
    }
    case 'TOAST': return { ...s, toast: a.msg, pulse: s.pulse + 1 };
    case 'CLEAR_TOAST': return { ...s, toast: null };
    case 'CONFIRM_NEW': {
      const it = ITEMS[s.pending];
      return { ...s, cart: { [s.pending]: 1 }, cartRid: it.rid, pending: null, toast: it.name.replace(/\s*\(.*?\)/g, '') + ' added', pulse: s.pulse + 1 };
    }
    case 'CANCEL_NEW': return { ...s, pending: null };
    case 'PLACE_ORDER': return { ...s, screen: 'confirmation', cart: {}, cartRid: null, cartOpen: false, lastOrder: a.order };
    default: return s;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const peso = n => '₱' + Number(n).toLocaleString('en-PH');

function computeTotals(cart, cartRid, serviceFee = 9) {
  let subtotal = 0;
  Object.keys(cart).forEach(id => { subtotal += ITEMS[id].price * cart[id]; });
  const r = cartRid ? RESTAURANTS.find(x => x.id === cartRid) : null;
  const delivery = r ? r.fee : 0;
  const service = subtotal > 0 ? serviceFee : 0;
  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = subtotal + (subtotal > 0 ? delivery : 0) + service;
  return { subtotal, delivery, service, count, total };
}

function payName(p) {
  return p === 'cod' ? 'Cash on Delivery' : p === 'card' ? 'Credit / Debit Card' : 'GCash';
}

const B = '#d70f64';
const BD = '#b00c52';
const BT = '#fde7f0';
const BG = 'rgba(215,15,100,.35)';

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [s, dispatch] = useReducer(reducer, init);
  const toastTimer = useRef(null);

  function toast(msg) {
    clearTimeout(toastTimer.current);
    dispatch({ type: 'TOAST', msg });
    toastTimer.current = setTimeout(() => dispatch({ type: 'CLEAR_TOAST' }), 1900);
  }

  function add(id) {
    const it = ITEMS[id];
    if (s.cartRid && s.cartRid !== it.rid && Object.keys(s.cart).length) {
      dispatch({ type: 'ADD', id });
      return;
    }
    dispatch({ type: 'ADD', id });
    toast(it.name.replace(/\s*\(.*?\)/g, '') + ' added');
  }

  function placeOrder() {
    const t = computeTotals(s.cart, s.cartRid);
    const r = RESTAURANTS.find(x => x.id === s.cartRid);
    dispatch({
      type: 'PLACE_ORDER',
      order: {
        name: r ? r.name : '',
        eta: r ? r.time : '25–40 min',
        total: peso(t.total),
        count: t.count,
        payLabel: payName(s.payment),
      },
    });
    window.scrollTo(0, 0);
  }

  const t = computeTotals(s.cart, s.cartRid);
  const cartRest = s.cartRid ? RESTAURANTS.find(x => x.id === s.cartRid) : null;

  const ql = s.q.toLowerCase();
  const visibleRestaurants = RESTAURANTS.filter(r => {
    const okQ = !ql || r.name.toLowerCase().includes(ql) || r.cuisines.join(' ').toLowerCase().includes(ql) || r.menu.some(m => m.name.toLowerCase().includes(ql));
    const okC = s.chip === 'All' || r.cuisines.includes(s.chip);
    return okQ && okC;
  });

  const R = s.activeRid ? RESTAURANTS.find(x => x.id === s.activeRid) : null;

  return (
    <>
      <style>{`
        @keyframes pop{0%{transform:scale(1)}40%{transform:scale(1.45)}100%{transform:scale(1)}}
        @keyframes toastUp{from{transform:translateX(-50%) translateY(28px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}
        @keyframes checkPop{0%{transform:scale(0);opacity:0}55%{transform:scale(1.18);opacity:1}100%{transform:scale(1)}}
        @keyframes ringPulse{0%{transform:scale(.8);opacity:.55}70%{opacity:0}100%{transform:scale(1.7);opacity:0}}
        @keyframes modalIn{from{transform:translateY(24px) scale(.97);opacity:0}to{transform:translateY(0) scale(1);opacity:1}}
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
        ::-webkit-scrollbar{height:6px;width:8px;}
        ::-webkit-scrollbar-thumb{background:rgba(0,0,0,.16);border-radius:999px;}
        .rest-card:hover{transform:translateY(-4px);box-shadow:0 14px 30px rgba(20,20,30,.13) !important;}
        .btn-brand:hover{filter:brightness(1.07);}
        .btn-brand:active{transform:scale(.985);}
        .btn-icon:hover{background:#e7e7ea !important;}
        .back-btn:active{transform:scale(.92);}
        .add-btn:hover{border-color:${B} !important;}
        .add-btn:active{transform:scale(.88);}
        .pay-opt:hover{border-color:${B} !important;}
        .chip-btn:hover{border-color:${B} !important;}
        .stepper-dec:active,.stepper-inc:active{transform:scale(.85);}
        .modal-keep:active{transform:scale(.97);}
        .modal-new:active{transform:scale(.97);}
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f5f5f6', paddingBottom: 40 }}>

        {/* Header */}
        <header style={{ position: 'sticky', top: 0, zIndex: 40, background: '#fff', boxShadow: '0 1px 0 rgba(0,0,0,.07),0 4px 18px rgba(0,0,0,.03)' }}>
          <div style={{ maxWidth: 1140, margin: '0 auto', padding: '11px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div onClick={() => { dispatch({ type: 'RESET_HOME' }); window.scrollTo(0, 0); }}
              style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', flex: 'none' }}>
              <div style={{ width: 34, height: 34, borderRadius: 11, background: B, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: `0 4px 12px ${BG}` }}>🛵</div>
              <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-.5px' }}>Pood<span style={{ color: B }}>Fanda</span></div>
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 9, background: '#f1f1f3', borderRadius: 13, padding: '10px 14px', maxWidth: 540 }}>
              <span style={{ fontSize: 15, opacity: .55 }}>🔍</span>
              <input value={s.q} onChange={e => dispatch({ type: 'SET_Q', v: e.target.value })}
                placeholder="Search Jollibee, KFC, pizza, halo-halo…"
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', font: 'inherit', fontSize: 14.5, color: '#1c1c22' }} />
            </div>
            <button onClick={() => dispatch({ type: 'OPEN_CART' })} className="btn-brand"
              style={{ display: 'flex', alignItems: 'center', gap: 9, background: B, color: '#fff', border: 'none', borderRadius: 13, padding: '11px 15px', font: 'inherit', fontWeight: 700, fontSize: 14, cursor: 'pointer', flex: 'none', transition: 'filter .15s,transform .1s' }}>
              <span style={{ fontSize: 16 }}>🛒</span>
              {t.count > 0 ? (
                <>
                  <span key={s.pulse} style={{ background: '#fff', color: B, borderRadius: 999, minWidth: 20, height: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, padding: '0 5px', animation: 'pop .35s ease' }}>{t.count}</span>
                  <span style={{ fontVariantNumeric: 'tabular-nums' }}>{peso(t.total)}</span>
                </>
              ) : <span>Cart</span>}
            </button>
          </div>
        </header>

        {/* Home */}
        {s.screen === 'home' && (
          <main style={{ maxWidth: 1140, margin: '0 auto', padding: 18 }}>
            <div style={{ background: `linear-gradient(110deg,${B},${BD})`, color: '#fff', borderRadius: 20, padding: '22px 24px', display: 'flex', alignItems: 'center', gap: 18, marginBottom: 22, overflow: 'hidden', position: 'relative' }}>
              <div style={{ fontSize: 46, flex: 'none' }}>🛵</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-.4px' }}>Free delivery all weekend</div>
                <div style={{ fontSize: 14, opacity: .92, marginTop: 3 }}>No delivery fee on McDonald&apos;s PH, Greenwich & Bonchon. Sarap mag-order. 🎉</div>
              </div>
              <div style={{ position: 'absolute', right: -30, top: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,.10)' }} />
            </div>

            <div style={{ display: 'flex', gap: 9, overflowX: 'auto', padding: '2px 0 14px' }}>
              {CHIPS.map(c => {
                const active = c === s.chip;
                return (
                  <button key={c} onClick={() => dispatch({ type: 'SET_CHIP', v: c })} className="chip-btn"
                    style={{ flex: 'none', padding: '9px 16px', borderRadius: 999, border: `1.5px solid ${active ? B : '#e7e7ea'}`, background: active ? B : '#fff', color: active ? '#fff' : '#54545c', font: 'inherit', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', transition: 'all .15s' }}>
                    {c}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '6px 2px 14px' }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: '-.4px' }}>{s.chip === 'All' ? 'All restaurants' : s.chip}</h2>
              <span style={{ fontSize: 13, color: '#8a8a93', fontWeight: 600 }}>{visibleRestaurants.length} {visibleRestaurants.length === 1 ? 'place' : 'places'}</span>
            </div>

            {visibleRestaurants.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '70px 20px', color: '#8a8a93' }}>
                <div style={{ fontSize: 46 }}>🍽️</div>
                <div style={{ fontWeight: 700, fontSize: 17, color: '#1c1c22', marginTop: 10 }}>No restaurants found</div>
                <div style={{ fontSize: 14, marginTop: 4 }}>Try a different search or category.</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 18 }}>
                {visibleRestaurants.map(r => (
                  <div key={r.id} onClick={() => { dispatch({ type: 'OPEN_REST', id: r.id }); window.scrollTo(0, 0); }} className="rest-card"
                    style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', cursor: 'pointer', boxShadow: '0 1px 3px rgba(20,20,30,.07)', transition: 'transform .16s ease,box-shadow .16s ease' }}>
                    <div style={{ position: 'relative', height: 138, background: r.grad, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ fontSize: 62, filter: 'drop-shadow(0 6px 10px rgba(0,0,0,.22))' }}>{r.emoji}</div>
                      {r.fee === 0 && (
                        <div style={{ position: 'absolute', top: 12, left: 12, background: '#fff', color: B, fontSize: 11, fontWeight: 800, padding: '5px 10px', borderRadius: 999, letterSpacing: '.3px', boxShadow: '0 2px 8px rgba(0,0,0,.12)' }}>FREE DELIVERY</div>
                      )}
                    </div>
                    <div style={{ padding: '14px 16px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
                        <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, letterSpacing: '-.3px' }}>{r.name}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, background: BT, color: BD, padding: '3px 8px', borderRadius: 9, fontSize: 12.5, fontWeight: 800, flex: 'none' }}>★ {r.rating.toFixed(1)}</div>
                      </div>
                      <p style={{ margin: '5px 0 0', color: '#8a8a93', fontSize: 13 }}>{r.tagline}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 11, color: '#54545c', fontSize: 12.5, fontWeight: 600 }}>
                        <span>🕒 {r.time}</span><span style={{ opacity: .4 }}>•</span>
                        <span>{r.fee === 0 ? 'Free delivery' : `₱${r.fee} fee`}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        )}

        {/* Restaurant */}
        {s.screen === 'restaurant' && R && (
          <main>
            <div style={{ position: 'relative', height: 196, background: R.grad, overflow: 'hidden' }}>
              <div style={{ position: 'absolute', right: 24, bottom: -18, fontSize: 150, opacity: .22 }}>{R.emoji}</div>
              <button onClick={() => { dispatch({ type: 'GO_HOME' }); window.scrollTo(0, 0); }} className="back-btn"
                style={{ position: 'absolute', top: 16, left: 16, width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,.92)', border: 'none', cursor: 'pointer', fontSize: 22, fontWeight: 700, color: '#1c1c22', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(0,0,0,.18)', transition: 'transform .1s' }}>‹</button>
            </div>
            <div style={{ maxWidth: 920, margin: '-46px auto 0', padding: '0 18px', position: 'relative' }}>
              <div style={{ background: '#fff', borderRadius: 22, padding: 22, boxShadow: '0 10px 30px rgba(0,0,0,.10)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: R.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, flex: 'none' }}>{R.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, letterSpacing: '-.6px' }}>{R.name}</h1>
                    <p style={{ margin: '3px 0 0', color: '#8a8a93', fontSize: 13.5 }}>{R.tagline}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 16 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: BT, color: BD, padding: '6px 11px', borderRadius: 10, fontSize: 13, fontWeight: 800 }}>★ {R.rating.toFixed(1)}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#f1f1f3', padding: '6px 11px', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#54545c' }}>🕒 {R.time}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#f1f1f3', padding: '6px 11px', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#54545c' }}>🛵 {R.fee === 0 ? 'Free delivery' : `₱${R.fee} delivery`}</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#f1f1f3', padding: '6px 11px', borderRadius: 10, fontSize: 13, fontWeight: 600, color: '#54545c' }}>{R.cuisines.join(' · ')}</span>
                </div>
              </div>
            </div>

            <div style={{ position: 'sticky', top: 58, zIndex: 20, background: '#f5f5f6', padding: '16px 0 12px', marginTop: 18 }}>
              <div style={{ maxWidth: 920, margin: '0 auto', padding: '0 18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: '#fff', border: '1.5px solid #ececef', borderRadius: 13, padding: '10px 14px', marginBottom: 11 }}>
                  <span style={{ fontSize: 14, opacity: .55 }}>🔍</span>
                  <input value={s.menuQ} onChange={e => dispatch({ type: 'SET_MENU_Q', v: e.target.value })} placeholder="Search this menu…"
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', font: 'inherit', fontSize: 14, color: '#1c1c22' }} />
                </div>
                <MenuCats R={R} menuCat={s.menuCat} dispatch={dispatch} B={B} />
              </div>
            </div>

            <div style={{ maxWidth: 920, margin: '0 auto', padding: '4px 18px 30px' }}>
              <MenuItems R={R} cart={s.cart} cartRid={s.cartRid} menuCat={s.menuCat} menuQ={s.menuQ} dispatch={dispatch} add={add} B={B} BD={BD} BT={BT} />
            </div>
          </main>
        )}

        {/* Checkout */}
        {s.screen === 'checkout' && (
          <main style={{ maxWidth: 680, margin: '0 auto', padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
              <button onClick={() => { dispatch({ type: 'BACK_CHECKOUT' }); window.scrollTo(0, 0); }} className="back-btn"
                style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', border: '1.5px solid #ececef', cursor: 'pointer', fontSize: 22, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform .1s' }}>‹</button>
              <h1 style={{ margin: 0, fontSize: 23, fontWeight: 800, letterSpacing: '-.5px' }}>Checkout</h1>
            </div>

            <div style={{ background: '#fff', borderRadius: 18, padding: 18, boxShadow: '0 1px 3px rgba(0,0,0,.06)', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#8a8a93', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 12 }}>📍 Delivery to</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>Home</div>
                  <div style={{ color: '#8a8a93', fontSize: 13.5, marginTop: 2 }}>Unit 4B, Demo Residences, Makati City</div>
                </div>
                <span style={{ color: B, fontWeight: 700, fontSize: 13.5, cursor: 'default' }}>Change</span>
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 18, padding: 18, boxShadow: '0 1px 3px rgba(0,0,0,.06)', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#8a8a93', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 14 }}>Your order · {cartRest ? cartRest.name : ''}</div>
              {Object.keys(s.cart).map(id => {
                const m = ITEMS[id], qty = s.cart[id];
                return (
                  <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '9px 0' }}>
                    <span style={{ fontWeight: 800, color: B, fontSize: 14, minWidth: 24 }}>{qty}×</span>
                    <span style={{ fontSize: 24 }}>{m.emoji}</span>
                    <span style={{ flex: 1, minWidth: 0, fontSize: 14.5, fontWeight: 600 }}>{m.name}</span>
                    <span style={{ fontWeight: 700, fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>{peso(m.price * qty)}</span>
                  </div>
                );
              })}
            </div>

            <div style={{ background: '#fff', borderRadius: 18, padding: 18, boxShadow: '0 1px 3px rgba(0,0,0,.06)', marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#8a8a93', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 14 }}>Payment method</div>
              {[
                { id: 'gcash', label: 'GCash', sub: 'Pay via GCash e-wallet', icon: '📱' },
                { id: 'cod', label: 'Cash on Delivery', sub: 'Pay with cash when it arrives', icon: '💵' },
                { id: 'card', label: 'Credit / Debit Card', sub: 'Visa, Mastercard accepted', icon: '💳' },
              ].map(p => {
                const active = s.payment === p.id;
                return (
                  <div key={p.id} onClick={() => dispatch({ type: 'SET_PAY', v: p.id })} className="pay-opt"
                    style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '13px 14px', border: `1.5px solid ${active ? B : '#ececef'}`, background: active ? BT : '#fff', borderRadius: 13, cursor: 'pointer', marginBottom: 9, transition: 'all .15s' }}>
                    <span style={{ fontSize: 22 }}>{p.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: 14.5 }}>{p.label}</div>
                      <div style={{ color: '#8a8a93', fontSize: 12.5, marginTop: 1 }}>{p.sub}</div>
                    </div>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${active ? B : '#cfcfd6'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {active && <div style={{ width: 10, height: 10, borderRadius: '50%', background: B }} />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ background: '#fff', borderRadius: 18, padding: 18, boxShadow: '0 1px 3px rgba(0,0,0,.06)', marginBottom: 18 }}>
              {[['Subtotal', peso(t.subtotal)], ['Delivery fee', t.subtotal === 0 ? '—' : (t.delivery === 0 ? 'Free' : peso(t.delivery))], ['Service fee', peso(t.service)]].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 14, color: '#54545c' }}>
                  <span>{label}</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>{val}</span>
                </div>
              ))}
              <div style={{ height: 1, background: '#ececef', margin: '10px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: 16 }}>Total</span>
                <span style={{ fontWeight: 800, fontSize: 20, color: B, fontVariantNumeric: 'tabular-nums' }}>{peso(t.total)}</span>
              </div>
            </div>

            <button onClick={placeOrder} className="btn-brand"
              style={{ width: '100%', background: B, color: '#fff', border: 'none', borderRadius: 15, padding: 17, font: 'inherit', fontWeight: 800, fontSize: 16.5, cursor: 'pointer', boxShadow: `0 8px 22px ${BG}`, transition: 'filter .15s,transform .1s' }}>
              Place Order · {peso(t.total)}
            </button>
          </main>
        )}

        {/* Confirmation */}
        {s.screen === 'confirmation' && s.lastOrder && (
          <main style={{ maxWidth: 520, margin: '0 auto', padding: '48px 18px', textAlign: 'center' }}>
            <div style={{ position: 'relative', width: 104, height: 104, margin: '0 auto 26px' }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: B, animation: 'ringPulse 1.8s ease-out infinite' }} />
              <div style={{ position: 'relative', width: 104, height: 104, borderRadius: '50%', background: B, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 54, color: '#fff', boxShadow: `0 10px 30px ${BG}`, animation: 'checkPop .5s ease' }}>✓</div>
            </div>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, letterSpacing: '-.7px' }}>Order placed! 🎉</h1>
            <p style={{ margin: '10px 0 0', color: '#54545c', fontSize: 15.5, lineHeight: 1.5 }}>Your order from <b>{s.lastOrder.name}</b> is confirmed.<br />The kitchen is now preparing your food. 👨‍🍳</p>
            <div style={{ background: '#fff', borderRadius: 18, padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,.06)', marginTop: 26, textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontSize: 34 }}>🛵</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#8a8a93', textTransform: 'uppercase', letterSpacing: '.5px' }}>Estimated arrival</div>
                  <div style={{ fontSize: 19, fontWeight: 800, color: B, marginTop: 2 }}>{s.lastOrder.eta}</div>
                </div>
              </div>
              <div style={{ height: 1, background: '#ececef', margin: '16px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#54545c', padding: '3px 0' }}>
                <span>{s.lastOrder.count} item(s)</span>
                <span style={{ fontWeight: 700, color: '#1c1c22', fontVariantNumeric: 'tabular-nums' }}>{s.lastOrder.total}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#54545c', padding: '3px 0' }}>
                <span>Paid via</span>
                <span style={{ fontWeight: 700, color: '#1c1c22' }}>{s.lastOrder.payLabel}</span>
              </div>
            </div>
            <button onClick={() => { dispatch({ type: 'RESET_HOME' }); window.scrollTo(0, 0); }} className="btn-brand"
              style={{ marginTop: 26, width: '100%', background: B, color: '#fff', border: 'none', borderRadius: 15, padding: 16, font: 'inherit', fontWeight: 800, fontSize: 16, cursor: 'pointer', boxShadow: `0 8px 22px ${BG}`, transition: 'filter .15s,transform .1s' }}>
              Order something else
            </button>
          </main>
        )}

        {/* Cart overlay */}
        <div onClick={() => dispatch({ type: 'CLOSE_CART' })}
          style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(15,15,20,.42)', opacity: s.cartOpen ? 1 : 0, pointerEvents: s.cartOpen ? 'auto' : 'none', transition: 'opacity .3s ease' }} />

        {/* Cart drawer */}
        <aside style={{ position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 60, width: 400, maxWidth: '92vw', background: '#fff', display: 'flex', flexDirection: 'column', transform: s.cartOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform .32s cubic-bezier(.4,0,.2,1)', boxShadow: '-12px 0 40px rgba(0,0,0,.18)' }}>
          <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #ececef', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-.4px' }}>Your cart</div>
              {t.count > 0 && <div style={{ fontSize: 13, color: '#8a8a93', marginTop: 2 }}>from {cartRest ? cartRest.name : ''}</div>}
            </div>
            <button onClick={() => dispatch({ type: 'CLOSE_CART' })} className="btn-icon"
              style={{ width: 36, height: 36, borderRadius: '50%', background: '#f1f1f3', border: 'none', cursor: 'pointer', fontSize: 18, color: '#54545c', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background .15s,transform .1s' }}>✕</button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 20px' }}>
            {t.count === 0 ? (
              <div style={{ textAlign: 'center', padding: '70px 16px', color: '#8a8a93' }}>
                <div style={{ fontSize: 52 }}>🛒</div>
                <div style={{ fontWeight: 700, fontSize: 17, color: '#1c1c22', marginTop: 12 }}>Your cart is empty</div>
                <div style={{ fontSize: 14, marginTop: 5, lineHeight: 1.5 }}>Add some langhap-sarap favorites<br />and they&apos;ll show up here.</div>
              </div>
            ) : Object.keys(s.cart).map(id => {
              const m = ITEMS[id], qty = s.cart[id];
              return (
                <div key={id} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f1f1f3' }}>
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: '#f1f1f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flex: 'none' }}>{m.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>{m.name}</div>
                    <div style={{ color: '#8a8a93', fontSize: 12.5, marginTop: 2 }}>{peso(m.price)} each</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 7, flex: 'none' }}>
                    <div style={{ fontWeight: 800, fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>{peso(m.price * qty)}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: '#f1f1f3', borderRadius: 10, padding: 2 }}>
                      <button onClick={() => dispatch({ type: 'DEC', id })} className="stepper-dec"
                        style={{ width: 26, height: 26, border: 'none', background: 'transparent', color: B, fontSize: 18, fontWeight: 700, cursor: 'pointer', borderRadius: 8, transition: 'transform .1s' }}>−</button>
                      <span style={{ minWidth: 16, textAlign: 'center', fontWeight: 800, fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>{qty}</span>
                      <button onClick={() => dispatch({ type: 'INC', id })} className="stepper-inc"
                        style={{ width: 26, height: 26, border: 'none', background: B, color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', borderRadius: 8, transition: 'transform .1s' }}>+</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {t.count > 0 && (
            <div style={{ borderTop: '1px solid #ececef', padding: '18px 20px 20px' }}>
              {[['Subtotal', peso(t.subtotal)], ['Delivery fee', t.delivery === 0 ? 'Free' : peso(t.delivery)], ['Service fee', peso(t.service)]].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: 13.5, color: '#54545c' }}>
                  <span>{label}</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>{val}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0 14px' }}>
                <span style={{ fontWeight: 800, fontSize: 15.5 }}>Total</span>
                <span style={{ fontWeight: 800, fontSize: 19, color: B, fontVariantNumeric: 'tabular-nums' }}>{peso(t.total)}</span>
              </div>
              <button onClick={() => { dispatch({ type: 'GO_CHECKOUT' }); window.scrollTo(0, 0); }} className="btn-brand"
                style={{ width: '100%', background: B, color: '#fff', border: 'none', borderRadius: 14, padding: 15, font: 'inherit', fontWeight: 800, fontSize: 15.5, cursor: 'pointer', boxShadow: `0 8px 20px ${BG}`, transition: 'filter .15s,transform .1s' }}>
                Go to checkout
              </button>
            </div>
          )}
        </aside>

        {/* New-order modal */}
        {s.pending && (() => {
          const it = ITEMS[s.pending];
          const newRest = RESTAURANTS.find(x => x.id === it.rid);
          return (
            <div style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(15,15,20,.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
              <div style={{ background: '#fff', borderRadius: 22, padding: 26, maxWidth: 360, width: '100%', textAlign: 'center', animation: 'modalIn .25s ease', boxShadow: '0 20px 50px rgba(0,0,0,.3)' }}>
                <div style={{ fontSize: 42 }}>🛍️</div>
                <h3 style={{ margin: '14px 0 0', fontSize: 19, fontWeight: 800, letterSpacing: '-.4px' }}>Start a new order?</h3>
                <p style={{ margin: '9px 0 0', color: '#54545c', fontSize: 14, lineHeight: 1.5 }}>
                  Your cart has items from <b>{cartRest ? cartRest.name : ''}</b>. Adding from <b>{newRest ? newRest.name : ''}</b> will clear it.
                </p>
                <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
                  <button onClick={() => dispatch({ type: 'CANCEL_NEW' })} className="modal-keep"
                    style={{ flex: 1, background: '#f1f1f3', color: '#1c1c22', border: 'none', borderRadius: 13, padding: 14, font: 'inherit', fontWeight: 700, fontSize: 14.5, cursor: 'pointer', transition: 'transform .1s' }}>Keep cart</button>
                  <button onClick={() => dispatch({ type: 'CONFIRM_NEW' })} className="modal-new"
                    style={{ flex: 1, background: B, color: '#fff', border: 'none', borderRadius: 13, padding: 14, font: 'inherit', fontWeight: 700, fontSize: 14.5, cursor: 'pointer', transition: 'transform .1s' }}>New order</button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Toast */}
        {s.toast && (
          <div key={s.pulse} style={{ position: 'fixed', bottom: 26, left: '50%', zIndex: 90, transform: 'translateX(-50%)', background: '#1c1c22', color: '#fff', padding: '13px 20px', borderRadius: 14, fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 9, boxShadow: '0 10px 30px rgba(0,0,0,.28)', animation: 'toastUp .3s ease', whiteSpace: 'nowrap' }}>
            <span style={{ color: '#4ade80', fontSize: 16 }}>✓</span>{s.toast}
          </div>
        )}
      </div>
    </>
  );
}

function MenuCats({ R, menuCat, dispatch, B }) {
  const cats = [];
  R.menu.forEach(m => { if (!cats.includes(m.cat)) cats.push(m.cat); });
  return (
    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
      {['All', ...cats].map(c => {
        const active = c === menuCat;
        return (
          <button key={c} onClick={() => dispatch({ type: 'SET_MENU_CAT', v: c })} className="chip-btn"
            style={{ flex: 'none', padding: '8px 15px', borderRadius: 999, border: `1.5px solid ${active ? B : '#e7e7ea'}`, background: active ? B : '#fff', color: active ? '#fff' : '#54545c', font: 'inherit', fontWeight: 700, fontSize: 13, cursor: 'pointer', transition: 'all .15s' }}>
            {c}
          </button>
        );
      })}
    </div>
  );
}

function MenuItems({ R, cart, cartRid, menuCat, menuQ, dispatch, add, B, BD, BT }) {
  const cats = [];
  R.menu.forEach(m => { if (!cats.includes(m.cat)) cats.push(m.cat); });
  const mq = menuQ.toLowerCase();

  return cats.map(cat => {
    if (menuCat !== 'All' && menuCat !== cat) return null;
    let items = R.menu.filter(m => m.cat === cat);
    if (mq) items = items.filter(m => m.name.toLowerCase().includes(mq) || m.desc.toLowerCase().includes(mq));
    if (!items.length) return null;
    return (
      <div key={cat}>
        <h3 style={{ margin: '22px 2px 4px', fontSize: 18, fontWeight: 800, letterSpacing: '-.4px' }}>{cat}</h3>
        {items.map(m => {
          const qty = cartRid === R.id ? (cart[m.id] || 0) : 0;
          return (
            <div key={m.id} style={{ display: 'flex', gap: 16, padding: '18px 0', borderBottom: '1px solid #ececef' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <h4 style={{ margin: 0, fontSize: 15.5, fontWeight: 700 }}>{m.name}</h4>
                  {m.badge && <span style={{ background: BT, color: BD, fontSize: 10.5, fontWeight: 800, padding: '3px 8px', borderRadius: 999, letterSpacing: '.3px', textTransform: 'uppercase' }}>{m.badge}</span>}
                </div>
                <p style={{ margin: '6px 0 0', color: '#8a8a93', fontSize: 13, lineHeight: 1.45, maxWidth: 430 }}>{m.desc}</p>
                <div style={{ marginTop: 10, fontWeight: 800, fontSize: 15, fontVariantNumeric: 'tabular-nums' }}>{peso(m.price)}</div>
              </div>
              <div style={{ position: 'relative', flex: 'none', width: 96, height: 96 }}>
                <div style={{ width: 96, height: 96, borderRadius: 15, background: '#f1f1f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 42 }}>{m.emoji}</div>
                {qty === 0 ? (
                  <button onClick={() => add(m.id)} className="add-btn"
                    style={{ position: 'absolute', bottom: -10, right: -8, width: 38, height: 38, borderRadius: 12, background: '#fff', border: '1.5px solid #ececef', color: B, fontSize: 22, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,.12)', transition: 'border-color .15s,transform .1s' }}>+</button>
                ) : (
                  <div style={{ position: 'absolute', bottom: -12, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 2, background: '#fff', borderRadius: 12, boxShadow: '0 4px 14px rgba(0,0,0,.16)', padding: 3 }}>
                    <button onClick={() => dispatch({ type: 'DEC', id: m.id })} className="stepper-dec"
                      style={{ width: 30, height: 30, border: 'none', background: 'transparent', color: B, fontSize: 20, fontWeight: 700, cursor: 'pointer', borderRadius: 9, transition: 'transform .1s' }}>−</button>
                    <span style={{ minWidth: 18, textAlign: 'center', fontWeight: 800, fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>{qty}</span>
                    <button onClick={() => dispatch({ type: 'INC', id: m.id })} className="stepper-inc"
                      style={{ width: 30, height: 30, border: 'none', background: B, color: '#fff', fontSize: 18, fontWeight: 700, cursor: 'pointer', borderRadius: 9, transition: 'transform .1s' }}>+</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  });
}
