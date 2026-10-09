import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/catalog";
import { saveOrder, Order, OrderItem } from "@/lib/orders";
import { createFlowOrder } from "@/lib/flow";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customer, items, shippingMethod } = body;

    if (!customer || !customer.name || !customer.email || !customer.rut) {
      return NextResponse.json(
        { success: false, error: "Por favor completa todos los datos obligatorios del comprador (Nombre, RUT, Email)." },
        { status: 400 }
      );
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Tu bolsa de compras está vacía." },
        { status: 400 }
      );
    }

    // Validar productos y calcular subtotal real desde el catálogo
    const catalog = await getProducts();
    let calculatedSubtotal = 0;
    const validatedItems: OrderItem[] = [];

    for (const item of items) {
      const prod = catalog.find((p) => p.id === item.productId || p.slug === item.productId);
      if (!prod) {
        return NextResponse.json(
          { success: false, error: `El producto ${item.name || item.productId} ya no está disponible.` },
          { status: 400 }
        );
      }

      const qty = Math.max(1, Number(item.quantity) || 1);
      const price = prod.price;
      calculatedSubtotal += price * qty;

      validatedItems.push({
        productId: prod.id,
        name: prod.name,
        brand: prod.brand,
        image: prod.images?.[0]?.src || "/brand/placeholder.png",
        size: item.size || prod.sizes[0] || "Única",
        quantity: qty,
        price: price,
      });
    }

    // Despacho: Gratis sobre $50.000 CLP, de lo contrario $3.990 CLP
    const shippingCost = calculatedSubtotal >= 50000 ? 0 : 3990;
    const finalTotal = calculatedSubtotal + shippingCost;

    // Generar ID único y número de orden
    const timestamp = Date.now();
    const randomSuffix = Math.floor(Math.random() * 900 + 100);
    const orderId = `spm_${timestamp}`;
    const orderNumber = `#SPM-${Math.floor(timestamp / 1000).toString().slice(-4)}${randomSuffix}`;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      date: new Date().toISOString(),
      clientName: customer.name.trim(),
      clientRut: customer.rut.trim(),
      clientEmail: customer.email.trim().toLowerCase(),
      clientPhone: customer.phone ? customer.phone.trim() : "",
      clientAddress: customer.address ? customer.address.trim() : "",
      clientCity: customer.city || "Santiago",
      clientRegion: customer.region || "Región Metropolitana",
      shippingMethod: shippingMethod || "Envío Express a Domicilio (Starken / Blue Express)",
      shippingCost,
      status: "Pendiente de Pago",
      items: validatedItems,
      subtotal: calculatedSubtotal,
      total: finalTotal,
      paymentMethod: "Webpay Plus / Flow",
    };

    // Guardar orden inicial
    await saveOrder(newOrder);

    // Determinar la URL base del sitio para los callbacks de Flow
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "localhost:3000";
    const protocol = req.headers.get("x-forwarded-proto") || (host.includes("localhost") ? "http" : "https");
    const baseUrl = `${protocol}://${host}`;

    // Subject de la compra
    const subject = `Orden ${orderNumber} - SPM Streetwear (${validatedItems.length} items)`;

    // Iniciar transacción en Flow.cl
    const flowResponse = await createFlowOrder({
      commerceOrder: orderId,
      subject,
      amount: finalTotal,
      email: customer.email.trim().toLowerCase(),
      urlConfirmation: `${baseUrl}/api/flow/confirm`,
      urlReturn: `${baseUrl}/api/flow/return`,
    });

    // Guardar token y flowOrder en la orden
    newOrder.flowToken = flowResponse.token;
    newOrder.flowOrder = flowResponse.flowOrder;
    await saveOrder(newOrder);

    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      redirectUrl: flowResponse.url,
      token: flowResponse.token,
    });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Error al conectar con la pasarela de pago Flow." },
      { status: 500 }
    );
  }
}
