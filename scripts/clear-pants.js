const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

const DATABASE_URL = "postgresql://neondb_owner:npg_N7fSCV3slyZg@ep-empty-voice-aerg852h-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";

async function clearPants() {
    const pool = new Pool({ connectionString: DATABASE_URL });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        // First get all pant product IDs
        const pantProducts = await prisma.product.findMany({
            where: { category: 'pant' },
            select: { id: true, name: true }
        });

        const pantIds = pantProducts.map(p => p.id);
        console.log(`Found ${pantProducts.length} pant products to delete:`);
        pantProducts.forEach(p => console.log(`  - ${p.name} (${p.id})`));

        if (pantIds.length === 0) {
            console.log('No pant products found. Nothing to delete.');
            return;
        }

        // Delete related records first (foreign key constraints)
        const deletedReviews = await prisma.review.deleteMany({ where: { productId: { in: pantIds } } });
        console.log(`✅ Deleted ${deletedReviews.count} reviews`);

        const deletedVariants = await prisma.variant.deleteMany({ where: { productId: { in: pantIds } } });
        console.log(`✅ Deleted ${deletedVariants.count} variants`);

        const deletedImages = await prisma.productImage.deleteMany({ where: { productId: { in: pantIds } } });
        console.log(`✅ Deleted ${deletedImages.count} product images`);

        const deletedComboItems = await prisma.comboItem.deleteMany({ where: { productId: { in: pantIds } } });
        console.log(`✅ Deleted ${deletedComboItems.count} combo items`);

        // Now delete the pant products themselves
        const deletedProducts = await prisma.product.deleteMany({ where: { category: 'pant' } });
        console.log(`✅ Deleted ${deletedProducts.count} pant products`);

        // Show remaining products
        const remaining = await prisma.product.count();
        console.log(`\n✨ Done! Remaining products in DB: ${remaining}`);
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

clearPants();
