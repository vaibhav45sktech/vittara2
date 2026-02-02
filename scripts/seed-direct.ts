import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

async function seedDatabase() {
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const adapter = new PrismaPg(pool);


  const prisma = new PrismaClient({ adapter });

  try {
    // Clear existing data
    await prisma.review.deleteMany({});
    await prisma.variant.deleteMany({});
    await prisma.product.deleteMany({});

    // Create sample products based on the existing products.ts data
    const productsData = [
      // --- Pant 11 (Modern Pleated Gurkha) ---
      {
        name: "Pearled Ivory White pantenga",
        description: "Exquisite ivory white pantenga crafted with premium silk fabric for elegant occasions.",
        price: 12999,
        image: "/images/new-collection/Pant 11/pant1.jpg",
        variants: [
          { size: "S", stock: 5, color: "#9C7C5C" },
        ]
      },
      {
        name: "Blue Elegance pantenga",
        description: "Stunning blue pantenga made with comfortable cotton blend fabric.",
        price: 7999,
        image: "/images/new-collection/Pant 11/pant2.png",
        variants: [
          { size: "M", stock: 10, color: "#1C3A63" },
          { size: "S", stock: 5, color: "#9C1C28" },
        ]
      },
      {
        name: "Wine Hued Elegance pantenga",
        description: "Sophisticated wine-colored pantenga with premium net fabric.",
        price: 7999,
        image: "/images/new-collection/Pant 11/pant3.jpg",
        variants: [
          { size: "XL", stock: 5, color: "#4B1F3A" },
          { size: "M", stock: 3, color: "#000000" },
        ]
      },
      {
        name: "Beige Cream Sitara pantenga",
        description: "Luxurious beige cream pantenga with silk finish for premium feel.",
        price: 14999,
        image: "/images/new-collection/Pant 11/pant4.jpg",
        variants: [
          { size: "L", stock: 7, color: "#D9C9B0" },
        ]
      },
      {
        name: "pantenga 5",
        description: "Stylish pantenga with cotton fabric.",
        price: 8999,
        image: "/images/new-collection/Pant 11/pant5.jpg",
        variants: [
          { size: "S", stock: 8, color: "#8B0000" },
        ]
      },
      {
        name: "pantenga 6",
        description: "Elegant pantenga with silk fabric.",
        price: 10999,
        image: "/images/new-collection/Pant 11/pant6.jpg",
        variants: [
          { size: "S", stock: 6, color: "#FFD700" },
        ]
      },
      {
        name: "pantenga 7",
        description: "Pink pantenga with net fabric.",
        price: 9999,
        image: "/images/new-collection/Pant 11/pant7.jpg",
        variants: [
          { size: "M", stock: 9, color: "#FF69B4" },
        ]
      },
      {
        name: "pantenga 8",
        description: "Navy pantenga with silk fabric.",
        price: 11999,
        image: "/images/new-collection/Pant 11/pant8.jpg",
        variants: [
          { size: "M", stock: 7, color: "#000080" },
        ]
      },
      {
        name: "pantenga 9",
        description: "Olive pantenga with cotton fabric.",
        price: 7999,
        image: "/images/new-collection/Pant 11/pant9.jpg",
        variants: [
          { size: "L", stock: 6, color: "#556B2F" },
        ]
      },
      {
        name: "pantenga 10",
        description: "Maroon pantenga with silk fabric.",
        price: 13999,
        image: "/images/new-collection/Pant 11/pant10.jpg",
        variants: [
          { size: "L", stock: 5, color: "#800000" },
        ]
      },
      {
        name: "pantenga 11",
        description: "Orange pantenga with cotton fabric.",
        price: 12999,
        image: "/images/new-collection/Pant 11/pant11.png",
        variants: [
          { size: "XL", stock: 7, color: "#FF4500" },
        ]
      },
      {
        name: "pantenga 12",
        description: "Slate pantenga with net fabric.",
        price: 11999,
        image: "/images/new-collection/Pant 11/pant12.png",
        variants: [
          { size: "S", stock: 8, color: "#708090" },
        ]
      },
      {
        name: "pantenga 13",
        description: "Orchid pantenga with silk fabric.",
        price: 14999,
        image: "/images/new-collection/Pant 11/pant13.png",
        variants: [
          { size: "S", stock: 6, color: "#DA70D6" },
        ]
      },
      {
        name: "pantenga 14",
        description: "Firebrick pantenga with cotton fabric.",
        price: 8999,
        image: "/images/new-collection/Pant 11/pant14.jpg",
        variants: [
          { size: "L", stock: 8, color: "#B22222" },
        ]
      },
      {
        name: "pantenga 15",
        description: "Seagreen pantenga with net fabric.",
        price: 9999,
        image: "/images/new-collection/Pant 11/pant15.jpg",
        variants: [
          { size: "M", stock: 7, color: "#2E8B57" },
        ]
      },
      {
        name: "pantenga 16",
        description: "Brown pantenga with silk fabric.",
        price: 7999,
        image: "/images/new-collection/Pant 11/pant16.jpg",
        variants: [
          { size: "XL", stock: 9, color: "#A52A2A" },
        ]
      },
      {
        name: "pantenga 17",
        description: "Chocolate pantenga with cotton fabric.",
        price: 10999,
        image: "/images/new-collection/Pant 11/pant17.jpg",
        variants: [
          { size: "XL", stock: 10, color: "#000000" },
        ]
      },
      {
        name: "pantenga 18",
        description: "Darkslateblue pantenga with net fabric.",
        price: 11999,
        image: "/images/new-collection/Pant 11/pant18.jpg",
        variants: [
          { size: "XL", stock: 8, color: "#483D8B" },
        ]
      },
      {
        name: "pantenga 19",
        description: "Cadetblue pantenga with silk fabric.",
        price: 13999,
        image: "/images/new-collection/Pant 11/pant19.png",
        variants: [
          { size: "M", stock: 6, color: "#5F9EA0" },
        ]
      },
      {
        name: "pantenga 20",
        description: "Mediumvioletred pantenga with cotton fabric.",
        price: 14999,
        image: "/images/new-collection/Pant 11/pant20.png",
        variants: [
          { size: "M", stock: 7, color: "#C71585" },
        ]
      },
      {
        name: "pantenga 21",
        description: "Steelblue pantenga with net fabric.",
        price: 9999,
        image: "/images/new-collection/Pant 11/pant21.png",
        variants: [
          { size: "M", stock: 8, color: "#4682B4" },
        ]
      },
      {
        name: "pantenga 22",
        description: "Darkmagenta pantenga with silk fabric.",
        price: 10999,
        image: "/images/new-collection/Pant 11/pant22.jpg.png",
        variants: [
          { size: "XL", stock: 9, color: "#8B008B" },
        ]
      },
      {
        name: "pantenga 23",
        description: "Crimson pantenga with cotton fabric.",
        price: 12999,
        image: "/images/new-collection/Pant 11/pant23.png",
        variants: [
          { size: "L", stock: 8, color: "#DC143C" },
        ]
      },
      {
        name: "pantenga 24",
        description: "Crimson pantenga with net fabric.",
        price: 12999,
        image: "/images/new-collection/Pant 11/pant24.jpg.png",
        variants: [
          { size: "M", stock: 7, color: "#DC143C" },
        ]
      },

      // --- Pant 22 (Classic Gurkha) ---
      {
        name: "Classic Ivory Gurkha",
        description: "Timeless ivory gurkha pants with traditional craftsmanship and modern fit.",
        price: 12499,
        image: "/images/new-collection/Pant 22/p1.png",
        variants: [
          { size: "M", stock: 8, color: "#F5F5DC" },
        ]
      },
      {
        name: "Navy Sharp Gurkha",
        description: "Sharp navy gurkha pants with wool blend fabric for formal occasions.",
        price: 13999,
        image: "/images/new-collection/Pant 22/p2.png",
        variants: [
          { size: "L", stock: 6, color: "#000080" },
        ]
      },
      {
        name: "Charcoal Structured Pant",
        description: "Structured charcoal pants with linen fabric.",
        price: 12999,
        image: "/images/new-collection/Pant 22/p3.png",
        variants: [
          { size: "XL", stock: 7, color: "#36454F" },
        ]
      },
      {
        name: "Olive Drab Classic",
        description: "Classic olive drab pants with cotton fabric.",
        price: 11999,
        image: "/images/new-collection/Pant 22/p4.jpg",
        variants: [
          { size: "M", stock: 9, color: "#6B8E23" },
        ]
      },
      {
        name: "Sand Beige Gurkha",
        description: "Gurkha pants in sand beige with cotton-twill fabric.",
        price: 11499,
        image: "/images/new-collection/Pant 22/p5.jpg",
        variants: [
          { size: "S", stock: 7, color: "#F4A460" },
        ]
      },
      {
        name: "Slate Grey Formal",
        description: "Formal slate grey pants with wool fabric.",
        price: 13499,
        image: "/images/new-collection/Pant 22/p6.jpg",
        variants: [
          { size: "L", stock: 5, color: "#708090" },
        ]
      },
      {
        name: "Midnight Black Gurkha",
        description: "Premium midnight black gurkha pants with italian-wool fabric.",
        price: 14499,
        image: "/images/new-collection/Pant 22/p7.jpg",
        variants: [
          { size: "M", stock: 6, color: "#000000" },
        ]
      },
      {
        name: "Rusty Brown Pant",
        description: "Vintage rusty brown pants with corduroy fabric.",
        price: 10999,
        image: "/images/new-collection/Pant 22/p8.jpg",
        variants: [
          { size: "XL", stock: 8, color: "#4B5563" },
        ]
      },
      {
        name: "Forest Green Gurkha",
        description: "Seasonal forest green gurkha pants with cotton fabric.",
        price: 12999,
        image: "/images/new-collection/Pant 22/p9.jpg",
        variants: [
          { size: "L", stock: 6, color: "#228B22" },
        ]
      },
      {
        name: "Deep Maroon Classic",
        description: "Evening deep maroon classic pants with velvet-touch fabric.",
        price: 12499,
        image: "/images/new-collection/Pant 22/p10.jpg",
        variants: [
          { size: "S", stock: 7, color: "#800000" },
        ]
      },
      {
        name: "Steel Blue Sharp",
        description: "Modern fit steel blue sharp pants with poly-blend fabric.",
        price: 11999,
        image: "/images/new-collection/Pant 22/p11.jpg",
        variants: [
          { size: "M", stock: 8, color: "#4682B4" },
        ]
      },
      {
        name: "Taupe Linen Gurkha",
        description: "Summer taupe linen gurkha pants.",
        price: 13999,
        image: "/images/new-collection/Pant 22/p12.png",
        variants: [
          { size: "XL", stock: 5, color: "#483C32" },
        ]
      },
      {
        name: "Khaki Smart Paint",
        description: "Smart casual khaki pants with cotton fabric.",
        price: 10999,
        image: "/images/new-collection/Pant 22/p13.jpg",
        variants: [
          { size: "L", stock: 9, color: "#C3B091" },
        ]
      },
      {
        name: "Graphite Grey Regular",
        description: "Daily wear graphite grey regular pants with cotton-stretch fabric.",
        price: 12499,
        image: "/images/new-collection/Pant 22/p14.jpg",
        variants: [
          { size: "M", stock: 7, color: "#383838" },
        ]
      },
      {
        name: "Cocoa Brown Formal",
        description: "Elegant cocoa brown formal pants with wool-silk fabric.",
        price: 13499,
        image: "/images/new-collection/Pant 22/p15.jpg",
        variants: [
          { size: "S", stock: 6, color: "#000000" },
        ]
      },
      {
        name: "Pewter Grey Gurkha",
        description: "Classic pewter grey gurkha pants with cotton fabric.",
        price: 11999,
        image: "/images/new-collection/Pant 22/p16.jpg",
        variants: [
          { size: "XL", stock: 8, color: "#808080" },
        ]
      },

      // --- Shirts ---
      {
        name: "Classic White Linen Shirt",
        description: "Premium white linen shirt perfect for summer wear with breathable fabric.",
        price: 4999,
        image: "/images/new-collection/Shirts/shirt1.jpg",
        variants: [
          { size: "M", stock: 10, color: "#FFFFFF" },
        ]
      },
      {
        name: "Navy Blue Formal Shirt",
        description: "Elegant navy blue formal shirt with premium cotton fabric.",
        price: 5499,
        image: "/images/new-collection/Shirts/shirt2.jpg",
        variants: [
          { size: "L", stock: 9, color: "#000080" },
        ]
      },
      {
        name: "Sky Blue Casual Shirt",
        description: "Light sky blue casual shirt with comfortable cotton blend.",
        price: 4499,
        image: "/images/new-collection/Shirts/shirt3.png",
        variants: [
          { size: "M", stock: 8, color: "#87CEEB" },
        ]
      },
      {
        name: "Black Satin Party Shirt",
        description: "Lustrous black satin shirt for party occasions with elegant finish.",
        price: 6999,
        image: "/images/new-collection/Shirts/shirt4.png",
        variants: [
          { size: "S", stock: 3, color: "#000000" },
        ]
      },
      {
        name: "Olive Green Utility Shirt",
        description: "Trending olive green utility shirt with cotton fabric.",
        price: 5299,
        image: "/images/new-collection/Shirts/shirt5.jpg",
        variants: [
          { size: "XL", stock: 7, color: "#556B2F" },
        ]
      },
      {
        name: "Beige textured Shirt",
        description: "Premium beige textured shirt with textured-cotton fabric.",
        price: 5999,
        image: "/images/new-collection/Shirts/shirt6.jpg",
        variants: [
          { size: "L", stock: 8, color: "#F5F5DC" },
        ]
      },
      {
        name: "Striped Office Shirt",
        description: "Formal striped office shirt with cotton fabric.",
        price: 4999,
        image: "/images/new-collection/Shirts/shirt7.jpg",
        variants: [
          { size: "M", stock: 12, color: "#FFFFFF" },
          { size: "M", stock: 10, color: "#000000" },
        ]
      },
      {
        name: "Maroon Silk Event Shirt",
        description: "Luxury maroon silk event shirt with silk fabric.",
        price: 7499,
        image: "/images/new-collection/Shirts/shirt8.jpg",
        variants: [
          { size: "M", stock: 6, color: "#800000" },
        ]
      },
      {
        name: "Charcoal Grey Shirt",
        description: "Smart casual charcoal grey shirt with cotton fabric.",
        price: 5499,
        image: "/images/new-collection/Shirts/shirt9.jpg",
        variants: [
          { size: "L", stock: 9, color: "#36454F" },
        ]
      },
      {
        name: "Printed Resort Shirt",
        description: "Holiday printed resort shirt with rayon fabric.",
        price: 4599,
        image: "/images/new-collection/Shirts/shirt10.jpg",
        variants: [
          { size: "M", stock: 10, color: "#FFFFFF" },
        ]
      },
      {
        name: "Lavender Formal Shirt",
        description: "Pastel lavender formal shirt with cotton fabric.",
        price: 5199,
        image: "/images/new-collection/Shirts/shirt11.jpg",
        variants: [
          { size: "S", stock: 8, color: "#E6E6FA" },
        ]
      },
      {
        name: "Checkered Casual Shirt",
        description: "Everyday checkered casual shirt with cotton-flannel fabric.",
        price: 4799,
        image: "/images/new-collection/Shirts/shirt12.jpg",
        variants: [
          { size: "XL", stock: 7, color: "#000080" },
          { size: "XL", stock: 9, color: "#FFFFFF" },
        ]
      },
      {
        name: "Rust Orange Shirt",
        description: "Autumn rust orange shirt with corduroy fabric.",
        price: 5299,
        image: "/images/new-collection/Shirts/shirt13.jpg",
        variants: [
          { size: "L", stock: 8, color: "#D2691E" },
        ]
      },
      {
        name: "Teal Green Shirt",
        description: "Vibrant teal green shirt with cotton fabric.",
        price: 5499,
        image: "/images/new-collection/Shirts/shirt14.jpg",
        variants: [
          { size: "M", stock: 9, color: "#008080" },
        ]
      },
      {
        name: "Denim Washed Shirt",
        description: "Denim washed shirt with denim fabric.",
        price: 5999,
        image: "/images/new-collection/Shirts/shirt15.jpg",
        variants: [
          { size: "L", stock: 7, color: "#5F9EA0" },
        ]
      },
      {
        name: "Midnight Blue Shirt",
        description: "Evening midnight blue shirt with satin-blend fabric.",
        price: 5899,
        image: "/images/new-collection/Shirts/shirt16.jpg",
        variants: [
          { size: "M", stock: 8, color: "#191970" },
        ]
      },
      {
        name: "Coral Linen Shirt",
        description: "Summer coral linen shirt with linen fabric.",
        price: 5199,
        image: "/images/new-collection/Shirts/shirt17.png",
        variants: [
          { size: "S", stock: 9, color: "#FF7F50" },
        ]
      },
      {
        name: "Graphite Formal Shirt",
        description: "Office graphite formal shirt with cotton fabric.",
        price: 5599,
        image: "/images/new-collection/Shirts/shirt18.jpg",
        variants: [
          { size: "XL", stock: 6, color: "#505050" },
        ]
      },
      {
        name: "Emerald Green Shirt",
        description: "Rich emerald green shirt with silk-blend fabric.",
        price: 5699,
        image: "/images/new-collection/Shirts/shirt19.png",
        variants: [
          { size: "L", stock: 7, color: "#50C878" },
        ]
      },
      {
        name: "Royal Purple Shirt",
        description: "Royal purple shirt with satin fabric.",
        price: 5999,
        image: "/images/new-collection/Shirts/shirt20.png",
        variants: [
          { size: "M", stock: 8, color: "#7851A9" },
        ]
      }
    ];

    for (const productData of productsData) {
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          image: productData.image,
          variants: {
            create: productData.variants
          }
        }
      });
      console.log(`Created product: ${product.name}`);
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();