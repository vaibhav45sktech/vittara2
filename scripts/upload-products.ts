import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'fs';
import * as path from 'path';

interface ProductData {
  name: string;
  description: string;
  price: number;
  category: string;
  mainImage: string;
  additionalImages: string[];
}

async function extractProductInfo(folderPath: string): Promise<ProductData | null> {
  const rtfFiles = fs.readdirSync(folderPath).filter(file => file.toLowerCase().endsWith('.rtf'));
  
  if (rtfFiles.length === 0) return null;
  
  const rtfPath = path.join(folderPath, rtfFiles[0]);
  const rtfContent = fs.readFileSync(rtfPath, 'utf8');
  
  // Extract name and description from RTF
  const nameMatch = rtfContent.match(/name:\s*\*\\par\s*\*\\cf0\s*([^\*\\par]+)/i);
  const descMatch = rtfContent.match(/description:\s*\*\\par\s*\*\\cf0\s*([^\*\\key feature]+)/i);
  
  if (!nameMatch || !descMatch) return null;
  
  const name = nameMatch[1].trim();
  const description = descMatch[1].trim().replace(/\*\\par/g, ' ').replace(/\s+/g, ' ');
  
  // Get image files
  const imageFiles = fs.readdirSync(folderPath)
    .filter(file => /\.(jpg|jpeg|png|webp)$/i.test(file))
    .sort();
  
  if (imageFiles.length === 0) return null;
  
  const mainImage = `/images/internal/${path.basename(path.dirname(folderPath))}/${path.basename(folderPath)}/${imageFiles[0]}`;
  const additionalImages = imageFiles.slice(1).map(file => 
    `/images/internal/${path.basename(path.dirname(folderPath))}/${path.basename(folderPath)}/${file}`
  );
  
  // Determine category from folder structure
  const parentFolder = path.basename(path.dirname(folderPath)).toLowerCase();
  const category = parentFolder.includes('pant') ? 'pant' : 'shirt';
  
  return {
    name,
    description,
    price: Math.floor(Math.random() * 3000) + 2000, // Random price between 2000-5000
    category,
    mainImage,
    additionalImages
  };
}

async function uploadProducts() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log('Starting product upload...');
    
    const internalStoragePath = path.join(__dirname, '../src/Internal storage');
    const productFolders: string[] = [];
    
    // Collect all product folders
    const pant11Path = path.join(internalStoragePath, 'Pant 11');
    const pant22Path = path.join(internalStoragePath, 'Pant 22');
    const shirtsPath = path.join(internalStoragePath, 'Shirts');
    
    // Get Pant 11 folders (A1-A5)
    if (fs.existsSync(pant11Path)) {
      const pant11Folders = fs.readdirSync(pant11Path)
        .filter(item => fs.statSync(path.join(pant11Path, item)).isDirectory())
        .map(folder => path.join(pant11Path, folder));
      productFolders.push(...pant11Folders);
    }
    
    // Get Pant 22 folders (B1-B6)
    if (fs.existsSync(pant22Path)) {
      const pant22Folders = fs.readdirSync(pant22Path)
        .filter(item => fs.statSync(path.join(pant22Path, item)).isDirectory())
        .map(folder => path.join(pant22Path, folder));
      productFolders.push(...pant22Folders);
    }
    
    // Get Shirt folders (S1-S4)
    if (fs.existsSync(shirtsPath)) {
      const shirtFolders = fs.readdirSync(shirtsPath)
        .filter(item => fs.statSync(path.join(shirtsPath, item)).isDirectory())
        .map(folder => path.join(shirtsPath, folder));
      productFolders.push(...shirtFolders);
    }
    
    console.log(`Found ${productFolders.length} product folders to process`);
    
    // Process each product folder
    for (let i = 0; i < productFolders.length; i++) {
      const folderPath = productFolders[i];
      console.log(`Processing folder ${i + 1}/${productFolders.length}: ${path.basename(folderPath)}`);
      
      const productData = await extractProductInfo(folderPath);
      
      if (!productData) {
        console.log(`Skipping folder ${path.basename(folderPath)} - no valid data found`);
        continue;
      }
      
      // Create product
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          image: productData.mainImage,
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
      
      console.log(`Added ${productData.additionalImages.length} additional images`);
      
      // Add some sample variants
      const sizes = ['S', 'M', 'L', 'XL'];
      const colors = ['Black', 'Navy', 'Charcoal', 'Brown'];
      
      for (const size of sizes) {
        for (const color of colors) {
          await prisma.variant.create({
            data: {
              size,
              color,
              stock: Math.floor(Math.random() * 20) + 5, // Random stock 5-25
              productId: product.id
            }
          });
        }
      }
      
      console.log(`Added ${sizes.length * colors.length} variants`);
    }
    
    console.log('Product upload completed successfully!');
    
  } catch (error) {
    console.error('Error uploading products:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

uploadProducts();