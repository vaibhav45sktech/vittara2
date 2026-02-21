export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  size: string;
  fabric: string;
  color: string;
  images: string[]; // Array of 4 different pose images
  videoUrl?: string; // Made optional
  category?: 'pant' | 'shirt'; // Added for fit selection
}

const products: Product[] = [
  {
    id: 1,
    title: "Modern Ivory Gurkha Pant",
    description: "A masterpiece of modern tailoring, this Ivory Gurkha pant features a high-waisted design with signature side buckles. Crafted from premium cotton blend for breathability and comfort, it offers a refined silhouette perfect for smart casual or semi-formal occasions.",
    price: 799,
    size: "32",
    fabric: "cotton-blend",
    color: "ivory",
    images: [
      "/images/new-collection/Pant 11/pant1.jpg",
      "/images/new-collection/Pant 11/pant3.jpg",
      "/images/new-collection/Pant 11/pant4.jpg",
      "/images/new-collection/Pant 11/pant5.jpg"
    ]
  },
  {
    id: 2,
    title: "Classic Navy Tailored Gurkha",
    description: "Sharp, sophisticated, and timeless. This Classic Navy Gurkha pant brings sartorial elegance to your wardrobe. The structured fit, combined with the traditional Gurkha waistband, provides a commanding presence suitable for business and formal settings.",
    price: 799,
    size: "34",
    fabric: "wool-blend",
    color: "navy",
    images: [
      "/images/new-collection/Pant 22/p2.png",
      "/images/new-collection/Pant 22/p3.png",
      "/images/new-collection/Pant 22/p4.jpg",
      "/images/new-collection/Pant 22/p5.jpg"
    ]
  },
  {
    id: 3,
    title: "Olive Drab Casual Shirt",
    description: "Effortlessly stylish, this Olive Drab shirt is cut from high-quality linen. Designed for the modern man, it features a relaxed fit ensuring comfort throughout the day while maintaining a crisp look. Pairs perfectly with our Gurkha pants.",
    price: 799,
    size: "L",
    fabric: "linen",
    color: "olive",
    images: [
      "/images/new-collection/Shirts/shirt5.jpg",
      "/images/new-collection/Shirts/shirt2.jpg",
      "/images/new-collection/Shirts/shirt6.jpg",
      "/images/new-collection/Shirts/shirt7.jpg"
    ]
  },
  {
    id: 4,
    title: "Crimson Red Statement Pant",
    description: "Make a bold statement with these Crimson Red pants. Featuring a contemporary cut and vibrant hue, they are designed for those who appreciate distinct style. The customized fabric ensures durability while offering a smooth, premium hand feel.",
    price: 799,
    size: "30",
    fabric: "cotton",
    color: "crimson",
    images: [
      "/images/new-collection/Pant 11/pant7.jpg",
      "/images/new-collection/Pant 11/pant8.jpg",
      "/images/new-collection/Pant 11/pant9.jpg",
      "/images/new-collection/Pant 11/pant14.jpg"
    ]
  },
  {
    id: 5,
    title: "Slate Grey Formal Trousers",
    description: "The epitome of versatility, these Slate Grey trousers are an essential addition to any curated wardrobe. The fabric is lightweight yet structured, offering a flawless drape. Ideal for daily office wear or evening gatherings.",
    price: 799,
    size: "36",
    fabric: "poly-viscose",
    color: "grey",
    images: [
      "/images/new-collection/Pant 22/p6.jpg",
      "/images/new-collection/Pant 22/p7.jpg",
      "/images/new-collection/Pant 22/p8.jpg",
      "/images/new-collection/Pant 22/p9.jpg"
    ]
  }
];

export default products;