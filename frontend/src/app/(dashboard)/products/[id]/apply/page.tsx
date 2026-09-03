import { ApplyForm } from "./ApplyForm";

export default async function ApplyPage(props: PageProps<"/products/[id]/apply">) {
  const { id } = await props.params;
  return <ApplyForm productId={Number(id)} />;
}
