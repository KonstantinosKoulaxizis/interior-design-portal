import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/catalogue/ProductDetail";
import { PRODUCTS, getProduct } from "@/lib/content";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/catalogue/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  return { title: product ? `${product.name} | Maria Michalakakou` : "Συλλογή | Maria Michalakakou" };
}

async function Product({ params }: { params: PageProps<"/catalogue/[slug]">["params"] }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}

export default function ProductPage({ params }: PageProps<"/catalogue/[slug]">) {
  return (
    <main>
      <Suspense fallback={<div className="min-h-[100svh]" />}>
        <Product params={params} />
      </Suspense>
    </main>
  );
}
