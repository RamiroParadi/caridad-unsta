import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-blue-900 flex items-center justify-center p-4">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Página no encontrada</h2>
        <p className="text-lg mb-8 text-blue-200">
          La página que buscas no existe o ha sido movida.
        </p>
        <Link href="/sign-in">
          <Button className="bg-white text-blue-900 hover:bg-blue-100">
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  )
}
