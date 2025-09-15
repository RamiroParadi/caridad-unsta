import { TutoringVolunteerForm } from "@/components/tutoring-volunteer-form"

export default function TutoriasPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Tutoría Voluntaria</h2>
        <p className="text-blue-200">Ofrece tu conocimiento para ayudar a otros estudiantes</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <TutoringVolunteerForm />
      </div>

      {/* Información adicional */}
      <div className="bg-blue-800 rounded-lg p-6 text-white max-w-2xl mx-auto">
        <h3 className="text-xl font-bold mb-4">¿Por qué ser tutor voluntario?</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Beneficios para ti:</h4>
            <ul className="text-sm text-blue-200 space-y-1">
              <li>• Refuerzas tus conocimientos</li>
              <li>• Desarrollas habilidades de enseñanza</li>
              <li>• Contribuyes a la comunidad estudiantil</li>
              <li>• Obtienes experiencia valiosa</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Impacto en otros:</h4>
            <ul className="text-sm text-blue-200 space-y-1">
              <li>• Ayudas a estudiantes con dificultades</li>
              <li>• Mejoras el rendimiento académico</li>
              <li>• Creas una red de apoyo estudiantil</li>
              <li>• Promueves la solidaridad universitaria</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
