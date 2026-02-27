export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  banner: string;
  logoFont?: string;
  darkCard?: boolean;
  bio: string;
  origin: string;
  website: string;
  affiliateUrl: string;
  instagram: string;
  tiktok?: string;
  aesthetics: string[];
  categories: string[];
  priceRange: "budget" | "mid" | "premium" | "luxury";
  followers: number;
  rating: number;
  featured: boolean;
  newDrop: boolean;
}

export interface Product {
  id: string;
  name: string;
  brandId: string;
  brandName: string;
  image: string;
  images: string[];
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  aesthetics: string[];
  sizes: string[];
  affiliateUrl: string;
  trending: boolean;
  newArrival: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: "spotlight" | "trend" | "guide" | "style";
  author: string;
  date: string;
  readTime: number;
}

export const AESTHETICS = [
  "Streetwear", "Minimalist", "Y2K", "Avant-Garde", "Techwear",
  "Cottagecore", "Dark Academia", "Gorpcore", "Coastal Grandmother",
  "Old Money", "Grunge", "Bohemian", "Brutalist", "Archive"
] as const;

export const CATEGORIES = [
  "Tops", "Bottoms", "Outerwear", "Dresses", "Knitwear",
  "Accessories", "Footwear", "Bags", "Jewelry", "Swimwear"
] as const;

import verobottegaLogo from "@/assets/verobottega-logo.png";

const IMG = (seed: string, w = 600, h = 800) =>
  `https://images.unsplash.com/photo-${seed}?w=${w}&h=${h}&fit=crop&auto=format`;

export const brands: Brand[] = [
  {
    id: "16", name: "VeroBottega", slug: "verobottega", logo: verobottegaLogo,
    banner: "https://verobottega.store/cdn/shop/files/IMG_7344.jpg?crop=center&height=500&width=1200", logoFont: "'Anton', sans-serif", bio: "Streetwear label crafting premium tracksuits, polos, and essentials straight from the workshop.",
    origin: "USA", website: "https://verobottega.store", affiliateUrl: "https://verobottega.store",
    instagram: "@verobottega", aesthetics: ["Streetwear", "Minimalist"], categories: ["Tops", "Bottoms", "Outerwear"],
    priceRange: "mid", followers: 15000, rating: 4.5, featured: true, newDrop: true
  },
  {
    id: "17", name: "Drip by Rage", slug: "drip-by-rage", logo: "https://dripbyrage.store/cdn/shop/files/log_659ff53a-6e0e-469f-a803-e2a3e8b9eec8.png?v=1686708735&width=200",
    banner: "https://dripbyrage.store/cdn/shop/files/freepik__enhance__244082254.png?v=1760581903&width=1200", logoFont: "'Rajdhani', sans-serif", darkCard: true, bio: "Streetwear brand rooted in Punjabi culture and the ideology of self-expression. Bold graphics, oversized silhouettes, and sun-faded finishes that merge heritage with modern street style.",
    origin: "Canada", website: "https://dripbyrage.store", affiliateUrl: "https://dripbyrage.store",
    instagram: "@dripbyrage", tiktok: "@dripbyrage", aesthetics: ["Streetwear", "Grunge", "Archive"], categories: ["Tops", "Outerwear", "Bottoms"],
    priceRange: "mid", followers: 50000, rating: 4.7, featured: true, newDrop: true
  },
];

