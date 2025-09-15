"use client"

import { UserButton } from "@clerk/nextjs"
import { GraduationCap } from "lucide-react"
import StudentCodePage from "@/components/student-code-page"

export function CustomUserButton() {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1">
      <UserButton>
        <UserButton.UserProfilePage 
          label="Código de Estudiante"
          labelIcon={<GraduationCap className="h-4 w-4" />}
          url="student-code"
        >
          <StudentCodePage />
        </UserButton.UserProfilePage>
      </UserButton>
    </div>
  )
}