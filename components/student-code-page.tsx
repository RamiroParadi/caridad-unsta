"use client"

import { StudentCodeField } from "@/components/student-code-field"
import { UserNameField } from "@/components/user-name-field"

export default function StudentCodePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-2">Información Personal</h2>
        <p className="text-sm text-gray-600 mb-4">
          Gestiona tu información personal y código de estudiante
        </p>
      </div>
      
      <UserNameField />
      <StudentCodeField />
    </div>
  )
}
