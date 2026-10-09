import crypto from "crypto";

export interface FlowPaymentParams {
  commerceOrder: string;
  subject: string;
  amount: number;
  email: string;
  urlConfirmation: string;
  urlReturn: string;
  optional?: string;
  paymentMethod?: number; // 1: Webpay, 9: Todos
}

export interface FlowPaymentResponse {
  url: string;
  token: string;
  flowOrder: number;
}

export interface FlowStatusResponse {
  flowOrder: number;
  commerceOrder: string;
  requestDate: string;
  status: number; // 1: Pendiente, 2: Pagada, 3: Rechazada, 4: Anulada
  subject: string;
  currency: string;
  amount: number;
  payer: string;
  optional?: string;
  pending_info?: {
    media: string;
    date: string;
  };
  paymentData?: {
    date: string;
    media: string;
    conversionDate: string;
    conversionRate: number;
    amount: number;
    currency: string;
    fee: number;
    balance: number;
    transferDate: string;
  };
}

const FLOW_API_KEY = process.env.FLOW_API_KEY || "";
const FLOW_SECRET_KEY = process.env.FLOW_SECRET_KEY || "";
const FLOW_ENV = process.env.FLOW_ENV || "production";

export function getFlowBaseUrl(): string {
  return FLOW_ENV === "sandbox" ? "https://sandbox.flow.cl/api" : "https://www.flow.cl/api";
}

/**
 * Genera la firma digital HMAC-SHA256 exigida por Flow.cl
 * 1. Ordena los parámetros alfabéticamente por su clave.
 * 2. Concatena nombre + valor sin separadores.
 * 3. Firma con HMAC-SHA256 usando el Secret Key.
 */
export function signFlowParams(params: Record<string, any>, secretKey: string = FLOW_SECRET_KEY): string {
  const keys = Object.keys(params).sort();
  let toSign = "";
  for (const key of keys) {
    if (key !== "s" && params[key] !== undefined && params[key] !== null) {
      toSign += key + String(params[key]);
    }
  }
  return crypto.createHmac("sha256", secretKey).update(toSign).digest("hex");
}

/**
 * Crea una orden de pago en Flow.cl y retorna la URL para redirigir al cliente
 */
export async function createFlowOrder(params: FlowPaymentParams): Promise<FlowPaymentResponse> {
  const apiKey = process.env.FLOW_API_KEY;
  const secretKey = process.env.FLOW_SECRET_KEY;

  if (!apiKey) {
    throw new Error("FLOW_API_KEY no configurada en las variables de entorno.");
  }
  if (!secretKey) {
    throw new Error("FLOW_SECRET_KEY no configurada. Flow requiere el Secret Key para firmar la transacción.");
  }

  const payload: Record<string, any> = {
    apiKey,
    commerceOrder: params.commerceOrder,
    subject: params.subject,
    currency: "CLP",
    amount: Math.round(params.amount),
    email: params.email,
    urlConfirmation: params.urlConfirmation,
    urlReturn: params.urlReturn,
  };

  if (params.optional) {
    payload.optional = params.optional;
  }
  if (params.paymentMethod) {
    payload.paymentMethod = params.paymentMethod;
  }

  // Generar firma digital
  payload.s = signFlowParams(payload, secretKey);

  const formBody = new URLSearchParams();
  for (const [key, val] of Object.entries(payload)) {
    formBody.append(key, String(val));
  }

  const url = `${getFlowBaseUrl()}/payment/create`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formBody.toString(),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Error al crear pago en Flow (${response.status})`);
  }

  return {
    url: `${data.url}?token=${data.token}`,
    token: data.token,
    flowOrder: data.flowOrder,
  };
}

/**
 * Consulta el estado oficial de una transacción en Flow.cl mediante su token
 */
export async function getFlowPaymentStatus(token: string): Promise<FlowStatusResponse> {
  const apiKey = process.env.FLOW_API_KEY;
  const secretKey = process.env.FLOW_SECRET_KEY;

  if (!apiKey || !secretKey) {
    throw new Error("Credenciales de Flow no configuradas.");
  }

  const queryParams: Record<string, any> = {
    apiKey,
    token,
  };

  queryParams.s = signFlowParams(queryParams, secretKey);

  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(queryParams)) {
    qs.append(k, String(v));
  }

  const url = `${getFlowBaseUrl()}/payment/getStatus?${qs.toString()}`;
  const response = await fetch(url, {
    method: "GET",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Error al consultar estado en Flow (${response.status})`);
  }

  return data as FlowStatusResponse;
}
