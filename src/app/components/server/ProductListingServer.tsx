import ProductListing from "../ProductListing";

interface Section {
  id: string;
  category: "modern" | "classic" | "shirt";
  title: string;
  description: string;
  details?: string[];
  care?: string[];
}

interface ProductListingServerProps {
  sections: Section[];
  pageTitle?: string;
  subTitle?: string;
}

export default function ProductListingServer({ 
  sections, 
  pageTitle, 
  subTitle 
}: ProductListingServerProps) {
  // Pass the sections and page info to the client component
  // The client component will fetch and filter the products
  return (
    <ProductListing 
      sections={sections} 
      pageTitle={pageTitle} 
      subTitle={subTitle}
    />
  );
}