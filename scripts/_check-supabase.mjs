import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";
const env = Object.fromEntries(
  fs.readFileSync("d:/GORROS/.env.local", "utf8").split(/\r?\n/).filter((l) => l.includes("=") && !l.startsWith("#")).map((l) => [l.slice(0, l.indexOf("=")).trim(), l.slice(l.indexOf("=") + 1).trim()])
);
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
const t = await sb.from("products").select("*").limit(1);
console.log("products table:", t.error ? "ERROR " + t.error.message : "OK rows=" + t.data.length);
const b = await sb.storage.listBuckets();
console.log("buckets:", b.error ? "ERROR " + b.error.message : b.data.map((x) => `${x.name}(public=${x.public})`).join(", ") || "(none)");
