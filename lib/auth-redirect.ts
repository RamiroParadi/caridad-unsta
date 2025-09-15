import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs/server"
import { getUserRole } from "./auth-utils"
import { UserRole } from "../app/generated/prisma"

export async function redirectBasedOnRole() {
  const user = await currentUser()
  
  if (!user) {
    redirect("/welcome")
  }
  
  try {
    const role = await getUserRole(user.id)
    
    if (role === UserRole.ADMIN) {
      redirect("/dashboards/admin")
    } else {
      redirect("/dashboards/usuario")
    }
  } catch (error) {
    console.error('Error al obtener rol del usuario:', error)
    // En caso de error, redirigir al dashboard de usuario por defecto
    redirect("/dashboards/usuario")
  }
}
