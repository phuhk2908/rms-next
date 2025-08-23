import { Metadata } from "next";
import { AccessDeniedComp } from "./_components/access-denied";

export const metadata: Metadata = {
   title: "Access Denied",
   description: "",
};

export default function AccessDeniedPage() {
   return <AccessDeniedComp />;
}
