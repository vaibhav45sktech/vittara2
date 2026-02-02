// Seed script using Prisma CLI
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seeding...')
  
  // Clear existing data first
  await prisma.review.deleteMany()
  await prisma.variant.deleteMany()
  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  
  console.log('Existing data cleared')
  
  // Create sample products
  const products = [
    {
      name: "FITTARA Black Classic Double-Buckle Gurkha Trousers",
      description: "The FITTARA Black Classic Double-Buckle Gurkha Trousers embody timeless tailoring with a bold, structured presence. Designed with an overlapping high-rise waistband and distinctive double-buckle detailing, this style delivers a strong, elegant silhouette rooted in classic design principles.",
      price: 3499,
      image: "/images/internal/Pant 11/A1/1767408097400.jpg",
      category: "pant"
    },
    {
      name: "FITTARA Navy Wool Blend Slim Fit Chinos",
      description: "Premium wool blend chinos featuring slim fit silhouette with refined details. Perfect for smart casual occasions with exceptional comfort and durability.",
      price: 2999,
      image: "/images/internal/Pant 11/A2/1767408097400.jpg",
      category: "pant"
    },
    {
      name: "FITTARA Charcoal Formal Dress Pants",
      description: "Classic charcoal formal trousers crafted from premium fabric with impeccable finish. Ideal for business meetings and formal events.",
      price: 3299,
      image: "/images/internal/Pant 11/A3/1767408097400.jpg",
      category: "pant"
    },
    {
      name: "FITTARA Brown Leather Belt Detailed Trousers",
      description: "Stylish trousers featuring genuine leather belt details and contemporary cut. Versatile piece for both office and weekend wear.",
      price: 3199,
      image: "/images/internal/Pant 11/A4/1767408097400.jpg",
      category: "pant"
    },
    {
      name: "FITTARA Grey Premium Casual Pants",
      description: "Comfortable grey casual pants with modern fit and quality construction. Perfect for everyday wear with superior fabric feel.",
      price: 2799,
      image: "/images/internal/Pant 11/A5/1767408097400.jpg",
      category: "pant"
    },
    {
      name: "FITTARA Black Formal Evening Trousers",
      description: "Sophisticated black evening trousers with sleek design and premium fabric. Perfect for formal dinners and special occasions.",
      price: 3699,
      image: "/images/internal/Pant 22/B1/1767416931443.png",
      category: "pant"
    },
    {
      name: "FITTARA Navy Slim Business Pants",
      description: "Professional navy business pants with slim fit and wrinkle-resistant fabric. Essential for the modern professional wardrobe.",
      price: 3399,
      image: "/images/internal/Pant 22/B2/1767416931443.png",
      category: "pant"
    },
    {
      name: "FITTARA Olive Green Cargo Pants",
      description: "Functional olive green cargo pants with multiple pockets and comfortable fit. Great for casual outings and weekend adventures.",
      price: 2899,
      image: "/images/internal/Pant 22/B3/1767416931443.png",
      category: "pant"
    },
    {
      name: "FITTARA White Linen Summer Trousers",
      description: "Lightweight white linen trousers perfect for summer occasions. Breathable fabric with relaxed fit for maximum comfort.",
      price: 2699,
      image: "/images/internal/Pant 22/B4/1767416931443.png",
      category: "pant"
    },
    {
      name: "FITTARA Burgundy Velvet Formal Pants",
      description: "Luxurious burgundy velvet formal pants with rich texture and elegant drape. Statement piece for special formal events.",
      price: 3999,
      image: "/images/internal/Pant 22/B5/1767416931443.png",
      category: "pant"
    },
    {
      name: "FITTARA Khaki Adventure Shorts",
      description: "Durable khaki adventure shorts designed for outdoor activities. Quick-dry fabric with reinforced construction for active lifestyles.",
      price: 2499,
      image: "/images/internal/Pant 22/B6/1767416931443.png",
      category: "pant"
    },
    {
      name: "FITTARA White Premium Dress Shirt",
      description: "Classic white dress shirt crafted from premium cotton with perfect fit. Timeless piece for formal occasions and business settings.",
      price: 2199,
      image: "/images/internal/Shirts/S1/1767334222586.jpg",
      category: "shirt"
    },
    {
      name: "FITTARA Blue Oxford Casual Shirt",
      description: "Versatile blue oxford shirt with button-down collar and comfortable fit. Perfect for smart casual looks and weekend wear.",
      price: 1999,
      image: "/images/internal/Shirts/S2/1767334222586.jpg",
      category: "shirt"
    },
    {
      name: "FITTARA Black Linen Blend Shirt",
      description: "Stylish black linen blend shirt with relaxed fit and natural texture. Ideal for summer evenings and casual sophistication.",
      price: 2299,
      image: "/images/internal/Shirts/S3/1767334222586.jpg",
      category: "shirt"
    },
    {
      name: "FITTARA Striped Cotton Polo Shirt",
      description: "Classic striped polo shirt made from premium cotton with comfortable fit. Perfect for casual outings and sporty elegance.",
      price: 1799,
      image: "/images/internal/Shirts/S4/1767334222586.jpg",
      category: "shirt"
    }
  ]

  console.log(`Creating ${products.length} products...`)
  
  for (let i = 0; i < products.length; i++) {
    const productData = products[i]
    console.log(`Creating product ${i + 1}/${products.length}: ${productData.name}`)
    
    const product = await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        image: productData.image,
        category: productData.category
      }
    })
    
    console.log(`Created: ${product.name} (ID: ${product.id})`)
  }
  
  const count = await prisma.product.count()
  console.log(`Seeding completed. Total products: ${count}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })