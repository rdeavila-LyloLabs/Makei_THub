'use client'

import { useState } from 'react'
import { uploadEvidence } from '@/app/actions/evidences'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload } from 'lucide-react'

export function UploadEvidenceDialog({ trainingId }: { trainingId: string }) {
    const [open, setOpen] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [type, setType] = useState('Certificate')
    const [loading, setLoading] = useState(false)

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!file) return

        setLoading(true)
        const formData = new FormData()
        formData.append('file', file)
        formData.append('training_id', trainingId)
        formData.append('file_type', type)

        const result = await uploadEvidence(formData)

        setLoading(false)
        if (result.success) {
            setOpen(false)
            setFile(null)
        } else {
            console.error(result.error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Upload className="mr-2 h-3 w-3" /> Upload
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                    <DialogTitle>Upload Evidence</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Document Type</Label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                        >
                            <option value="Certificate">Certificate</option>
                            <option value="Invoice">Invoice</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label>File</Label>
                        <Input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={(e) => setFile(e.target.files?.[0] || null)}
                        />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={!file || loading}>
                            {loading ? 'Uploading...' : 'Upload'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
