import { SignIn } from '@clerk/nextjs'
import Image from "next/image"
import Link from "next/link"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center space-y-8">
        {/* Header con logo y branding */}
        <div className="text-center">
          {/* Logo UNSTA */}
          <div className="w-28 h-28 mx-auto mb-6">
            <Image
              src="/logounsta.png"
              alt="Logo UNSTA"
              width={90}
              height={90}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Título principal */}
          <h1 className="text-5xl font-bold text-teal-600" style={{
            textShadow: '2px 2px 0px #2563eb',
            filter: 'drop-shadow(0 0 2px rgba(37, 99, 235, 0.3))'
          }}>
            CARIDAD UNSTA
          </h1>
        </div>

        {/* Formulario de Clerk personalizado */}
        <div className="w-full max-w-md">
        <SignIn 
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'bg-white shadow-xl border border-gray-200 rounded-lg',
              headerTitle: 'text-blue-900 text-xl font-bold text-center',
              headerSubtitle: 'text-gray-600 text-sm text-center mb-6',
              formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-md transition-colors',
              formFieldInput: 'border border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-md px-3 py-2.5',
              formFieldLabel: 'text-gray-700 font-medium text-sm',
              socialButtonsBlockButton: 'border border-gray-300 hover:bg-gray-50 rounded-md py-2.5 px-4 transition-colors',
              footerActionLink: 'text-blue-600 hover:text-blue-700 font-medium',
              footerActionText: 'text-gray-600 text-sm',
              dividerLine: 'bg-gray-300',
              dividerText: 'text-gray-500 text-sm',
              formFieldInputShowPasswordButton: 'text-gray-500 hover:text-gray-700',
              formFieldSuccessText: 'text-green-600 text-sm',
              formFieldErrorText: 'text-red-600 text-sm',
              identityPreviewText: 'text-gray-700',
              identityPreviewEditButton: 'text-blue-600 hover:text-blue-700'
            },
            variables: {
              colorPrimary: '#2563eb',
              colorBackground: '#ffffff',
              colorInputBackground: '#ffffff',
              colorInputText: '#1f2937',
              colorText: '#374151',
              colorTextSecondary: '#6b7280',
              borderRadius: '0.5rem'
            }
          }}
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/dashboards/usuario"
        />
        </div>

        {/* Footer */}
        <div className="text-center">
        <p className="text-sm text-gray-500">
          ¿No tenés cuenta?{" "}
          <Link href="/sign-up" className="text-blue-600 hover:text-blue-700 underline font-medium">
            Registrate aquí
          </Link>
        </p>
        </div>
      </div>
    </div>
  )
}