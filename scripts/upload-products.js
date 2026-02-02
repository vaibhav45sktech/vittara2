const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'df9xmemb1',
  api_key: '924532362669628',
  api_secret: 'ymR_yta4qi7sZMFYyKSM4fgjXnc',
});

// Hardcoded database URL
const DATABASE_URL = "postgresql://neondb_owner:npg_N7fSCV3slyZg@ep-empty-voice-aerg852h-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";

const INTERNAL_STORAGE_PATH = path.join(__dirname, '../src/Internal storage');

// Mock data generators
const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
const colors = ['Black', 'White', 'Blue', 'Red', 'Green', 'Grey', 'Navy', 'Beige'];

function getRandomStock() {
  return Math.floor(Math.random() * 50) + 10; // 10-60 items
}

function getRandomSizes() {
  const numSizes = Math.floor(Math.random() * 3) + 2; // 2-4 sizes
  return sizes.slice(0, numSizes);
}

function parseRTF(rtfContent) {
  // Simple RTF parser to extract text
  const text = rtfContent
    .replace(/\\[a-z]+\d*\s?/g, '') // Remove RTF commands
    .replace(/[{}]/g, '') // Remove braces
    .replace(/\\/g, '') // Remove backslashes
    .trim();
  
  // Extract name and description
  const nameMatch = text.match(/Name:\s*(.+?)(?:Description:|$)/s);
  const descMatch = text.match(/Description:\s*(.+?)(?:Key Features:|$)/s);
  
  const name = nameMatch ? nameMatch[1].trim().split('\n')[0].trim() : 'Product';
  const description = descMatch ? descMatch[1].trim().replace(/\s+/g, ' ') : 'Premium quality product';
  
  return { name, description };
}

async function uploadImageToCloudinary(imagePath, productName) {
  try {
    console.log(`  📤 Uploading ${path.basename(imagePath)}...`);
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'fittara-products',
      public_id: `${productName}_${Date.now()}`,
      resource_type: 'image'
    });
    return result.secure_url;
  } catch (error) {
    console.error(`  ❌ Failed to upload ${imagePath}:`, error.message);
    return null;
  }
}

async function processProductFolder(folderPath, category) {
  const files = fs.readdirSync(folderPath);
  const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  const detailsFile = files.find(f => f.toLowerCase() === 'details.rtf');
  
  let productInfo = {
    name: path.basename(folderPath),
    description: 'Premium quality product crafted with attention to detail'
  };
  
  // Read details if exists
  if (detailsFile) {
    const detailsPath = path.join(folderPath, detailsFile);
    const rtfContent = fs.readFileSync(detailsPath, 'utf-8');
    productInfo = parseRTF(rtfContent);
  }
  
  // Upload images to Cloudinary
  const imageUrls = [];
  for (const imageFile of imageFiles) {
    const imagePath = path.join(folderPath, imageFile);
    const url = await uploadImageToCloudinary(imagePath, productInfo.name);
    if (url) imageUrls.push(url);
  }
  
  if (imageUrls.length === 0) {
    console.log(`  ⚠️  No images uploaded for ${productInfo.name}`);
    return null;
  }
  
  return {
    name: productInfo.name,
    description: productInfo.description,
    price: 799,
    image: imageUrls[0], // Main image
    images: imageUrls, // All images
    category: category
  };
}

async function uploadProducts() {
  const pool = new Pool({ connectionString: DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });
  
  try {
    console.log('🚀 Starting product upload process...\n');
    
    const categories = [
      { folder: 'Shirts', category: 'shirt' },
      { folder: 'Pant 11', category: 'modern' },
      { folder: 'Pant 22', category: 'classic' }
    ];
    
    let totalProducts = 0;
    
    for (const { folder, category } of categories) {
      const categoryPath = path.join(INTERNAL_STORAGE_PATH, folder);
      if (!fs.existsSync(categoryPath)) {
        console.log(`⚠️  Folder not found: ${folder}`);
        continue;
      }
      
      console.log(`\n📁 Processing ${folder}...`);
      const subfolders = fs.readdirSync(categoryPath).filter(f => {
        const fullPath = path.join(categoryPath, f);
        return fs.statSync(fullPath).isDirectory();
      });
      
      for (const subfolder of subfolders) {
        console.log(`\n  📦 Processing ${subfolder}...`);
        const productData = await processProductFolder(
          path.join(categoryPath, subfolder),
          category
        );
        
        if (!productData) continue;
        
        // Create product in database
        const product = await prisma.product.create({
          data: {
            name: productData.name,
            description: productData.description,
            price: productData.price,
            image: productData.image,
          }
        });
        
        console.log(`  ✅ Created product: ${product.name}`);
        console.log(`  📸 Main image: ${productData.image}`);
        console.log(`  📸 Total ${productData.images.length} images uploaded to Cloudinary`);
        
        // Note: Additional images stored in Cloudinary but not in DB yet (need migration)
        // Images available at: ${productData.images.join(', ')}
        
        // Create variants (sizes and stock)
        const productSizes = getRandomSizes();
        for (const size of productSizes) {
          await prisma.variant.create({
            data: {
              size: size,
              stock: getRandomStock(),
              color: colors[Math.floor(Math.random() * colors.length)],
              productId: product.id
            }
          });
        }
        console.log(`  📏 Added ${productSizes.length} size variants`);
        
        totalProducts++;
      }
    }
    
    console.log(`\n\n✨ Upload complete! Added ${totalProducts} products to database.`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

uploadProducts();
