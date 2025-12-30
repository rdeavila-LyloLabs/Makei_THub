import { getEmployees } from "@/app/actions/employees"
import { EmployeeTable } from "@/components/employees/employee-table"
import { AddEmployeeDialog } from "@/components/employees/add-employee-dialog"

export default async function EmployeesPage() {
    const employees = await getEmployees()

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Colaboradores</h1>
                    <p className="text-muted-foreground">
                        Gestiona el directorio de personal de tu organización.
                    </p>
                </div>
                <AddEmployeeDialog />
            </div>

            <EmployeeTable employees={employees} />
        </div>
    )
}
