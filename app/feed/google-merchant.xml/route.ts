import { NextResponse } from "next/server";
import { getProducts } from "@/lib/catalog";
import { site } from "@/lib/site";

function escapeXml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const products = await getProducts();
  const baseUrl = site.url;

  const itemsXml = products
    .filter((p) => p.isActive !== false)
    .map((p) => {
      const rawImg = p.images?.[0]?.src;
      const imgUrl = rawImg
        ? (rawImg.startsWith("http") ? rawImg : `${baseUrl}${rawImg.startsWith("/") ? rawImg : `/${rawImg}`}`)
        : `${baseUrl}/products/placeholder-cap.png`;

      const shippingPrice = p.price >= site.freeShippingFrom ? "0 CLP" : "3990 CLP";

      return `
    <item>
      <g:id>${escapeXml(p.id)}</g:id>
      <g:title>${escapeXml(p.seoTitle || `${p.brand} ${p.name}`)}</g:title>
      <g:description>${escapeXml(p.seoDescription || p.description)}</g:description>
      <g:link>${baseUrl}/producto/${escapeXml(p.slug)}</g:link>
      <g:image_link>${escapeXml(imgUrl)}</g:image_link>
      <g:condition>new</g:condition>
      <g:availability>${p.stock > 0 ? "in_stock" : "out_of_stock"}</g:availability>
      <g:price>${p.price} CLP</g:price>
      <g:brand>${escapeXml(p.brand || site.shortName)}</g:brand>
      <g:product_type>Ropa y Accesorios &gt; Gorras y Jockeys</g:product_type>
      <g:google_product_category>1604</g:google_product_category>
      <g:shipping>
        <g:country>CL</g:country>
        <g:service>Starken / Blue Express</g:service>
        <g:price>${shippingPrice}</g:price>
      </g:shipping>
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>${escapeXml(site.name)} - Catálogo Oficial Google Merchant</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(site.description)}</description>
    ${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
