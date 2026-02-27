export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  banner: string;
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

const IMG = (seed: string, w = 600, h = 800) =>
  `https://images.unsplash.com/photo-${seed}?w=${w}&h=${h}&fit=crop&auto=format`;

export const brands: Brand[] = [
  {
    id: "1", name: "MISBHV", slug: "misbhv", logo: IMG("1611162617474-5b21e879e113", 200, 200),
    banner: IMG("1558618666-fcd25c85f82e", 1200, 500), bio: "Warsaw-based label merging post-Soviet aesthetics with club culture and Y2K nostalgia.",
    origin: "Warsaw, Poland", website: "https://misbhv.com", affiliateUrl: "https://misbhv.com?ref=drip",
    instagram: "@misbhv", aesthetics: ["Y2K", "Streetwear", "Avant-Garde"], categories: ["Tops", "Outerwear", "Accessories"],
    priceRange: "premium", followers: 892000, rating: 4.7, featured: true, newDrop: false
  },
  {
    id: "2", name: "Story mfg.", slug: "story-mfg", logo: IMG("1507003211169-0a1dd7228f2d", 200, 200),
    banner: IMG("1523381294911-8d28f28e5a3b", 1200, 500), bio: "Slow-made, hand-dyed clothing rooted in natural processes and positive manufacturing.",
    origin: "London, UK", website: "https://storymfg.com", affiliateUrl: "https://storymfg.com?ref=drip",
    instagram: "@storymfg", aesthetics: ["Bohemian", "Cottagecore"], categories: ["Tops", "Outerwear", "Knitwear"],
    priceRange: "premium", followers: 245000, rating: 4.9, featured: true, newDrop: true
  },
  {
    id: "3", name: "Ahluwalia", slug: "ahluwalia", logo: IMG("1534528741775-53994a69daeb", 200, 200),
    banner: IMG("1558171813-4c2ba397e080", 1200, 500), bio: "Luxury craftsmanship meeting Nigerian-Indian heritage through upcycled textiles.",
    origin: "London, UK", website: "https://ahluwalia.world", affiliateUrl: "https://ahluwalia.world?ref=drip",
    instagram: "@ahluwaliastudio", aesthetics: ["Avant-Garde", "Streetwear"], categories: ["Tops", "Bottoms", "Outerwear"],
    priceRange: "luxury", followers: 178000, rating: 4.8, featured: false, newDrop: true
  },
  {
    id: "4", name: "Satisfy", slug: "satisfy", logo: IMG("1472099645785-5658abf4ff4e", 200, 200),
    banner: IMG("1571902943202-507ec2618e8f", 1200, 500), bio: "Performance running gear designed for the ultra-aesthetic runner who demands both form and function.",
    origin: "Paris, France", website: "https://satisfyrunning.com", affiliateUrl: "https://satisfyrunning.com?ref=drip",
    instagram: "@satisfyrunning", aesthetics: ["Gorpcore", "Techwear", "Minimalist"], categories: ["Tops", "Bottoms", "Accessories"],
    priceRange: "premium", followers: 320000, rating: 4.6, featured: true, newDrop: false
  },
  {
    id: "5", name: "Bode", slug: "bode", logo: IMG("1500648767791-00dcc994a43e", 200, 200),
    banner: IMG("1490481651871-ab68de25d43d", 1200, 500), bio: "One-of-a-kind menswear crafted from antique textiles and deadstock materials.",
    origin: "New York, USA", website: "https://bodenewyork.com", affiliateUrl: "https://bodenewyork.com?ref=drip",
    instagram: "@bikinicountdance", aesthetics: ["Bohemian", "Archive", "Cottagecore"], categories: ["Tops", "Outerwear", "Bottoms"],
    priceRange: "luxury", followers: 410000, rating: 4.9, featured: true, newDrop: false
  },
  {
    id: "6", name: "HELIOT EMIL", slug: "heliot-emil", logo: IMG("1506794778202-cad84cf45f1d", 200, 200),
    banner: IMG("1558618666-fcd25c85f82e", 1200, 500), bio: "Danish label exploring industrial design through deconstructed silhouettes and hardware details.",
    origin: "Copenhagen, Denmark", website: "https://heliotemil.com", affiliateUrl: "https://heliotemil.com?ref=drip",
    instagram: "@heliotemil", aesthetics: ["Avant-Garde", "Techwear", "Brutalist"], categories: ["Outerwear", "Bags", "Accessories"],
    priceRange: "luxury", followers: 285000, rating: 4.7, featured: false, newDrop: true
  },
  {
    id: "7", name: "Paloma Wool", slug: "paloma-wool", logo: IMG("1438761681033-6461ffad8d80", 200, 200),
    banner: IMG("1523381294911-8d28f28e5a3b", 1200, 500), bio: "Barcelona creative project blurring fashion, art, and photography with Mediterranean warmth.",
    origin: "Barcelona, Spain", website: "https://palomawool.com", affiliateUrl: "https://palomawool.com?ref=drip",
    instagram: "@palaboralwool", aesthetics: ["Minimalist", "Bohemian"], categories: ["Dresses", "Tops", "Knitwear"],
    priceRange: "mid", followers: 560000, rating: 4.5, featured: true, newDrop: false
  },
  {
    id: "8", name: "GmbH", slug: "gmbh", logo: IMG("1507003211169-0a1dd7228f2d", 200, 200),
    banner: IMG("1571902943202-507ec2618e8f", 1200, 500), bio: "Berlin-based collective creating fashion at the intersection of club culture and diasporic identity.",
    origin: "Berlin, Germany", website: "https://gmbhgmbh.eu", affiliateUrl: "https://gmbhgmbh.eu?ref=drip",
    instagram: "@gmbh_official", aesthetics: ["Streetwear", "Techwear", "Avant-Garde"], categories: ["Outerwear", "Bottoms", "Footwear"],
    priceRange: "premium", followers: 195000, rating: 4.6, featured: false, newDrop: false
  },
  {
    id: "9", name: "Rier", slug: "rier", logo: IMG("1472099645785-5658abf4ff4e", 200, 200),
    banner: IMG("1490481651871-ab68de25d43d", 1200, 500), bio: "Austrian label bringing Alpine heritage into contemporary menswear through considered fabrics.",
    origin: "Vienna, Austria", website: "https://rier.at", affiliateUrl: "https://rier.at?ref=drip",
    instagram: "@rier___", aesthetics: ["Minimalist", "Old Money", "Gorpcore"], categories: ["Outerwear", "Knitwear", "Bottoms"],
    priceRange: "premium", followers: 67000, rating: 4.8, featured: false, newDrop: true
  },
  {
    id: "10", name: "Eytys", slug: "eytys", logo: IMG("1534528741775-53994a69daeb", 200, 200),
    banner: IMG("1558618666-fcd25c85f82e", 1200, 500), bio: "Stockholm footwear brand known for chunky silhouettes and Scandinavian minimalism.",
    origin: "Stockholm, Sweden", website: "https://eytys.com", affiliateUrl: "https://eytys.com?ref=drip",
    instagram: "@eytys", aesthetics: ["Minimalist", "Streetwear"], categories: ["Footwear", "Bottoms", "Tops"],
    priceRange: "mid", followers: 340000, rating: 4.4, featured: true, newDrop: false
  },
  {
    id: "11", name: "Nanushka", slug: "nanushka", logo: IMG("1500648767791-00dcc994a43e", 200, 200),
    banner: IMG("1523381294911-8d28f28e5a3b", 1200, 500), bio: "Budapest-born brand mastering vegan leather and earthy, sensual modernism.",
    origin: "Budapest, Hungary", website: "https://nanushka.com", affiliateUrl: "https://nanushka.com?ref=drip",
    instagram: "@nanushka", aesthetics: ["Minimalist", "Old Money", "Bohemian"], categories: ["Outerwear", "Dresses", "Bags"],
    priceRange: "premium", followers: 720000, rating: 4.6, featured: true, newDrop: false
  },
  {
    id: "12", name: "PHIPPS", slug: "phipps", logo: IMG("1506794778202-cad84cf45f1d", 200, 200),
    banner: IMG("1571902943202-507ec2618e8f", 1200, 500), bio: "Workwear-inspired sustainable fashion rooted in environmental activism and utilitarian design.",
    origin: "Paris, France", website: "https://phfranklinphipps.com", affiliateUrl: "https://phipps.com?ref=drip",
    instagram: "@phipps", aesthetics: ["Gorpcore", "Streetwear", "Grunge"], categories: ["Outerwear", "Tops", "Bottoms"],
    priceRange: "mid", followers: 89000, rating: 4.3, featured: false, newDrop: true
  },
  {
    id: "13", name: "Eckhaus Latta", slug: "eckhaus-latta", logo: IMG("1438761681033-6461ffad8d80", 200, 200),
    banner: IMG("1490481651871-ab68de25d43d", 1200, 500), bio: "LA art-world darlings challenging gender norms through knitwear and deconstructed Americana.",
    origin: "Los Angeles, USA", website: "https://eckhauslatta.com", affiliateUrl: "https://eckhauslatta.com?ref=drip",
    instagram: "@eckhauslatta", aesthetics: ["Avant-Garde", "Grunge", "Archive"], categories: ["Knitwear", "Tops", "Dresses"],
    priceRange: "luxury", followers: 230000, rating: 4.7, featured: false, newDrop: false
  },
  {
    id: "14", name: "Auralee", slug: "auralee", logo: IMG("1507003211169-0a1dd7228f2d", 200, 200),
    banner: IMG("1558618666-fcd25c85f82e", 1200, 500), bio: "Japanese brand defining quiet luxury with impeccable fabrics and understated silhouettes.",
    origin: "Tokyo, Japan", website: "https://auralee.jp", affiliateUrl: "https://auralee.jp?ref=drip",
    instagram: "@auralee_official", aesthetics: ["Minimalist", "Old Money"], categories: ["Tops", "Bottoms", "Knitwear", "Outerwear"],
    priceRange: "premium", followers: 155000, rating: 4.9, featured: true, newDrop: false
  },
  {
    id: "15", name: "Collina Strada", slug: "collina-strada", logo: IMG("1534528741775-53994a69daeb", 200, 200),
    banner: IMG("1523381294911-8d28f28e5a3b", 1200, 500), bio: "Eco-conscious NYC label with tie-dye maximalism, deadstock fabrics, and garden party energy.",
    origin: "New York, USA", website: "https://collinastrada.com", affiliateUrl: "https://collinastrada.com?ref=drip",
    instagram: "@collinastrada", aesthetics: ["Bohemian", "Y2K", "Cottagecore"], categories: ["Dresses", "Tops", "Accessories"],
    priceRange: "mid", followers: 390000, rating: 4.5, featured: false, newDrop: true
  },
  {
    id: "16", name: "VeroBottega", slug: "verobottega", logo: "https://verobottega.store/cdn/shop/files/IMG_7344.jpg?crop=center&height=200&width=200",
    banner: "https://verobottega.store/cdn/shop/files/IMG_7344.jpg?crop=center&height=500&width=1200", bio: "Streetwear label crafting premium tracksuits, polos, and essentials straight from the workshop.",
    origin: "USA", website: "https://verobottega.store", affiliateUrl: "https://verobottega.store",
    instagram: "@verobottega", aesthetics: ["Streetwear", "Minimalist"], categories: ["Tops", "Bottoms", "Outerwear"],
    priceRange: "mid", followers: 15000, rating: 4.5, featured: true, newDrop: true
  },
];

