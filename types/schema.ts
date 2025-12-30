import { z } from 'zod';

export const EmployeeSchema = z.object({
    id: z.string().optional(),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    position: z.string().min(1, "Position is required"),
    department: z.string().min(1, "Department is required"),
});

export type Employee = z.infer<typeof EmployeeSchema>;

export const TrainingSchema = z.object({
    id: z.string().optional(),
    employee_id: z.string().uuid("Employee is required"),
    title: z.string().min(1, "Title is required"),
    training_type: z.string().min(1, "Type is required"),
    provider: z.string().optional(),
    start_date: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid start date"),
    end_date: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid end date"),
    cost: z.number().min(0, "Cost must be positive"),
    status: z.enum(['Planned', 'In Progress', 'Completed']).default('Planned'),
});

export type Training = z.infer<typeof TrainingSchema>;

export const EvidenceSchema = z.object({
    id: z.string().optional(),
    training_id: z.string().uuid(),
    file_url: z.string().url(),
    file_type: z.string(),
});

export type Evidence = z.infer<typeof EvidenceSchema>;
