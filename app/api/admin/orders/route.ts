import { NextRequest, NextResponse } from "next/server";
import { getOrders, updateOrderStatus, OrderStatus } from "@/lib/orders";

export async function GET() {
  const orders = await getOrders();
  return NextResponse.json({ success: true, count: orders.length, orders });
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, status } = body;

    if (!orderId || !status) {
      return NextResponse.json({ success: false, error: "Faltan parámetros (orderId, status)" }, { status: 400 });
    }

    const updated = await updateOrderStatus(orderId, status as OrderStatus);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Orden no encontrada" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
