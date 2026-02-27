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
import apolloOriginalsLogo from "@/assets/apollo-originals-logo.png";
import touroBanner from "@/assets/touro-studio-banner.jpg";

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
  {
    id: "18", name: "Apollo Originals", slug: "apollo-originals", logo: apolloOriginalsLogo,
    banner: "https://www.apollooriginals.com/cdn/shop/files/DSC04632.jpg?height=500&width=1200&v=1760980219", logoFont: "'Oswald', sans-serif", darkCard: true, bio: "Quality-focused streetwear label blending sports culture with space-age graphics. Custom apparel, heavyweight hoodies, and bold graphic tees designed to stand out.",
    origin: "USA", website: "https://www.apollooriginals.com", affiliateUrl: "https://www.apollooriginals.com",
    instagram: "@apollooriginals", aesthetics: ["Streetwear", "Grunge"], categories: ["Tops", "Outerwear", "Accessories"],
    priceRange: "mid", followers: 12000, rating: 4.4, featured: true, newDrop: true
  },
  {
    id: "19", name: "Touro Studio", slug: "touro-studio", logo: touroBanner,
    banner: "https://tourostudio.com/cdn/shop/files/touro1.jpg?v=1765346119&width=1200", logoFont: "'Montserrat', sans-serif", bio: "Quiet form. Focused fit. India-made, purpose-led. Touro Studio crafts premium oversized tees with minimalist design and intentional silhouettes.",
    origin: "India", website: "https://tourostudio.com", affiliateUrl: "https://tourostudio.com",
    instagram: "@tourostudio", aesthetics: ["Minimalist", "Streetwear"], categories: ["Tops"],
    priceRange: "budget", followers: 8000, rating: 4.3, featured: true, newDrop: true
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
  // Apollo Originals
  { id: "p35", name: "Crushers Hoodie", brandId: "18", brandName: "Apollo Originals", image: "https://www.apollooriginals.com/cdn/shop/files/eb01d37e-12db-417b-907c-4a54c651b782.jpg?v=1765475320&width=600", images: ["https://www.apollooriginals.com/cdn/shop/files/eb01d37e-12db-417b-907c-4a54c651b782.jpg?v=1765475320&width=600"], price: 69.99, description: "Crushers Hockey themed hoodie with bold graphic print. Premium heavyweight construction for warmth and durability.", category: "Tops", aesthetics: ["Streetwear"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://www.apollooriginals.com/products/crushers-hoodie", trending: true, newArrival: true },
  { id: "p36", name: "Crushers \"C\" A Frame Snapback", brandId: "18", brandName: "Apollo Originals", image: "https://www.apollooriginals.com/cdn/shop/files/att.5RULhfSA0ZiM01IkmYpbfuFZ7gmGD1ZTQgaKvw4oCiQ.jpg?v=1765475072&width=600", images: ["https://www.apollooriginals.com/cdn/shop/files/att.5RULhfSA0ZiM01IkmYpbfuFZ7gmGD1ZTQgaKvw4oCiQ.jpg?v=1765475072&width=600"], price: 49.99, description: "A-frame snapback cap featuring the Crushers 'C' logo. Structured crown with classic snapback closure.", category: "Accessories", aesthetics: ["Streetwear"], sizes: ["One Size"], affiliateUrl: "https://www.apollooriginals.com/products/chrushers-c-a-frame-snapback", trending: true, newArrival: true },
  { id: "p37", name: "Vintage Crushers Snapback - Black", brandId: "18", brandName: "Apollo Originals", image: "https://www.apollooriginals.com/cdn/shop/files/IMG_8708.jpg?v=1765474797&width=600", images: ["https://www.apollooriginals.com/cdn/shop/files/IMG_8708.jpg?v=1765474797&width=600"], price: 49.99, description: "Vintage-style Crushers Hockey Club snapback in black with embroidered full-color crest logo.", category: "Accessories", aesthetics: ["Streetwear"], sizes: ["One Size"], affiliateUrl: "https://www.apollooriginals.com/products/vintage-chrushers-snapback-black", trending: false, newArrival: true },
  { id: "p38", name: "Shuttle Hoodie", brandId: "18", brandName: "Apollo Originals", image: "https://www.apollooriginals.com/cdn/shop/files/572FC1E3-15E9-4C2C-B682-0247842FE2D4.jpg?v=1757517528&width=600", images: ["https://www.apollooriginals.com/cdn/shop/files/572FC1E3-15E9-4C2C-B682-0247842FE2D4.jpg?v=1757517528&width=600", "https://www.apollooriginals.com/cdn/shop/files/7C0A8D7E-8456-42B3-8F39-04FACC34B8B5.jpg?v=1757517528&width=600"], price: 109.99, description: "Premium heavyweight hoodie with Apollo Originals space shuttle graphic. Bold back print with clean front branding.", category: "Tops", aesthetics: ["Streetwear"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://www.apollooriginals.com/products/shuttle-hoodie", trending: true, newArrival: false },
  { id: "p39", name: "P.A. x Apollo Heavy Weight Hoodie", brandId: "18", brandName: "Apollo Originals", image: "https://www.apollooriginals.com/cdn/shop/files/PAbackofhoodie.png?v=1760987515&width=600", images: ["https://www.apollooriginals.com/cdn/shop/files/PAbackofhoodie.png?v=1760987515&width=600", "https://www.apollooriginals.com/cdn/shop/files/IMG_4506.jpg?v=1742230324&width=600"], price: 84.99, description: "Collaboration heavyweight hoodie with bold back graphic. Premium cotton construction with oversized fit.", category: "Tops", aesthetics: ["Streetwear"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://www.apollooriginals.com/products/p-a-x-apollo-heavy-weight-hoodie", trending: false, newArrival: false },
  { id: "p40", name: "Layered Camo Crew Neck", brandId: "18", brandName: "Apollo Originals", image: "https://www.apollooriginals.com/cdn/shop/files/C9CA218D-6F18-4CDA-96B6-A1DF1973D8E5.jpg?v=1758811359&width=600", images: ["https://www.apollooriginals.com/cdn/shop/files/C9CA218D-6F18-4CDA-96B6-A1DF1973D8E5.jpg?v=1758811359&width=600", "https://www.apollooriginals.com/cdn/shop/files/BCFAC156-E5C9-4B50-BE42-99988D3AC646.jpg?v=1758811360&width=600"], price: 74.99, description: "Layered camo crew neck sweatshirt with unique camouflage pattern overlay. Comfortable fit for everyday wear.", category: "Tops", aesthetics: ["Streetwear", "Grunge"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://www.apollooriginals.com/products/layered-camo-crew-neck", trending: false, newArrival: true },
  { id: "p41", name: "Planetary Outlaw Tee", brandId: "18", brandName: "Apollo Originals", image: "https://www.apollooriginals.com/cdn/shop/files/0D496906-7546-488F-88E2-1A1747D0339D.jpg?v=1758811719&width=600", images: ["https://www.apollooriginals.com/cdn/shop/files/0D496906-7546-488F-88E2-1A1747D0339D.jpg?v=1758811719&width=600", "https://www.apollooriginals.com/cdn/shop/files/A020A419-C3D1-4B21-A712-C3474E964102.jpg?v=1758811719&width=600"], price: 49.99, description: "Bold graphic tee featuring the Planetary Outlaw design. Comfortable cotton construction with detailed front and back prints.", category: "Tops", aesthetics: ["Streetwear"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://www.apollooriginals.com/products/planetary-outlaw-tee", trending: false, newArrival: true },
  { id: "p42", name: "Apollo Essential Camo Hoodie", brandId: "18", brandName: "Apollo Originals", image: "https://www.apollooriginals.com/cdn/shop/files/98711DFD-F1ED-46D6-A047-82C7EC85C2BD.jpg?v=1758812102&width=600", images: ["https://www.apollooriginals.com/cdn/shop/files/98711DFD-F1ED-46D6-A047-82C7EC85C2BD.jpg?v=1758812102&width=600", "https://www.apollooriginals.com/cdn/shop/files/9C12314D-72A6-4418-B9D2-C86A298E5EE9.jpg?v=1758812102&width=600"], price: 94.99, description: "Essential camo hoodie with all-over camouflage print. Heavyweight cotton with kangaroo pocket and adjustable drawstring hood.", category: "Outerwear", aesthetics: ["Streetwear", "Grunge"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://www.apollooriginals.com/products/apollo-essential-camo-hoodie", trending: true, newArrival: true },
  // Touro Studio
  { id: "p43", name: "Touro Royal Tee (Chicory Coffee)", brandId: "19", brandName: "Touro Studio", image: "https://tourostudio.com/cdn/shop/files/DSC00890_1.jpg?v=1764915038&width=600", images: ["https://tourostudio.com/cdn/shop/files/DSC00890_1.jpg?v=1764915038&width=600", "https://tourostudio.com/cdn/shop/files/DSC00823_1.jpg?v=1764915038&width=600"], price: 21, originalPrice: 26, description: "Oversized tee from the Chicory Coffee collection. Premium cotton with minimalist Touro branding. Quiet form, focused fit.", category: "Tops", aesthetics: ["Minimalist", "Streetwear"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://tourostudio.com/products/touro-royal-tee", trending: true, newArrival: true },
  { id: "p44", name: "Touro Resilience Tee (Chicory Coffee)", brandId: "19", brandName: "Touro Studio", image: "https://tourostudio.com/cdn/shop/files/DSC00225.jpg?v=1764919509&width=600", images: ["https://tourostudio.com/cdn/shop/files/DSC00225.jpg?v=1764919509&width=600", "https://tourostudio.com/cdn/shop/files/DSC00482.jpg?v=1764919508&width=600"], price: 23, originalPrice: 28, description: "Oversized tee from the Chicory Coffee collection featuring the Resilience graphic. Premium cotton construction, purpose-led design.", category: "Tops", aesthetics: ["Minimalist", "Streetwear"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://tourostudio.com/products/touro-resilience-tee-chicory-coffee", trending: true, newArrival: true },
  { id: "p45", name: "Touro Skyline Tee", brandId: "19", brandName: "Touro Studio", image: "https://tourostudio.com/cdn/shop/files/DSC01063.jpg?v=1764917558&width=600", images: ["https://tourostudio.com/cdn/shop/files/DSC01063.jpg?v=1764917558&width=600", "https://tourostudio.com/cdn/shop/files/DSC01112_1.jpg?v=1764917558&width=600"], price: 21, originalPrice: 26, description: "Bestselling oversized tee with skyline-inspired graphic. Premium cotton, intentional silhouette, India-made.", category: "Tops", aesthetics: ["Minimalist", "Streetwear"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://tourostudio.com/products/touro-skyline-tee", trending: true, newArrival: false },
  { id: "p46", name: "Touro Rulebreaker Tee", brandId: "19", brandName: "Touro Studio", image: "https://tourostudio.com/cdn/shop/files/Break_the_rules.jpg?v=1765513807&width=600", images: ["https://tourostudio.com/cdn/shop/files/Break_the_rules.jpg?v=1765513807&width=600", "https://tourostudio.com/cdn/shop/files/DSC01316_1.jpg?v=1765513869&width=600"], price: 21, originalPrice: 26, description: "Oversized tee with bold 'Break The Rules' graphic. Premium cotton, focused fit, minimalist design language.", category: "Tops", aesthetics: ["Minimalist", "Streetwear"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://tourostudio.com/products/touro-rulebreaker-tee-1", trending: false, newArrival: false },
  { id: "p47", name: "Touro Resilience Tee", brandId: "19", brandName: "Touro Studio", image: "https://tourostudio.com/cdn/shop/files/Resilience.jpg?v=1765513571&width=600", images: ["https://tourostudio.com/cdn/shop/files/Resilience.jpg?v=1765513571&width=600", "https://tourostudio.com/cdn/shop/files/DSC01204.jpg?v=1765513571&width=600"], price: 23, originalPrice: 28, description: "Statement oversized tee with Resilience graphic. Premium cotton, purpose-led design, India-made craftsmanship.", category: "Tops", aesthetics: ["Minimalist", "Streetwear"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://tourostudio.com/products/touro-resilience-tee", trending: false, newArrival: false },
  { id: "p48", name: "Touro Signature Tee", brandId: "19", brandName: "Touro Studio", image: "https://tourostudio.com/cdn/shop/files/mockup_blacck.jpg?v=1765515519&width=600", images: ["https://tourostudio.com/cdn/shop/files/mockup_blacck.jpg?v=1765515519&width=600", "https://tourostudio.com/cdn/shop/files/DSC01698.jpg?v=1765515519&width=600"], price: 23, originalPrice: 28, description: "The essential Touro signature tee. Premium oversized construction with signature branding. India-made with purpose-led design.", category: "Tops", aesthetics: ["Minimalist", "Streetwear"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://tourostudio.com/products/touro-signature-tee", trending: true, newArrival: false },
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
