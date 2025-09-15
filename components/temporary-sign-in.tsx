"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

export function TemporarySignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"ALUMNO" | "ADMIN">("ALUMNO")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simular autenticación
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Guardar datos de sesión temporal
    localStorage.setItem('user', JSON.stringify({
      email,
      name: email.split('@')[0],
      role
    }))

    setIsLoading(false)
    router.push('/dashboards/usuario')
  }

  return (
    <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border border-white/20">
      <CardHeader>
        <CardTitle className="text-white text-center">Iniciar Sesión</CardTitle>
        <CardDescription className="text-blue-200 text-center">
          Modo desarrollo - Usa cualquier email y contraseña
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-blue-200">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-blue-300"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-blue-200">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-blue-300"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role" className="text-blue-200">Rol</Label>
            <Select value={role} onValueChange={(value: "ALUMNO" | "ADMIN") => setRole(value)}>
              <SelectTrigger className="bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Selecciona tu rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALUMNO">Alumno</SelectItem>
                <SelectItem value="ADMIN">Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm text-blue-200 mb-2">
            ¿No tenés cuenta?
          </p>
          <Button 
            variant="outline" 
            className="border-blue-300 text-blue-200 hover:bg-blue-700"
            onClick={() => router.push('/sign-up')}
          >
            Registrate aquí
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
