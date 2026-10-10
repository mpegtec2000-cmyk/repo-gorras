import fs from "fs";
import path from "path";

export default function EmailPreviewPage() {
  const filePath = path.join(process.cwd(), "supabase", "email-templates", "reset-password.html");
  let html = fs.readFileSync(filePath, "utf-8");
  html = html.replace("{{ .ConfirmationURL }}", "https://www.spm-store.cl/login?type=reset");

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#000000", padding: "20px 0" }}>
      <iframe
        srcDoc={html}
        style={{
          width: "100%",
          maxWidth: "700px",
          height: "850px",
          border: "none",
          display: "block",
          margin: "0 auto",
          borderRadius: "16px",
          overflow: "hidden",
        }}
        title="Email Preview"
      />
    </div>
  );
}
