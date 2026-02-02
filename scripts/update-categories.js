const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const DATABASE_URL = "postgresql://neondb_owner:npg_N7fSCV3slyZg@ep-empty-voice-aerg852h-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";

async function updateCategories() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log('🔄 Updating product categories...\n');
    
    const products = await prisma.product.findMany();
    
    for (const product of products) {
      let category = 'shirt'; // default
      
      const name = product.name.toLowerCase();
      
      // Determine category based on name
      if (name.includes('shirt')) {
        category = 'shirt';
      } else if (name.includes('pant') || name.includes('gurkha') || name.match(/^[ab]\d+$/)) {
        // A1-A5 are from Pant 11 (modern), B1-B6 are from Pant 22 (classic)
        if (name.match(/^a\d+$/) || name === 'product') {
          category = 'modern';
        } else if (name.match(/^b\d+$/)) {
          category = 'classic';
        } else if (name.includes('classic')) {
          category = 'classic';
        } else {
          category = 'modern';
        }
      }
      
      await prisma.product.update({
        where: { id: product.id },
        data: { category }
      });
      
      console.log(`✅ Updated ${product.name} → ${category}`);
    }
    
    console.log(`\n✨ Updated ${products.length} products!`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

updateCategories();
