import { getAllMenuCategories } from "@/data/menu-category";

export default async function Home() {
   const data = await getAllMenuCategories();
   console.log(data);
   return <></>;
}
