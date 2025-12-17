'use client'

import { useLeadFormsController } from '@/hooks/useLeadForms'
import { LeadFormsView } from '@/components/features/lead-forms/LeadFormsView'

export default function LeadFormsPage() {
  const controller = useLeadFormsController()

  return (
    <LeadFormsView
      forms={controller.forms}
      tags={controller.tags}
      isLoading={controller.isLoading}
      error={controller.error}
      publicBaseUrl={controller.publicBaseUrl}
      isCreateOpen={controller.isCreateOpen}
      setIsCreateOpen={controller.setIsCreateOpen}
      createDraft={controller.createDraft}
      setCreateDraft={controller.setCreateDraft}
      onCreate={controller.create}
      isCreating={controller.isCreating}
      createError={controller.createError}
      onDelete={controller.remove}
      isDeleting={controller.isDeleting}
      deleteError={controller.deleteError}
    />
  )
}
