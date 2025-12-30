import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { deleteEmployee } from "@/app/actions/employees"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

// Simple table for MVP, can be enhanced with Sorting/Pagination from Tanstack Table later
export function EmployeeTable({ employees }: { employees: any[] }) {
    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Correo</TableHead>
                        <TableHead>Cargo</TableHead>
                        <TableHead>Departamento</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {employees.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                                No se encontraron colaboradores.
                            </TableCell>
                        </TableRow>
                    ) : (
                        employees.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell className="font-medium">
                                    {employee.first_name} {employee.last_name}
                                </TableCell>
                                <TableCell>{employee.email}</TableCell>
                                <TableCell>{employee.position}</TableCell>
                                <TableCell>{employee.department}</TableCell>
                                <TableCell className="text-right">
                                    <form action={async () => {
                                        'use server'
                                        await deleteEmployee(employee.id)
                                    }}>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </form>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
