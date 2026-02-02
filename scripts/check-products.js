const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const DATABASE_URL = "postgresql://neondb_owner:npg_N7fSCV3slyZg@ep-empty-voice-aerg852h-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";

async function checkProducts() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const products = await prisma.product.findMany({
      include: {
        variants: true,
      }
    });
    
    console.log(`\n✅ Total products in database: ${products.length}\n`);
    
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Price: ₹${product.price}`);
      console.log(`   Variants: ${product.variants.length}`);
      console.log(`   Image: ${product.image.substring(0, 60)}...`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

checkProducts();
