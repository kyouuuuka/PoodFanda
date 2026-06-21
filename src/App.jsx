import { useReducer, useRef, useState, useEffect } from 'react';
import { RESTAURANTS, ITEMS } from './data';

// Asset base — drop images into public/assets/… and they appear automatically.
const A = '/assets';

// Nav tab icons. Inherit color via currentColor from the tab's text color.
const NavIcons = {
  delivery: (
    <svg aria-hidden="true" focusable="false" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M14.4729 5C14.0587 5 13.7229 5.33566 13.7229 5.74971C13.7229 6.16376 14.0587 6.49941 14.4729 6.49941H17.1729C17.2833 6.49941 17.3729 6.58896 17.3729 6.69941V9.38586C17.3729 9.42859 17.3592 9.4702 17.3338 9.50458L14.154 13.8153C14.1163 13.8664 14.0566 13.8965 13.9931 13.8965H10.3729C10.2624 13.8965 10.1729 13.807 10.1729 13.6965V9.69816C10.1729 9.28411 9.83708 8.94846 9.42287 8.94846H6.02287C5.01565 8.94846 4.19446 9.18295 3.55495 9.62085C2.91419 10.0596 2.51456 10.6624 2.28321 11.297C1.833 12.5318 1.99469 13.9438 2.25118 14.8503C2.34251 15.1731 2.63726 15.3959 2.97287 15.3959H3.57306C3.52524 15.6066 3.5 15.8259 3.5 16.0511C3.5 17.6797 4.82076 18.9999 6.45 18.9999C8.07924 18.9999 9.4 17.6797 9.4 16.0511C9.4 15.8259 9.37476 15.6066 9.32694 15.3959H14.3718C14.6736 15.3959 14.9574 15.2527 15.1365 15.0099L18.6875 10.196C18.8079 10.0328 18.8729 9.83526 18.8729 9.63243V5.94963C18.8729 5.42516 18.4475 5 17.9229 5H14.4729ZM7.74379 15.3959H5.15621C5.05631 15.5927 5 15.8153 5 16.0511C5 16.8516 5.64919 17.5005 6.45 17.5005C7.25081 17.5005 7.9 16.8516 7.9 16.0511C7.9 15.8153 7.84369 15.5927 7.74379 15.3959ZM8.67287 13.8565C8.67287 13.8786 8.65496 13.8965 8.63287 13.8965H3.57325C3.46237 13.2317 3.45914 12.4506 3.69253 11.8104C3.83701 11.4141 4.06488 11.0892 4.40266 10.8579C4.74169 10.6257 5.25009 10.4479 6.02287 10.4479H8.63287C8.65496 10.4479 8.67287 10.4658 8.67287 10.4879V13.8565Z" />
      <path d="M4.52344 5.99961C4.10922 5.99961 3.77344 6.3354 3.77344 6.74961C3.77344 7.16382 4.10922 7.49961 4.52344 7.49961H9.42344C9.83765 7.49961 10.1734 7.16382 10.1734 6.74961C10.1734 6.3354 9.83765 5.99961 9.42344 5.99961H4.52344Z" />
      <path fillRule="evenodd" clipRule="evenodd" d="M16.0957 16.0512C16.0957 14.4225 17.4165 13.1023 19.0457 13.1023C20.6749 13.1023 21.9957 14.4225 21.9957 16.0512C21.9957 17.6798 20.6749 19 19.0457 19C17.4165 19 16.0957 17.6798 16.0957 16.0512ZM19.0457 14.6017C18.2449 14.6017 17.5957 15.2507 17.5957 16.0512C17.5957 16.8517 18.2449 17.5006 19.0457 17.5006C19.8465 17.5006 20.4957 16.8517 20.4957 16.0512C20.4957 15.2507 19.8465 14.6017 19.0457 14.6017Z" />
    </svg>
  ),
  pickup: (
    <svg aria-hidden="true" focusable="false" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M10.978 7.6715C11.3804 7.76979 11.6269 8.17567 11.5286 8.57805L10.4015 13.1922C10.1984 14.0233 10.5609 14.8897 11.2953 15.3287L12.4349 16.0098C13.5296 16.6641 14.4352 17.592 15.0627 18.7022L16.1529 20.631C16.3567 20.9916 16.2296 21.4492 15.869 21.653C15.5084 21.8568 15.0509 21.7297 14.8471 21.3691L13.7569 19.4403C13.2574 18.5566 12.5366 17.8181 11.6654 17.2974L10.5258 16.6162C9.22642 15.8396 8.5851 14.3067 8.94431 12.8362L10.0714 8.2221C10.1697 7.81972 10.5756 7.57321 10.978 7.6715Z" />
      <path fillRule="evenodd" clipRule="evenodd" d="M14.3325 8.36177C14.7402 8.43496 15.0114 8.8248 14.9382 9.23249L14.2 9.09997C14.9382 9.23249 14.9382 9.23239 14.9382 9.23249L14.9375 9.23651L14.9357 9.24613L14.9292 9.2815C14.9235 9.31205 14.9151 9.35628 14.9042 9.41253C14.8824 9.52499 14.8502 9.68571 14.8085 9.8813C14.7253 10.2717 14.6033 10.8048 14.4485 11.3723C14.2945 11.9371 14.1041 12.5502 13.882 13.0954C13.6695 13.6168 13.3926 14.1679 13.0302 14.5302C12.7373 14.8231 12.2625 14.8231 11.9696 14.5302C11.6767 14.2373 11.6767 13.7624 11.9696 13.4695C12.1072 13.3319 12.2928 13.0205 12.4929 12.5294C12.6833 12.0621 12.8554 11.5127 13.0014 10.9776C13.1466 10.445 13.2622 9.9407 13.3415 9.56861C13.381 9.38297 13.4114 9.2312 13.4317 9.12647C13.4419 9.07413 13.4496 9.0336 13.4546 9.00653L13.4602 8.97626L13.4615 8.96909L13.4618 8.96757C13.535 8.55993 13.9249 8.28859 14.3325 8.36177Z" />
      <path fillRule="evenodd" clipRule="evenodd" d="M13.2 5.8999C13.7523 5.8999 14.2 5.45219 14.2 4.8999C14.2 4.34762 13.7523 3.8999 13.2 3.8999C12.6477 3.8999 12.2 4.34762 12.2 4.8999C12.2 5.45219 12.6477 5.8999 13.2 5.8999ZM13.2 7.3999C14.5807 7.3999 15.7 6.28061 15.7 4.8999C15.7 3.51919 14.5807 2.3999 13.2 2.3999C11.8193 2.3999 10.7 3.51919 10.7 4.8999C10.7 6.28061 11.8193 7.3999 13.2 7.3999Z" />
      <path fillRule="evenodd" clipRule="evenodd" d="M10.7518 9.03582C8.43465 8.66945 7.3 10.1419 7.3 11.3C7.3 11.7142 6.96421 12.05 6.55 12.05C6.13579 12.05 5.8 11.7142 5.8 11.3C5.8 9.12931 7.85651 7.04201 11.0211 7.55986L11.0491 7.56444L14.3767 8.37112C14.7793 8.46871 15.0265 8.87416 14.9289 9.27671C14.8313 9.67926 14.4259 9.92649 14.0233 9.8289L10.7518 9.03582Z" />
      <path fillRule="evenodd" clipRule="evenodd" d="M14.9319 9.72425C14.9407 9.52054 14.95 9.30432 14.95 9.0999C14.95 8.68569 14.6142 8.3499 14.2 8.3499C13.7858 8.3499 13.45 8.68569 13.45 9.0999C13.45 9.26992 13.4422 9.45254 13.4332 9.66234C13.4322 9.68501 13.4312 9.708 13.4302 9.73132C13.4204 9.96302 13.4104 10.2211 13.4138 10.4846C13.4206 11.006 13.4791 11.6116 13.7361 12.1827C14.0036 12.7772 14.4656 13.2886 15.1906 13.638C15.8945 13.9773 16.8156 14.1499 18 14.1499C18.4142 14.1499 18.75 13.8141 18.75 13.3999C18.75 12.9857 18.4142 12.6499 18 12.6499C16.9444 12.6499 16.2705 12.4934 15.8419 12.2868C15.4344 12.0904 15.2264 11.8393 15.1039 11.5671C14.9709 11.2715 14.9194 10.9063 14.9137 10.4652C14.9109 10.2474 14.919 10.0264 14.9289 9.79504C14.9298 9.77164 14.9309 9.74803 14.9319 9.72425Z" />
      <path fillRule="evenodd" clipRule="evenodd" d="M8.95777 16.366C9.3355 16.536 9.50392 16.98 9.33394 17.3578L9.15059 17.7652C8.64057 18.8986 7.93609 19.934 7.06905 20.8244L6.43735 21.4732C6.14839 21.77 5.67356 21.7763 5.37679 21.4873C5.08002 21.1984 5.07368 20.7235 5.36265 20.4268L5.99434 19.778C6.73926 19.013 7.34452 18.1234 7.78271 17.1497L7.96606 16.7422C8.13604 16.3645 8.58004 16.1961 8.95777 16.366Z" />
    </svg>
  ),
  pandamart: (
    <svg aria-hidden="true" focusable="false" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2C15.1046 2 16 2.89543 16 4V4.8C16 4.91046 16.0895 5 16.2 5H18C19.1046 5 20 5.89543 20 7V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V7C4 5.89543 4.89543 5 6 5H7.8C7.91046 5 8 4.91046 8 4.8V4C8 2.89543 8.89543 2 10 2H14ZM18.291 16.5H5.702L5.64885 16.5072C5.56422 16.5305 5.50203 16.608 5.5019 16.7L5.50011 20.3L5.50718 20.3532C5.52572 20.4209 5.57901 20.4743 5.64672 20.4929L5.7 20.5H18.2919L18.3451 20.4929C18.4298 20.4696 18.4919 20.392 18.4919 20.3L18.491 16.7L18.4839 16.6468C18.4605 16.5622 18.383 16.5 18.291 16.5ZM7.79936 6.50806H5.70806L5.65491 6.5152C5.57028 6.5385 5.50809 6.61605 5.50794 6.70806L5.50312 14.8L5.51018 14.8532C5.52871 14.9209 5.58201 14.9743 5.64972 14.9929L5.703 15H18.291L18.3442 14.9929C18.4288 14.9696 18.491 14.892 18.491 14.8L18.4919 6.70806L18.4848 6.65489C18.4615 6.57024 18.384 6.50806 18.2919 6.50806H16.1994L16.146 6.51526C16.0613 6.53865 15.9992 6.61625 15.9994 6.70829L16 7.25L15.9932 7.35177C15.9435 7.71785 15.6297 8 15.25 8L15.1482 7.99315C14.7822 7.94349 14.5 7.6297 14.5 7.25L14.4994 6.70782C14.4992 6.59745 14.4097 6.50806 14.2994 6.50806H9.69936L9.64596 6.51526C9.56134 6.53865 9.49925 6.61625 9.49936 6.70829L9.5 7.25L9.49315 7.35177C9.44349 7.71785 9.1297 8 8.75 8C8.33579 8 8 7.66421 8 7.25L7.99936 6.70782C7.99922 6.59745 7.90972 6.50806 7.79936 6.50806ZM14 3.5H10C9.75454 3.5 9.55039 3.67688 9.50806 3.91012L9.5 4V4.8C9.5 4.91046 9.58954 5 9.7 5H14.3C14.4105 5 14.5 4.91046 14.5 4.8V4C14.5 3.75454 14.3231 3.55039 14.0899 3.50806L14 3.5Z" />
    </svg>
  ),
  shops: (
    <svg aria-hidden="true" focusable="false" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M21.2585 11.1816L21.2573 19.6567C21.2573 20.3522 20.7369 20.9243 20.07 20.9931L19.9347 21H4.0644C3.37964 21 2.81642 20.4714 2.7487 19.7941L2.74187 19.6567L2.74152 11.1824C2.28063 10.667 1.99976 9.98246 1.99976 9.23132L2.00695 9.02552L2.02848 8.82077L2.68496 4.15331C2.77183 3.53567 3.2637 3.0663 3.86401 3.00646L3.9942 3H20.0049C20.6192 3 21.1463 3.42819 21.2895 4.02333L21.3142 4.15331L21.9707 8.82077C22.0958 9.71058 21.8095 10.5637 21.2585 11.1816ZM10.677 19.5H13.3221V15.8955C13.3221 15.2464 12.8688 14.7048 12.2661 14.5795L12.1348 14.5592L11.9996 14.5522C11.3148 14.5522 10.7516 15.0808 10.6839 15.7582L10.677 15.8955V19.5ZM19.7583 11.9525L19.7573 19.5H14.8221V15.8955C14.8221 14.5372 13.8714 13.3811 12.5713 13.1109L12.5338 13.1031L12.2885 13.0651L12.038 13.0522H11.9996C10.5176 13.0522 9.33304 14.1915 9.19132 15.6089L9.18758 15.6463L9.17705 15.8583V19.5H4.24186L4.24155 11.953C4.34993 11.9777 4.46088 11.9961 4.57404 12.0078L4.6125 12.0118L4.81947 12.0224H5.12242C5.9724 12.0224 6.72457 11.6476 7.23825 11.0605C7.69253 11.5794 8.33373 11.9321 9.06539 12.0075L9.10385 12.0115L9.31607 12.0224H9.88353C10.7335 12.0224 11.4857 11.6476 11.9994 11.0605C12.4536 11.5794 13.0948 11.9321 13.8265 12.0075L13.865 12.0115L14.0772 12.0224H14.6446C15.4946 12.0224 16.2468 11.6476 16.7605 11.0605C17.2147 11.5794 17.8559 11.9321 18.5876 12.0075L18.6261 12.0115L18.8383 12.0224H19.1412C19.2735 12.0224 19.4055 12.0129 19.5364 11.9939C19.6116 11.983 19.6856 11.9691 19.7583 11.9525ZM8.03155 5.04175C8.03155 4.80435 8.22102 4.6119 8.45476 4.61194H10.7824C11.0161 4.61198 11.2056 4.80441 11.2057 5.04179L11.2061 9.1791L11.1992 9.31645C11.1315 9.99381 10.5683 10.5224 9.88353 10.5224H9.35452L9.21929 10.5155C8.5524 10.4467 8.03199 9.87461 8.03199 9.1791L8.03155 5.04175ZM17.5538 5.04175C17.5538 4.80435 17.7432 4.6119 17.977 4.61194H19.4086C19.6192 4.61194 19.7977 4.76924 19.8275 4.98101L20.3996 9.04873L20.4115 9.18035C20.4377 9.83419 19.9725 10.4149 19.321 10.5094C19.2615 10.5181 19.2014 10.5224 19.1412 10.5224H18.8767L18.7415 10.5155C18.0746 10.4467 17.5542 9.87461 17.5542 9.1791L17.5538 5.04175ZM3.58679 9.23132L3.59398 9.09418L4.15793 5.07347C4.19507 4.80867 4.41831 4.61194 4.68165 4.61194H5.9155C6.20765 4.61199 6.44448 4.85252 6.44456 5.14925L6.44495 9.1791L6.43812 9.31645C6.3704 9.99381 5.80718 10.5224 5.12242 10.5224H4.85792L4.72795 10.5157C4.08698 10.4496 3.58679 9.89979 3.58679 9.23132ZM12.7931 9.1791L12.7927 5.04175C12.7927 4.80435 12.9821 4.6119 13.2159 4.61194H15.5435C15.7772 4.61198 15.9667 4.80441 15.9668 5.04179L15.9672 9.1791L15.9603 9.31645C15.8926 9.99381 15.3294 10.5224 14.6446 10.5224H14.1156L13.9804 10.5155C13.3135 10.4467 12.7931 9.87461 12.7931 9.1791Z" />
    </svg>
  ),
};

