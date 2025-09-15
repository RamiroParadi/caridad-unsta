import StudentLayout from "@/components/student-layout"
import { ProtectedRoute } from "@/components/protected-route"
import { UserExistenceGuard } from "@/components/user-existence-guard"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute allowedRoles={['ALUMNO', 'ADMIN']} fallbackUrl="/sign-in">
      <UserExistenceGuard>
        <StudentLayout>{children}</StudentLayout>
      </UserExistenceGuard>
    </ProtectedRoute>
  )
}
