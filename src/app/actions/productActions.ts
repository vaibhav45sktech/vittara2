'use server';

import prisma from '@/lib/prisma';
import products from '@/app/data/products';

// Fetch all products
export async function getAllProducts() {
  // First try database
  try {
    const dbProducts = await prisma.product.findMany({
      include: {
        variants: true,
        reviews: true,
        images: {
          orderBy: {
            order: 'asc',
          }
        },
      },
    });

    if (dbProducts.length > 0) {
      console.log(`Loaded ${dbProducts.length} products from database`);
      // Transform the data to match the expected format
      return dbProducts.map((product, index) => ({
        id: index + 1, // Use sequential IDs for frontend
        originalId: product.id, // Keep original string ID for URL routing
        title: product.name,
        price: Math.round(product.price), // Convert to integer for consistency
        image: product.image,
        images: product.images.length > 0
          ? product.images.map(img => img.url)
          : [product.image],
        slug: product.name.toLowerCase().replace(/\s+/g, '-'),
        tag: 'READY TO WEAR', // Default tag
        colors: Array.from(new Set(product.variants.map(v => v.color))), // Get unique colors from variants
        size: product.variants[0]?.size || '', // Get first size from variants
        fabric: product.description.includes('cotton') ? 'cotton' : product.description.includes('silk') ? 'silk' : 'cotton', // Default fabric
        color: product.variants[0]?.color || 'multicolor', // Default color
        category: product.category === 'pant' ? 'modern' : (product.category as 'modern' | 'classic' | 'shirt'), // Map 'pant' to 'modern' for frontend
      }));
    }
  } catch (error) {
    console.error('Database connection failed, using static products:', error instanceof Error ? error.message : String(error));
  }

  // Fallback to static products data
  console.log(`Using static products data (${products.length} products)`);
  return products;
}

// Fetch products by category
export async function getProductsByCategory(category: string) {
  try {
    // Map category parameter to database category values
    let categoryFilter: string | string[];
    if (category === 'pant') {
      categoryFilter = ['modern', 'classic']; // Both pant categories
    } else {
      categoryFilter = category; // 'shirt', 'modern', or 'classic'
    }

    const dbProducts = await prisma.product.findMany({
      where: {
        category: Array.isArray(categoryFilter)
          ? { in: categoryFilter }
          : categoryFilter,
      },
      include: {
        variants: true,
        reviews: true,
        images: {
          orderBy: {
            order: 'asc',
          }
        },
      },
    });

    if (dbProducts.length > 0) {
      return dbProducts.map((product, index) => ({
        id: index + 1000, // Use offset to avoid conflicts with getAllProducts
        originalId: product.id, // Keep original string ID for URL routing
        title: product.name,
        price: Math.round(product.price),
        image: product.image,
        images: product.images.length > 0
          ? product.images.map(img => img.url)
          : [product.image],
        slug: product.name.toLowerCase().replace(/\s+/g, '-'),
        tag: 'READY TO WEAR',
        colors: Array.from(new Set(product.variants.map(v => v.color))), // Get unique colors from variants
        size: product.variants[0]?.size || '', // Get first size from variants
        fabric: product.description.includes('cotton') ? 'cotton' : product.description.includes('silk') ? 'silk' : 'cotton',
        color: product.variants[0]?.color || 'multicolor',
        category: product.category === 'pant' ? 'modern' : (product.category as 'modern' | 'classic' | 'shirt'), // Map 'pant' to 'modern' for frontend
      }));
    }
  } catch (error) {
    console.error(`Error fetching ${category} products from database:`, error);
  }

  // Fallback to static products data
  console.log(`Using static products data for category: ${category}`);
  return products.filter(product => {
    if (category === 'shirt') return product.category === 'shirt';
    if (category === 'pant') return product.category === 'modern' || product.category === 'classic';
    if (category === 'modern') return product.category === 'modern';
    if (category === 'classic') return product.category === 'classic';
    return false;
  });
}

