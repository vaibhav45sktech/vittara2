'use server';

import prisma from '@/lib/prisma';

// Fetch all products
export async function getAllProducts() {
  try {
    const products = await prisma.product.findMany({
      include: {
        variants: true,
        reviews: true,
      },
    });

    // Transform the data to match the expected format
    return products.map(product => ({
      id: parseInt(product.id) || 0, // Convert to number for frontend compatibility
      originalId: product.id, // Keep original string ID for URL routing
      title: product.name,
      price: Math.round(product.price), // Convert to integer for consistency
      image: product.image,
      slug: product.name.toLowerCase().replace(/\s+/g, '-'),
      tag: 'READY TO WEAR', // Default tag
      colors: Array.from(new Set(product.variants.map(v => v.color))), // Get unique colors from variants
      size: product.variants[0]?.size || '', // Get first size from variants
      fabric: product.description.includes('cotton') ? 'cotton' : product.description.includes('silk') ? 'silk' : 'cotton', // Default fabric
      color: product.variants[0]?.color || 'multicolor', // Default color
      category: (product.name.toLowerCase().includes('shirt') ? 'shirt' : product.name.toLowerCase().includes('pant') || product.name.toLowerCase().includes('gurkha') ? (product.name.toLowerCase().includes('classic') ? 'classic' : 'modern') : 'shirt') as 'modern' | 'classic' | 'shirt',
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Fetch products by category
export async function getProductsByCategory(category: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        name: {
          contains: category,
          mode: 'insensitive',
        },
      },
      include: {
        variants: true,
        reviews: true,
      },
    });

    return products.map(product => ({
      id: parseInt(product.id) || 0,
      originalId: product.id, // Keep original string ID for URL routing
      title: product.name,
      price: Math.round(product.price),
      image: product.image,
      slug: product.name.toLowerCase().replace(/\s+/g, '-'),
      tag: 'READY TO WEAR',
      colors: Array.from(new Set(product.variants.map(v => v.color))), // Get unique colors from variants
      size: product.variants[0]?.size || '', // Get first size from variants
      fabric: product.description.includes('cotton') ? 'cotton' : product.description.includes('silk') ? 'silk' : 'cotton',
      color: product.variants[0]?.color || 'multicolor',
      category: (category === 'pant' ? (product.name.toLowerCase().includes('classic') ? 'classic' : 'modern') : category === 'shirt' ? 'shirt' : 'shirt') as 'modern' | 'classic' | 'shirt',
    }));
  } catch (error) {
    console.error(`Error fetching ${category} products:`, error);
    return [];
  }
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
        reviews: true,
      },
    });

    if (!product) {
      return null;
    }

    // Get unique sizes and colors from variants
    const sizes = Array.from(new Set(product.variants.map(v => v.size)));
    const colors = Array.from(new Set(product.variants.map(v => v.color)));

    return {
      id: parseInt(product.id) || 0, // Keep as number for frontend compatibility
      title: product.name,
      description: product.description,
      price: Math.round(product.price),
      image: product.image,
      slug: product.name.toLowerCase().replace(/\s+/g, '-'),
      tag: 'READY TO WEAR',
      colors: colors,
      size: sizes[0] || '',
      fabric: 'cotton',
      color: colors[0] || 'multicolor',
      category: (product.name.toLowerCase().includes('shirt') ? 'shirt' : product.name.toLowerCase().includes('pant') || product.name.toLowerCase().includes('gurkha') ? (product.name.toLowerCase().includes('classic') ? 'classic' : 'modern') : 'shirt') as 'modern' | 'classic' | 'shirt',
      variants: product.variants,
      reviews: product.reviews,
    };
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
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