export const products: Product[] = [
  { id: "p1", name: "Reconstructed Sport Top", brandId: "1", brandName: "MISBHV", image: IMG("1515886657613-9f3515b0c78f"), images: [IMG("1515886657613-9f3515b0c78f"), IMG("1583743814966-8936f5b7be1a")], price: 245, description: "Asymmetric sport top with reconstructed paneling.", category: "Tops", aesthetics: ["Y2K", "Streetwear"], sizes: ["XS", "S", "M", "L"], affiliateUrl: "https://misbhv.com/tops?ref=drip", trending: true, newArrival: false },
  { id: "p2", name: "Acid Wash Cargo Pants", brandId: "1", brandName: "MISBHV", image: IMG("1594938298603-c8148c4dae35"), images: [IMG("1594938298603-c8148c4dae35")], price: 380, description: "Oversized cargo pant with acid wash finish.", category: "Bottoms", aesthetics: ["Y2K", "Streetwear"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://misbhv.com/pants?ref=drip", trending: true, newArrival: false },
  { id: "p3", name: "Hand-Dyed Sundae Jacket", brandId: "2", brandName: "Story mfg.", image: IMG("1591047139829-d91aecb6caea"), images: [IMG("1591047139829-d91aecb6caea")], price: 520, description: "Naturally hand-dyed jacket using ancient techniques.", category: "Outerwear", aesthetics: ["Bohemian", "Cottagecore"], sizes: ["S", "M", "L"], affiliateUrl: "https://storymfg.com/jackets?ref=drip", trending: true, newArrival: true },
  { id: "p4", name: "Crochet Grateful Vest", brandId: "2", brandName: "Story mfg.", image: IMG("1434389677669-e08b4cda3a12"), images: [IMG("1434389677669-e08b4cda3a12")], price: 340, description: "Hand-crocheted vest with positive messaging.", category: "Knitwear", aesthetics: ["Bohemian", "Cottagecore"], sizes: ["One Size"], affiliateUrl: "https://storymfg.com/knit?ref=drip", trending: false, newArrival: true },
  { id: "p5", name: "Patchwork Heritage Shirt", brandId: "3", brandName: "Ahluwalia", image: IMG("1596755094514-f87e34085b2c"), images: [IMG("1596755094514-f87e34085b2c")], price: 450, description: "Upcycled patchwork shirt honoring textile heritage.", category: "Tops", aesthetics: ["Avant-Garde", "Streetwear"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://ahluwalia.world/tops?ref=drip", trending: true, newArrival: true },
  { id: "p6", name: "TechSilk Running Tee", brandId: "4", brandName: "Satisfy", image: IMG("1571019613454-1cb2f99b2d8b"), images: [IMG("1571019613454-1cb2f99b2d8b")], price: 165, description: "Ultralight silk-blend running tee.", category: "Tops", aesthetics: ["Gorpcore", "Techwear"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://satisfyrunning.com/tops?ref=drip", trending: false, newArrival: false },
  { id: "p7", name: "Moth Short", brandId: "4", brandName: "Satisfy", image: IMG("1552374196-c4e7ffc6e126"), images: [IMG("1552374196-c4e7ffc6e126")], price: 195, description: "Lightweight running short with side panel.", category: "Bottoms", aesthetics: ["Gorpcore", "Minimalist"], sizes: ["S", "M", "L"], affiliateUrl: "https://satisfyrunning.com/shorts?ref=drip", trending: true, newArrival: false },
  { id: "p8", name: "Quilted Farm Jacket", brandId: "5", brandName: "Bode", image: IMG("1551028719-00167b16eac5"), images: [IMG("1551028719-00167b16eac5")], price: 1200, description: "One-of-a-kind quilted jacket from antique fabrics.", category: "Outerwear", aesthetics: ["Bohemian", "Archive"], sizes: ["S", "M", "L"], affiliateUrl: "https://bodenewyork.com/outerwear?ref=drip", trending: true, newArrival: false },
  { id: "p9", name: "Lace Camp Collar Shirt", brandId: "5", brandName: "Bode", image: IMG("1598300042247-d088f8ab3a91"), images: [IMG("1598300042247-d088f8ab3a91")], price: 680, description: "Camp collar shirt with antique lace overlay.", category: "Tops", aesthetics: ["Bohemian", "Archive"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://bodenewyork.com/shirts?ref=drip", trending: false, newArrival: false },
  { id: "p10", name: "Carabiner Harness Bag", brandId: "6", brandName: "HELIOT EMIL", image: IMG("1548036328-c83913d01abb"), images: [IMG("1548036328-c83913d01abb")], price: 590, description: "Industrial-inspired harness bag with carabiner hardware.", category: "Bags", aesthetics: ["Avant-Garde", "Techwear", "Brutalist"], sizes: ["One Size"], affiliateUrl: "https://heliotemil.com/bags?ref=drip", trending: true, newArrival: true },
  { id: "p11", name: "Deconstructed Trench", brandId: "6", brandName: "HELIOT EMIL", image: IMG("1544441893-675835a29f3d"), images: [IMG("1544441893-675835a29f3d")], price: 980, description: "Trench coat with raw-edge deconstruction.", category: "Outerwear", aesthetics: ["Avant-Garde", "Brutalist"], sizes: ["S", "M", "L"], affiliateUrl: "https://heliotemil.com/outerwear?ref=drip", trending: false, newArrival: true },
  { id: "p12", name: "Printed Mesh Dress", brandId: "7", brandName: "Paloma Wool", image: IMG("1515372823-9b1c9916f81e"), images: [IMG("1515372823-9b1c9916f81e")], price: 185, description: "Body-skimming mesh dress with artistic print.", category: "Dresses", aesthetics: ["Minimalist", "Bohemian"], sizes: ["XS", "S", "M", "L"], affiliateUrl: "https://palomawool.com/dresses?ref=drip", trending: true, newArrival: false },
  { id: "p13", name: "Organic Linen Trouser", brandId: "7", brandName: "Paloma Wool", image: IMG("1594938298603-c8148c4dae35"), images: [IMG("1594938298603-c8148c4dae35")], price: 155, description: "Wide-leg organic linen trouser.", category: "Bottoms", aesthetics: ["Minimalist"], sizes: ["XS", "S", "M", "L", "XL"], affiliateUrl: "https://palomawool.com/bottoms?ref=drip", trending: false, newArrival: false },
  { id: "p14", name: "Technical Bomber", brandId: "8", brandName: "GmbH", image: IMG("1551028719-00167b16eac5"), images: [IMG("1551028719-00167b16eac5")], price: 720, description: "Bonded technical fabric bomber jacket.", category: "Outerwear", aesthetics: ["Streetwear", "Techwear"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://gmbhgmbh.eu/outerwear?ref=drip", trending: false, newArrival: false },
  { id: "p15", name: "Alpine Boiled Wool Coat", brandId: "9", brandName: "Rier", image: IMG("1544441893-675835a29f3d"), images: [IMG("1544441893-675835a29f3d")], price: 890, description: "Traditional boiled wool coat with modern cut.", category: "Outerwear", aesthetics: ["Minimalist", "Old Money"], sizes: ["S", "M", "L"], affiliateUrl: "https://rier.at/coats?ref=drip", trending: true, newArrival: true },
  { id: "p16", name: "Angel Platform Sneaker", brandId: "10", brandName: "Eytys", image: IMG("1549298916-b41d501d3772"), images: [IMG("1549298916-b41d501d3772")], price: 280, description: "Chunky platform sneaker in premium leather.", category: "Footwear", aesthetics: ["Minimalist", "Streetwear"], sizes: ["36", "37", "38", "39", "40", "41", "42", "43", "44"], affiliateUrl: "https://eytys.com/sneakers?ref=drip", trending: true, newArrival: false },
  { id: "p17", name: "Vegan Leather Puffer", brandId: "11", brandName: "Nanushka", image: IMG("1591047139829-d91aecb6caea"), images: [IMG("1591047139829-d91aecb6caea")], price: 495, description: "Oversized vegan leather puffer in cream.", category: "Outerwear", aesthetics: ["Minimalist", "Old Money"], sizes: ["XS", "S", "M", "L"], affiliateUrl: "https://nanushka.com/puffers?ref=drip", trending: true, newArrival: false },
  { id: "p18", name: "Tie Dye Deadstock Gown", brandId: "15", brandName: "Collina Strada", image: IMG("1515372823-9b1c9916f81e"), images: [IMG("1515372823-9b1c9916f81e")], price: 350, originalPrice: 420, description: "Floor-length gown made from deadstock tie-dye fabric.", category: "Dresses", aesthetics: ["Bohemian", "Y2K", "Cottagecore"], sizes: ["XS", "S", "M", "L"], affiliateUrl: "https://collinastrada.com/dresses?ref=drip", trending: false, newArrival: true },
  { id: "p19", name: "Cashmere Cloud Knit", brandId: "14", brandName: "Auralee", image: IMG("1434389677669-e08b4cda3a12"), images: [IMG("1434389677669-e08b4cda3a12")], price: 620, description: "Ultra-soft cashmere crewneck in signature oversized cut.", category: "Knitwear", aesthetics: ["Minimalist", "Old Money"], sizes: ["S", "M", "L"], affiliateUrl: "https://auralee.jp/knit?ref=drip", trending: true, newArrival: false },
  { id: "p20", name: "Open Knit Tank", brandId: "13", brandName: "Eckhaus Latta", image: IMG("1583743814966-8936f5b7be1a"), images: [IMG("1583743814966-8936f5b7be1a")], price: 295, description: "Sheer open-knit tank with raw edges.", category: "Knitwear", aesthetics: ["Avant-Garde", "Grunge"], sizes: ["XS", "S", "M", "L"], affiliateUrl: "https://eckhauslatta.com/knit?ref=drip", trending: false, newArrival: false },
  { id: "p21", name: "Green Legacy Pants", brandId: "16", brandName: "VeroBottega", image: "https://verobottega.store/cdn/shop/files/F0F02233-AC93-4228-BD9E-DB136F18F066.jpg?crop=center&height=800&width=600", images: ["https://verobottega.store/cdn/shop/files/F0F02233-AC93-4228-BD9E-DB136F18F066.jpg?crop=center&height=800&width=600"], price: 64, originalPrice: 68, description: "Two-tone tracksuits carefully crafted at each seam with metal studs, full metal zipper, oversized 3-panel hood, jumbo/reg DTG prints, and ribbed cuffs and hem. Premium French Terry Cotton rated at 400 GSM.", category: "Bottoms", aesthetics: ["Streetwear"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://verobottega.store/products/green-legacy-pants", trending: true, newArrival: true },
  { id: "p22", name: "Green Legacy Hoodie", brandId: "16", brandName: "VeroBottega", image: "https://verobottega.store/cdn/shop/files/IMG-7500.webp?crop=center&height=800&width=600", images: ["https://verobottega.store/cdn/shop/files/IMG-7500.webp?crop=center&height=800&width=600"], price: 68, originalPrice: 72, description: "Two-tone tracksuits carefully crafted at each seam with metal studs, full metal zipper, oversized 3-panel hood, jumbo/reg DTG prints, and ribbed cuffs and hem. Premium French Terry Cotton rated at 400 GSM.", category: "Tops", aesthetics: ["Streetwear"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://verobottega.store/products/legacy-tracksuits-green", trending: true, newArrival: true },
  { id: "p23", name: "United Long Sleeve Polo", brandId: "16", brandName: "VeroBottega", image: "https://verobottega.store/cdn/shop/files/IMG-7501.webp?crop=center&height=800&width=600", images: ["https://verobottega.store/cdn/shop/files/IMG-7501.webp?crop=center&height=800&width=600"], price: 53, originalPrice: 64, description: "Long sleeve button-up polo made with jersey cotton material. Comfy, breathable, and created with the intention of being able to be worn on and off the field. Available in Black, White, and Pink.", category: "Tops", aesthetics: ["Streetwear", "Minimalist"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://verobottega.store/products/united-long-sleeve-polo", trending: true, newArrival: true },
  { id: "p24", name: "FTA Jerseys", brandId: "16", brandName: "VeroBottega", image: "https://verobottega.store/cdn/shop/files/IMG-7502.webp?crop=center&height=800&width=600", images: ["https://verobottega.store/cdn/shop/files/IMG-7502.webp?crop=center&height=800&width=600"], price: 45, originalPrice: 60, description: "100% woven cotton with double-layered collar, DTF print, drop shoulders, and boxy fit. True to size. Available in Black and Navy.", category: "Tops", aesthetics: ["Streetwear"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://verobottega.store/products/fta-jerseys", trending: false, newArrival: true },
  { id: "p25", name: "Vero Santo Sweatpants", brandId: "16", brandName: "VeroBottega", image: "https://verobottega.store/cdn/shop/files/Generated_with_Kive.ai_-_kive-image.png?crop=center&height=800&width=600", images: ["https://verobottega.store/cdn/shop/files/Generated_with_Kive.ai_-_kive-image.png?crop=center&height=800&width=600"], price: 45, originalPrice: 68, description: "100% cotton straight-leg sweatpants with embroidered logo and stripes, ribbed waistband. Fits true to size. Available in Black and Beige.", category: "Bottoms", aesthetics: ["Streetwear", "Minimalist"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://verobottega.store/products/vero-santo-sweatpants", trending: false, newArrival: true },
  { id: "p26", name: "Young Shiner Zip-up", brandId: "16", brandName: "VeroBottega", image: "https://verobottega.store/cdn/shop/files/E44A6D7C-E642-4B39-BD00-B1B4B82B065A.jpg?crop=center&height=800&width=600", images: ["https://verobottega.store/cdn/shop/files/E44A6D7C-E642-4B39-BD00-B1B4B82B065A.jpg?crop=center&height=800&width=600"], price: 53, originalPrice: 68, description: "100% cotton zip-up with distressed embroidery on the front logo, slightly cropped with drop shoulders. Fits true to size. Available in Black and Beige.", category: "Outerwear", aesthetics: ["Streetwear"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://verobottega.store/products/young-shiner-zip-up", trending: false, newArrival: false },
  { id: "p27", name: "VERO Staple Wash Hoodie", brandId: "16", brandName: "VeroBottega", image: "https://verobottega.store/cdn/shop/files/1E493B78-B45E-4B20-80AB-768095617721.jpg?crop=center&height=800&width=600", images: ["https://verobottega.store/cdn/shop/files/1E493B78-B45E-4B20-80AB-768095617721.jpg?crop=center&height=800&width=600"], price: 57, originalPrice: 79, description: "100% French terry cotton with pigment wash, chenille embroidery, custom zipper, and woven neck label. True to size. Available in Green and Gray.", category: "Tops", aesthetics: ["Streetwear"], sizes: ["S", "M", "L", "XL"], affiliateUrl: "https://verobottega.store/products/vero-staple-wash-hoodie", trending: true, newArrival: false },
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