// Fetch a single product by ID
export async function getProductById(id: string | number) {
  try {
    const productId = typeof id === 'string' ? id : id.toString();

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        variants: {
          select: {
            size: true,
            color: true,
            stock: true,
          }
        },
        images: {
          orderBy: {
            order: 'asc',
          }
        },
        reviews: true,
      },
    });

    if (product) {
      // Get unique sizes and colors from variants
      const sizes = Array.from(new Set(product.variants.map(v => v.size)));
      const colors = Array.from(new Set(product.variants.map(v => v.color)));

      // Get all images or fallback to main image
      const productImages = product.images.length > 0
        ? product.images.map(img => img.url)
        : [product.image];

      return {
        id: Math.abs(product.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)), // Generate numeric ID from string
        title: product.name,
        description: product.description,
        price: Math.round(product.price),
        image: product.image,
        images: productImages,
        slug: product.name.toLowerCase().replace(/\s+/g, '-'),
        tag: 'READY TO WEAR',
        colors: colors,
        size: sizes[0] || '',
        fabric: 'cotton',
        color: colors[0] || 'multicolor',
        category: product.category === 'pant' ? 'modern' : (product.category as 'modern' | 'classic' | 'shirt'), // Map 'pant' to 'modern' for frontend
        variants: product.variants,
        reviews: product.reviews,
      };
    }
  } catch (error) {
    console.error('Error fetching product by ID from database:', error instanceof Error ? error.message : String(error));
  }

  // Fallback to static products data
  console.log(`Using static products data for product ID: ${id}`);
  // Only try to parse as number if it's a numeric string, otherwise look for string match in static products
  let staticProduct = null;
  if (typeof id === 'string') {
    // If it's a string ID, first try to match with originalId, then as numeric ID
    staticProduct = products.find(p => (p as any).originalId === id) ||
      (isNaN(Number(id)) ? null : products.find(p => p.id === Number(id)));
  } else {
    // If it's already a number, match with numeric ID
    staticProduct = products.find(p => p.id === id);
  }

  if (staticProduct) {
    return {
      ...staticProduct,
      images: [staticProduct.image], // Wrap single image in array
      description: `Premium ${staticProduct.fabric} ${staticProduct.category} in ${staticProduct.color} color. Perfect for any occasion.`,
      variants: [
        {
          size: staticProduct.size,
          color: staticProduct.color,
          stock: 10
        }
      ],
      reviews: []
    };
  }

  return null;
}

// Fetch all reviews for a product
export async function getProductReviews(productId: string | number) {
  try {
    const stringProductId = typeof productId === 'number' ? productId.toString() : productId;

    const reviews = await prisma.review.findMany({
      where: {
        productId: stringProductId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return reviews;
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    return [];
  }
}

// Add a new review
export async function addProductReview(productId: string | number, rating: number, comment: string) {
  try {
    const stringProductId = typeof productId === 'number' ? productId.toString() : productId;

    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        productId: stringProductId,
      },
    });

    return review;
  } catch (error) {
    console.error('Error adding product review:', error);
    throw error;
  }
}

// Get product variants by product ID
export async function getProductVariants(productId: string | number) {
  try {
    const stringProductId = typeof productId === 'number' ? productId.toString() : productId;

    const variants = await prisma.variant.findMany({
      where: {
        productId: stringProductId,
      },
    });

    return variants;
  } catch (error) {
    console.error('Error fetching product variants:', error);
    return [];
  }
}
export async function getSizeCharts(category: string) {
  try {
    const dbCategory = category === 'shirt' ? 'shirt' : 'pant';
    const charts = await prisma.sizeChart.findMany({
      where: { category: dbCategory },
      orderBy: { fit: 'asc' }
    });
    return charts;
  } catch (error) {
    console.error('Error fetching size charts:', error);
    return [];
  }
}
