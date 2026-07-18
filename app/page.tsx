import { redirect } from "next/navigation";

// The application experience at /apply IS the site; the old standalone
// landing page is retired so nothing links back to a stale design.
export default function Home() {
  redirect("/apply");
}
