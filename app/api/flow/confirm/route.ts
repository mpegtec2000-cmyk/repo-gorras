import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getFlowPaymentStatus } from "@/lib/flow";
import { getOrder, updateOrderStatus } from "@/lib/orders";
import { updateProductPartial, getProduct } from "@/lib/catalog";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const token = formData.get("token") as string;

    if (!token) {
      return NextResponse.json({ success: false, error: "Token no proporcionado" }, { status: 400 });
    }

    // Consultar el estado oficial de la transacción en Flow
    const flowStatus = await getFlowPaymentStatus(token);
    const order = await getOrder(flowStatus.commerceOrder);

    if (!order) {
      console.error(`Orden no encontrada para flowOrder: ${flowStatus.flowOrder}, commerceOrder: ${flowStatus.commerceOrder}`);
      return NextResponse.json({ success: false, error: "Orden no encontrada" }, { status: 404 });
    }

    // Status 2 = Pagada
    if (flowStatus.status === 2) {
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

        try {
          revalidatePath("/admin");
          revalidatePath("/admin/ventas");
          revalidatePath("/admin/flujo");
          revalidatePath("/admin/inventario");
          revalidatePath("/admin/productos");
          revalidatePath("/tienda");
          revalidatePath("/");
        } catch {}
      }
    } else if (flowStatus.status === 3 || flowStatus.status === 4) {
      // Rechazada o Anulada
      await updateOrderStatus(order.id, "Rechazado", {
        flowOrder: flowStatus.flowOrder,
        flowToken: token,
      });

      try {
        revalidatePath("/admin/ventas");
      } catch {}
    }

    return NextResponse.json({ success: true, status: flowStatus.status });
  } catch (error: any) {
    console.error("Error en webhook de Flow:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
