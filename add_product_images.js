const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function addMultipleImages() {
  const client = new Client({ 
    connectionString: process.env.DATABASE_URL 
  });
  
  try {
    await client.connect();
    console.log('Connected to database');
    
    // Get all products
    const products = await client.query('SELECT id, name, image FROM "Product"');
    
    for (const product of products.rows) {
      console.log(`Processing: ${product.name}`);
      
      // Determine the product's folder based on its name
      let folderPath = '';
      if (product.name.includes('Black Classic Double-Buckle Gurkha Trousers')) {
        folderPath = '/images/internal/Pant 11/A1/';
      } else if (product.name.includes('Navy Wool Blend Slim Fit Chinos')) {
        folderPath = '/images/internal/Pant 11/A2/';
      } else if (product.name.includes('Charcoal Formal Dress Pants')) {
        folderPath = '/images/internal/Pant 11/A3/';
      } else if (product.name.includes('Brown Leather Belt Detailed Trousers')) {
        folderPath = '/images/internal/Pant 11/A4/';
      } else if (product.name.includes('Grey Premium Casual Pants')) {
        folderPath = '/images/internal/Pant 11/A5/';
      } else if (product.name.includes('Black Formal Evening Trousers')) {
        folderPath = '/images/internal/Pant 22/B1/';
      } else if (product.name.includes('Navy Slim Business Pants')) {
        folderPath = '/images/internal/Pant 22/B2/';
      } else if (product.name.includes('Olive Green Cargo Pants')) {
        folderPath = '/images/internal/Pant 22/B3/';
      } else if (product.name.includes('White Linen Summer Trousers')) {
        folderPath = '/images/internal/Pant 22/B4/';
      } else if (product.name.includes('Burgundy Velvet Formal Pants')) {
        folderPath = '/images/internal/Pant 22/B5/';
      } else if (product.name.includes('Khaki Adventure Shorts')) {
        folderPath = '/images/internal/Pant 22/B6/';
      } else if (product.name.includes('White Premium Dress Shirt')) {
        folderPath = '/images/internal/Shirts/S1/';
      } else if (product.name.includes('Blue Oxford Casual Shirt')) {
        folderPath = '/images/internal/Shirts/S2/';
      } else if (product.name.includes('Black Linen Blend Shirt')) {
        folderPath = '/images/internal/Shirts/S3/';
      } else if (product.name.includes('Striped Cotton Polo Shirt')) {
        folderPath = '/images/internal/Shirts/S4/';
      }
      
      if (folderPath) {
        // Get all images from the folder
        const folder = path.join(process.cwd(), 'public', folderPath); // Use current working directory
        
        console.log(`  Looking for folder: ${folder}`);
        
        if (fs.existsSync(folder)) {
          console.log(`  Folder exists!`);
          const files = fs.readdirSync(folder).filter(file => 
            file.toLowerCase().endsWith('.jpg') || 
            file.toLowerCase().endsWith('.png') ||
            file.toLowerCase().endsWith('.jpeg')
          );
          
          console.log(`  Found ${files.length} images in ${folderPath}`);
          
          // Add each image to the ProductImage table
          for (let i = 0; i < files.length; i++) {
            const imagePath = folderPath + files[i];
            console.log(`    Adding image: ${imagePath}`);
            
            try {
              // Insert the image record - using a simpler approach
              const insertQuery = {
                text: 'INSERT INTO "ProductImage" (id, url, "order", "productId") VALUES ($1, $2, $3, $4)',
                values: [require('crypto').randomUUID(), imagePath, i, product.id]
              };
              
              const result = await client.query(insertQuery);
              console.log(`      Insert result: ${result.command} ${result.rowCount}`);
            } catch (insertErr) {
              console.log(`      Insert error: ${insertErr.message}`);
            }
          }
        }
      }
    }
    
    console.log('All additional images added successfully');
  } catch (err) {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
  } finally {
    await client.end();
  }
}

addMultipleImages();