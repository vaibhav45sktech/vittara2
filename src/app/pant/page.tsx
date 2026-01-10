"use client";

import ProductListing from "../components/ProductListing";

const PANT_SECTIONS = [
  {
    id: "pant-11",
    category: "modern" as const,
    title: "FITTARA Modern Pleated Gurkha Pants",
    description: "Designed for comfort with a refined edge, the FITTARA Modern Pleated Gurkha Pants feature a high-waist Gurkha construction with front pleats that provide extra ease and natural movement. The pleated design adds comfort around the thigh area while maintaining a clean, modern silhouette. Made using customized fabric, these pants offer breathability, smooth drape, and everyday versatility — making them ideal for workwear and smart casual styling.",
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
    title: "FITTARA Classic Gurkha Pants",
    description: "The FITTARA Classic Gurkha Pants are designed for a sharper, more defined look. With a refined tailored fit, this style enhances posture and delivers a clean, confident silhouette. Featuring the same Gurkha waist construction with side buckles, these pants are made using a customized fabric that offers better structure, smooth drape, and a premium hand feel — ideal for occasions where appearance matters most.",
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
  }
];

export default function PantPage() {
  return (
    <ProductListing 
      sections={PANT_SECTIONS} 
      pageTitle="The FITTARA Pant Collection"
      subTitle="Premium Gurkha pants designed for modern elegance and classic style."
    />
  );
}