export const products: Product[] = [
  { id: "p21", name: "Green Legacy Pants", brandId: "16", brandName: "VeroBottega", image: "https://verobottega.store/cdn/shop/files/F0F02233-AC93-4228-BD9E-DB136F18F066.jpg?crop=center&height=800&width=600", images: ["https://verobottega.store/cdn/shop/files/F0F02233-AC93-4228-BD9E-DB136F18F066.jpg?crop=center&height=800&width=600"], price: 64, originalPrice: 68, description: "Two-tone tracksuits carefully crafted at each seam with metal studs, full metal zipper, oversized 3-panel hood, jumbo/reg DTG prints, and ribbed cuffs and hem. Premium French Terry Cotton rated at 400 GSM.", category: "Bottoms", aesthetics: ["Streetwear"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://verobottega.store/products/green-legacy-pants", trending: true, newArrival: true },
  { id: "p22", name: "Green Legacy Hoodie", brandId: "16", brandName: "VeroBottega", image: "https://verobottega.store/cdn/shop/files/IMG-7500.webp?crop=center&height=800&width=600", images: ["https://verobottega.store/cdn/shop/files/IMG-7500.webp?crop=center&height=800&width=600"], price: 68, originalPrice: 72, description: "Two-tone tracksuits carefully crafted at each seam with metal studs, full metal zipper, oversized 3-panel hood, jumbo/reg DTG prints, and ribbed cuffs and hem. Premium French Terry Cotton rated at 400 GSM.", category: "Tops", aesthetics: ["Streetwear"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://verobottega.store/products/legacy-tracksuits-green", trending: true, newArrival: true },
  { id: "p23", name: "United Long Sleeve Polo", brandId: "16", brandName: "VeroBottega", image: "https://verobottega.store/cdn/shop/files/IMG-7501.webp?crop=center&height=800&width=600", images: ["https://verobottega.store/cdn/shop/files/IMG-7501.webp?crop=center&height=800&width=600"], price: 53, originalPrice: 64, description: "Long sleeve button-up polo made with jersey cotton material. Comfy, breathable, and created with the intention of being able to be worn on and off the field. Available in Black, White, and Pink.", category: "Tops", aesthetics: ["Streetwear", "Minimalist"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://verobottega.store/products/united-long-sleeve-polo", trending: true, newArrival: true },
  { id: "p24", name: "FTA Jerseys", brandId: "16", brandName: "VeroBottega", image: "https://verobottega.store/cdn/shop/files/IMG-7502.webp?crop=center&height=800&width=600", images: ["https://verobottega.store/cdn/shop/files/IMG-7502.webp?crop=center&height=800&width=600"], price: 45, originalPrice: 60, description: "100% woven cotton with double-layered collar, DTF print, drop shoulders, and boxy fit. True to size. Available in Black and Navy.", category: "Tops", aesthetics: ["Streetwear"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://verobottega.store/products/fta-jerseys", trending: false, newArrival: true },
  { id: "p25", name: "Vero Santo Sweatpants", brandId: "16", brandName: "VeroBottega", image: "https://verobottega.store/cdn/shop/files/Generated_with_Kive.ai_-_kive-image.png?crop=center&height=800&width=600", images: ["https://verobottega.store/cdn/shop/files/Generated_with_Kive.ai_-_kive-image.png?crop=center&height=800&width=600"], price: 45, originalPrice: 68, description: "100% cotton straight-leg sweatpants with embroidered logo and stripes, ribbed waistband. Fits true to size. Available in Black and Beige.", category: "Bottoms", aesthetics: ["Streetwear", "Minimalist"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://verobottega.store/products/vero-santo-sweatpants", trending: false, newArrival: true },
  { id: "p26", name: "Young Shiner Zip-up", brandId: "16", brandName: "VeroBottega", image: "https://verobottega.store/cdn/shop/files/E44A6D7C-E642-4B39-BD00-B1B4B82B065A.jpg?crop=center&height=800&width=600", images: ["https://verobottega.store/cdn/shop/files/E44A6D7C-E642-4B39-BD00-B1B4B82B065A.jpg?crop=center&height=800&width=600"], price: 53, originalPrice: 68, description: "100% cotton zip-up with distressed embroidery on the front logo, slightly cropped with drop shoulders. Fits true to size. Available in Black and Beige.", category: "Outerwear", aesthetics: ["Streetwear"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://verobottega.store/products/young-shiner-zip-up", trending: false, newArrival: false },
  { id: "p27", name: "VERO Staple Wash Hoodie", brandId: "16", brandName: "VeroBottega", image: "https://verobottega.store/cdn/shop/files/1E493B78-B45E-4B20-80AB-768095617721.jpg?crop=center&height=800&width=600", images: ["https://verobottega.store/cdn/shop/files/1E493B78-B45E-4B20-80AB-768095617721.jpg?crop=center&height=800&width=600"], price: 57, originalPrice: 79, description: "100% French terry cotton with pigment wash, chenille embroidery, custom zipper, and woven neck label. True to size. Available in Green and Gray.", category: "Tops", aesthetics: ["Streetwear"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://verobottega.store/products/vero-staple-wash-hoodie", trending: true, newArrival: false },
  { id: "p28", name: "Panjab Oversized Faded Hoodie", brandId: "17", brandName: "Drip by Rage", image: "https://dripbyrage.store/cdn/shop/files/ghy234wg2w.png?v=1762457556&width=600", images: ["https://dripbyrage.store/cdn/shop/files/ghy234wg2w.png?v=1762457556&width=600", "https://dripbyrage.store/cdn/shop/files/405264004_218481821281220_279562461490352271_n_710adddf-665f-4a65-9024-c0840fa1eda5.jpg?v=1739224612&width=600"], price: 140, description: "Oversized faded hoodie with snug collar for wind protection, kangaroo pockets, drop shoulders, and washed effect. 100% combed cotton, 440g/m², pre-shrunk with binding taped neck and shoulders.", category: "Tops", aesthetics: ["Streetwear", "Grunge"], sizes: ["S", "M", "L", "XL", "2XL"], affiliateUrl: "https://dripbyrage.store/en-us/products/panjab-oversized-faded-hoodie", trending: true, newArrival: false },
  { id: "p29", name: "Panjab Varsity Jacket", brandId: "17", brandName: "Drip by Rage", image: "https://dripbyrage.store/cdn/shop/files/1_7695ffa1-8498-41cb-9a99-16e2d6b50826.png?v=1763858207&width=600", images: ["https://dripbyrage.store/cdn/shop/files/1_7695ffa1-8498-41cb-9a99-16e2d6b50826.png?v=1763858207&width=600", "https://dripbyrage.store/cdn/shop/files/imageye___-_imgi_2_635050820_18042835775724883_1336967576264197782_n_6ff11f83-1611-44a7-ad83-b44b77b683ea.jpg?v=1771781768&width=600"], price: 382, description: "Bold celebration of heritage and modern street style. Embroidered 'Panjab Motherland' design on the back, black fleece body with cream leather sleeves. Intricate embroidery details showcasing craftsmanship and cultural symbolism.", category: "Outerwear", aesthetics: ["Streetwear", "Archive"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://dripbyrage.store/en-us/products/panjab-varsity-jacket", trending: true, newArrival: true },
  { id: "p30", name: "Baaj Oversized Faded Hoodie", brandId: "17", brandName: "Drip by Rage", image: "https://dripbyrage.store/cdn/shop/files/gf32wg.png?v=1704196519&width=600", images: ["https://dripbyrage.store/cdn/shop/files/gf32wg.png?v=1704196519&width=600", "https://dripbyrage.store/cdn/shop/files/f2qgf3231qf.png?v=1762457593&width=600"], price: 140, description: "Oversized faded hoodie with snug collar, kangaroo pockets, drop shoulders, and washed effect. 100% combed cotton, 32 count plain weave, pre-shrunk.", category: "Tops", aesthetics: ["Streetwear", "Grunge"], sizes: ["S", "M", "L", "XL", "2XL"], affiliateUrl: "https://dripbyrage.store/en-us/products/baaj-oversized-faded-hoodie-black", trending: true, newArrival: false },
  { id: "p31", name: "47 Red Edition Oversized Faded Hoodie", brandId: "17", brandName: "Drip by Rage", image: "https://dripbyrage.store/cdn/shop/files/117_5b9a8cf9-6648-4076-9889-e24c930562c7.jpg?v=1769113722&width=600", images: ["https://dripbyrage.store/cdn/shop/files/117_5b9a8cf9-6648-4076-9889-e24c930562c7.jpg?v=1769113722&width=600", "https://dripbyrage.store/cdn/shop/files/huje3w45u34.png?v=1764978337&width=600"], price: 140, description: "Oversized faded hoodie with snug collar for wind protection, kangaroo pockets, drop shoulders, and washed effect. 100% combed cotton, pre-shrunk.", category: "Tops", aesthetics: ["Streetwear", "Grunge"], sizes: ["S", "M", "L", "XL", "2XL"], affiliateUrl: "https://dripbyrage.store/en-us/products/47-red-edition-oversized-faded-hoodie-black", trending: true, newArrival: false },
  { id: "p32", name: "Gangster Queen Varsity Jacket", brandId: "17", brandName: "Drip by Rage", image: "https://dripbyrage.store/cdn/shop/files/26_6e36909a-86af-4c14-953d-af14cb5e028c.jpg?v=1755474900&width=600", images: ["https://dripbyrage.store/cdn/shop/files/26_6e36909a-86af-4c14-953d-af14cb5e028c.jpg?v=1755474900&width=600", "https://dripbyrage.store/cdn/shop/files/1_87e4fb73-bf2c-400a-a97d-b9013ec487ed.png?v=1755474900&width=600"], price: 322, description: "The ultimate statement piece featuring a striking embroidered queen design on the back, exuding power and confidence. Intricate sleeve details add rebellious flair — a perfect fusion of streetwear and royal imagery.", category: "Outerwear", aesthetics: ["Streetwear", "Archive"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://dripbyrage.store/en-us/products/gangster-queen-varsity-jacket", trending: true, newArrival: true },
  { id: "p33", name: "Panjab Oversized Faded T-Shirt", brandId: "17", brandName: "Drip by Rage", image: "https://dripbyrage.store/cdn/shop/files/g4g234.jpg?v=1718818918&width=600", images: ["https://dripbyrage.store/cdn/shop/files/g4g234.jpg?v=1718818918&width=600", "https://dripbyrage.store/cdn/shop/files/h533.jpg?v=1762458013&width=600"], price: 67, description: "Vintage style oversized T-shirt with raw hem for an effortless street look. 100% combed cotton, 260gsm — soft, skin-friendly, moisture-absorbing, and breathable. Faded fabric with a timeless casual vibe.", category: "Tops", aesthetics: ["Streetwear", "Grunge"], sizes: ["S", "M", "L", "XL", "2XL"], affiliateUrl: "https://dripbyrage.store/en-us/products/panjab-oversized-faded-t-shirt", trending: true, newArrival: false },
  { id: "p34", name: "War Oversized Fleece Hoodie", brandId: "17", brandName: "Drip by Rage", image: "https://dripbyrage.store/cdn/shop/files/468357971_18367850734116818_2973765328195243156_n.jpg?v=1735953851&width=600", images: ["https://dripbyrage.store/cdn/shop/files/468357971_18367850734116818_2973765328195243156_n.jpg?v=1735953851&width=600", "https://dripbyrage.store/cdn/shop/files/u3j34wu4.png?v=1762457590&width=600"], price: 140, description: "Snug collar, ribbed cuffs and hem, raglan sleeves, oversized fit with fleece lining. 100% combed cotton, 380g/m², pre-shrunk, reactive-dyed for longer-lasting color. Front kangaroo pocket.", category: "Tops", aesthetics: ["Streetwear"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://dripbyrage.store/en-us/products/war-oversized-fleece-hoodie-camel", trending: true, newArrival: false },
];

export const blogPosts: BlogPost[] = [
  { id: "b1", title: "The Rise of Post-Soviet Fashion", slug: "post-soviet-fashion-rise", excerpt: "How Warsaw and Tbilisi became the new fashion capitals for underground labels.", coverImage: IMG("1558618666-fcd25c85f82e", 800, 500), category: "trend", author: "Maya Chen", date: "2026-02-20", readTime: 6 },
  { id: "b2", title: "Brand Spotlight: Story mfg.", slug: "spotlight-story-mfg", excerpt: "Inside the slow-fashion revolution with London's most mindful label.", coverImage: IMG("1523381294911-8d28f28e5a3b", 800, 500), category: "spotlight", author: "Jordan Blake", date: "2026-02-18", readTime: 8 },
  { id: "b3", title: "5 Ways to Style Gorpcore in 2026", slug: "style-gorpcore-2026", excerpt: "Trail-to-city dressing that actually looks intentional.", coverImage: IMG("1571902943202-507ec2618e8f", 800, 500), category: "guide", author: "Alex Rivera", date: "2026-02-15", readTime: 5 },
  { id: "b4", title: "Why Upcycled Fashion Is the Future", slug: "upcycled-fashion-future", excerpt: "The sustainability argument that's winning over luxury consumers.", coverImage: IMG("1490481651871-ab68de25d43d", 800, 500), category: "trend", author: "Maya Chen", date: "2026-02-12", readTime: 7 },
];

export function getBrandById(id: string) {
  return brands.find(b => b.id === id);
}

export function getBrandBySlug(slug: string) {
  return brands.find(b => b.slug === slug);
}

export function getProductsByBrand(brandId: string) {
  return products.filter(p => p.brandId === brandId);
}

export function getProductById(id: string) {
  return products.find(p => p.id === id);
}

export function getSimilarBrands(brand: Brand, limit = 4) {
  return brands
    .filter(b => b.id !== brand.id && b.aesthetics.some(a => brand.aesthetics.includes(a)))
    .slice(0, limit);
}

export function getRelatedProducts(product: Product, limit = 4) {
  return products
    .filter(p => p.id !== product.id && (p.brandId === product.brandId || p.aesthetics.some(a => product.aesthetics.includes(a))))
    .slice(0, limit);
}
