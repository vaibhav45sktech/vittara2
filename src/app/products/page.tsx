import ProductListingServer from "../components/server/ProductListingServer";

const ALL_SECTIONS = [
  {
    id: "pant-11",
    category: "modern" as const,
    title: "Fittara Modern Pleated Gurkha Pants",
    description: "Designed for comfort with a refined edge, the Fittara Modern Pleated Gurkha Pants feature a high-waist Gurkha construction with front pleats that provide extra ease and natural movement. The pleated design adds comfort around the thigh area while maintaining a clean, modern silhouette. Made using customized fabric, these pants offer breathability, smooth drape, and everyday versatility — making them ideal for workwear and smart casual styling.",
    details: [
      "High-waist Gurkha fit",
      "Side buckle waist",
      "Balanced classic silhouette",
      "Customized fabric for comfort & durability",
      "Suitable for daily and formal wear"
    ],
    care: [
      "Dry clean recommended",
      "Do not bleach",
      "Low heat iron",
      "Hang after use to maintain shape"
    ]
  },
  {
    id: "pant-22",
    category: "classic" as const,
    title: "Fittara Classic Gurkha Pants",
    description: "The Fittara Classic Gurkha Pants are designed for a sharper, more defined look. With a refined tailored fit, this style enhances posture and delivers a clean, confident silhouette. Featuring the same Gurkha waist construction with side buckles, these pants are made using a customized fabric that offers better structure, smooth drape, and a premium hand feel — ideal for occasions where appearance matters most.",
    details: [
      "High-waist Gurkha fit",
      "Side buckle waist",
      "Balanced classic silhouette",
      "Customized fabric for comfort & durability",
      "Suitable for daily and formal wear"
    ],
    care: [
      "Dry clean recommended",
      "Do not bleach",
      "Low heat iron",
      "Hang after use to maintain shape"
    ]
  },
  {
    id: "shirts",
    category: "shirt" as const,
    title: "Fittara Premium Shirts",
    description: "Experience the epitome of style and comfort with our curated collection of premium shirts. From crisp formal wear to relaxed casual styles, each piece is crafted with attention to detail and high-quality fabrics to ensure you look your best.",
    details: [
      "Premium quality fabrics",
      "Expert tailoring for perfect fit",
      "Versatile designs",
      "Comfortable for all-day wear"
    ],
    care: [
      "Machine wash cold",
      "Tumble dry low",
      "Iron on medium heat",
      "Do not bleach"
    ]
  }
];

export default function ProductsPage() {
  return (
    <ProductListingServer 
      sections={ALL_SECTIONS} 
      pageTitle="The Fittara Collection"
      subTitle="Discover our complete range of premium apparel."
    />
  );
}