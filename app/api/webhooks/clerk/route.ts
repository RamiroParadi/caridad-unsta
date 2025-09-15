import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { Webhook } from 'svix'
import { UserDbService } from '@/lib/services/user-db-service'

export async function POST(request: NextRequest) {
  try {
    // Obtener headers
    const headerPayload = await headers()
    const svix_id = headerPayload.get("svix-id")
    const svix_timestamp = headerPayload.get("svix-timestamp")
    const svix_signature = headerPayload.get("svix-signature")

    // Verificar que tenemos los headers necesarios
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return new Response('Error occured -- no svix headers', {
        status: 400,
      })
    }

    // Obtener el body
    const payload = await request.text()
    const body = JSON.parse(payload)

    // Crear un nuevo Svix instance con el secret
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '')
    
    let evt: any

    // Verificar el payload
    try {
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as any
    } catch (err) {
      console.error('Error verifying webhook:', err)
      return new Response('Error occured', {
        status: 400,
      })
    }

    // Manejar el evento
    const eventType = evt.type
    
    if (eventType === 'user.created') {
      const { id, email_addresses, first_name, last_name } = evt.data
      
      // Obtener el email principal
      const primaryEmail = email_addresses.find((email: any) => email.id === evt.data.primary_email_address_id)
      
      if (primaryEmail) {
        try {
          // Crear el usuario en nuestra base de datos
          await UserDbService.createUser({
            clerkId: id,
            email: primaryEmail.email_address,
            name: `${first_name || ''} ${last_name || ''}`.trim() || 'Usuario',
            role: 'ALUMNO' // Por defecto todos los usuarios nuevos son estudiantes
          })
          
          console.log(`Usuario creado automáticamente: ${primaryEmail.email_address}`)
        } catch (error) {
          console.error('Error creando usuario automáticamente:', error)
          // No devolvemos error para no fallar el webhook
        }
      }
    }
    
    if (eventType === 'user.updated') {
      const { id, email_addresses, first_name, last_name } = evt.data
      
      // Obtener el email principal
      const primaryEmail = email_addresses.find((email: any) => email.id === evt.data.primary_email_address_id)
      
      if (primaryEmail) {
        try {
          // Actualizar el usuario en nuestra base de datos
          const existingUser = await UserDbService.getUserByClerkId(id)
          if (existingUser) {
            await UserDbService.updateUser(id, {
              email: primaryEmail.email_address,
              name: `${first_name || ''} ${last_name || ''}`.trim() || existingUser.name
            })
            console.log(`Usuario actualizado automáticamente: ${primaryEmail.email_address}`)
          }
        } catch (error) {
          console.error('Error actualizando usuario automáticamente:', error)
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}