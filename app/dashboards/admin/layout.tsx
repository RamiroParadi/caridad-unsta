import AdminLayout from "@/components/admin-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { UserExistenceGuard } from "@/components/user-existence-guard"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={['ADMIN']} fallbackUrl="/dashboards/usuario">
      <UserExistenceGuard>
        <AdminLayout>{children}</AdminLayout>
      </UserExistenceGuard>
    </ProtectedRoute>
  )
}
