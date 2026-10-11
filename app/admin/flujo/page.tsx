import React from "react";
import { getRealAnalytics } from "@/lib/analytics-server";
import FlujoClient from "./FlujoClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Flujo & Analítica | SaaS Admin",
};

export default async function FlujoPage() {
  const initialMetrics = await getRealAnalytics();
  return <FlujoClient initialMetrics={initialMetrics} />;
}
