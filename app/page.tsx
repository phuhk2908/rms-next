import { getAllMenuCategories } from "@/data/menu-category";
import Image from "next/image";

export default async function Home() {
  const data = await getAllMenuCategories();
  console.log(data);
  return <></>;
}