// Quick cuisine chips shown inside the greeting hero. `chip` filters the restaurant grid.
// HERO_POOL is the full set of recommendations; the randomize button picks 5 at random.
const HERO_POOL = [
  { label: 'Milk Tea', chip: 'All' },
  { label: 'Burgers', chip: 'Burgers' },
  { label: 'Coffee', chip: 'All' },
  { label: 'Filipino', chip: 'Filipino' },
  { label: 'Halo-Halo', chip: 'Desserts' },
  { label: 'Chicken', chip: 'Chicken' },
  { label: 'Pizza', chip: 'Pizza' },
  { label: 'Korean', chip: 'Korean' },
  { label: 'Snacks', chip: 'Snacks' },
  { label: 'Rice Meals', chip: 'All' },
  { label: 'Desserts', chip: 'Desserts' },
  { label: 'Pasta', chip: 'All' },
];
const HERO_CHIPS = HERO_POOL.slice(0, 5);

function shuffleHero() {
  const pool = [...HERO_POOL];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 5);
}

// "Your daily deals" banners. `img` → public/assets/deals/<img>.png (full-bleed promo images)
const DEALS = [
  { img: 'deal1' },
  { img: 'deal2' },
  { img: 'deal3' },
  { img: 'deal4' },
  { img: 'deal5' },
];

// "Top brands" row — restaurant ids. logo → public/assets/brands/<id>.webp
const TOP_BRANDS = ['jb', 'chowking', 'kfc', 'bonchon', 'greenwich', 'mcdo', 'shakeys', 'inasal', 'armynavy'];

// ─── State ───────────────────────────────────────────────────────────────────

// Address logos. Click an svg pill in the picker to assign a label when saving.
const ADDR_ICONS = {
  home: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M3 11l9-7 9 7" /><path d="M5 10v10h5v-6h4v6h5V10" /></svg>,
  work: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>,
  heart: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M12 20s-7-4.5-7-9.5A4 4 0 0112 7a4 4 0 017 3.5C19 15.5 12 20 12 20z" /></svg>,
  pin: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M12 21s7-6.5 7-11a7 7 0 10-14 0c0 4.5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>,
};

// Quick labels shown as pills. key → icon in ADDR_ICONS.
const ADDR_LABELS = [
  { key: 'home', text: 'Home' },
  { key: 'work', text: 'Work' },
  { key: 'heart', text: 'Partner' },
];

// Saved delivery addresses persist in localStorage. Starts empty.
const ADDR_KEY = 'poodfanda.savedAddresses';
function loadAddresses() {
  try { return JSON.parse(localStorage.getItem(ADDR_KEY)) || []; } catch { return []; }
}

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
  favorites: [],
  heroChips: HERO_CHIPS,
  heroPulse: 0,
  address: 'Triangle Paseo de Roxas Makati City',
  addrOpen: false,
  sort: '',              // '' = none selected; 'Top rated' active; 'Relevance' | 'Fastest Delivery' | 'Distance' are inert
  minRating: 0,          // 0 = off, 4 = "Ratings 4+" filter on
  vouchers: false,       // "Accepts vouchers" → free-delivery restaurants
  priceLevels: [],       // selected price tiers (1/2/3), empty = all
};

