const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

// Hardcoded database URL
const DATABASE_URL = "postgresql://neondb_owner:npg_N7fSCV3slyZg@ep-empty-voice-aerg852h-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";

async function clearProducts() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
  });

  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log('🗑️  Clearing all products from database...');
    
    // Delete all reviews first (foreign key constraint)
    const deletedReviews = await prisma.review.deleteMany({});
    console.log(`✅ Deleted ${deletedReviews.count} reviews`);
    
    // Delete all variants
    const deletedVariants = await prisma.variant.deleteMany({});
    console.log(`✅ Deleted ${deletedVariants.count} variants`);
    
    // Delete all products
    const deletedProducts = await prisma.product.deleteMany({});
    console.log(`✅ Deleted ${deletedProducts.count} products`);
    
    console.log('\n✨ Database cleared successfully!');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

clearProducts();
