import ProductListingServer from "../components/server/ProductListingServer";

const SHIRT_SECTIONS = [
  {
    id: "shirts",
    category: "shirt" as const,
    title: "Fittara Premium Shirts",
    description: "Elevate your wardrobe with our latest collection of premium shirts. Meticulously crafted from high-quality fabrics, these shirts offer the perfect balance of sophistication and comfort. Whether for a formal setting or a casual outing, find your perfect fit with Fittara.",
    details: [
      "Selected premium fabrics including Linen, Cotton, and Silk blends",
      "Tailored for a sharp, modern fit",
      "Variety of styles from formal to smart casual",
      "Breathable and comfortable"
    ],
    care: [
      "Machine wash cold or dry clean for best results",
      "Tumble dry low",
      "Iron on medium heat",
      "Do not bleach"
    ]
  }
];

export default function ShirtPage() {
  return (
    <ProductListingServer 
      sections={SHIRT_SECTIONS} 
      pageTitle="The Fittara Shirt Collection"
      subTitle="Refined shirts for every occasion."
    />
  );
}
