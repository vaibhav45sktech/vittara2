import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

async function uploadManualProducts() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log('Starting manual product upload...');
    
    // Define all products manually based on the internal storage structure
    const products = [
      // Pant 11 - A1 to A5 (5 pants)
      {
        name: "FITTARA Black Classic Double-Buckle Gurkha Trousers",
        description: "The FITTARA Black Classic Double-Buckle Gurkha Trousers embody timeless tailoring with a bold, structured presence. Designed with an overlapping high-rise waistband and distinctive double-buckle detailing, this style delivers a strong, elegant silhouette rooted in classic design principles.",
        price: 3499,
        category: "pant",
        image: "/images/internal/Pant 11/A1/1767408097400.jpg",
        additionalImages: [
          "/images/internal/Pant 11/A1/1767408366593.png",
          "/images/internal/Pant 11/A1/1767414337510.jpg",
          "/images/internal/Pant 11/A1/virtual-photoshoot-1.jpg (4).png",
          "/images/internal/Pant 11/A1/virtual-photoshoot-2.jpg (4).png",
          "/images/internal/Pant 11/A1/virtual-photoshoot-3.jpg.png"
        ]
      },
      {
        name: "FITTARA Navy Wool Blend Slim Fit Chinos",
        description: "Premium wool blend chinos featuring slim fit silhouette with refined details. Perfect for smart casual occasions with exceptional comfort and durability.",
        price: 2999,
        category: "pant",
        image: "/images/internal/Pant 11/A2/image1.jpg",
        additionalImages: []
      },
      {
        name: "FITTARA Charcoal Formal Dress Pants",
        description: "Classic charcoal formal trousers crafted from premium fabric with impeccable finish. Ideal for business meetings and formal events.",
        price: 3299,
        category: "pant",
        image: "/images/internal/Pant 11/A3/image1.jpg",
        additionalImages: []
      },
      {
        name: "FITTARA Brown Leather Belt Detailed Trousers",
        description: "Stylish trousers featuring genuine leather belt details and contemporary cut. Versatile piece for both office and weekend wear.",
        price: 3199,
        category: "pant",
        image: "/images/internal/Pant 11/A4/image1.jpg",
        additionalImages: []
      },
      {
        name: "FITTARA Grey Premium Casual Pants",
        description: "Comfortable grey casual pants with modern fit and quality construction. Perfect for everyday wear with superior fabric feel.",
        price: 2799,
        category: "pant",
        image: "/images/internal/Pant 11/A5/image1.jpg",
        additionalImages: []
      },
      
      // Pant 22 - B1 to B6 (6 pants)
      {
        name: "FITTARA Black Formal Evening Trousers",
        description: "Sophisticated black evening trousers with sleek design and premium fabric. Perfect for formal dinners and special occasions.",
        price: 3699,
        category: "pant",
        image: "/images/internal/Pant 22/B1/1767416931443.png",
        additionalImages: [
          "/images/internal/Pant 22/B1/1767417201916.jpg",
          "/images/internal/Pant 22/B1/1767417371294.jpg",
          "/images/internal/Pant 22/B1/1767420307160.jpg"
        ]
      },
      {
        name: "FITTARA Navy Slim Business Pants",
        description: "Professional navy business pants with slim fit and wrinkle-resistant fabric. Essential for the modern professional wardrobe.",
        price: 3399,
        category: "pant",
        image: "/images/internal/Pant 22/B2/image1.jpg",
        additionalImages: []
      },
      {
        name: "FITTARA Olive Green Cargo Pants",
        description: "Functional olive green cargo pants with multiple pockets and comfortable fit. Great for casual outings and weekend adventures.",
        price: 2899,
        category: "pant",
        image: "/images/internal/Pant 22/B3/image1.jpg",
        additionalImages: []
      },
      {
        name: "FITTARA White Linen Summer Trousers",
        description: "Lightweight white linen trousers perfect for summer occasions. Breathable fabric with relaxed fit for maximum comfort.",
        price: 2699,
        category: "pant",
        image: "/images/internal/Pant 22/B4/image1.jpg",
        additionalImages: []
      },
      {
        name: "FITTARA Burgundy Velvet Formal Pants",
        description: "Luxurious burgundy velvet formal pants with rich texture and elegant drape. Statement piece for special formal events.",
        price: 3999,
        category: "pant",
        image: "/images/internal/Pant 22/B5/image1.jpg",
        additionalImages: []
      },
      {
        name: "FITTARA Khaki Adventure Shorts",
        description: "Durable khaki adventure shorts designed for outdoor activities. Quick-dry fabric with reinforced construction for active lifestyles.",
        price: 2499,
        category: "pant",
        image: "/images/internal/Pant 22/B6/image1.jpg",
        additionalImages: []
      },
      
      // Shirts - S1 to S4 (4 shirts)
      {
        name: "FITTARA White Premium Dress Shirt",
        description: "Classic white dress shirt crafted from premium cotton with perfect fit. Timeless piece for formal occasions and business settings.",
        price: 2199,
        category: "shirt",
        image: "/images/internal/Shirts/S1/1767334222586.jpg",
        additionalImages: [
          "/images/internal/Shirts/S1/1767334430882.png",
          "/images/internal/Shirts/S1/1767334511818.jpg",
          "/images/internal/Shirts/S1/1767334711386.jpg",
          "/images/internal/Shirts/S1/1767334840359.jpg",
          "/images/internal/Shirts/S1/1767334913079.jpg"
        ]
      },
      {
        name: "FITTARA Blue Oxford Casual Shirt",
        description: "Versatile blue oxford shirt with button-down collar and comfortable fit. Perfect for smart casual looks and weekend wear.",
        price: 1999,
        category: "shirt",
        image: "/images/internal/Shirts/S2/image1.jpg",
        additionalImages: []
      },
      {
        name: "FITTARA Black Linen Blend Shirt",
        description: "Stylish black linen blend shirt with relaxed fit and natural texture. Ideal for summer evenings and casual sophistication.",
        price: 2299,
        category: "shirt",
        image: "/images/internal/Shirts/S3/image1.jpg",
        additionalImages: []
      },
      {
        name: "FITTARA Striped Cotton Polo Shirt",
        description: "Classic striped polo shirt made from premium cotton with comfortable fit. Perfect for casual outings and sporty elegance.",
        price: 1799,
        category: "shirt",
        image: "/images/internal/Shirts/S4/image1.jpg",
        additionalImages: []
      }
    ];
    
    console.log(`Uploading ${products.length} products...`);
    
    for (let i = 0; i < products.length; i++) {
      const productData = products[i];
      console.log(`Processing product ${i + 1}/${products.length}: ${productData.name}`);
      
      // Create product
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          image: productData.image,
          category: productData.category
        }
      });
      
      console.log(`Created product: ${product.name} (${product.category})`);
      
      // Add additional images
      for (let j = 0; j < productData.additionalImages.length; j++) {
        await prisma.productImage.create({
          data: {
            url: productData.additionalImages[j],
            order: j + 1,
            productId: product.id
          }
        });
      }
      
      if (productData.additionalImages.length > 0) {
        console.log(`Added ${productData.additionalImages.length} additional images`);
      }
      
      // Add variants
      const sizes = ['S', 'M', 'L', 'XL'];
      const colors = productData.category === 'shirt' 
        ? ['White', 'Blue', 'Black', 'Striped']
        : ['Black', 'Navy', 'Charcoal', 'Brown', 'Olive', 'Khaki'];
      
      for (const size of sizes) {
        for (const color of colors.slice(0, 4)) { // Limit to 4 colors per product
          await prisma.variant.create({
            data: {
              size,
              color,
              stock: Math.floor(Math.random() * 15) + 8, // Random stock 8-23
              productId: product.id
            }
          });
        }
      }
      
      console.log(`Added ${sizes.length * 4} variants`);
    }
    
    console.log('All products uploaded successfully!');
    
  } catch (error) {
    console.error('Error uploading products:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

uploadManualProducts();