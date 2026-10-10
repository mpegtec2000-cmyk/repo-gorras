import { getServiceSupabase } from "@/lib/supabase";
import ClientesClient from "./ClientesClient";

export const dynamic = "force-dynamic";

export default async function ClientesPage() {
  let clients: any[] = [];
  try {
    const sb = getServiceSupabase();
    const { data } = await sb
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    clients = data || [];
  } catch (err) {
    console.error("Error cargando perfiles en ClientesPage:", err);
  }

  return <ClientesClient initialClients={clients} />;
}
