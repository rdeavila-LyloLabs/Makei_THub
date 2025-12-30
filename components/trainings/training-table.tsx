import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge" // Need to install badge potentially, or just style it
import { UploadEvidenceDialog } from "./upload-evidence-dialog"

function StatusBadge({ status }: { status: string }) {
    const styles = {
        'Planned': 'bg-blue-100 text-blue-800',
        'In Progress': 'bg-yellow-100 text-yellow-800',
        'Completed': 'bg-green-100 text-green-800',
    }
    const className = styles[status as keyof typeof styles] || 'bg-gray-100'

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
            {status}
        </span>
    )
}

export function TrainingTable({ trainings }: { trainings: any[] }) {
    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Capacitación</TableHead>
                        <TableHead>Colaborador</TableHead>
                        <TableHead>Fechas</TableHead>
                        <TableHead>Costo</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Soportes</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {trainings.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                                No hay capacitaciones asignadas.
                            </TableCell>
                        </TableRow>
                    ) : (
                        trainings.map((training) => (
                            <TableRow key={training.id}>
                                <TableCell>
                                    <div className="font-medium">{training.title}</div>
                                    <div className="text-xs text-muted-foreground">{training.provider}</div>
                                </TableCell>
                                <TableCell>
                                    {training.employees?.first_name} {training.employees?.last_name}
                                </TableCell>
                                <TableCell>
                                    <div className="text-xs">
                                        {new Date(training.start_date).toLocaleDateString()} - <br />
                                        {new Date(training.end_date).toLocaleDateString()}
                                    </div>
                                </TableCell>
                                <TableCell>${training.cost}</TableCell>
                                <TableCell>
                                    <StatusBadge status={training.status} />
                                </TableCell>
                                <TableCell className="text-right">
                                    <UploadEvidenceDialog trainingId={training.id} />
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
