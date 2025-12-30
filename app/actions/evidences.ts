'use server'

import { revalidatePath } from 'next/cache';
import { getUserOrgId } from './utils';

export async function uploadEvidence(formData: FormData) {
    const { supabase, organizationId } = await getUserOrgId();

    const file = formData.get('file') as File;
    const trainingId = formData.get('training_id') as string;
    const fileType = formData.get('file_type') as string; // 'Certificate' or 'Invoice'

    if (!file || !trainingId) {
        return { error: 'Missing file or training ID' };
    }

    // Generate unique path: {orgId}/{trainingId}/{timestamp}_{filename}
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${organizationId}/${trainingId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('training-supports')
        .upload(filePath, file);

    if (uploadError) {
        console.error('Upload Error:', uploadError);
        return { error: 'Failed to upload file' };
    }

    // Get Public URL (or signed URL, but public is easier for MVP if bucket is public, 
    // currently bucket is private so we might need signed URL or proxy. 
    // For MVP, I will assume we can generate a signed URL for viewing, or just store the path)

    // Storing the PATH is better practice, but for simple display:
    // We will store the path in 'file_url' column for now.

    const { error: dbError } = await supabase.from('evidences').insert({
        organization_id: organizationId,
        training_id: trainingId,
        file_url: filePath,
        file_type: fileType,
    });

    if (dbError) {
        return { error: 'Failed to save evidence record' };
    }

    revalidatePath('/dashboard/trainings');
    return { success: true };
}
