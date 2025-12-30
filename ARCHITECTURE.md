# ARCHITECTURE.md

## High-Level Architecture
- **Frontend**: Next.js 14 (App Router)
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Multi-tenancy**: Discriminated by `organization_id` column in all primary tables.

## Database Schema (ERD)

### 1. organizations
*Tenant root. Stores company details.*
- `id` (UUID, PK)
- `name` (Text)
- `created_at` (Timestamp)

### 2. employees
*Staff members belonging to an organization.*
- `id` (UUID, PK)
- `organization_id` (UUID, FK -> organizations.id)
- `first_name` (Text)
- `last_name` (Text)
- `email` (Text, Unique per org)
- `position` (Text)
- `department` (Text)
- `created_at` (Timestamp)

### 3. trainings
*Training records assigned to employees.*
- `id` (UUID, PK)
- `organization_id` (UUID, FK -> organizations.id)
- `employee_id` (UUID, FK -> employees.id)
- `title` (Text)
- `training_type` (Text) - Enum/Text (e.g., 'Technical', 'Soft Skills')
- `provider` (Text)
- `start_date` (Date)
- `end_date` (Date)
- `cost` (Decimal/Numeric)
- `status` (Text) - 'Planned', 'In Progress', 'Completed'
- `created_at` (Timestamp)

### 4. evidences
*Proof of completion or financial documents.*
- `id` (UUID, PK)
- `organization_id` (UUID, FK -> organizations.id)
- `training_id` (UUID, FK -> trainings.id)
- `file_url` (Text) - Path in Supabase Storage
- `file_type` (Text) - 'Certificate', 'Invoice', etc.
- `uploaded_at` (Timestamp)

## Row Level Security (RLS) Policies

All tables MUST enable RLS.

### Policy Pattern
Users will be authenticated via Supabase Auth. We assume a metadata field or a mapping table links `auth.uid()` to an `organization_id`. For this MVP, we might simplify or assume the user *is* the org admin.

**Generic Policy:**
```sql
CREATE POLICY "Tenant Isolation" ON table_name
USING (organization_id = (SELECT organization_id FROM auth_user_profile WHERE user_id = auth.uid()));
```
*(Note: For MVP simplicity, if the `organizations` table is linked directly to `auth.users`, the check might vary slightly, e.g., `auth.uid() = organization_owner_id`)*

## Relationships
- `organizations` 1:N `employees`
- `employees` 1:N `trainings`
- `trainings` 1:N `evidences`
