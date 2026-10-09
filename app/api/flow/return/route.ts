import { NextRequest, NextResponse } from "next/server";
import { getFlowPaymentStatus } from "@/lib/flow";
import { getOrder, updateOrderStatus } from "@/lib/orders";
import { updateProductPartial, getProduct } from "@/lib/catalog";

async function handleReturn(token: string | null, req: NextRequest) {
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
  const protocol = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
  const baseUrl = `${protocol}://${host}`;

  if (!token) {
    return NextResponse.redirect(`${baseUrl}/tienda?error=token_missing`);
  }

  try {
    const flowStatus = await getFlowPaymentStatus(token);
    const order = await getOrder(flowStatus.commerceOrder);

    if (!order) {
      return NextResponse.redirect(`${baseUrl}/tienda?error=order_not_found`);
    }

    if (flowStatus.status === 2) {
      // Si la orden aún no estaba marcada como pagada por el webhook
      if (order.status !== "Pagado") {
        await updateOrderStatus(order.id, "Pagado", {
          flowOrder: flowStatus.flowOrder,
          flowToken: token,
          paidAt: flowStatus.paymentData?.date || new Date().toISOString(),
          paymentMedia: flowStatus.paymentData?.media || "Webpay Plus",
        });

        // Descontar inventario de cada producto comprado
        for (const item of order.items) {
          const currentProd = await getProduct(item.productId);
          if (currentProd) {
            const newStock = Math.max(0, currentProd.stock - item.quantity);
            const newSold = currentProd.sold + item.quantity;
            await updateProductPartial(currentProd.id, {
              stock: newStock,
              sold: newSold,
            });
          }
        }
      }

      return NextResponse.redirect(`${baseUrl}/pedido/${order.id}?status=success&token=${token}`);
    } else {
      await updateOrderStatus(order.id, "Rechazado", {
        flowOrder: flowStatus.flowOrder,
        flowToken: token,
      });

      return NextResponse.redirect(`${baseUrl}/pedido/${order.id}?status=rejected&token=${token}`);
    }
  } catch (error: any) {
    console.error("Error en retorno de Flow:", error);
    return NextResponse.redirect(`${baseUrl}/tienda?error=flow_return_failed`);
  }
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  return handleReturn(token, req);
}

export async function POST(req: NextRequest) {
  let token: string | null = null;
  try {
    const formData = await req.formData();
    token = formData.get("token") as string;
  } catch {
    token = req.nextUrl.searchParams.get("token");
  }
  return handleReturn(token, req);
}