function reducer(s, a) {
  switch (a.type) {
    case 'SET_Q': return { ...s, q: a.v, screen: 'home' };
    case 'SET_CHIP': return { ...s, chip: a.v };
    case 'SET_MENU_Q': return { ...s, menuQ: a.v };
    case 'SET_MENU_CAT': return { ...s, menuCat: a.v };
    case 'SET_PAY': return { ...s, payment: a.v };
    case 'SET_ADDRESS': return { ...s, address: a.v, addrOpen: false };
    case 'OPEN_ADDR': return { ...s, addrOpen: true };
    case 'CLOSE_ADDR': return { ...s, addrOpen: false };
    case 'SET_SORT': return { ...s, sort: a.v };
    case 'TOGGLE_RATING': return { ...s, minRating: s.minRating ? 0 : 4 };
    case 'TOGGLE_VOUCHERS': return { ...s, vouchers: !s.vouchers };
    case 'TOGGLE_PRICE': return { ...s, priceLevels: s.priceLevels.includes(a.v) ? [] : [a.v] };
    case 'CLEAR_FILTERS': return { ...s, sort: '', minRating: 0, vouchers: false, priceLevels: [] };
    case 'OPEN_REST': return { ...s, screen: 'restaurant', activeRid: a.id, menuCat: 'All', menuQ: '' };
    case 'GO_HOME': return { ...s, screen: 'home' };
    case 'SHUFFLE_HERO': return { ...s, heroChips: shuffleHero(), heroPulse: s.heroPulse + 1 };
    case 'OPEN_FAV': return { ...s, screen: 'favorites', cartOpen: false };
    case 'TOGGLE_FAV': {
      const has = s.favorites.includes(a.id);
      return { ...s, favorites: has ? s.favorites.filter(x => x !== a.id) : [...s.favorites, a.id] };
    }
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

// DOM id for a menu category section — used to scroll-link the category tabs.
const catSlug = (rid, cat) => `cat-${rid}-${cat.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`;

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

const B = '#e8418a';
const BD = '#cf2a72';
const BT = '#fde7f0';
const BG = 'rgba(215,15,100,.35)';

// ─── App ─────────────────────────────────────────────────────────────────────

// Tracks viewport width so inline styles can react to screen size.
function useViewport() {
  const [w, setW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1280);
  useEffect(() => {
    const on = () => setW(window.innerWidth);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return w;
}

export default function App() {
  const [s, dispatch] = useReducer(reducer, init);
  const vw = useViewport();
  const compact = vw < 980;   // tablet & below — hide left filters, stack hero
  const narrow = vw < 640;    // phone — trim header, full-width search, 1-col grid
  const toastTimer = useRef(null);
  const [addrInput, setAddrInput] = useState('');
  const [addrLabel, setAddrLabel] = useState('home');  // label to assign when saving
  const [saved, setSaved] = useState(loadAddresses);   // persisted saved addresses
  useEffect(() => { localStorage.setItem(ADDR_KEY, JSON.stringify(saved)); }, [saved]);

  function saveAddr() {
    const v = addrInput.trim();
    if (!v) return;
    const lbl = ADDR_LABELS.find(l => l.key === addrLabel) || ADDR_LABELS[0];
    setSaved(list => list.some(a => a.value === v) ? list : [...list, { id: Date.now().toString(36), icon: lbl.key, label: lbl.text, sub: v, value: v }]);
    dispatch({ type: 'SET_ADDRESS', v });
  }
  function delAddr(id) {
    setSaved(list => list.filter(a => a.id !== id));
  }

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

  function toggleFav(id) {
    const wasFav = s.favorites.includes(id);
    dispatch({ type: 'TOGGLE_FAV', id });
    toast(wasFav ? 'Removed from favorites' : 'Added to favorites');
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
    const okR = !s.minRating || r.rating >= s.minRating;
    const okV = !s.vouchers || r.fee === 0;
    const okP = s.priceLevels.length === 0 || s.priceLevels.includes(r.priceLevel);
    return okQ && okC && okR && okV && okP;
  });
  if (s.sort === 'Top rated') visibleRestaurants.sort((a, b) => b.rating - a.rating);

  const R = s.activeRid ? RESTAURANTS.find(x => x.id === s.activeRid) : null;
  const favRestaurants = RESTAURANTS.filter(r => s.favorites.includes(r.id));

  return (
    <>
      <style>{`
        @keyframes pop{0%{transform:scale(1)}40%{transform:scale(1.45)}100%{transform:scale(1)}}
        @keyframes toastUp{from{transform:translateX(-50%) translateY(28px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}
        @keyframes checkPop{0%{transform:scale(0);opacity:0}55%{transform:scale(1.18);opacity:1}100%{transform:scale(1)}}
        @keyframes ringPulse{0%{transform:scale(.8);opacity:.55}70%{opacity:0}100%{transform:scale(1.7);opacity:0}}
        @keyframes modalIn{from{transform:translateY(24px) scale(.97);opacity:0}to{transform:translateY(0) scale(1);opacity:1}}
        @keyframes sparkle{0%,100%{transform:scale(.5) rotate(0deg);opacity:.25}50%{transform:scale(1.15) rotate(22deg);opacity:1}}
        @keyframes chipIn{from{transform:translateX(26px);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;}
        ::-webkit-scrollbar{height:0;width:8px;}
        ::-webkit-scrollbar:horizontal{display:none;}
        ::-webkit-scrollbar-thumb{background:rgba(0,0,0,.16);border-radius:999px;}
        .menu-search::placeholder{font-weight:700;color:#8a8a93;opacity:1;}
        .rest-img{transition:transform .3s ease;}
        .rest-card:hover .rest-img{transform:scale(1.07);}
        .brand-item{position:relative;}
        .brand-item:hover{z-index:2;}
        .brand-logo{transition:transform .2s ease, filter .2s ease;}
        .brand-item:hover .brand-logo{transform:scale(1.12);filter:drop-shadow(0 4px 8px rgba(0,0,0,.15));}
        .hide-scroll::-webkit-scrollbar{display:none;}
        .hide-scroll{scrollbar-width:none;}
        .scroll-arrow:hover{transform:translateY(-50%) scale(1.08);}
        .hero-chip:hover{filter:brightness(.95);}
        .clear-all:hover{opacity:.6;}
        .filter-scroll{scrollbar-width:thin;scrollbar-color:#cfcfd6 transparent;}
        .filter-scroll::-webkit-scrollbar{width:8px;}
        .filter-scroll::-webkit-scrollbar-track{background:transparent;}
        .filter-scroll::-webkit-scrollbar-thumb{background:#cfcfd6;border-radius:999px;}
        .filter-scroll::-webkit-scrollbar-thumb:hover{background:#b3b3bd;}
        .ghost-btn:hover{background:#f5f5f6 !important;}
        .btn-brand:hover{filter:brightness(1.07);}
        .btn-brand:active{transform:scale(.985);}
        .btn-icon:hover{background:#e7e7ea !important;}
        .back-btn:active{transform:scale(.92);}
        .menu-card:hover{box-shadow:0 6px 18px rgba(0,0,0,.10);}
        .menu-col{container-type:inline-size;}
        .menu-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:14px;}
        .menu-grid>.menu-card{min-width:0;}
        @container (min-width:600px){.menu-grid{grid-template-columns:repeat(2,minmax(0,1fr));}}
        .add-btn:hover{border-color:${B} !important;}
        .add-btn:active{transform:scale(.88);}
        .fav-btn:hover{transform:scale(1.12);}
        .fav-btn:active{transform:scale(.85);}
        .pay-opt:hover{border-color:${B} !important;}
        .chip-btn:hover{border-color:${B} !important;}
        .fchip:hover{border-color:#1c1c22 !important;}
        .stepper-dec:active,.stepper-inc:active{transform:scale(.85);}
        .modal-keep:active{transform:scale(.97);}
        .modal-new:active{transform:scale(.97);}
        .addr-row:hover{background:#f6f6f7 !important;}
        .addr-go:hover{filter:brightness(1.07);}
        .addr-go:active{transform:scale(.96);}
      `}</style>

      <div style={{ minHeight: '100vh', background: '#f5f5f6', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <header style={{ position: 'sticky', top: 0, zIndex: 40, background: '#fff', boxShadow: '0 1px 0 rgba(0,0,0,.07),0 4px 18px rgba(0,0,0,.03)' }}>
          {/* Top bar: logo · address · auth · cart */}
          <div style={{ position: 'relative', maxWidth: 1240, margin: '0 auto', padding: '12px 22px', display: 'flex', alignItems: 'center', gap: 18 }}>
            <div onClick={() => { dispatch({ type: 'RESET_HOME' }); window.scrollTo(0, 0); }}
              style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer', flex: 'none' }}>
              <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="28" height="28" aria-hidden="true" focusable="false">
                <path d="M35 0H5C2.24 0 0 2.24 0 5v30c0 2.76 2.24 5 5 5h30c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5Z" fill="#ff2b85" />
                <path d="M14.58 17.53c.41-.04.71-.4.68-.81a.756.756 0 0 0-.81-.68c-.39.03-.68.35-.68.74.02.43.38.76.81.75Zm10.44-1.33c.12-.09.25-.14.4-.16.43-.02.79.32.81.75 0 .41-.33.75-.75.75s-.75-.33-.75-.75c0-.23.11-.45.29-.59Z" fill="#fff" />
                <path fillRule="evenodd" clipRule="evenodd" d="M33.51 14.52v-.03c-.15-.3-.1-.65.12-.9a4.983 4.983 0 0 0 .89-4.78c-.06-.19-.34-.24-.61-.29-.26-.05-.52-.09-.62-.26-.09-.15-.06-.38 0-.63.02-.07.03-.13.04-.2.05-.26.07-.51-.06-.64s-.28-.26-.42-.37l-.09-.07c-1-.74-2.23-1.1-3.47-1.03-1.08.05-2.23.41-3.06 1.14-.4.29-.92.37-1.39.22l-.07-.02c-.84-.3-1.7-.52-2.58-.66a14.28 14.28 0 0 0-6.95.66h-.05c-.45.18-.96.1-1.35-.19-1.55-1.37-4.68-1.71-6.72.01-2.23 1.88-2.36 5.17-.71 7.1.22.25.26.6.12.9-.98 2-1.5 4.2-1.51 6.43 0 7.97 6.72 13.77 15 13.77 8.28 0 15-5.8 15-13.77 0-2.22-.52-4.41-1.49-6.41 0 0 0 .02-.01.02h-.01ZM19.9 20.19c1.19 0 2.15.26 2.15.72 0 .46-.96 1.5-2.15 1.5s-2.15-1.04-2.15-1.5c0-.46.96-.72 2.15-.72ZM7.86 11.8a.578.578 0 0 1-.18-.2c-.02-.03-.04-.07-.06-.1-.36-.66-.45-1.44-.23-2.16.42-1.41 1.92-2.24 3.35-2.05.37.05.74.17 1.07.35.14.08.26.17.37.28.04.04.08.09.1.15.02.09 0 .18-.07.25-.06.06-.14.11-.22.15-1.37.8-2.49 1.95-3.52 3.14-.17.19-.35.37-.61.19Zm3.66 11.33c-1.24-.14-2.32-1.45-2.73-2.77-.18-.58-.61-3.26 1.31-5.2.64-.64 1.54-1.21 2.79-1.59.41-.1.82-.15 1.24-.15.62 0 1.36.1 1.95.53 1.24.91 1.26 2.44.52 3.23s-2.4 2.59-2.83 4.06c-.42 1.47-1.01 2.04-2.26 1.9 0 0 .01-.01.01 0v-.01Zm8.4 4.43h-.04c-2.39-.01-4.32-1.7-4.32-3.4 0-.59.26-.89.89-.73.37.09 1.89.48 3.27.48h.35c1.35 0 2.82-.37 3.24-.48h.03c.64-.16.89.14.89.72 0 1.7-1.93 3.39-4.32 3.4h.01v.01Zm11.09-7.22c-.41 1.32-1.49 2.63-2.73 2.77-1.24.14-1.83-.42-2.26-1.9-.43-1.47-2.09-3.28-2.83-4.07-.74-.78-.72-2.32.52-3.23.58-.43 1.33-.53 1.95-.53.42 0 .83.05 1.24.15 1.25.38 2.15.94 2.79 1.58 1.92 1.94 1.49 4.62 1.31 5.2 0 0 .01.03 0 .03h.01Zm1.37-8.84-.06.1a.86.86 0 0 1-.18.2c-.26.18-.44 0-.61-.19-1.03-1.19-2.15-2.34-3.52-3.14a1.07 1.07 0 0 1-.22-.15.33.33 0 0 1-.08-.25c.02-.06.05-.11.1-.15.11-.11.23-.21.37-.28.33-.18.7-.3 1.07-.35 1.43-.19 2.93.64 3.35 2.05.21.72.13 1.5-.23 2.16h.01Z" fill="#fff" />
              </svg>
              <span style={{ fontWeight: 800, fontSize: 23, letterSpacing: '-.6px', color: '#ff2b85', transform: 'translateY(-3px)' }}>poodfanda</span>
            </div>
            <div onClick={() => { setAddrInput(s.address); dispatch({ type: 'OPEN_ADDR' }); }} style={{ position: 'absolute', left: 425, top: '50%', transform: 'translateY(-50%)', display: compact ? 'none' : 'flex', alignItems: 'center', gap: 6, color: '#1c1c22', fontSize: 14, fontWeight: 600, flex: 'none', cursor: 'pointer' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg aria-hidden="true" focusable="false" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12.3224 2C16.9186 2 20.6446 5.72596 20.6446 10.3222C20.6446 11.8203 20.2487 13.226 19.5559 14.4404L18.4715 15.8911C17.8726 16.5162 16.6838 17.706 14.9052 19.4602L13.0213 21.313C12.6322 21.6947 12.0092 21.6946 11.6203 21.3128L7.91833 17.6571L6.59648 16.3282C6.2846 16.0104 5.78156 15.3801 5.08734 14.4375C4.3955 13.2238 4.00024 11.8192 4.00024 10.3222C4.00024 5.72596 7.72621 2 12.3224 2ZM12.3224 3.5C8.55463 3.5 5.50024 6.55439 5.50024 10.3222C5.50024 11.4141 5.75604 12.466 6.23886 13.4136L6.37241 13.66L6.96356 14.5436L7.18196 14.7804L7.77128 15.385C8.23371 15.8535 8.88147 16.5011 9.70239 17.3151C10.6866 18.2861 11.4247 19.0143 11.9168 19.4998C11.9577 19.5401 11.9986 19.5805 12.0395 19.6209C12.1953 19.7745 12.4456 19.7745 12.6013 19.6209L12.6754 19.5478L15.3017 16.9571L17.2047 15.0461C17.3404 14.9068 17.4503 14.7925 17.5337 14.7039L17.6874 14.534L18.2724 13.659L18.4049 13.4158C18.84 12.5624 19.0911 11.6245 19.1369 10.6487L19.1446 10.3222C19.1446 6.55439 16.0902 3.5 12.3224 3.5ZM12.3224 6.75C14.3935 6.75 16.0724 8.42893 16.0724 10.5C16.0724 12.5711 14.3935 14.25 12.3224 14.25C10.2513 14.25 8.57241 12.5711 8.57241 10.5C8.57241 8.42893 10.2513 6.75 12.3224 6.75ZM12.3224 8.25C11.0798 8.25 10.0724 9.25736 10.0724 10.5C10.0724 11.7426 11.0798 12.75 12.3224 12.75C13.5651 12.75 14.5724 11.7426 14.5724 10.5C14.5724 9.25736 13.5651 8.25 12.3224 8.25Z" />
                </svg>
              </span>
              <span>{s.address}</span>
            </div>
            <div style={{ flex: 1 }} />
            <div className="ghost-btn" style={{ display: 'flex', alignItems: 'center', gap: 7, flex: 'none', borderRadius: 12, padding: '8px 14px', fontWeight: 700, fontSize: 14.5, color: '#1c1c22', cursor: 'pointer', transition: 'all .15s' }}>
              <svg aria-hidden="true" focusable="false" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 11.5C13.933 11.5 15.5 9.933 15.5 8C15.5 6.067 13.933 4.5 12 4.5C10.067 4.5 8.50001 6.067 8.50001 8C8.50001 9.933 10.067 11.5 12 11.5ZM10.0566 14.2045C10.679 14.071 11.33 14.0001 12 14C12.0003 14 12.0007 14 12.001 14C12.6709 14 13.3218 14.0708 13.9442 14.2042C17.1008 14.881 19.5251 17.1688 19.9907 20.0041C20.0802 20.5491 19.6241 21 19.0718 21H4.93021C4.37792 21 3.92177 20.5491 4.01127 20.0041C4.47684 17.1692 6.90063 14.8815 10.0566 14.2045ZM10.1743 12.6562C8.31584 11.9269 7.00001 10.1171 7.00001 8C7.00001 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8C17 10.1169 15.6845 11.9265 13.8263 12.656C13.2609 12.8779 12.6452 12.9999 12.001 13C12.0007 13 12.0003 13 12 13C11.3557 13 10.7399 12.8781 10.1743 12.6562ZM18.3216 19.5C17.5644 17.2951 15.1351 15.5 12.001 15.5C8.86687 15.5 6.43759 17.2951 5.6804 19.5H18.3216Z" />
              </svg>
              {!narrow && <>Profile <span style={{ fontSize: 11, opacity: .7 }}>▾</span></>}
            </div>
            <div style={{ display: narrow ? 'none' : 'flex', alignItems: 'center', gap: 5, fontSize: 14, fontWeight: 700, color: '#1c1c22', cursor: 'default', flex: 'none' }}>
              <svg aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM10.6635 19.3813C9.79267 18.1369 9.11658 16.9361 8.65036 15.75H5.50337C6.58707 17.6234 8.45784 18.9845 10.6635 19.3813ZM4.84335 14.25H8.17237C7.98964 13.4966 7.89523 12.7442 7.8931 11.9853C7.891 11.2379 7.97842 10.4952 8.15242 9.75H4.84335C4.62027 10.4603 4.5 11.2161 4.5 12C4.5 12.7839 4.62027 13.5397 4.84335 14.25ZM5.50337 8.25H8.61663C9.06884 7.07159 9.72906 5.8752 10.586 4.63309C8.41405 5.04747 6.57436 6.39858 5.50337 8.25ZM18.4966 15.75C17.4415 17.574 15.6402 18.9124 13.5102 19.3479C14.3698 18.1154 15.038 16.9255 15.5 15.75H18.4966ZM19.1566 14.25H15.978C16.1608 13.4966 16.2552 12.7442 16.2573 11.9853C16.2594 11.2379 16.172 10.4952 15.998 9.75H19.1566C19.3797 10.4603 19.5 11.2161 19.5 12C19.5 12.7839 19.3797 13.5397 19.1566 14.25ZM18.4966 8.25H15.5338C15.0859 7.08283 14.4339 5.89803 13.5888 4.66862C15.6845 5.12065 17.4545 6.44847 18.4966 8.25ZM12.0752 5.12312C12.8682 6.22942 13.4764 7.26325 13.9116 8.25H10.2388C10.674 7.26325 11.2822 6.22942 12.0752 5.12312ZM9.69994 9.75H14.4504C14.6591 10.5113 14.7593 11.2505 14.7573 11.981C14.7552 12.7258 14.6467 13.4775 14.4269 14.25H9.72354C9.50364 13.4775 9.39519 12.7258 9.3931 11.981C9.39105 11.2505 9.49129 10.5113 9.69994 9.75ZM10.2783 15.75H13.8721C13.4389 16.7093 12.8428 17.7109 12.0752 18.7788C11.3076 17.7109 10.7115 16.7093 10.2783 15.75Z" />
              </svg>
              EN ▾
            </div>
            <button onClick={() => { dispatch({ type: 'OPEN_FAV' }); window.scrollTo(0, 0); }} className="btn-icon" aria-label="Favourites"
              style={{ position: 'relative', width: 38, height: 38, borderRadius: '50%', background: 'transparent', border: 'none', cursor: 'pointer', color: s.screen === 'favorites' ? B : '#1c1c22', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', transition: 'background .15s,color .15s' }}>
              <svg aria-hidden="true" focusable="false" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18.338 4.438c2.764 1.316 4.015 4.757 2.795 7.686-1.548 3.243-4.436 5.835-8.665 7.776-.254.114-.543.13-.807.05l-.13-.05c-4.228-1.94-7.116-4.533-8.664-7.776-1.22-2.93.031-6.37 2.795-7.686 1.89-.9 3.826-.315 5.378.855.112.084.246.195.403.333l.286.257a.4.4 0 00.542 0l.315-.283c.145-.125.27-.228.374-.307 1.555-1.171 3.49-1.754 5.378-.855zm-.644 1.355c-1.178-.56-2.506-.3-3.831.699l-.151.12c-.115.096-.258.222-.427.376-.207.19-.553.467-1.038.83a.4.4 0 01-.487-.007 99.836 99.836 0 00-.909-.708l-.13-.11-.158-.143a7.024 7.024 0 00-.426-.36c-1.323-.997-2.652-1.258-3.83-.697-2.032.966-2.972 3.553-2.086 5.685 1.335 2.798 3.822 5.087 7.52 6.863l.259.122.259-.121c3.561-1.711 5.998-3.895 7.34-6.493l.149-.301c.888-2.133.034-4.627-1.867-5.66l-.187-.095z" />
              </svg>
              {s.favorites.length > 0 && (
                <span style={{ position: 'absolute', top: -2, right: -2, background: B, color: '#fff', borderRadius: 999, minWidth: 19, height: 19, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, padding: '0 5px' }}>{s.favorites.length}</span>
              )}
            </button>
            <button onClick={() => dispatch({ type: 'OPEN_CART' })} className="btn-icon"
              style={{ position: 'relative', width: 38, height: 38, borderRadius: '50%', background: 'transparent', border: 'none', cursor: 'pointer', color: '#1c1c22', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', transition: 'background .15s' }}>
              <svg aria-hidden="true" focusable="false" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M3 4.25a.75.75 0 000 1.5h1.34a.5.5 0 01.49.402l1.873 9.367A2.25 2.25 0 008.948 17.25H17.5a.75.75 0 000-1.5H8.948a.75.75 0 01-.735-.602l-.17-.853 9.31-.97a2.25 2.25 0 001.97-1.74l1.06-4.594A1.25 1.25 0 0019.166 4.5H6.44l-.14-.7A2 2 0 004.34 4.25H3zm3.74 1.75l1.2 6.002 9.06-.945a.75.75 0 00.657-.58l1.013-4.477H6.74z" />
                <path d="M9 20.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM16.5 20.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
              {t.count > 0 && (
                <span key={s.pulse} style={{ position: 'absolute', top: -2, right: -2, background: B, color: '#fff', borderRadius: 999, minWidth: 19, height: 19, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, padding: '0 5px', animation: 'pop .35s ease' }}>{t.count}</span>
              )}
            </button>
          </div>

          {/* Address picker dropdown */}
          {s.addrOpen && (
            <>
              <div onClick={() => dispatch({ type: 'CLOSE_ADDR' })} style={{ position: 'fixed', inset: 0, zIndex: 45, background: 'rgba(15,15,20,.25)' }} />
              <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 46, display: 'flex', justifyContent: 'center', padding: '0 22px', pointerEvents: 'none' }}>
                <div style={{ width: '100%', maxWidth: 700 }}>
                  <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 22px 55px rgba(0,0,0,.22)', padding: '18px 20px 10px', pointerEvents: 'auto', animation: 'modalIn .2s ease' }}>
                    <div style={{ fontSize: 11.5, fontWeight: 700, color: '#8a8a93', marginBottom: 6, paddingLeft: 4 }}>Enter your address</div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #e3e3e6', borderRadius: 12, padding: '11px 14px' }}>
                        <input value={addrInput} onChange={e => setAddrInput(e.target.value)} autoFocus
                          onKeyDown={e => { if (e.key === 'Enter' && addrInput.trim()) dispatch({ type: 'SET_ADDRESS', v: addrInput.trim() }); }}
                          placeholder="Enter your address"
                          style={{ flex: 1, border: 'none', outline: 'none', font: 'inherit', fontSize: 15, color: '#1c1c22', background: 'transparent' }} />
                        {addrInput && (
                          <button onClick={() => setAddrInput('')} aria-label="Clear address" style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#8a8a93', display: 'flex', padding: 0 }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 3a9 9 0 100 18 9 9 0 000-18zM9.53 8.47a.75.75 0 00-1.06 1.06L10.94 12l-2.47 2.47a.75.75 0 101.06 1.06L12 13.06l2.47 2.47a.75.75 0 101.06-1.06L13.06 12l2.47-2.47a.75.75 0 00-1.06-1.06L12 10.94 9.53 8.47z" /></svg>
                          </button>
                        )}
                      </div>
                      <button onClick={saveAddr} className="addr-go" aria-label="Save address"
                        style={{ background: B, color: '#fff', border: 'none', borderRadius: 12, width: 56, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'filter .15s,transform .1s' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
                      </button>
                    </div>

                    {/* Add a label for the address — click a pill to assign it */}
                    <div style={{ marginTop: 14, paddingLeft: 4 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#54545c', marginBottom: 8 }}>Add a Label</div>
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {ADDR_LABELS.map(({ key, text }) => {
                          const on = addrLabel === key;
                          return (
                            <button key={key} type="button" onClick={() => setAddrLabel(key)}
                              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 999, cursor: 'pointer', fontSize: 14, fontWeight: 600, background: on ? '#fdeaf2' : '#fff', color: on ? B : '#1c1c22', border: on ? `1.5px solid ${B}` : '1.5px solid #e3e3e6', transition: 'all .12s' }}>
                              {ADDR_ICONS[key]}{text}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-.3px', margin: '18px 0 4px', paddingLeft: 4 }}>Saved Addresses</div>
                    {saved.length === 0 && (
                      <div style={{ color: '#8a8a93', fontSize: 14, padding: '8px 10px 4px' }}>No saved addresses yet. Type one above, pick a logo, then tap the arrow to save.</div>
                    )}
                    {saved.map(adr => {
                      const selected = s.address === adr.value;
                      return (
                        <div key={adr.id} onClick={() => dispatch({ type: 'SET_ADDRESS', v: adr.value })} className="addr-row"
                          style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 10px', borderRadius: 12, cursor: 'pointer', background: selected ? '#f6f6f7' : 'transparent', transition: 'background .12s' }}>
                          <span style={{ color: '#1c1c22', display: 'flex', flex: 'none' }}>
                            {ADDR_ICONS[adr.icon] || ADDR_ICONS.pin}
                          </span>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 700, fontSize: 15, color: '#1c1c22', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{adr.label}</div>
                            {adr.sub && <div style={{ color: '#54545c', fontSize: 14 }}>{adr.sub}</div>}
                          </div>
                          {selected && (
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={B} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none' }} xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" /><path d="M8.5 12.5l2.5 2.5 4.5-5" /></svg>
                          )}
                          <button onClick={e => { e.stopPropagation(); delAddr(adr.id); }} aria-label="Remove address"
                            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#8a8a93', display: 'flex', flex: 'none', padding: 4 }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M12 3a9 9 0 100 18 9 9 0 000-18zM9.53 8.47a.75.75 0 00-1.06 1.06L10.94 12l-2.47 2.47a.75.75 0 101.06 1.06L12 13.06l2.47 2.47a.75.75 0 101.06-1.06L13.06 12l2.47-2.47a.75.75 0 00-1.06-1.06L12 10.94 9.53 8.47z" /></svg>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Nav row: tabs · search — hidden on restaurant screen */}
          {s.screen !== 'restaurant' && (
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: '0 22px', display: 'flex', alignItems: 'flex-end', gap: 18, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: narrow ? 16 : 26, flex: 'none', overflowX: 'auto' }} className="hide-scroll">
              {[[NavIcons.delivery, 'Delivery', true], [NavIcons.pickup, 'Pick-up', false], [NavIcons.pandamart, 'pandamart', false], [NavIcons.shops, 'Shops', false]].map(([icon, label, active]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, paddingBottom: 12, borderBottom: `2.5px solid ${active ? '#1c1c22' : 'transparent'}`, cursor: 'pointer', fontWeight: active ? 800 : 600, fontSize: 15, color: active ? '#1c1c22' : '#8a8a93' }}>
                  <span style={{ display: 'inline-flex' }}>{icon}</span>{label}
                </div>
              ))}
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: '#f1f1f3', borderRadius: 999, padding: '11px 18px', width: narrow ? '100%' : 420, maxWidth: narrow ? '100%' : '45%', alignSelf: 'center', marginBottom: narrow ? 12 : 8 }}>
              <span style={{ display: 'inline-flex', opacity: .55, flex: 'none' }}>
                <svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M10.5 2C15.1944 2 19 5.80558 19 10.5C19 12.4076 18.3716 14.1684 17.3106 15.5867C17.2902 15.614 17.2661 15.6455 17.2383 15.6811C17.1139 15.8403 17.1279 16.0674 17.2708 16.2102L20.8386 19.7747C21.1316 20.0675 21.1318 20.5424 20.839 20.8354C20.5728 21.1018 20.1562 21.1261 19.8625 20.9084L19.7783 20.8358L16.2103 17.2705C16.0675 17.1279 15.8408 17.114 15.6817 17.2381C15.655 17.2588 15.6311 17.2772 15.6099 17.2932C14.1876 18.3648 12.418 19 10.5 19C5.80558 19 2 15.1944 2 10.5C2 5.80558 5.80558 2 10.5 2ZM10.5 3.5C6.63401 3.5 3.5 6.63401 3.5 10.5C3.5 14.366 6.63401 17.5 10.5 17.5C14.366 17.5 17.5 14.366 17.5 10.5C17.5 6.63401 14.366 3.5 10.5 3.5Z" /></svg>
              </span>
              <input value={s.q} onChange={e => dispatch({ type: 'SET_Q', v: e.target.value })}
                placeholder="Search for restaurants, cuisines, and dishes"
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', font: 'inherit', fontSize: 14.5, color: '#1c1c22' }} />
            </div>
          </div>
          )}
        </header>

        {/* Home */}
        {s.screen === 'home' && (
          <>
            {/* Full-width greeting hero */}
            <div style={{ background: `linear-gradient(115deg, ${BD} 0%, ${B} 60%, #f8579e 100%)`, position: 'relative', overflow: 'visible' }}>
              <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
                {[820, 620, 440, 280].map(d => (
                  <div key={d} style={{ position: 'absolute', bottom: 5 - d / 2, right: 125 - d / 2, width: d, height: d, borderRadius: '50%', background: 'rgba(255,255,255,.055)' }} />
                ))}
              </div>
              <div style={{ maxWidth: 1240, margin: '0 auto', padding: narrow ? '20px 22px 28px' : '24px 22px 40px', position: 'relative' }}>
                <div style={{ marginLeft: compact ? 0 : 266 }}>
                  <h1 style={{ margin: 0, color: '#fff', fontSize: narrow ? 27 : 34, fontWeight: 800, letterSpacing: '-.8px' }}>Good Afternoon</h1>
                  <p style={{ margin: '6px 0 0', color: 'rgba(255,255,255,.95)', fontSize: 18, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 7 }}>Ready for something you&apos;ll love? <span style={{ opacity: .8, fontSize: 15 }}>ⓘ</span></p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginTop: 22, flexWrap: 'wrap' }}>
                    <button onClick={() => dispatch({ type: 'SHUFFLE_HERO' })} className="hero-chip" aria-label="Show me something new"
                      style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,.92)', border: 'none', cursor: 'pointer', color: B, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                      <svg key={s.heroPulse} aria-hidden="true" focusable="false" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ animation: s.heroPulse ? 'spin .5s ease' : 'none' }}><path fillRule="evenodd" clipRule="evenodd" d="M12.0859 3C7.06791 3 3 7.02944 3 12C3 16.9706 7.06791 21 12.0859 21C16.4151 21 20.1183 17.9784 20.9837 13.83C21.0708 13.4127 20.7999 13.0046 20.3787 12.9184C19.9574 12.8322 19.5454 13.1005 19.4584 13.5177C18.7417 16.9531 15.6727 19.4571 12.0859 19.4571C7.92814 19.4571 4.55759 16.1185 4.55759 12C4.55759 7.88153 7.92814 4.54286 12.0859 4.54286C14.4082 4.54286 16.5416 5.59328 17.9458 7.31666C18.0129 7.39907 17.9999 7.51979 17.9167 7.5863C17.8822 7.61384 17.8393 7.62885 17.7951 7.62885L16.7587 7.62857C16.3286 7.62857 15.9799 7.97395 15.9799 8.4C15.9799 8.82605 16.3286 9.17143 16.7587 9.17143H20.4969C20.7263 9.17143 20.9122 8.98723 20.9122 8.76V5.05714C20.9122 4.63109 20.5636 4.28571 20.1334 4.28571C19.7035 4.28571 19.3549 4.63099 19.3549 5.05691L19.3554 6.20997C19.3555 6.2842 19.2947 6.34441 19.2198 6.34444C19.1791 6.34446 19.1406 6.3264 19.1148 6.29523C17.42 4.24684 14.8646 3 12.0859 3Z" /></svg>
                    </button>
                    {s.heroChips.map((c, idx) => {
                      const active = c.chip !== 'All' && c.chip === s.chip;
                      return (
                        <button key={`${s.heroPulse}-${idx}`} onClick={() => { dispatch({ type: 'SET_CHIP', v: c.chip }); document.getElementById('all-rests')?.scrollIntoView({ behavior: 'smooth' }); }} className="hero-chip"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '9px 18px', borderRadius: 999, border: 'none', background: active ? '#1c1c22' : 'rgba(255,255,255,.92)', color: active ? '#fff' : '#1c1c22', font: 'inherit', fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'background .15s,color .15s', animation: 'chipIn .4s ease both', animationDelay: `${(s.heroChips.length - 1 - idx) * 0.07}s` }}>
                          <span style={{ display: 'inline-flex', color: active ? '#ff8fbd' : B }}>
                            <svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M18.8646 10.3406C17.7865 9.79807 16.9701 8.84681 16.5972 7.69874L15.3248 3.78109C14.9865 2.73964 13.5135 2.73964 13.1752 3.78109L11.9028 7.69874C11.5299 8.84681 10.7135 9.79807 9.63541 10.3406L8.12214 11.1022C7.29217 11.5199 7.29275 12.7053 8.12312 13.1222L9.71873 13.9232C10.799 14.4656 11.6172 15.4181 11.9904 16.5681L13.1751 20.2187C13.5132 21.2604 14.9868 21.2604 15.3249 20.2187L16.5096 16.5681C16.8828 15.4181 17.701 14.4656 18.7813 13.9232L20.3769 13.1222C21.2073 12.7053 21.2078 11.5199 20.3779 11.1022L18.8646 10.3406Z" /><path d="M8.50717 5.31615C7.64638 5.02912 6.9709 4.35364 6.68387 3.49285C6.46475 2.83572 5.53525 2.83572 5.31613 3.49285C5.02911 4.35364 4.35363 5.02913 3.49283 5.31615C2.83572 5.53527 2.83572 6.46474 3.49284 6.68386C4.35364 6.97088 5.02912 7.64636 5.31615 8.50716C5.53526 9.16428 6.46474 9.16428 6.68385 8.50716C6.97088 7.64636 7.64636 6.97089 8.50716 6.68386C9.16428 6.46475 9.16429 5.53526 8.50717 5.31615Z" /><path d="M6 19.5C6.82843 19.5 7.5 18.8284 7.5 18C7.5 17.1716 6.82843 16.5 6 16.5C5.17157 16.5 4.5 17.1716 4.5 18C4.5 18.8284 5.17157 19.5 6 19.5Z" /></svg>
                          </span>{c.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              {!compact && (
              <Img src={`${A}/mascot.png`} alt="" style={{ position: 'absolute', right: 48, bottom: 0, width: 230, height: 196, objectFit: 'contain' }}
                fallback={
                  <div style={{ position: 'absolute', right: 80, bottom: 40, width: 168, height: 168, zIndex: 20 }}>
                    <img src="https://images.dhmedia.io/image/foodpanda/web-acquisition/fp/illu_personalised_cuisines.png" alt="" style={{ width: '150%', height: '150%', objectFit: 'contain', position: 'relative', zIndex: 1 }} />
                    {[{ left: 65, top: 44, size: 20, delay: 0 }, { left: 122, top: 22, size: 30, delay: .35 }, { left: 168, top: 58, size: 18, delay: .7 }].map((sp, i) => (
                      <span key={i} style={{ position: 'absolute', left: sp.left, top: sp.top, fontSize: sp.size, color: '#ffc83d', zIndex: 2, animation: `sparkle 1.6s ease-in-out ${sp.delay}s infinite` }}>✦</span>
                    ))}
                  </div>
                } />
              )}
            </div>

            <main style={{ width: '100%', maxWidth: 1240, margin: '0 auto', padding: '0 22px 24px', display: 'flex', gap: 26, alignItems: 'flex-start' }}>

              {/* Left filters — floats up over the hero (hidden on tablet & below) */}
              <aside style={{ display: compact ? 'none' : 'block', width: 240, flex: 'none', marginTop: -200, position: 'sticky', top: 140, alignSelf: 'flex-start' }}>
                <div className="filter-scroll" style={{ background: '#fff', borderRadius: 16, padding: 20, boxShadow: '0 8px 28px rgba(20,20,30,.14)', maxHeight: 'calc(100vh - 108px)', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 16 }}>
                    <span style={{ fontWeight: 800, fontSize: 19 }}>Filters</span>
                    <span onClick={() => dispatch({ type: 'CLEAR_FILTERS' })} className="clear-all" style={{ fontSize: 13, fontWeight: 700, color: '#1c1c22', cursor: 'pointer' }}>Clear all</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#8a8a93', marginBottom: 8 }}>Sort by</div>
                  {['Relevance', 'Fastest Delivery', 'Distance', 'Top rated'].map((o) => {
                    const on = s.sort === o;
                    return (
                      <label key={o} onClick={() => dispatch({ type: 'SET_SORT', v: o })} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '10px 0', fontSize: 14.5, fontWeight: on ? 600 : 500, color: '#2b2b30', cursor: 'pointer' }}>
                        <span style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${on ? '#1c1c22' : '#d2d2d8'}`, background: on ? '#1c1c22' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                          {on && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff' }} />}
                        </span>
                        {o}
                      </label>
                    );
                  })}
                  <div style={{ height: 1, background: '#f1f1f3', margin: '15px 0' }} />
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#8a8a93', marginBottom: 11 }}>Quick filters</div>
                  <span onClick={() => dispatch({ type: 'TOGGLE_RATING' })} className="fchip" style={{ display: 'inline-block', border: `1.5px solid ${s.minRating ? '#1c1c22' : '#d9d9de'}`, background: s.minRating ? '#1c1c22' : 'transparent', color: s.minRating ? '#fff' : '#1c1c22', borderRadius: 999, padding: '7px 15px', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', transition: 'all .15s' }}>Ratings 4+</span>
                  <div style={{ height: 1, background: '#f1f1f3', margin: '15px 0' }} />
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#8a8a93', marginBottom: 11 }}>Offers</div>
                  <label onClick={() => dispatch({ type: 'TOGGLE_VOUCHERS' })} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, cursor: 'pointer' }}>
                    <span style={{ width: 18, height: 18, borderRadius: 5, border: `2px solid ${s.vouchers ? '#1c1c22' : '#cfcfd6'}`, background: s.vouchers ? '#1c1c22' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', transition: 'all .15s' }}>
                      {s.vouchers && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M5 12.5l4.5 4.5L19 7" /></svg>}
                    </span>
                    Accepts vouchers
                  </label>
                  <div style={{ height: 1, background: '#f1f1f3', margin: '15px 0' }} />
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#8a8a93', marginBottom: 11 }}>Price</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {['₱', '₱₱', '₱₱₱'].map((p, i) => {
                      const lvl = i + 1;
                      const on = s.priceLevels.includes(lvl);
                      return (
                      <span key={p} onClick={() => dispatch({ type: 'TOGGLE_PRICE', v: lvl })} className="fchip" style={{ flex: 1, textAlign: 'center', border: `1.5px solid ${on ? '#1c1c22' : '#d9d9de'}`, background: on ? '#1c1c22' : 'transparent', color: on ? '#fff' : '#1c1c22', borderRadius: 999, padding: '7px 0', fontSize: 13.5, fontWeight: 700, cursor: 'pointer', transition: 'all .15s' }}>{p}</span>
                      );
                    })}
                  </div>
                </div>
              </aside>

              {/* Right content */}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 30, paddingTop: 22 }}>


              {/* Your daily deals */}
              <section>
                <h2 style={{ margin: '0 0 18px', fontSize: 26, fontWeight: 800, letterSpacing: '-.5px' }}>Your daily deals</h2>
                <ScrollRow gap={18}>
                  {DEALS.map((d, i) => (
                    <div key={i} style={{ flex: 'none', width: 272, height: 124, borderRadius: 14, overflow: 'hidden', cursor: 'pointer' }}>
                      <Img src={`${A}/deals/${d.img}.png`} alt="deal" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} fallback={<div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 54, opacity: .9, color: '#fff' }}>🍱</div>} />
                    </div>
                  ))}
                </ScrollRow>
              </section>

              {/* Top brands */}
              <section>
                <h2 style={{ margin: '0 0 18px', fontSize: 26, fontWeight: 800, letterSpacing: '-.5px' }}>Top brands</h2>
                <ScrollRow gap={16}>
                  {TOP_BRANDS.map(id => {
                    const r = RESTAURANTS.find(x => x.id === id);
                    if (!r) return null;
                    return (
                      <div key={id} onClick={() => { dispatch({ type: 'OPEN_REST', id }); window.scrollTo(0, 0); }} className="brand-item"
                        style={{ flex: 'none', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                        <Img src={`${A}/brands/${id}.webp`} alt={r.name} className="brand-logo" style={{ width: 64, height: 64, objectFit: 'contain' }}
                          fallback={<div style={{ width: 64, height: 64, borderRadius: 12, background: r.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>{r.emoji}</div>} />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 15 }}>{r.name}</div>
                          <div style={{ fontSize: 13, color: '#8a8a93', marginTop: 2 }}>{r.time.split('–')[0]} min</div>
                        </div>
                      </div>
                    );
                  })}
                </ScrollRow>
              </section>

              {/* All restaurants */}
              <section id="all-rests">
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 18 }}>
                  <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: '-.5px' }}>{s.chip === 'All' ? 'All restaurants' : s.chip}</h2>
                  <span style={{ fontSize: 13, color: '#8a8a93', fontWeight: 600 }}>{visibleRestaurants.length} {visibleRestaurants.length === 1 ? 'place' : 'places'}</span>
                </div>

                {visibleRestaurants.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '70px 20px', color: '#8a8a93' }}>
                    <div style={{ fontSize: 46 }}>🍽️</div>
                    <div style={{ fontWeight: 700, fontSize: 17, color: '#1c1c22', marginTop: 10 }}>No restaurants found</div>
                    <div style={{ fontSize: 14, marginTop: 4 }}>Try a different search or category.</div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: narrow ? '1fr' : 'repeat(auto-fill,minmax(280px,1fr))', gap: narrow ? 18 : 24 }}>
                    {visibleRestaurants.map(r => (
                      <RestCard key={r.id} r={r} isFav={s.favorites.includes(r.id)}
                        onOpen={() => { dispatch({ type: 'OPEN_REST', id: r.id }); window.scrollTo(0, 0); }}
                        onFav={() => toggleFav(r.id)} B={B} BD={BD} />
                    ))}
                  </div>
                )}
              </section>
            </div>
          </main>
          </>
        )}

        {/* Favourites */}
        {s.screen === 'favorites' && (
          <main style={{ width: '100%', maxWidth: 1240, margin: '0 auto', padding: narrow ? '26px 22px 40px' : '34px 22px 48px', minHeight: 'calc(100vh - 122px)', display: 'flex', flexDirection: 'column' }}>
            <h1 style={{ margin: '0 0 26px', fontSize: narrow ? 28 : 34, fontWeight: 800, letterSpacing: '-.8px' }}>My Favourites</h1>
            {favRestaurants.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: '#54545c', paddingBottom: 40 }}>
                <img src="https://micro-assets.foodora.com/img/no-favorites-fp.svg" alt="No favourites found" style={{ width: 180, height: 180, margin: '0 auto 22px', display: 'block', objectFit: 'contain' }} />
                <div style={{ fontWeight: 800, fontSize: 21, color: '#1c1c22' }}>No Favourites Saved</div>
                <div style={{ fontSize: 15, marginTop: 8, lineHeight: 1.5, maxWidth: 440, marginInline: 'auto' }}>
                  You&apos;ll see all your favourites here, to make ordering even faster. Just look for the <span style={{ color: B }}>♥</span>
                </div>
                <button onClick={() => { dispatch({ type: 'RESET_HOME' }); window.scrollTo(0, 0); }} className="ghost-btn"
                  style={{ marginTop: 22, background: '#fff', border: '1.5px solid #d9d9de', borderRadius: 12, padding: '12px 22px', font: 'inherit', fontWeight: 700, fontSize: 14.5, color: '#1c1c22', cursor: 'pointer', transition: 'background .15s' }}>
                  Let&apos;s find some favourites
                </button>
              </div>
            ) : (
              <div style={{ width: '100%', display: 'grid', gridTemplateColumns: narrow ? '1fr' : 'repeat(auto-fill,minmax(280px,1fr))', gap: narrow ? 18 : 24 }}>
                {favRestaurants.map(r => (
                  <RestCard key={r.id} r={r} isFav
                    onOpen={() => { dispatch({ type: 'OPEN_REST', id: r.id }); window.scrollTo(0, 0); }}
                    onFav={() => toggleFav(r.id)} B={B} BD={BD} />
                ))}
              </div>
            )}
          </main>
        )}

        {/* Restaurant */}
        {s.screen === 'restaurant' && R && (
          <main style={{ background: '#fff', minHeight: '70vh' }}>
            <div style={{ maxWidth: 1240, margin: '0 auto', padding: compact ? '0 18px' : '0 24px' }}>

              {/* Breadcrumb */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '18px 0 2px', fontSize: 13.5, color: '#8a8a93', flexWrap: 'wrap' }}>
                <span onClick={() => { dispatch({ type: 'GO_HOME' }); window.scrollTo(0, 0); }} style={{ color: '#1c1c22', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Makati City</span>
                <span>›</span>
                <span onClick={() => { dispatch({ type: 'GO_HOME' }); window.scrollTo(0, 0); }} style={{ color: '#1c1c22', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Restaurant List</span>
                <span>›</span>
                <span>{R.name}</span>
              </div>

              {/* Header */}
              <div style={{ display: 'flex', gap: narrow ? 16 : 24, alignItems: 'flex-start', padding: '14px 0 22px', borderBottom: '1px solid #ececef' }}>
                <div style={{ width: narrow ? 100 : 158, height: narrow ? 100 : 158, borderRadius: 14, overflow: 'hidden', flex: 'none', boxShadow: '0 2px 10px rgba(0,0,0,.10)', background: '#fff' }}>
                  <Img src={`${A}/brands/${R.id}.webp`} alt={R.name} style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
                    fallback={<div style={{ width: '100%', height: '100%', background: R.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: narrow ? 46 : 70 }}>{R.emoji}</div>} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#8a8a93', fontSize: 13.5, fontWeight: 600 }}>{R.cuisines.join(' · ')}</div>
                  <h1 style={{ margin: '8px 0 0', fontSize: narrow ? 24 : 34, fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.1 }}>{R.name}</h1>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, fontSize: 13.5, color: '#54545c', flexWrap: 'wrap' }}>
                    <span>₱ {R.fee} delivery or <span style={{ color: B, fontWeight: 700 }}>free with ₱200 spend</span></span>
                    <span style={{ opacity: .4 }}>•</span>
                    <span style={{ fontWeight: 600 }}>Min. order ₱129</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginTop: 12, fontSize: 13.5, color: '#54545c', flexWrap: 'wrap' }}>
                    <span style={{ color: '#f5a623', fontWeight: 800 }}>★ {R.rating.toFixed(1)}/5</span>
                    <span style={{ color: '#8a8a93' }}>(20000+)</span>
                    <span style={{ color: '#1c1c22', fontWeight: 700, textDecoration: 'underline', cursor: 'pointer' }}>See reviews</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginLeft: 6, color: '#8a8a93', cursor: 'pointer' }}>ⓘ More info</span>
                  </div>
                </div>
                <button onClick={() => toggleFav(R.id)} className="ghost-btn"
                  style={{ flex: 'none', display: narrow ? 'none' : 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 18px', borderRadius: 12, border: '1.5px solid #ececef', background: '#fff', cursor: 'pointer', font: 'inherit', fontWeight: 700, fontSize: 14, color: s.favorites.includes(R.id) ? B : '#1c1c22', transition: 'all .15s' }}>
                  <svg aria-hidden="true" focusable="false" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M18.338 4.438c2.764 1.316 4.015 4.757 2.795 7.686-1.548 3.243-4.436 5.835-8.665 7.776-.254.114-.543.13-.807.05l-.13-.05c-4.228-1.94-7.116-4.533-8.664-7.776-1.22-2.93.031-6.37 2.795-7.686 1.89-.9 3.826-.315 5.378.855.112.084.246.195.403.333l.286.257a.4.4 0 00.542 0l.315-.283c.145-.125.27-.228.374-.307 1.555-1.171 3.49-1.754 5.378-.855zm-.644 1.355c-1.178-.56-2.506-.3-3.831.699l-.151.12c-.115.096-.258.222-.427.376-.207.19-.553.467-1.038.83a.4.4 0 01-.487-.007 99.836 99.836 0 00-.909-.708l-.13-.11-.158-.143a7.024 7.024 0 00-.426-.36c-1.323-.997-2.652-1.258-3.83-.697-2.032.966-2.972 3.553-2.086 5.685 1.335 2.798 3.822 5.087 7.52 6.863l.259.122.259-.121c3.561-1.711 5.998-3.895 7.34-6.493l.149-.301c.888-2.133.034-4.627-1.867-5.66l-.187-.095z" /></svg>
                  {s.favorites.includes(R.id) ? 'Saved to favorites' : 'Add to favorites'}
                </button>
              </div>

              {/* Available deals */}
              <div style={{ padding: '24px 0 6px' }}>
                <h2 style={{ margin: '0 0 16px', fontSize: 22, fontWeight: 800, letterSpacing: '-.5px' }}>Available deals</h2>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <div style={{ width: 280, maxWidth: '100%', background: '#1c1c22', color: '#fff', borderRadius: 14, padding: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 14 }}>
                      <span style={{ width: 18, height: 18, borderRadius: '50%', background: B, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flex: 'none' }}>%</span>
                      App-only deals
                    </div>
                    <div style={{ marginTop: 8, fontSize: 13, color: '#c9c9cf', lineHeight: 1.45 }}>Download the app to unlock more discounts</div>
                  </div>
                  <div style={{ width: 280, maxWidth: '100%', background: '#f6efff', borderRadius: 14, padding: 18 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 800, fontSize: 14 }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, color: '#6c2bd9', fontWeight: 800, fontSize: 10.5, background: '#e8ddff', padding: '2px 6px', borderRadius: 6, flex: 'none' }}>PRO</span>
                      Free delivery
                    </div>
                    <div style={{ marginTop: 8, fontSize: 13, color: '#54545c', lineHeight: 1.45 }}>Valid for all items. Auto applied.</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky search + category tabs */}
            <div style={{ position: 'sticky', top: 62, zIndex: 20, background: '#fff', borderBottom: '1px solid #ececef', boxShadow: '0 4px 10px rgba(0,0,0,.03)', marginTop: 18 }}>
              <div style={{ maxWidth: 1240, margin: '0 auto', padding: compact ? '0 18px' : '0 24px', display: 'flex', alignItems: 'center', gap: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: '#f5f5f6', borderRadius: 999, padding: '9px 15px', width: narrow ? 150 : 230, flex: 'none', margin: '10px 0' }}>
                  <svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style={{ flex: 'none', color: '#8a8a93' }}>
                    <path fillRule="evenodd" clipRule="evenodd" fill="currentColor" d="M9.96564 11.0279C9.13594 11.6401 8.11023 12.002 7 12.002C4.23858 12.002 2 9.76338 2 7.00195C2 4.24053 4.23858 2.00195 7 2.00195C9.76142 2.00195 12 4.24053 12 7.00195C12 8.11221 11.6381 9.13795 11.0259 9.96766C11.031 9.97246 11.036 9.97734 11.0409 9.9823L13.7803 12.7216C14.0732 13.0145 14.0732 13.4894 13.7803 13.7823C13.4874 14.0752 13.0125 14.0752 12.7196 13.7823L9.98029 11.043C9.97532 11.038 9.97044 11.033 9.96564 11.0279ZM10.5 7.00195C10.5 8.93495 8.933 10.502 7 10.502C5.067 10.502 3.5 8.93495 3.5 7.00195C3.5 5.06896 5.067 3.50195 7 3.50195C8.933 3.50195 10.5 5.06896 10.5 7.00195Z" />
                  </svg>
                  <input value={s.menuQ} onChange={e => dispatch({ type: 'SET_MENU_Q', v: e.target.value })} placeholder="Search in menu" className="menu-search"
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', font: 'inherit', fontSize: 14, color: '#1c1c22' }} />
                </div>
                <MenuCats key={R.id} R={R} />
              </div>
            </div>

            {/* Body: menu grid + cart sidebar */}
            <div style={{ maxWidth: 1240, margin: '0 auto', padding: compact ? '4px 18px 44px' : '4px 24px 44px', display: 'flex', gap: 28, alignItems: 'flex-start' }}>
              <div className="menu-col" style={{ flex: 1, minWidth: 0 }}>
                <MenuItems R={R} cart={s.cart} cartRid={s.cartRid} menuQ={s.menuQ} dispatch={dispatch} add={add} B={B} BD={BD} BT={BT} />
              </div>

              {!compact && (
                <aside style={{ width: 340, flex: 'none', position: 'sticky', top: 128 }}>
                  <div style={{ border: '1px solid #ececef', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 18px rgba(0,0,0,.05)' }}>
                    {t.count === 0 ? (
                      <div style={{ padding: '32px 22px 26px', textAlign: 'center' }}>
                        <Img src={`${A}/cart-empty.webp`} alt="" style={{ width: 96, height: 96, objectFit: 'contain', margin: '0 auto', display: 'block' }}
                          fallback={<div style={{ fontSize: 64 }}>🧺</div>} />
                        <div style={{ fontWeight: 800, fontSize: 19, marginTop: 12 }}>Hungry?</div>
                        <div style={{ color: '#8a8a93', fontSize: 14, marginTop: 4, lineHeight: 1.4 }}>You haven&apos;t added anything<br />to your cart!</div>
                      </div>
                    ) : (
                      <div style={{ padding: '18px 18px 4px', maxHeight: 360, overflowY: 'auto' }}>
                        <div style={{ fontWeight: 800, fontSize: 17, marginBottom: 10, letterSpacing: '-.3px' }}>Your order</div>
                        {Object.keys(s.cart).map(id => {
                          const m = ITEMS[id], qty = s.cart[id];
                          return (
                            <div key={id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '11px 0', borderBottom: '1px solid #f1f1f3' }}>
                              <div style={{ width: 48, height: 48, borderRadius: 10, overflow: 'hidden', flex: 'none', background: '#f1f1f3' }}>
                                {m.img && <Img src={m.img} alt={m.name} style={{ width: 48, height: 48, objectFit: 'cover', display: 'block' }} fallback={<div style={{ width: 48, height: 48 }} />} />}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontWeight: 700, fontSize: 13.5, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.name}</div>
                                {m.desc && <div style={{ color: '#8a8a93', fontSize: 12, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.desc}</div>}
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 6 }}>
                                  <span style={{ fontWeight: 800, fontSize: 13, color: '#1c1c22', fontVariantNumeric: 'tabular-nums' }}>{peso(m.price * qty)}</span>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #ececef', borderRadius: 999, padding: '5px 10px', boxShadow: '0 1px 3px rgba(0,0,0,.06)', flex: 'none' }}>
                                    <button onClick={() => dispatch({ type: 'DEC', id })} className="stepper-dec" aria-label={qty === 1 ? `Remove ${m.name}` : `Decrease ${m.name}`}
                                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, border: 'none', background: 'transparent', color: '#1c1c22', cursor: 'pointer', padding: 0 }}>
                                      {qty === 1 ? (
                                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M10 11v6M14 11v6" /></svg>
                                      ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ fill: 'currentColor' }}><path d="M5.75 11.25h12.5a.75.75 0 0 1 0 1.5H5.75a.75.75 0 0 1 0-1.5Z" /></svg>
                                      )}
                                    </button>
                                    <span style={{ minWidth: 14, textAlign: 'center', fontWeight: 800, fontSize: 13.5, fontVariantNumeric: 'tabular-nums' }}>{qty}</span>
                                    <button onClick={() => dispatch({ type: 'INC', id })} className="stepper-inc" aria-label={`Increase ${m.name}`}
                                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, border: 'none', background: 'transparent', color: '#1c1c22', cursor: 'pointer', padding: 0 }}>
                                      <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ fill: 'currentColor' }}><path fillRule="evenodd" clipRule="evenodd" d="M12 5C12.3797 5 12.6935 5.28215 12.7432 5.64823L12.75 5.75V10.85C12.75 11.0709 12.9291 11.25 13.15 11.25H18.25C18.6642 11.25 19 11.5858 19 12C19 12.3797 18.7178 12.6935 18.3518 12.7432L18.25 12.75H13.15C12.9291 12.75 12.75 12.9291 12.75 13.15V18.25C12.75 18.6642 12.4142 19 12 19C11.6203 19 11.3065 18.7178 11.2568 18.3518L11.25 18.25V13.15C11.25 12.9291 11.0709 12.75 10.85 12.75H5.75C5.33579 12.75 5 12.4142 5 12C5 11.6203 5.28215 11.3065 5.64823 11.2568L5.75 11.25H10.85C11.0709 11.25 11.25 11.0709 11.25 10.85V5.75C11.25 5.33579 11.5858 5 12 5Z" /></svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <div style={{ borderTop: '1px solid #ececef', padding: '16px 18px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: '#54545c', marginBottom: 14, lineHeight: 1.4 }}>
                        <span style={{ width: 18, height: 18, borderRadius: '50%', background: B, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flex: 'none' }}>%</span>
                        Free delivery with ₱200 and above. Let&apos;s go!
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 14 }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: 15 }}>Total <span style={{ fontWeight: 500, color: '#8a8a93', fontSize: 11.5 }}>(incl. fees and tax)</span></div>
                          <span style={{ textDecoration: 'underline', fontSize: 12.5, color: '#1c1c22', cursor: 'pointer' }}>See summary</span>
                        </div>
                        <span style={{ fontWeight: 800, fontSize: 19, fontVariantNumeric: 'tabular-nums' }}>{peso(t.total)}</span>
                      </div>
                      <button disabled={t.count === 0} onClick={() => { dispatch({ type: 'GO_CHECKOUT' }); window.scrollTo(0, 0); }} className={t.count === 0 ? '' : 'btn-brand'}
                        style={{ width: '100%', background: t.count === 0 ? '#e7e7ea' : B, color: t.count === 0 ? '#a0a0a8' : '#fff', border: 'none', borderRadius: 12, padding: 14, font: 'inherit', fontWeight: 800, fontSize: 15, cursor: t.count === 0 ? 'default' : 'pointer', boxShadow: t.count === 0 ? 'none' : `0 8px 20px ${BG}`, transition: 'filter .15s,transform .1s' }}>
                        Review payment and address
                      </button>
                    </div>
                  </div>
                </aside>
              )}
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

        {/* Footer */}
        <footer style={{ background: '#fff', borderTop: '1px solid #ececef', marginTop: 'auto' }}>
          <div style={{ maxWidth: 1240, margin: '0 auto', padding: narrow ? '20px 22px' : '22px 22px', display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
            {/* Left: brand lockup */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: '1 1 auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="26" height="26" aria-hidden="true" focusable="false">
                  <path d="M35 0H5C2.24 0 0 2.24 0 5v30c0 2.76 2.24 5 5 5h30c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5Z" fill="#ff2b85" />
                  <path d="M14.58 17.53c.41-.04.71-.4.68-.81a.756.756 0 0 0-.81-.68c-.39.03-.68.35-.68.74.02.43.38.76.81.75Zm10.44-1.33c.12-.09.25-.14.4-.16.43-.02.79.32.81.75 0 .41-.33.75-.75.75s-.75-.33-.75-.75c0-.23.11-.45.29-.59Z" fill="#fff" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M33.51 14.52v-.03c-.15-.3-.1-.65.12-.9a4.983 4.983 0 0 0 .89-4.78c-.06-.19-.34-.24-.61-.29-.26-.05-.52-.09-.62-.26-.09-.15-.06-.38 0-.63.02-.07.03-.13.04-.2.05-.26.07-.51-.06-.64s-.28-.26-.42-.37l-.09-.07c-1-.74-2.23-1.1-3.47-1.03-1.08.05-2.23.41-3.06 1.14-.4.29-.92.37-1.39.22l-.07-.02c-.84-.3-1.7-.52-2.58-.66a14.28 14.28 0 0 0-6.95.66h-.05c-.45.18-.96.1-1.35-.19-1.55-1.37-4.68-1.71-6.72.01-2.23 1.88-2.36 5.17-.71 7.1.22.25.26.6.12.9-.98 2-1.5 4.2-1.51 6.43 0 7.97 6.72 13.77 15 13.77 8.28 0 15-5.8 15-13.77 0-2.22-.52-4.41-1.49-6.41 0 0 0 .02-.01.02h-.01ZM19.9 20.19c1.19 0 2.15.26 2.15.72 0 .46-.96 1.5-2.15 1.5s-2.15-1.04-2.15-1.5c0-.46.96-.72 2.15-.72ZM7.86 11.8a.578.578 0 0 1-.18-.2c-.02-.03-.04-.07-.06-.1-.36-.66-.45-1.44-.23-2.16.42-1.41 1.92-2.24 3.35-2.05.37.05.74.17 1.07.35.14.08.26.17.37.28.04.04.08.09.1.15.02.09 0 .18-.07.25-.06.06-.14.11-.22.15-1.37.8-2.49 1.95-3.52 3.14-.17.19-.35.37-.61.19Zm3.66 11.33c-1.24-.14-2.32-1.45-2.73-2.77-.18-.58-.61-3.26 1.31-5.2.64-.64 1.54-1.21 2.79-1.59.41-.1.82-.15 1.24-.15.62 0 1.36.1 1.95.53 1.24.91 1.26 2.44.52 3.23s-2.4 2.59-2.83 4.06c-.42 1.47-1.01 2.04-2.26 1.9 0 0 .01-.01.01 0v-.01Zm8.4 4.43h-.04c-2.39-.01-4.32-1.7-4.32-3.4 0-.59.26-.89.89-.73.37.09 1.89.48 3.27.48h.35c1.35 0 2.82-.37 3.24-.48h.03c.64-.16.89.14.89.72 0 1.7-1.93 3.39-4.32 3.4h.01v.01Zm11.09-7.22c-.41 1.32-1.49 2.63-2.73 2.77-1.24.14-1.83-.42-2.26-1.9-.43-1.47-2.09-3.28-2.83-4.07-.74-.78-.72-2.32.52-3.23.58-.43 1.33-.53 1.95-.53.42 0 .83.05 1.24.15 1.25.38 2.15.94 2.79 1.58 1.92 1.94 1.49 4.62 1.31 5.2 0 0 .01.03 0 .03h.01Zm1.37-8.84-.06.1a.86.86 0 0 1-.18.2c-.26.18-.44 0-.61-.19-1.03-1.19-2.15-2.34-3.52-3.14a1.07 1.07 0 0 1-.22-.15.33.33 0 0 1-.08-.25c.02-.06.05-.11.1-.15.11-.11.23-.21.37-.28.33-.18.7-.3 1.07-.35 1.43-.19 2.93.64 3.35 2.05.21.72.13 1.5-.23 2.16h.01Z" fill="#fff" />
                </svg>
                <span style={{ fontWeight: 800, fontSize: 19, letterSpacing: '-.5px', color: '#ff2b85' }}>poodfanda</span>
              </div>
              <span style={{ width: 1, height: 22, background: '#d9d9de', flex: 'none' }} />
              <svg width="160" height="32" viewBox="0 0 300 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ flex: 'none' }}><mask id="mask0_1088_35094" maskUnits="userSpaceOnUse" x="0" y="10" width="62" height="45" style={{ maskType: 'luminance' }}><path fillRule="evenodd" clipRule="evenodd" d="M0 10H61.7303V55H0V10Z" fill="white"></path></mask><g mask="url(#mask0_1088_35094)"><path fillRule="evenodd" clipRule="evenodd" d="M52.503 31.1474C52.488 31.1544 52.48 31.1614 52.468 31.1664L46.336 33.6684L46.149 33.7534L44.655 40.5824C44.555 40.8154 44.257 40.8704 44.056 40.6754L39.589 35.3934L39.567 35.3784L14.379 46.1874C14.357 46.1994 14.332 46.2044 14.308 46.2044C14.214 46.2044 14.139 46.1294 14.139 46.0344C14.139 45.9804 14.165 45.9304 14.207 45.8994L35.984 29.5984L33.229 23.3084C33.091 23.0214 33.345 22.7164 33.682 22.8004H33.685L40.357 24.4454L45.538 19.8334V19.8344C45.763 19.6594 46.066 19.7844 46.122 20.0604L46.629 26.9904L52.604 30.4854C52.86 30.6494 52.823 31.0274 52.503 31.1474M49.458 11.3434C41.728 8.31042 33.226 10.5874 27.979 16.4184L7.50504 38.3504C7.23004 38.6454 7.35704 39.0154 7.69304 39.0654L13.147 39.4004C13.584 39.4274 13.638 39.8024 13.418 40.0604L0.0850411 54.4424C-0.145959 54.6924 0.133041 55.0834 0.451041 54.9844L19.487 48.9694C19.89 48.8314 20.2 49.1894 20.029 49.5034L17.483 54.0054C17.352 54.2624 17.599 54.6144 17.919 54.5904L45.363 48.4774C51.922 47.4394 57.776 43.0624 60.379 36.4354C64.298 26.4884 59.401 15.2554 49.458 11.3434" fill="#D61F26"></path></g><path fillRule="evenodd" clipRule="evenodd" d="M123.031 44.7135H116.777L121.67 21.7975L128.49 19.2905L123.031 44.7135Z" fill="#D61F26"></path><path fillRule="evenodd" clipRule="evenodd" d="M109.598 31.5875C108.101 31.5875 107.24 32.8265 106.89 34.2645C109.851 34.2645 110.747 33.3395 110.747 32.5715C110.747 32.0325 110.265 31.5875 109.598 31.5875M106.19 38.2775C106.156 38.4355 106.124 38.7255 106.124 38.8825C106.124 39.9035 106.823 40.2525 108.675 40.2525C110.33 40.2525 112.687 39.8385 114.059 39.3615V44.0465C112.307 44.6835 109.563 45.0325 107.365 45.0325C102.202 45.0325 99.7168 43.6295 99.7168 38.9475C99.7168 34.3525 101.851 27.1855 110.077 27.1855C115.3 27.1855 116.861 29.5475 116.861 32.0325C116.861 35.2505 114.091 37.9905 106.19 38.2775" fill="#D61F26"></path><path fillRule="evenodd" clipRule="evenodd" d="M134.389 26.365C132.257 26.365 130.885 24.995 130.885 23.114C130.885 20.66 132.607 19.29 134.739 19.29C136.907 19.29 138.247 20.66 138.247 22.509C138.247 24.995 136.557 26.365 134.389 26.365" fill="#D61F26"></path><path fillRule="evenodd" clipRule="evenodd" d="M130.001 27.7627H136.438L133.183 44.4607H126.682L128.975 32.7347" fill="#D61F26"></path><path fillRule="evenodd" clipRule="evenodd" d="M154.983 27.7627C152.751 33.3717 150.296 38.8517 147.174 44.4607H139.206C138.187 39.1687 137.74 33.5927 137.869 27.7627H144.372C144.241 30.5027 144.275 33.3087 144.431 35.9177C144.465 36.6197 144.531 37.2877 144.592 37.9617H144.629C144.913 37.2877 145.229 36.6197 145.517 35.9177C146.631 33.1737 147.651 30.1867 148.421 27.7627H154.983Z" fill="#D61F26"></path><path fillRule="evenodd" clipRule="evenodd" d="M163.682 31.5875C162.187 31.5875 161.322 32.8265 160.968 34.2645C163.937 34.2645 164.829 33.3395 164.829 32.5715C164.829 32.0325 164.353 31.5875 163.682 31.5875M160.274 38.2775C160.243 38.4355 160.206 38.7255 160.206 38.8825C160.206 39.9035 160.911 40.2525 162.756 40.2525C164.414 40.2525 166.773 39.8385 168.143 39.3615V44.0465C166.389 44.6835 163.649 45.0325 161.452 45.0325C156.286 45.0325 153.801 43.6295 153.801 38.9475C153.801 34.3525 155.935 27.1855 164.16 27.1855C169.386 27.1855 170.945 29.5475 170.945 32.0325C170.945 35.2505 168.177 37.9905 160.274 38.2775" fill="#D61F26"></path><path fillRule="evenodd" clipRule="evenodd" d="M183.445 33.656C183.091 33.56 182.389 33.463 181.881 33.463C180.445 33.463 179.298 34.899 178.786 37.544L177.454 44.461H170.945L174.202 27.763H179.079L179.237 29.989C180.733 28.143 181.915 27.186 183.73 27.186C184.557 27.186 185.005 27.249 185.225 27.314L183.445 33.656Z" fill="#D61F26"></path><path fillRule="evenodd" clipRule="evenodd" d="M203.774 27.7627C200.903 35.2197 198.355 40.6687 195.805 44.4317C192.109 49.9467 188.857 51.2207 185.508 51.2207C184.52 51.2207 183.47 50.9617 182.959 50.7077L183.981 45.8967H186.212C187.328 45.8967 187.803 45.4477 188.539 44.4607C187.295 39.9687 186.688 33.6907 186.752 27.7627H193.288C193.155 30.4687 193.189 33.2767 193.351 35.8247C193.383 36.5547 193.443 37.2577 193.506 37.9617H193.541C193.827 37.2877 194.143 36.6197 194.433 35.8877C195.517 33.2417 196.571 30.2137 197.267 27.7627H203.774Z" fill="#D61F26"></path><path fillRule="evenodd" clipRule="evenodd" d="M228.765 44.4609H221.908L223.535 36.0449H217.732L216.105 44.4609H209.256L213.589 22.2139H220.444L218.883 30.1519H224.684L226.245 22.2139H233.094L228.765 44.4609Z" fill="#D61F26"></path><path fillRule="evenodd" clipRule="evenodd" d="M242.271 31.5875C240.773 31.5875 239.915 32.8265 239.564 34.2645C242.529 34.2645 243.424 33.3395 243.424 32.5715C243.424 32.0325 242.941 31.5875 242.271 31.5875M238.862 38.2775C238.829 38.4355 238.8 38.7255 238.8 38.8825C238.8 39.9035 239.502 40.2525 241.346 40.2525C243.006 40.2525 245.365 39.8385 246.735 39.3615V44.0465C244.983 44.6835 242.241 45.0325 240.04 45.0325C234.876 45.0325 232.391 43.6295 232.391 38.9475C232.391 34.3525 234.527 27.1855 242.75 27.1855C247.978 27.1855 249.542 29.5475 249.542 32.0325C249.542 35.2505 246.763 37.9905 238.862 38.2775" fill="#D61F26"></path><path fillRule="evenodd" clipRule="evenodd" d="M262.031 33.656C261.681 33.56 260.985 33.463 260.472 33.463C259.039 33.463 257.889 34.899 257.38 37.544L256.04 44.461H249.543L252.79 27.763H257.665L257.826 29.989C259.325 28.143 260.501 27.186 262.316 27.186C263.149 27.186 263.593 27.249 263.819 27.314L262.031 33.656Z" fill="#D61F26"></path><mask id="mask1_1088_35094" maskUnits="userSpaceOnUse" x="262" y="27" width="20" height="19" style={{ maskType: 'luminance' }}><path fillRule="evenodd" clipRule="evenodd" d="M262.734 27.1851H281.091V45.0321H262.734V27.1851Z" fill="white"></path></mask><g mask="url(#mask1_1088_35094)"><path fillRule="evenodd" clipRule="evenodd" d="M272.709 32.3181C270.096 32.3181 269.394 36.3011 269.394 38.0881C269.394 39.5211 269.999 39.9341 271.182 39.9341C273.759 39.9341 274.428 35.9491 274.428 34.1371C274.428 32.7341 273.856 32.3181 272.709 32.3181M270.283 45.0321C265.218 45.0321 262.734 42.8641 262.734 38.5311C262.734 33.7181 265.124 27.1851 273.54 27.1851C278.574 27.1851 281.091 29.4171 281.091 33.6901C281.091 38.5981 278.699 45.0321 270.283 45.0321" fill="#D61F26"></path></g><path fillRule="evenodd" clipRule="evenodd" d="M85.7605 39.1688H84.4855L86.7785 27.4398H88.5665C91.2735 27.4398 92.2615 29.0398 92.2615 31.2328C92.2615 35.6658 89.8035 39.1688 85.7605 39.1688V39.1688ZM91.8335 27.8558L96.1665 23.6978C94.4765 22.6808 92.1565 22.2148 89.2625 22.2148H87.7985H80.9775L76.6465 44.4618H83.4615H85.2845C95.3205 44.4618 99.3325 37.4498 99.3325 30.1518C99.3325 28.2568 98.9255 26.7408 98.1375 25.5628L91.8335 27.8558Z" fill="#D61F26"></path></svg>
            </div>
            {/* Right: socials */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 'none' }}>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="btn-icon"
                style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid #d9d9de', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1c1c22', transition: 'background .15s,color .15s' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="btn-icon"
                style={{ width: 38, height: 38, borderRadius: '50%', border: '1px solid #d9d9de', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1c1c22', transition: 'background .15s,color .15s' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 21v-7h2.4l.4-2.8h-2.8V9.4c0-.8.2-1.4 1.4-1.4h1.5V5.5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.1H8v2.8h2.5V21h3z" /></svg>
              </a>
            </div>
          </div>
        </footer>

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
                <div key={id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '14px 0', borderBottom: '1px solid #f1f1f3' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 12, overflow: 'hidden', flex: 'none', background: '#f1f1f3' }}>
                    {m.img && <Img src={m.img} alt={m.name} style={{ width: 56, height: 56, objectFit: 'cover', display: 'block' }} fallback={<div style={{ width: 56, height: 56 }} />} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.name}</div>
                    {m.desc && <div style={{ color: '#8a8a93', fontSize: 12.5, marginTop: 3, display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.desc}</div>}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginTop: 8 }}>
                      <span style={{ fontWeight: 800, fontSize: 14, fontVariantNumeric: 'tabular-nums' }}>{peso(m.price * qty)}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #ececef', borderRadius: 999, padding: '5px 10px', boxShadow: '0 1px 3px rgba(0,0,0,.06)', flex: 'none' }}>
                        <button onClick={() => dispatch({ type: 'DEC', id })} className="stepper-dec" aria-label={qty === 1 ? `Remove ${m.name}` : `Decrease ${m.name}`}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, border: 'none', background: 'transparent', color: '#1c1c22', cursor: 'pointer', padding: 0 }}>
                          {qty === 1 ? (
                            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M10 11v6M14 11v6" /></svg>
                          ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ fill: 'currentColor' }}><path d="M5.75 11.25h12.5a.75.75 0 0 1 0 1.5H5.75a.75.75 0 0 1 0-1.5Z" /></svg>
                          )}
                        </button>
                        <span style={{ minWidth: 14, textAlign: 'center', fontWeight: 800, fontSize: 13.5, fontVariantNumeric: 'tabular-nums' }}>{qty}</span>
                        <button onClick={() => dispatch({ type: 'INC', id })} className="stepper-inc" aria-label={`Increase ${m.name}`}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, border: 'none', background: 'transparent', color: '#1c1c22', cursor: 'pointer', padding: 0 }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ fill: 'currentColor' }}><path fillRule="evenodd" clipRule="evenodd" d="M12 5C12.3797 5 12.6935 5.28215 12.7432 5.64823L12.75 5.75V10.85C12.75 11.0709 12.9291 11.25 13.15 11.25H18.25C18.6642 11.25 19 11.5858 19 12C19 12.3797 18.7178 12.6935 18.3518 12.7432L18.25 12.75H13.15C12.9291 12.75 12.75 12.9291 12.75 13.15V18.25C12.75 18.6642 12.4142 19 12 19C11.6203 19 11.3065 18.7178 11.2568 18.3518L11.25 18.25V13.15C11.25 12.9291 11.0709 12.75 10.85 12.75H5.75C5.33579 12.75 5 12.4142 5 12C5 11.6203 5.28215 11.3065 5.64823 11.2568L5.75 11.25H10.85C11.0709 11.25 11.25 11.0709 11.25 10.85V5.75C11.25 5.33579 11.5858 5 12 5Z" /></svg>
                        </button>
                      </div>
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

// Restaurant grid card with a tappable favourite heart (top-right).
function RestCard({ r, isFav, onOpen, onFav, B, BD }) {
  return (
    <div onClick={onOpen} className="rest-card" style={{ cursor: 'pointer', transition: 'transform .16s ease' }}>
      <div style={{ position: 'relative', height: 168, borderRadius: 14, overflow: 'hidden' }}>
        <Img src={`${A}/restaurants/${r.id}.webp`} alt={r.name} className="rest-img" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          fallback={<div className="rest-img" style={{ width: '100%', height: '100%', background: r.grad, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 66 }}>{r.emoji}</div>} />
        <button onClick={e => { e.stopPropagation(); onFav(); }} className="fav-btn" aria-label={isFav ? 'Remove from favourites' : 'Add to favourites'} aria-pressed={isFav}
          style={{ position: 'absolute', top: 12, right: 12, width: 28, height: 28, borderRadius: '50%', background: '#fff', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isFav ? B : '#1c1c22', boxShadow: '0 2px 8px rgba(0,0,0,.15)', transition: 'transform .12s,color .15s' }}>
          <svg key={isFav ? 'on' : 'off'} aria-hidden="true" focusable="false" width="19" height="19" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style={{ animation: isFav ? 'pop .35s ease' : 'none' }}><path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M12.6217 2.82875C14.6366 3.8152 15.5488 6.39602 14.6592 8.59316C13.5308 11.0256 11.4249 12.9696 8.3415 14.4254C8.15614 14.5107 7.94533 14.5229 7.75273 14.4618L7.65776 14.425C4.57478 12.9693 2.46912 11.0254 1.34078 8.59316C0.451161 6.39602 1.36338 3.8152 3.37828 2.82875C4.83682 2.11468 6.33306 2.64718 7.49473 3.62706C7.55809 3.68051 7.63615 3.75107 7.72889 3.83874L7.72892 3.83871C7.88199 3.98341 8.11731 3.98336 8.27032 3.8386C8.34183 3.77095 8.40276 3.71543 8.45314 3.67203C9.62526 2.66225 11.1429 2.10474 12.6217 2.82875ZM11.8696 4.45404C11.1697 4.11137 10.2881 4.36724 9.41854 5.19403L9.24485 5.36699L8.28326 6.36823C8.12801 6.52989 7.87475 6.53148 7.71758 6.37179C7.71631 6.3705 7.71504 6.36919 7.71378 6.36787L6.75338 5.36542C5.83294 4.40468 4.87775 4.08814 4.13039 4.45404C2.96994 5.02217 2.42026 6.5773 2.92018 7.81797C3.76446 9.63786 5.30414 11.1633 7.59598 12.391L7.82073 12.5071C7.93328 12.5652 8.06585 12.5655 8.17856 12.5077C8.30589 12.4425 8.40456 12.391 8.47457 12.353C10.6006 11.2014 12.0681 9.79624 12.9017 8.18989L13.0437 7.90114C13.5554 6.63747 13.0778 5.16307 12.024 4.53751L11.8696 4.45404Z" /></svg>
        </button>
      </div>
      <div style={{ padding: '12px 2px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'flex-start' }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, letterSpacing: '-.3px' }}>{r.name}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#1c1c22', fontSize: 13.5, fontWeight: 800, flex: 'none' }}>
            <span style={{ color: '#f5a623' }}>★</span> {r.rating.toFixed(1)}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 5, color: '#8a8a93', fontSize: 12, fontWeight: 600 }}>
          <span>{r.time.replace('–', '-')}</span><span style={{ opacity: .5 }}>·</span>
          <span>₱₱</span><span style={{ opacity: .5 }}>·</span>
          <span>{r.cuisines[0]}</span>
        </div>
        <div style={{ marginTop: 6, fontSize: 12, fontWeight: 600, color: '#54545c', display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
          <svg aria-hidden="true" focusable="false" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ flex: 'none' }}><path fillRule="evenodd" clipRule="evenodd" d="M9.23752 3.28752C9.23752 3.95027 8.70027 4.48752 8.03752 4.48752C7.37478 4.48752 6.83752 3.95027 6.83752 3.28752C6.83752 2.62478 7.37478 2.08752 8.03752 2.08752C8.70027 2.08752 9.23752 2.62478 9.23752 3.28752ZM6.14386 9.14592C6.00445 8.96508 5.94904 8.72306 6.01506 8.48618L6.86505 5.43618C6.97625 5.03718 7.38985 4.80386 7.78886 4.91506C7.91357 4.94981 8.02209 5.01411 8.10897 5.09826L9.67246 6.11242L11.5377 6.11242C11.8829 6.11242 12.1627 6.39224 12.1627 6.73742C12.1627 7.0826 11.8829 7.36242 11.5377 7.36242H9.48751C9.3668 7.36242 9.24867 7.32746 9.14739 7.26177L8.10235 6.58391L7.63531 8.2598L9.66925 8.36322C9.87995 8.37393 10.071 8.49022 10.1773 8.67244C10.2837 8.85467 10.2909 9.07823 10.1965 9.26693L10.0965 9.46693L10.0947 9.47057L8.54468 12.5206C8.38829 12.8283 8.01206 12.951 7.70434 12.7946C7.39662 12.6382 7.27394 12.262 7.43032 11.9543L8.64567 9.56279L6.65576 9.46161C6.43443 9.45035 6.24586 9.32527 6.14386 9.14592ZM2.53752 4.68752C1.87478 4.68752 1.33752 5.22478 1.33752 5.88752V7.48752C1.33752 8.15027 1.87478 8.68752 2.53752 8.68752H4.13752C4.80027 8.68752 5.33752 8.15027 5.33752 7.48752V5.88752C5.33752 5.22478 4.80027 4.68752 4.13752 4.68752H2.53752ZM4.33752 10.5125C3.74382 10.5125 3.26252 10.9938 3.26252 11.5875C3.26252 12.1812 3.74382 12.6625 4.33752 12.6625C4.93123 12.6625 5.41252 12.1812 5.41252 11.5875C5.41252 10.9938 4.93123 10.5125 4.33752 10.5125ZM2.01252 11.5875C2.01252 10.3035 3.05346 9.26252 4.33752 9.26252C5.62159 9.26252 6.66252 10.3035 6.66252 11.5875C6.66252 12.8716 5.62159 13.9125 4.33752 13.9125C3.05346 13.9125 2.01252 12.8716 2.01252 11.5875ZM11.2625 11.5875C11.2625 10.9938 11.7438 10.5125 12.3375 10.5125C12.9312 10.5125 13.4125 10.9938 13.4125 11.5875C13.4125 12.1812 12.9312 12.6625 12.3375 12.6625C11.7438 12.6625 11.2625 12.1812 11.2625 11.5875ZM12.3375 9.26252C11.0535 9.26252 10.0125 10.3035 10.0125 11.5875C10.0125 12.8716 11.0535 13.9125 12.3375 13.9125C13.6216 13.9125 14.6625 12.8716 14.6625 11.5875C14.6625 10.3035 13.6216 9.26252 12.3375 9.26252Z" /></svg>
          <span>₱{r.fee || 39} or</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, color: '#6c2bd9', fontWeight: 800, fontSize: 11, background: '#efe9fd', padding: '2px 6px', borderRadius: 6 }}>
            <svg aria-hidden="true" focusable="false" width="13" height="13" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ flex: 'none' }}><path d="M10.6832 7.7806L8.00209 3L5.2852 7.7806L2 5.72375L2.99745 13H12.9713L14 5.70407L10.6832 7.7806Z" /></svg>
            PRO
          </span>
          <span>Free with ₱200 spend</span>
        </div>
        <div style={{ marginTop: 7, display: 'inline-flex', alignItems: 'center', gap: 4, color: BD, fontSize: 11, fontWeight: 800, background: BT, padding: '3px 7px', borderRadius: 6 }}>
          <svg aria-hidden="true" focusable="false" width="13" height="13" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ flex: 'none' }}><path fillRule="evenodd" clipRule="evenodd" d="M6.65484 2.56705C7.3923 1.81115 8.60773 1.81115 9.34518 2.56705L9.39322 2.61629C9.74688 2.9788 10.2319 3.18322 10.7384 3.18322L10.9377 3.18322C11.9755 3.18322 12.8169 4.02447 12.8169 5.0622V5.26146C12.8169 5.76789 13.0213 6.25287 13.3839 6.60649L13.4331 6.65452C14.1891 7.3919 14.1891 8.6072 13.4331 9.34457L13.3839 9.39261C13.0213 9.74623 12.8169 10.2312 12.8169 10.7376V10.9369C12.8169 11.9746 11.9755 12.8159 10.9377 12.8159L10.7384 12.8159C10.2319 12.8159 9.74688 13.0203 9.39322 13.3828L9.34518 13.432C8.60773 14.188 7.3923 14.1879 6.65484 13.432L6.6068 13.3828C6.25314 13.0203 5.76811 12.8159 5.26163 12.8159L5.06235 12.8159C4.02451 12.8159 3.18316 11.9746 3.18316 10.9369L3.18316 10.7376C3.18316 10.2312 2.97872 9.74623 2.61618 9.39261L2.56693 9.34457C1.81094 8.6072 1.81094 7.3919 2.56693 6.65452L2.61618 6.60649C2.97872 6.25287 3.18316 5.76789 3.18316 5.26147L3.18316 5.0622C3.18316 4.02447 4.0245 3.18322 5.06235 3.18322L5.26163 3.18322C5.76811 3.18322 6.25314 2.9788 6.6068 2.61629L6.65484 2.56705ZM6.89645 5.89616C6.89645 6.44839 6.44873 6.89607 5.89644 6.89607C5.34415 6.89607 4.89643 6.44839 4.89643 5.89616C4.89643 5.34393 5.34415 4.89626 5.89644 4.89626C6.44873 4.89626 6.89645 5.34393 6.89645 5.89616ZM10.1036 11.1028C10.6559 11.1028 11.1036 10.6552 11.1036 10.1029C11.1036 9.5507 10.6559 9.10303 10.1036 9.10303C9.5513 9.10303 9.10358 9.5507 9.10358 10.1029C9.10358 10.6552 9.5513 11.1028 10.1036 11.1028ZM5.90129 9.05883C5.6084 9.35172 5.6084 9.82659 5.90129 10.1195C6.19419 10.4124 6.66906 10.4124 6.96195 10.1195L10.1439 6.93751C10.4368 6.64461 10.4368 6.16974 10.1439 5.87685C9.85104 5.58395 9.37617 5.58395 9.08327 5.87685L5.90129 9.05883Z" /></svg>
          10% off ₱899
        </div>
      </div>
    </div>
  );
}

// Local image with graceful fallback — shows `fallback` until the file exists at `src`.
function Img({ src, alt, style, fallback, className }) {
  const [err, setErr] = useState(false);
  if (err || !src) return fallback;
  return <img src={src} alt={alt} style={style} className={className} onError={() => setErr(true)} />;
}

// Horizontal scroller with a circular "next" arrow on the right.
function ScrollRow({ children, gap = 18 }) {
  const ref = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const update = () => {
    const el = ref.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 1);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };
  const arrowBase = { position: 'absolute', top: '50%', transform: 'translateY(-50%)', width: 44, height: 44, borderRadius: '50%', background: '#fff', border: '1px solid #ececef', cursor: 'pointer', fontSize: 20, color: '#1c1c22', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(0,0,0,.14)', transition: 'transform .1s', zIndex: 2 };
  return (
    <div style={{ position: 'relative' }}>
      <div ref={ref} onScroll={update} className="hide-scroll" style={{ display: 'flex', gap, overflowX: 'auto', scrollBehavior: 'smooth', padding: '10px 0' }}>
        {children}
      </div>
      {canLeft && (
        <button onClick={() => ref.current?.scrollBy({ left: -320, behavior: 'smooth' })} className="scroll-arrow"
          style={{ ...arrowBase, left: -6 }}>←</button>
      )}
      {canRight && (
        <button onClick={() => ref.current?.scrollBy({ left: 320, behavior: 'smooth' })} className="scroll-arrow"
          style={{ ...arrowBase, right: -6 }}>→</button>
      )}
    </div>
  );
}

// Category tabs act as scroll shortcuts: clicking jumps to that section, and the
// active underline follows the section currently scrolled into view.
function MenuCats({ R }) {
  const ref = useRef(null);
  const btnRefs = useRef({});
  const counts = {};
  R.menu.forEach(m => { counts[m.cat] = (counts[m.cat] || 0) + 1; });
  const cats = Object.keys(counts);
  const [active, setActive] = useState(cats[0]);

  useEffect(() => {
    // Highlight the last section whose heading has scrolled up past the sticky bars.
    const line = 135;
    const onScroll = () => {
      let current = cats[0];
      for (const c of cats) {
        const el = document.getElementById(catSlug(R.id, c));
        if (el && el.getBoundingClientRect().top - line <= 0) current = c;
      }
      setActive(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [R.id]);

  // When the active category changes (via scroll-spy or click), bring its tab
  // into view if it has scrolled offscreen in the horizontal bar.
  useEffect(() => {
    const cont = ref.current;
    const btn = btnRefs.current[active];
    if (!cont || !btn) return;
    const left = cont.scrollLeft;
    const right = left + cont.clientWidth;
    if (btn.offsetLeft < left || btn.offsetLeft + btn.offsetWidth > right) {
      cont.scrollTo({ left: Math.max(0, btn.offsetLeft - (cont.clientWidth - btn.offsetWidth) / 2), behavior: 'smooth' });
    }
  }, [active]);

  function go(cat) {
    setActive(cat); // the [active] effect scrolls the tab into view
    document.getElementById(catSlug(R.id, cat))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div style={{ position: 'relative', flex: 1, minWidth: 0 }}>
      <button onClick={() => ref.current?.scrollBy({ left: -240, behavior: 'smooth' })} aria-label="Previous categories"
        style={{ position: 'absolute', top: '50%', left: -2, transform: 'translateY(-50%)', width: 30, height: 30, borderRadius: '50%', background: '#fff', border: '1px solid #ececef', cursor: 'pointer', fontSize: 16, color: '#1c1c22', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,.12)', zIndex: 1 }}>‹</button>
      <div ref={ref} className="hide-scroll" style={{ display: 'flex', gap: 24, overflowX: 'auto', paddingLeft: 36, paddingRight: 36 }}>
        {cats.map(c => {
          const on = c === active;
          return (
            <button key={c} ref={el => (btnRefs.current[c] = el)} onClick={() => go(c)}
              style={{ flex: 'none', padding: '17px 0', border: 'none', borderBottom: `3px solid ${on ? '#1c1c22' : 'transparent'}`, background: 'transparent', color: on ? '#1c1c22' : '#8a8a93', font: 'inherit', fontWeight: on ? 800 : 600, fontSize: 14, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'color .15s' }}>
              {c} ({counts[c]})
            </button>
          );
        })}
      </div>
      <button onClick={() => ref.current?.scrollBy({ left: 240, behavior: 'smooth' })} aria-label="More categories"
        style={{ position: 'absolute', top: '50%', right: -2, transform: 'translateY(-50%)', width: 30, height: 30, borderRadius: '50%', background: '#fff', border: '1px solid #ececef', cursor: 'pointer', fontSize: 16, color: '#1c1c22', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,.12)', zIndex: 1 }}>›</button>
    </div>
  );
}

function MenuItems({ R, cart, cartRid, menuQ, dispatch, add, B, BD, BT }) {
  const cats = [];
  R.menu.forEach(m => { if (!cats.includes(m.cat)) cats.push(m.cat); });
  const mq = menuQ.toLowerCase();

  return cats.map(cat => {
    let items = R.menu.filter(m => m.cat === cat);
    if (mq) items = items.filter(m => m.name.toLowerCase().includes(mq) || m.desc.toLowerCase().includes(mq));
    if (!items.length) return null;
    return (
      <div key={cat} id={catSlug(R.id, cat)} style={{ scrollMarginTop: 130 }}>
        <h3 style={{ margin: '26px 2px 14px', fontSize: 22, fontWeight: 800, letterSpacing: '-.5px' }}>{cat}</h3>
        <div className="menu-grid">
          {items.map(m => {
            const qty = cartRid === R.id ? (cart[m.id] || 0) : 0;
            return (
              <div key={m.id} className="menu-card" style={{ display: 'flex', gap: 12, padding: 14, border: '1px solid #ececef', borderRadius: 12, background: '#fff', transition: 'box-shadow .15s' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, lineHeight: 1.3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</h4>
                  <div style={{ marginTop: 6, fontWeight: 400, fontSize: 14, color: '#1c1c22', fontVariantNumeric: 'tabular-nums' }}>from {peso(m.price)}</div>
                  {m.desc && <p style={{ margin: '8px 0 0', color: '#8a8a93', fontSize: 12.5, lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{m.desc}</p>}
                  {m.badge && <span style={{ display: 'inline-block', marginTop: 8, background: BT, color: BD, fontSize: 10.5, fontWeight: 800, padding: '3px 8px', borderRadius: 999, letterSpacing: '.3px', textTransform: 'uppercase' }}>{m.badge}</span>}
                </div>
                {m.img ? (
                  <div style={{ position: 'relative', flex: 'none', width: 92, height: 92 }}>
                    <Img src={m.img} alt={m.name} style={{ width: 92, height: 92, borderRadius: 12, objectFit: 'cover', display: 'block', background: '#f1f1f3' }}
                      fallback={<div style={{ width: 92, height: 92, borderRadius: 12, background: '#f1f1f3' }} />} />
                    {qty === 0 ? (
                      <button onClick={() => add(m.id)} className="add-btn" aria-label={`Add ${m.name}`}
                        style={{ position: 'absolute', bottom: -10, right: -8, width: 36, height: 36, borderRadius: '50%', background: '#fff', border: '1.5px solid #ececef', color: '#1c1c22', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, boxShadow: '0 4px 12px rgba(0,0,0,.12)', transition: 'border-color .15s,transform .1s' }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ fill: 'currentColor' }}><path fillRule="evenodd" clipRule="evenodd" d="M12 5C12.3797 5 12.6935 5.28215 12.7432 5.64823L12.75 5.75V10.85C12.75 11.0709 12.9291 11.25 13.15 11.25H18.25C18.6642 11.25 19 11.5858 19 12C19 12.3797 18.7178 12.6935 18.3518 12.7432L18.25 12.75H13.15C12.9291 12.75 12.75 12.9291 12.75 13.15V18.25C12.75 18.6642 12.4142 19 12 19C11.6203 19 11.3065 18.7178 11.2568 18.3518L11.25 18.25V13.15C11.25 12.9291 11.0709 12.75 10.85 12.75H5.75C5.33579 12.75 5 12.4142 5 12C5 11.6203 5.28215 11.3065 5.64823 11.2568L5.75 11.25H10.85C11.0709 11.25 11.25 11.0709 11.25 10.85V5.75C11.25 5.33579 11.5858 5 12 5Z" /></svg>
                      </button>
                    ) : (
                      <div style={{ position: 'absolute', bottom: -12, left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: 2, background: '#fff', borderRadius: 12, boxShadow: '0 4px 14px rgba(0,0,0,.16)', padding: 3 }}>
                        <button onClick={() => dispatch({ type: 'DEC', id: m.id })} className="stepper-dec"
                          style={{ width: 28, height: 28, border: 'none', background: 'transparent', color: B, fontSize: 19, fontWeight: 700, cursor: 'pointer', borderRadius: 9, transition: 'transform .1s' }}>−</button>
                        <span style={{ minWidth: 16, textAlign: 'center', fontWeight: 800, fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>{qty}</span>
                        <button onClick={() => dispatch({ type: 'INC', id: m.id })} className="stepper-inc"
                          style={{ width: 28, height: 28, border: 'none', background: B, color: '#fff', fontSize: 17, fontWeight: 700, cursor: 'pointer', borderRadius: 9, transition: 'transform .1s' }}>+</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ flex: 'none', display: 'flex', alignItems: 'flex-end' }}>
                    {qty === 0 ? (
                      <button onClick={() => add(m.id)} className="add-btn" aria-label={`Add ${m.name}`}
                        style={{ width: 40, height: 40, borderRadius: '50%', background: '#fff', border: '1.5px solid #ececef', color: '#1c1c22', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, boxShadow: '0 2px 8px rgba(0,0,0,.10)', transition: 'border-color .15s,transform .1s' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ fill: 'currentColor' }}><path fillRule="evenodd" clipRule="evenodd" d="M12 5C12.3797 5 12.6935 5.28215 12.7432 5.64823L12.75 5.75V10.85C12.75 11.0709 12.9291 11.25 13.15 11.25H18.25C18.6642 11.25 19 11.5858 19 12C19 12.3797 18.7178 12.6935 18.3518 12.7432L18.25 12.75H13.15C12.9291 12.75 12.75 12.9291 12.75 13.15V18.25C12.75 18.6642 12.4142 19 12 19C11.6203 19 11.3065 18.7178 11.2568 18.3518L11.25 18.25V13.15C11.25 12.9291 11.0709 12.75 10.85 12.75H5.75C5.33579 12.75 5 12.4142 5 12C5 11.6203 5.28215 11.3065 5.64823 11.2568L5.75 11.25H10.85C11.0709 11.25 11.25 11.0709 11.25 10.85V5.75C11.25 5.33579 11.5858 5 12 5Z" /></svg>
                      </button>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: '#fff', borderRadius: 12, border: '1px solid #ececef', boxShadow: '0 2px 8px rgba(0,0,0,.10)', padding: 3 }}>
                        <button onClick={() => dispatch({ type: 'DEC', id: m.id })} className="stepper-dec"
                          style={{ width: 28, height: 28, border: 'none', background: 'transparent', color: B, fontSize: 19, fontWeight: 700, cursor: 'pointer', borderRadius: 9, transition: 'transform .1s' }}>−</button>
                        <span style={{ minWidth: 16, textAlign: 'center', fontWeight: 800, fontSize: 13, fontVariantNumeric: 'tabular-nums' }}>{qty}</span>
                        <button onClick={() => dispatch({ type: 'INC', id: m.id })} className="stepper-inc"
                          style={{ width: 28, height: 28, border: 'none', background: B, color: '#fff', fontSize: 17, fontWeight: 700, cursor: 'pointer', borderRadius: 9, transition: 'transform .1s' }}>+</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  });
}
