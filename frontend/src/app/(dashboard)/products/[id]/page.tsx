import { ProductDetail } from "./ProductDetail";

export default async function ProductDetailPage(props: PageProps<"/products/[id]">) {
  const { id } = await props.params;
  return <ProductDetail productId={Number(id)} />;
}
