export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  size: string;
  fabric: string;
  color: string;
  images: string[]; // Array of 4 different pose images
  videoUrl: string;
}

const products: Product[] = [
  {
    id: 1,
    title: "Royal Red Silk Lehenga",
    description: "Exquisite royal red silk lehenga with intricate golden embroidery and traditional motifs. Perfect for weddings and special occasions. Features heavy work on the blouse and dupatta with delicate beadwork throughout. This stunning piece combines traditional craftsmanship with contemporary design elements.",
    price: 1,
    size: "M",
    fabric: "silk",
    color: "red",
    images: [
      "/images/row1/PIY_7877.JPG",
      "/images/row1/PIY_7884.JPG", 
      "/images/row1/PIY_7899.JPG",
      "/images/row1/PIY_7902.JPG"
    ],
    videoUrl: "/images/row1/PIY_7909.MP4"
  },
  {
    id: 2,
    title: "Golden Yellow Bridal Lehenga",
    description: "Stunning golden yellow bridal lehenga with heavy zardozi work and mirror embellishments. Features a fully embroidered blouse with intricate patterns and a matching dupatta. This masterpiece showcases the finest Indian craftsmanship with luxurious silk fabric and premium quality threads.",
    price: 22500,
    size: "L",
    fabric: "silk",
    color: "yellow",
    images: [
      "/images/row2/PIY_7926.JPG",
      "/images/row2/PIY_7930.JPG",
      "/images/row2/PIY_7935.JPG", 
      "/images/row2/PIY_7937.JPG"
    ],
    videoUrl: "/images/row2/PIY_7948.MP4"
  },
  {
    id: 3,
    title: "Elegant Cotton Red Lehenga",
    description: "Beautiful cotton red lehenga with block print designs and traditional motifs. Comfortable yet elegant, perfect for daytime events and celebrations. Features lightweight cotton fabric with vibrant colors and comfortable fit. Ideal for festive occasions and cultural events.",
    price: 3999,
    size: "S",
    fabric: "cotton",
    color: "red",
    images: [
      "/images/row3/PIY_7966.JPG",
      "/images/row3/PIY_7971.JPG",
      "/images/row3/PIY_7978.JPG",
      "/images/row3/PIY_7988.JPG"
    ],
    videoUrl: "/images/row3/PIY_7998.MP4"
  },
  {
    id: 4,
    title: "Premium Silk Yellow Lehenga",
    description: "Premium silk yellow lehenga with contemporary design elements and traditional embroidery. Features modern silhouette with classic Indian aesthetics. Hand-embroidered with silk threads and adorned with delicate sequins. Perfect blend of tradition and modernity.",
    price: 8750,
    size: "XL",
    fabric: "silk", 
    color: "yellow",
    images: [
      "/images/row4/PIY_8015.JPG",
      "/images/row4/PIY_8019.JPG",
      "/images/row4/PIY_8025.JPG",
      "/images/row4/PIY_8029.JPG"
    ],
    videoUrl: "/images/row4/PIY_8053.MP4"
  },
  {
    id: 5,
    title: "Designer Cotton Yellow Lehenga",
    description: "Designer cotton yellow lehenga with unique patterns and comfortable fit. Features innovative design elements with traditional Indian aesthetics. Made from premium cotton fabric with vibrant prints and modern styling. Perfect for casual celebrations and day events.",
    price: 5250,
    size: "M",
    fabric: "cotton",
    color: "yellow", 
    images: [
      "/images/row5/PIY_8077.JPG",
      "/images/row5/PIY_8086.JPG",
      "/images/row5/PIY_8089.JPG",
      "/images/row5/PIY_8096.JPG"
    ],
    videoUrl: "/images/row5/PIY_8108.MP4"
  }
];

export default products;