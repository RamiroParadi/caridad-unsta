# Sistema de Caridad UNSTA

## Deploy en Vercel

### Variables de Entorno Requeridas

Configura estas variables en tu proyecto de Vercel:

```
DATABASE_URL=postgresql://username:password@host:port/database
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboards/usuario
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboards/usuario
CLERK_WEBHOOK_SECRET=whsec_...
NODE_ENV=production
```

### Pasos para Deploy

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. El deploy se ejecutará automáticamente
4. Configura el webhook de Clerk apuntando a: `https://tu-dominio.vercel.app/api/webhooks/clerk`

### Configuración de Base de Datos

- Usa Neon PostgreSQL para la base de datos
- Ejecuta `npx prisma db push` después del primer deploy
- Inicializa la base de datos visitando `/init-db`

### Notas Importantes

- El build está configurado para ignorar errores de ESLint y TypeScript durante el deploy
- Los archivos generados por Prisma están excluidos del linting
- El sistema está optimizado para producción
