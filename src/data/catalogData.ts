export interface CatalogVariant {
  id: number;
  a: boolean;
  o: string[];
}

export interface CatalogProduct {
  id: string;
  name: string;
  type: 'Footwear' | 'Apparel';
  vendor: string;
  tag?: string;
  price: number;
  image: string;
  sizes: string[];
  variants: CatalogVariant[];
  url: string;
  runwayLook: number;
  runwayLookName: string;
}

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    id: 'air-jordan-12-retro',
    name: 'Air Jordan 12 Retro',
    type: 'Footwear',
    vendor: 'Zircon Footwear',
    price: 24500,
    image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tatum-5-orbit-copy.webp',
    sizes: ['40', '41', '42', '43', '44', '45', '46'],
    variants: [
      { id: 57015167025457, a: true, o: ['40'] },
      { id: 57015167058225, a: true, o: ['41'] },
      { id: 57015167090993, a: true, o: ['42'] },
      { id: 57015167123761, a: true, o: ['43'] },
      { id: 57015167156529, a: true, o: ['44'] },
      { id: 57015167189297, a: true, o: ['45'] },
      { id: 57015167222065, a: true, o: ['46'] },
    ],
    url: '#shop',
    runwayLook: 0,
    runwayLookName: 'The City Edit',
  },
  {
    id: 'tatum-5-orbit',
    name: 'Tatum 5 Orbit',
    type: 'Footwear',
    vendor: 'Zircon Footwear',
    tag: 'New',
    price: 24500,
    image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tatum-5-orbit.webp',
    sizes: ['40', '41', '42', '43', '44', '45', '46'],
    variants: [
      { id: 57015166730545, a: true, o: ['40'] },
      { id: 57015166763313, a: true, o: ['41'] },
      { id: 57015166796081, a: true, o: ['42'] },
      { id: 57015166828849, a: true, o: ['43'] },
      { id: 57015166861617, a: true, o: ['44'] },
      { id: 57015166894385, a: true, o: ['45'] },
      { id: 57015166927153, a: true, o: ['46'] },
    ],
    url: '#shop',
    runwayLook: 1,
    runwayLookName: 'Gallery Opening',
  },
  {
    id: 'luka-5',
    name: 'Luka 5',
    type: 'Footwear',
    vendor: 'Zircon Footwear',
    price: 24500,
    image: 'https://reel-ref-try-the-look.vercel.app/assets/source-air-jordan-12-retro-copy.webp',
    sizes: ['40', '41', '42', '43', '44', '45', '46'],
    variants: [
      { id: 57015176364337, a: true, o: ['40'] },
      { id: 57015176397105, a: true, o: ['41'] },
      { id: 57015176429873, a: true, o: ['42'] },
      { id: 57015176462641, a: true, o: ['43'] },
      { id: 57015176495409, a: true, o: ['44'] },
      { id: 57015176528177, a: true, o: ['45'] },
      { id: 57015176560945, a: true, o: ['46'] },
    ],
    url: '#shop',
    runwayLook: 5,
    runwayLookName: 'Studio Day',
  },
  {
    id: 'tshirt',
    name: 'Tshirt',
    type: 'Apparel',
    vendor: 'Zircon Studio',
    price: 6500,
    image: 'https://reel-ref-try-the-look.vercel.app/assets/source-tshirt.webp',
    sizes: ['S', 'L', 'M', 'XL'],
    variants: [
      { id: 56835911582001, a: true, o: ['S'] },
      { id: 56835911614769, a: true, o: ['L'] },
      { id: 56835911647537, a: true, o: ['M'] },
      { id: 56835911680305, a: true, o: ['XL'] },
    ],
    url: '#shop',
    runwayLook: 0,
    runwayLookName: 'The City Edit',
  },
  {
    id: 'sweatshirt',
    name: 'Sweatshirt',
    type: 'Apparel',
    vendor: 'Zircon Studio',
    price: 14500,
    image: 'https://reel-ref-try-the-look.vercel.app/assets/source-sweatshirt.webp',
    sizes: ['S', 'L', 'M', 'XL'],
    variants: [
      { id: 56835806396721, a: true, o: ['S'] },
      { id: 56835806429489, a: true, o: ['L'] },
      { id: 56835806462257, a: true, o: ['M'] },
      { id: 56835806495025, a: true, o: ['XL'] },
    ],
    url: '#shop',
    runwayLook: 0,
    runwayLookName: 'The City Edit',
  },
  {
    id: 'hoodie-black',
    name: 'Hoodie Black',
    type: 'Apparel',
    vendor: 'Zircon Studio',
    tag: 'New',
    price: 16500,
    image: 'https://reel-ref-try-the-look.vercel.app/assets/source-hoodie-black.webp',
    sizes: ['S', 'L', 'M', 'XL'],
    variants: [
      { id: 56836251681073, a: true, o: ['S'] },
      { id: 56836251713841, a: true, o: ['L'] },
      { id: 56836251746609, a: true, o: ['M'] },
      { id: 56836251779377, a: true, o: ['XL'] },
    ],
    url: '#shop',
    runwayLook: 1,
    runwayLookName: 'Gallery Opening',
  },
  {
    id: 'sweatshirt-plus',
    name: 'Sweatshirt Plus',
    type: 'Apparel',
    vendor: 'Zircon Studio',
    price: 14500,
    image: 'https://reel-ref-try-the-look.vercel.app/assets/source-sweatshirt-plus.webp',
    sizes: ['S', 'L', 'M', 'XL'],
    variants: [
      { id: 56836143743281, a: true, o: ['S'] },
      { id: 56836143776049, a: true, o: ['L'] },
      { id: 56836143808817, a: true, o: ['M'] },
      { id: 56836143841585, a: true, o: ['XL'] },
    ],
    url: '#shop',
    runwayLook: 2,
    runwayLookName: 'Gallery Opening',
  },
  {
    id: 'hoodie',
    name: 'Hoodie',
    type: 'Apparel',
    vendor: 'Zircon Studio',
    price: 16500,
    image: 'https://reel-ref-try-the-look.vercel.app/assets/source-hoodie.webp',
    sizes: ['S', 'L', 'M', 'XL'],
    variants: [
      { id: 56836002185521, a: true, o: ['S'] },
      { id: 56836002218289, a: true, o: ['L'] },
      { id: 56836002251057, a: true, o: ['M'] },
      { id: 56836002283825, a: true, o: ['XL'] },
    ],
    url: '#shop',
    runwayLook: 5,
    runwayLookName: 'Studio Day',
  },
];

export function filterCatalog(
  items: CatalogProduct[],
  category: 'all' | 'footwear' | 'apparel',
  searchQuery = ''
): CatalogProduct[] {
  let list = items;
  if (category !== 'all') {
    const targetType = category === 'footwear' ? 'Footwear' : 'Apparel';
    list = list.filter((p) => p.type === targetType);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.vendor.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q)
    );
  }
  return list;
}

export function sortCatalog(
  items: CatalogProduct[],
  sortBy: 'default' | 'price-asc' | 'price-desc'
): CatalogProduct[] {
  const clone = [...items];
  if (sortBy === 'price-asc') {
    return clone.sort((a, b) => a.price - b.price);
  }
  if (sortBy === 'price-desc') {
    return clone.sort((a, b) => b.price - a.price);
  }
  return clone;
}

