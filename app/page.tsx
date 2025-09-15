import { redirect } from "next/navigation"

export default function Home() {
  // Redirigir directamente a sign-in
  redirect("/sign-in")
}
