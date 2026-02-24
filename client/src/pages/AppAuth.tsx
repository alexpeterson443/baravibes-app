import { useEffect } from "react";

export default function AppAuth() {
  useEffect(() => {
    const qs = window.location.search || "";
    // Forward query params to the backend start route
    window.location.replace(`/api/oauth/start${qs}`);
  }, []);

  return (
    <div style={{ padding: 24, textAlign: "center" }}>
      Starting sign-in…
    </div>
  );
}
