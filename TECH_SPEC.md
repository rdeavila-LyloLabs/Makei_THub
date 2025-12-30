# TECH_SPEC.md

## API Design (Server Actions)

We will use Next.js Server Actions for all data mutations to ensure type safety and direct backend integration.

### Employee Management
- `getEmployees(page: number, search: string)`: Returns paginated list of employees.
- `createEmployee(data: EmployeeSchema)`: Inserts new employee linked to the current user's org.
- `updateEmployee(id: string, data: Partial<EmployeeSchema>)`: Updates details.
- `deleteEmployee(id: string)`: Soft or hard delete (Hard delete for MVP).

### Training Management
- `assignTraining(data: TrainingSchema)`: Creates a training record.
- `updateTrainingStatus(id: string, status: TrainingStatus)`: Updates lifecycle state.
- `getDashboardStats()`: Aggregates total spend and count of active trainings.

### Evidence Management
- `uploadEvidence(formData: FormData)`:
    1. Validates file type (PDF, PNG, JPG).
    2. Uploads to Supabase Storage.
    3. Inserts record into `evidences` table.

## Supabase Storage

### Bucket: `training-supports`
- **Visibility**: Private (Authenticated access only).
- **Folder Structure**: `{organization_id}/{training_id}/{filename}`
- **RLS Policy**:
    - INSERT: Allow if user belongs to `organization_id`.
    - SELECT: Allow if user belongs to `organization_id`.

## Security Considerations
- **Input Validation**: usage of `zod` schemas for all Server Actions.
- **Authentication**: Usage of Supabase generic `createClient` for Next.js middleware protection.
