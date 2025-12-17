'use client'

import { useEffect, useMemo } from 'react'
import type { CreateLeadFormDTO, LeadForm, LeadFormField } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
    .slice(0, 80)
}

export interface LeadFormsViewProps {
  forms: LeadForm[]
  tags: string[]
  isLoading: boolean
  error?: string

  publicBaseUrl: string

  isCreateOpen: boolean
  setIsCreateOpen: (open: boolean) => void
  createDraft: CreateLeadFormDTO
  setCreateDraft: (dto: CreateLeadFormDTO) => void
  onCreate: () => void
  isCreating: boolean
  createError?: string

  onDelete: (id: string) => void
  isDeleting: boolean
  deleteError?: string
}

export function LeadFormsView(props: LeadFormsViewProps) {
  const {
    forms,
    tags,
    isLoading,
    error,
    publicBaseUrl,
    isCreateOpen,
    setIsCreateOpen,
    createDraft,
    setCreateDraft,
    onCreate,
    isCreating,
    createError,
    onDelete,
    isDeleting,
    deleteError,
  } = props

  const { copyToClipboard, isCopied } = useCopyToClipboard()

  // Auto-sugerir slug a partir do nome (se slug ainda estiver vazio)
  useEffect(() => {
    if (!createDraft.name) return
    if (createDraft.slug?.trim()) return
    setCreateDraft({ ...createDraft, slug: slugify(createDraft.name) })
  }, [createDraft.name, createDraft.slug, setCreateDraft])

  const sortedTags = useMemo(() => [...tags].sort((a, b) => a.localeCompare(b)), [tags])

  const fields = createDraft.fields || []

  const addField = () => {
    const next: LeadFormField = {
      key: `campo_${fields.length + 1}`,
      label: `Campo ${fields.length + 1}`,
      type: 'text',
      required: false,
      options: [],
      order: fields.length,
    }
    setCreateDraft({ ...createDraft, fields: [...fields, next] })
  }

  const updateField = (index: number, patch: Partial<LeadFormField>) => {
    const next = fields.map((f, i) => (i === index ? { ...f, ...patch } : f))
    setCreateDraft({ ...createDraft, fields: next })
  }

  const removeField = (index: number) => {
    const next = fields.filter((_, i) => i !== index)
    setCreateDraft({ ...createDraft, fields: next })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Formulários</h1>
          <p className="text-sm text-zinc-400">
            Crie um link público (tipo Google Forms) para captar contatos automaticamente com uma tag.
          </p>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>Criar formulário</Button>
          </DialogTrigger>
          <DialogContent className="border-zinc-800 bg-zinc-950 text-zinc-100">
            <DialogHeader>
              <DialogTitle>Novo formulário</DialogTitle>
              <DialogDescription className="text-zinc-400">
                Defina um nome, um slug (URL) e a tag que será aplicada a quem preencher.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input
                  value={createDraft.name}
                  onChange={(e) => setCreateDraft({ ...createDraft, name: e.target.value })}
                  placeholder="Ex: Lista de espera - Turma Janeiro"
                  className="bg-zinc-900 border-zinc-800"
                />
              </div>

              <div className="space-y-2">
                <Label>Slug (URL)</Label>
                <Input
                  value={createDraft.slug}
                  onChange={(e) => setCreateDraft({ ...createDraft, slug: slugify(e.target.value) })}
                  placeholder="ex: lista-espera-janeiro"
                  className="bg-zinc-900 border-zinc-800"
                />
                <p className="text-xs text-zinc-500">
                  Link público:{' '}
                  <span className="text-zinc-300">
                    {(publicBaseUrl || '...').replace(/\/$/, '')}/f/{createDraft.slug || 'seu-slug'}
                  </span>
                </p>
              </div>

              <div className="space-y-2">
                <Label>Tag</Label>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input
                    value={createDraft.tag}
                    onChange={(e) => setCreateDraft({ ...createDraft, tag: e.target.value })}
                    placeholder="Ex: alunos-turma-jan"
                    className="bg-zinc-900 border-zinc-800"
                  />
                  <select
                    className="h-10 rounded-md border border-zinc-800 bg-zinc-900 px-3 text-sm"
                    value={createDraft.tag || ''}
                    onChange={(e) => setCreateDraft({ ...createDraft, tag: e.target.value })}
                  >
                    <option value="">Selecionar tag existente…</option>
                    {sortedTags.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-xs text-zinc-500">
                  Dica: campanhas podem filtrar por tag, então nomeie do jeito que você já usa.
                </p>
              </div>

              <div className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/40 p-3">
                <div>
                  <p className="text-sm font-medium">Ativo</p>
                  <p className="text-xs text-zinc-500">Quando desligado, o link público retorna 404.</p>
                </div>
                <Switch
                  checked={createDraft.isActive ?? true}
                  onCheckedChange={(checked) => setCreateDraft({ ...createDraft, isActive: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label>Mensagem de sucesso (opcional)</Label>
                <Textarea
                  value={createDraft.successMessage ?? ''}
                  onChange={(e) => setCreateDraft({ ...createDraft, successMessage: e.target.value })}
                  placeholder="Ex: Cadastro confirmado! Em breve você receberá uma mensagem no WhatsApp."
                  className="min-h-[90px] bg-zinc-900 border-zinc-800"
                />
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">Campos do formulário</p>
                    <p className="text-xs text-zinc-500">
                      Nome e telefone já são coletados. Aqui você adiciona campos extras (ex: curso, turma, cidade).
                    </p>
                  </div>
                  <Button type="button" variant="secondary" className="border-zinc-700 bg-zinc-900" onClick={addField}>
                    Adicionar campo
                  </Button>
                </div>

                {fields.length === 0 ? (
                  <p className="mt-3 text-xs text-zinc-500">Nenhum campo extra por enquanto.</p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {fields.map((f, idx) => (
                      <div key={`${f.key}-${idx}`} className="rounded-lg border border-zinc-800 bg-zinc-950/40 p-3">
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-1">
                            <Label>Label</Label>
                            <Input
                              value={f.label}
                              onChange={(e) => updateField(idx, { label: e.target.value })}
                              className="bg-zinc-900 border-zinc-800"
                              placeholder="Ex: Qual sua turma?"
                            />
                          </div>

                          <div className="space-y-1">
                            <Label>Key (salvo em custom_fields)</Label>
                            <Input
                              value={f.key}
                              onChange={(e) => updateField(idx, { key: e.target.value })}
                              className="bg-zinc-900 border-zinc-800"
                              placeholder="Ex: turma"
                            />
                          </div>

                          <div className="space-y-1">
                            <Label>Tipo</Label>
                            <select
                              className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-900 px-3 text-sm"
                              value={f.type}
                              onChange={(e) => updateField(idx, { type: e.target.value as any })}
                            >
                              <option value="text">Texto</option>
                              <option value="number">Número</option>
                              <option value="date">Data</option>
                              <option value="select">Lista (select)</option>
                            </select>
                          </div>

                          <div className="flex items-center justify-between rounded-md border border-zinc-800 bg-zinc-900/40 px-3">
                            <div>
                              <p className="text-sm">Obrigatório</p>
                              <p className="text-xs text-zinc-500">Exige preenchimento</p>
                            </div>
                            <Switch
                              checked={!!f.required}
                              onCheckedChange={(checked) => updateField(idx, { required: checked })}
                            />
                          </div>
                        </div>

                        {f.type === 'select' ? (
                          <div className="mt-3 space-y-1">
                            <Label>Opções (uma por linha)</Label>
                            <Textarea
                              value={(f.options || []).join('\n')}
                              onChange={(e) =>
                                updateField(idx, {
                                  options: e.target.value
                                    .split('\n')
                                    .map((x) => x.trim())
                                    .filter(Boolean),
                                })
                              }
                              className="min-h-[90px] bg-zinc-900 border-zinc-800"
                              placeholder="Ex:\nTurma A\nTurma B\nTurma C"
                            />
                          </div>
                        ) : null}

                        <div className="mt-3 flex justify-end">
                          <Button type="button" variant="destructive" onClick={() => removeField(idx)}>
                            Remover campo
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {createError ? (
                <div className="rounded-lg border border-red-900/50 bg-red-950/30 p-3 text-sm text-red-200">
                  {createError}
                </div>
              ) : null}

              <Button onClick={onCreate} disabled={isCreating} className="w-full">
                {isCreating ? 'Criando…' : 'Criar'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle className="text-white">Seus formulários</CardTitle>
          <CardDescription className="text-zinc-400">
            Copie o link e compartilhe com os alunos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="rounded-lg border border-red-900/50 bg-red-950/30 p-3 text-sm text-red-200">{error}</div>
          ) : null}

          {deleteError ? (
            <div className="mb-3 rounded-lg border border-red-900/50 bg-red-950/30 p-3 text-sm text-red-200">{deleteError}</div>
          ) : null}

          {isLoading ? (
            <div className="text-sm text-zinc-400">Carregando…</div>
          ) : forms.length === 0 ? (
            <div className="text-sm text-zinc-400">Nenhum formulário ainda.</div>
          ) : (
            <div className="space-y-3">
              {forms.map((f) => {
                const url = `${(publicBaseUrl || '').replace(/\/$/, '')}/f/${encodeURIComponent(f.slug)}`
                return (
                  <div
                    key={f.id}
                    className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-white">{f.name}</p>
                          <Badge variant={f.isActive ? 'default' : 'secondary'}>
                            {f.isActive ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                        <p className="text-xs text-zinc-400">
                          <span className="text-zinc-500">Slug:</span> {f.slug} &nbsp;·&nbsp; <span className="text-zinc-500">Tag:</span> {f.tag}
                        </p>
                        <p className="text-xs text-zinc-400 break-all">
                          <span className="text-zinc-500">Link:</span> {url}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="secondary"
                          onClick={() => copyToClipboard(url)}
                          className="border-zinc-700 bg-zinc-900"
                        >
                          {isCopied ? 'Copiado' : 'Copiar link'}
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => onDelete(f.id)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? 'Deletando…' : 'Deletar'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
