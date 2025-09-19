# CARIDAD UNSTA 📚❤️

**Sistema de Gestión de Donaciones y Actividades Solidarias de la Universidad del Norte Santo Tomás de Aquino**

---

## 📋 Índice

1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Funcionalidades Implementadas](#funcionalidades-implementadas)
4. [Manual de Instalación](#manual-de-instalación)
5. [Manual de Usuario](#manual-de-usuario)
6. [Estructura del Proyecto](#estructura-del-proyecto)
7. [API Endpoints](#api-endpoints)
8. [Base de Datos](#base-de-datos)
9. [Despliegue](#despliegue)
10. [Contribución](#contribución)

---

## 📖 Descripción del Proyecto

CARIDAD UNSTA es una plataforma web desarrollada para fomentar la solidaridad estudiantil en la Universidad del Norte Santo Tomás de Aquino. El sistema permite a los estudiantes y administradores gestionar donaciones, organizar actividades de voluntariado y crear una comunidad universitaria más comprometida con el bien común.

### Objetivos del Proyecto
- **Solidaridad Estudiantil**: Fomentar la cultura de ayuda mutua entre estudiantes
- **Comunidad Unida**: Crear una red de apoyo que trascienda las diferencias académicas
- **Impacto Local**: Generar un impacto positivo directo en la comunidad universitaria
- **Responsabilidad Social**: Desarrollar el sentido de responsabilidad social en futuros profesionales

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **Next.js 15.5.3** - Framework de React para aplicaciones web
- **React 19.1.0** - Biblioteca de JavaScript para interfaces de usuario
- **TypeScript 5** - Superset de JavaScript con tipado estático
- **Tailwind CSS 4** - Framework de CSS para diseño responsivo
- **Lucide React** - Biblioteca de iconos moderna
- **Radix UI** - Componentes de interfaz accesibles
- **React Hook Form** - Manejo eficiente de formularios
- **Zod** - Validación de esquemas de datos

### Backend
- **Next.js API Routes** - API endpoints integrados
- **Prisma 6.16.1** - ORM para base de datos
- **Neon Database** - Base de datos PostgreSQL serverless
- **Clerk** - Autenticación y gestión de usuarios

### Herramientas de Desarrollo
- **ESLint** - Linter para JavaScript/TypeScript
- **PostCSS** - Procesador de CSS
- **Git** - Control de versiones
- **Netlify** - Plataforma de despliegue

---

## ⚡ Funcionalidades Implementadas

### 🔐 Sistema de Autenticación
- **Registro de usuarios** con Clerk
- **Inicio de sesión** seguro
- **Gestión de roles** (Admin/Alumno)
- **Protección de rutas** basada en roles

### 👥 Gestión de Usuarios
- **Perfil de usuario** personalizable
- **Código de estudiante** único
- **Roles diferenciados** (Administrador/Estudiante)
- **Gestión de usuarios** desde panel admin

### 💝 Sistema de Donaciones
- **Donaciones de Materiales de Estudio**
  - Libros y útiles escolares
  - Materiales educativos
- **Donaciones de Vestimenta**
  - Ropa en buen estado
  - Zapatos y accesorios
- **Donaciones Festivas**
  - Navidad
  - Día del Niño
  - Comienzo de Clases
  - Donaciones personalizadas
- **Estados de donación**: Pendiente, Confirmada, Rechazada
- **Donaciones anónimas** opcionales

### 🎯 Gestión de Actividades
- **Creación de actividades** de voluntariado
- **Calendario de actividades** semanal
- **Inscripción a actividades** por parte de estudiantes
- **Gestión de participantes** con modal detallado
- **Límite de participantes** por actividad
- **Estados de actividad**: Activa/Finalizada

### 📊 Panel de Administración
- **Dashboard con estadísticas** en tiempo real
- **Gestión completa de donaciones**
- **Administración de actividades**
- **Gestión de usuarios**
- **Sistema de notificaciones**
- **Exportación de datos** en CSV

### 🔔 Sistema de Notificaciones
- **Notificaciones globales** del sistema
- **Notificaciones por usuario**
- **Campana de notificaciones** con contador
- **Modal de notificaciones** detallado
- **Marcado de notificaciones** como leídas

### 📱 Interfaz Responsiva
- **Diseño mobile-first**
- **Sidebar colapsible** para administradores
- **Navegación intuitiva**
- **Componentes reutilizables**
- **Tema consistente** con colores institucionales

---

## 🚀 Manual de Instalación

### Prerrequisitos
- **Node.js** 18+ 
- **npm** o **yarn**
- **Git**
- **Cuenta de Neon** (base de datos)
- **Cuenta de Clerk** (autenticación)

### Pasos de Instalación

#### 1. Clonar el Repositorio
```bash
git clone https://github.com/RamiroParadi/caridad-unsta.git
cd caridad-unsta
```

#### 2. Instalar Dependencias
```bash
npm install
```

#### 3. Configurar Variables de Entorno
Crear archivo `.env.local`:
```env
# Base de Datos
DATABASE_URL="postgresql://usuario:password@host:puerto/database"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL="/dashboards/usuario"
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL="/dashboards/usuario"
```

#### 4. Configurar Base de Datos
```bash
# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma db push

# (Opcional) Poblar con datos iniciales
npm run seed
```

#### 5. Inicializar Base de Datos
```bash
# Ejecutar en modo desarrollo
npm run dev

# Visitar http://localhost:3000/init-db para inicializar datos
```

#### 6. Ejecutar en Desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

---

## 👤 Manual de Usuario

### 🎓 Para Estudiantes

#### Acceso al Sistema
1. **Registro**: Visita `/sign-up` para crear tu cuenta
2. **Inicio de Sesión**: Usa `/sign-in` para acceder
3. **Dashboard**: Acceso automático a `/dashboards/usuario`

#### Realizar Donaciones
1. **Selecciona el tipo de donación**:
   - Materiales de Estudio
   - Vestimenta
   - Donaciones Festivas
2. **Completa el formulario** con los detalles
3. **Confirma la donación**
4. **Recibe confirmación** por email

#### Participar en Actividades
1. **Ve a "Eventos"** en el dashboard
2. **Explora el calendario** semanal
3. **Haz clic en una actividad** para ver detalles
4. **Inscríbete** si hay cupos disponibles
5. **Recibe confirmación** de participación

#### Verificar Estado de Donaciones
1. **Accede a "Mis Donaciones"**
2. **Revisa el estado**: Pendiente/Confirmada/Rechazada
3. **Ve detalles** de cada donación

### 👨‍💼 Para Administradores

#### Acceso al Panel Admin
1. **Inicia sesión** con cuenta de administrador
2. **Accede automáticamente** a `/dashboards/admin`
3. **Navega** usando el sidebar izquierdo

#### Gestionar Donaciones
1. **Ve a "Donaciones"** en el sidebar
2. **Selecciona el tipo** de donación a gestionar
3. **Revisa las donaciones** pendientes
4. **Cambia el estado**: Pendiente → Confirmada/Rechazada
5. **Exporta datos** en CSV si es necesario

#### Gestionar Actividades
1. **Ve a "Actividades"** en el sidebar
2. **Crear nueva actividad**:
   - Título y descripción
   - Fecha y ubicación
   - Límite de participantes
3. **Editar actividades** existentes
4. **Ver participantes** de cada actividad
5. **Eliminar actividades** si es necesario

#### Gestionar Usuarios
1. **Ve a "Usuarios"** en el sidebar
2. **Ver lista** de todos los usuarios
3. **Cambiar roles** de usuario
4. **Actualizar información** de usuarios

#### Ver Estadísticas
1. **Dashboard principal** muestra:
   - Actividades activas
   - Usuarios totales
   - Donaciones totales
   - Donaciones pendientes
2. **Actividades recientes**
3. **Donaciones recientes**

---

## 📁 Estructura del Proyecto

```
caridad-unsta/
├── app/                          # App Router de Next.js
│   ├── api/                      # API Routes
│   │   ├── activities/           # Endpoints de actividades
│   │   ├── admin/                # Endpoints de administración
│   │   ├── donations/            # Endpoints de donaciones
│   │   ├── notifications/        # Endpoints de notificaciones
│   │   └── users/               # Endpoints de usuarios
│   ├── dashboards/              # Dashboards de usuario y admin
│   │   ├── admin/               # Panel de administración
│   │   └── usuario/             # Panel de estudiante
│   ├── sign-in/                 # Página de inicio de sesión
│   ├── sign-up/                 # Página de registro
│   ├── layout.tsx               # Layout principal
│   ├── page.tsx                 # Página de inicio
│   └── not-found.tsx            # Página 404
├── components/                   # Componentes reutilizables
│   ├── ui/                      # Componentes de UI base
│   ├── admin-layout.tsx         # Layout de administrador
│   ├── student-layout.tsx       # Layout de estudiante
│   ├── donation-form.tsx        # Formulario de donaciones
│   ├── event-form.tsx           # Formulario de actividades
│   └── participants-modal.tsx   # Modal de participantes
├── lib/                         # Utilidades y servicios
│   ├── services/                # Servicios de base de datos
│   ├── hooks/                   # Hooks personalizados
│   ├── prisma.ts                # Cliente de Prisma
│   └── utils.ts                 # Utilidades generales
├── prisma/                      # Configuración de Prisma
│   ├── schema.prisma            # Esquema de base de datos
│   └── migrations/              # Migraciones de BD
├── public/                      # Archivos estáticos
├── middleware.ts                # Middleware de Next.js
├── next.config.js               # Configuración de Next.js
├── tailwind.config.js           # Configuración de Tailwind
└── package.json                 # Dependencias del proyecto
```

---

## 🔌 API Endpoints

### Actividades
- `GET /api/activities` - Obtener todas las actividades
- `POST /api/activities` - Crear nueva actividad
- `DELETE /api/activities?id={id}` - Eliminar actividad
- `GET /api/activities/[id]/participants` - Obtener participantes

### Donaciones
- `GET /api/donations` - Obtener donaciones
- `POST /api/donations` - Crear nueva donación
- `PUT /api/donations/[id]` - Actualizar donación
- `GET /api/donations/sections` - Obtener secciones de donación

### Administración
- `GET /api/admin/stats` - Estadísticas del admin
- `GET /api/admin/recent-activities` - Actividades recientes
- `GET /api/admin/recent-donations` - Donaciones recientes
- `POST /api/admin/init-db` - Inicializar base de datos

### Usuarios
- `GET /api/users/all` - Obtener todos los usuarios
- `POST /api/users/create` - Crear usuario
- `PUT /api/users/update-role` - Actualizar rol de usuario
- `GET /api/users/role/[clerkId]` - Obtener rol de usuario

### Notificaciones
- `GET /api/notifications` - Obtener notificaciones
- `POST /api/notifications/mark-read` - Marcar como leída
- `GET /api/notifications/unread-count` - Contador de no leídas

---

## 🗄️ Base de Datos

### Esquema Principal

#### Usuarios (User)
- `id` - ID único
- `clerkId` - ID de Clerk
- `email` - Email del usuario
- `name` - Nombre completo
- `studentCode` - Código de estudiante
- `role` - Rol (ADMIN/ALUMNO)

#### Actividades (Activity)
- `id` - ID único
- `title` - Título de la actividad
- `description` - Descripción
- `date` - Fecha de la actividad
- `location` - Ubicación
- `maxParticipants` - Límite de participantes
- `isActive` - Estado activo

#### Donaciones (Donation)
- `id` - ID único
- `amount` - Monto (0 para no monetarias)
- `description` - Descripción
- `isAnonymous` - Donación anónima
- `status` - Estado (PENDIENTE/CONFIRMADA/RECHAZADA)
- `donorName` - Nombre del donante
- `donorEmail` - Email del donante

#### Secciones de Donación (DonationSection)
- `id` - ID único
- `name` - Nombre de la sección
- `description` - Descripción
- `isActive` - Estado activo

#### Participantes de Actividad (ActivityParticipant)
- `userId` - ID del usuario
- `activityId` - ID de la actividad
- Relación many-to-many entre usuarios y actividades

#### Notificaciones (Notification)
- `id` - ID único
- `title` - Título
- `message` - Mensaje
- `isActive` - Estado activo
- `createdAt` - Fecha de creación

---

## 🌐 Despliegue

### Netlify (Recomendado)

1. **Conectar repositorio** a Netlify
2. **Configurar variables de entorno**:
   - `DATABASE_URL`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - Variables adicionales de Clerk
3. **Configurar comando de build**: `npm run build`
4. **Directorio de publicación**: `.next`
5. **Desplegar** automáticamente

### Variables de Entorno Requeridas
```env
DATABASE_URL="postgresql://..."
CLERK_SECRET_KEY="sk_..."
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL="/dashboards/usuario"
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL="/dashboards/usuario"
```

---

## 🤝 Contribución

### Cómo Contribuir
1. **Fork** el repositorio
2. **Crear rama** para nueva funcionalidad: `git checkout -b feature/nueva-funcionalidad`
3. **Commit** cambios: `git commit -m 'Agregar nueva funcionalidad'`
4. **Push** a la rama: `git push origin feature/nueva-funcionalidad`
5. **Crear Pull Request**

### Estándares de Código
- **TypeScript** para tipado estático
- **ESLint** para calidad de código
- **Conventional Commits** para mensajes
- **Componentes funcionales** con hooks
- **Responsive design** obligatorio

### Reportar Issues
- Usar el sistema de **Issues** de GitHub
- Incluir **pasos para reproducir**
- Especificar **versión** y **entorno**
- Adjuntar **capturas de pantalla** si es necesario

---

## 📞 Soporte

### Contacto
- **Desarrollador**: Ramiro Paradi
- **Repositorio**: [GitHub - caridad-unsta](https://github.com/RamiroParadi/caridad-unsta)
- **Universidad**: Universidad del Norte Santo Tomás de Aquino

### Licencia
Este proyecto está desarrollado para uso educativo y solidario de la Universidad del Norte Santo Tomás de Aquino.

---

## 🎯 Roadmap Futuro

### Funcionalidades Planificadas
- [ ] **Sistema de mensajería** entre usuarios
- [ ] **Calendario avanzado** con vista mensual
- [ ] **Sistema de puntos** por participación
- [ ] **Notificaciones push** móviles
- [ ] **API pública** para integraciones
- [ ] **Dashboard móvil** nativo
- [ ] **Sistema de badges** por logros
- [ ] **Integración con redes sociales**

### Mejoras Técnicas
- [ ] **Tests automatizados** (Jest/Cypress)
- [ ] **CI/CD pipeline** completo
- [ ] **Monitoreo** de aplicación
- [ ] **Optimización** de rendimiento
- [ ] **Internacionalización** (i18n)
- [ ] **PWA** (Progressive Web App)

---

**CARIDAD UNSTA** - Construyendo una comunidad universitaria más solidaria 🎓❤️