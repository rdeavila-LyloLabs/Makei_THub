import { getTrainings } from "@/app/actions/trainings"
import { getEmployees } from "@/app/actions/employees"
import { TrainingTable } from "@/components/trainings/training-table"
import { AssignTrainingDialog } from "@/components/trainings/assign-training-dialog"

export default async function TrainingsPage() {
    const trainings = await getTrainings()
    const employees = await getEmployees()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Capacitaciones</h1>
                    <p className="text-muted-foreground">
                        Gestiona los planes de formación y presupuesto.
                    </p>
                </div>
                {/* Pass employees for the select dropdown */}
                <AssignTrainingDialog employees={employees || []} />
            </div>

            <TrainingTable trainings={trainings || []} />
        </div>
    )
}
