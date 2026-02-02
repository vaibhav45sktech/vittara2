const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const DATABASE_URL = "postgresql://neondb_owner:npg_N7fSCV3slyZg@ep-empty-voice-aerg852h-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";

async function fixCategories() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log('🔄 Fixing product categories based on image URLs...\n');
    
    const products = await prisma.product.findMany();
    
    for (const product of products) {
      let newCategory = product.category;
      let newName = product.name;
      
      // Extract folder name from Cloudinary URL
      const imgMatch = product.image.match(/fittara-products\/([^_]+)/);
      const folder = imgMatch ? decodeURIComponent(imgMatch[1]) : '';
      
      // Determine category and name based on folder
      if (folder.match(/^A\d+$/)) {
        // A1-A5 are modern pants
        newCategory = 'modern';
        if (product.name === 'Product') {
          newName = `Fittara Modern Gurkha Pant ${folder}`;
        }
      } else if (folder.match(/^B\d+$/)) {
        // B1-B6 are classic pants
        newCategory = 'classic';
        if (product.name === 'Product') {
          newName = `Fittara Classic Gurkha Pant ${folder}`;
        }
      } else if (folder.match(/^S\d+$/)) {
        // S1-S4 are shirts
        newCategory = 'shirt';
        if (product.name === 'Product') {
          newName = `Fittara Premium Shirt ${folder}`;
        }
      } else if (folder.toLowerCase().includes('shirt')) {
        newCategory = 'shirt';
      }
      
      // Update if changed
      if (newCategory !== product.category || newName !== product.name) {
        await prisma.product.update({
          where: { id: product.id },
          data: { 
            category: newCategory,
            name: newName
          }
        });
        console.log(`✅ Updated: ${product.name} → ${newName} (${newCategory})`);
      } else {
        console.log(`✓ OK: ${product.name} (${product.category})`);
      }
    }
    
    console.log('\n✨ Category fix complete!');
    
    // Show summary
    const shirts = await prisma.product.count({ where: { category: 'shirt' } });
    const modern = await prisma.product.count({ where: { category: 'modern' } });
    const classic = await prisma.product.count({ where: { category: 'classic' } });
    
    console.log('\n📊 Summary:');
    console.log(`   Shirts: ${shirts}`);
    console.log(`   Modern Pants: ${modern}`);
    console.log(`   Classic Pants: ${classic}`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

fixCategories();
