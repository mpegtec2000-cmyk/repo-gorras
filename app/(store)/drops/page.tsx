import { Metadata } from "next";
import { getProducts } from "@/lib/catalog";
import { site } from "@/lib/site";
import DropsClient from "./DropsClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: `Drops & Streetwear Lookbook | ${site.name}`,
  description:
    "Descubre los lanzamientos exclusivos, videos y sesiones de lookbook de SPM Streetwear. Sigue nuestra cuenta oficial de Instagram @spm_store.cl y accede a ediciones limitadas.",
  openGraph: {
    title: `Drops & Streetwear Lookbook | ${site.name}`,
    description:
      "Videos oficiales, sesiones en estudio y gorras exclusivas de SPM Streetwear en Chile. Conéctate con nuestra comunidad en Instagram @spm_store.cl.",
    url: `${site.url}/drops`,
    siteName: site.name,
    locale: site.locale,
    type: "website",
  },
};

export default async function DropsPage() {
  const products = await getProducts();
  return <DropsClient products={products} />;
}
