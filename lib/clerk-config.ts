// Configuración temporal de Clerk para desarrollo
// Para usar en producción, necesitas configurar las variables de entorno

export const clerkConfig = {
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_placeholder',
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
  afterSignInUrl: '/dashboards/usuario',
  afterSignUpUrl: '/dashboards/usuario',
}
