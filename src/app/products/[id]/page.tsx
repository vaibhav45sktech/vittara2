import ProductPage from "@/app/components/ProductPage";
import { notFound } from "next/navigation";
import { getProductById, getProductsByCategory } from "@/app/actions/productActions";

interface ProductPageParams {
  id: string;
}

export async function generateMetadata({ params }: { params: Promise<ProductPageParams> }) {
  const { id } = await params;
  const product = await getProductById(id);
  
  if (!product) {
    return {
      title: "Product Not Found | Fittara",
      description: "The product you're looking for doesn't exist."
    };
  }

  return {
    title: `${product.title} | Fittara Premium Apparel`,
    description: `Discover the ${product.title} from Fittara. Premium quality ${product.category} crafted with attention to detail.`,
    openGraph: {
      title: product.title,
      description: `Premium ${product.category} from Fittara`,
      images: [product.image],
    },
  };
}

export default async function IndividualProductPage({ params }: { params: Promise<ProductPageParams> }) {
  const { id } = await params;
  const product = await getProductById(id);
  
  if (!product) {
    notFound();
  }

  // Get related products (same category, excluding current product)
  const relatedProducts = await getProductsByCategory(product.category);
  const filteredRelatedProducts = relatedProducts.filter(p => p.id !== product.id).slice(0, 4);

  return (
    <ProductPage 
      product={product} 
      relatedProducts={filteredRelatedProducts} 
    />
  );
}