import { NextResponse } from 'next/server'
import { leadFormDb } from '@/lib/supabase-db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type Params = { params: Promise<{ slug: string }> }

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

/**
 * GET /api/public/lead-forms/[slug]
 * Retorna config pública do formulário (sem expor secrets)
 */
export async function GET(_req: Request, { params }: Params) {
  try {
    const { slug } = await params
    const form = await leadFormDb.getBySlug(slug)

    if (!form || !form.isActive) {
      return NextResponse.json(
        { error: 'Formulário não encontrado' },
        { status: 404, headers: corsHeaders() }
      )
    }

    return NextResponse.json(
      {
        id: form.id,
        name: form.name,
        slug: form.slug,
        isActive: form.isActive,
        successMessage: form.successMessage ?? null,
        fields: form.fields ?? [],
      },
      { headers: { ...corsHeaders(), 'Cache-Control': 'no-store' } }
    )
  } catch (error: any) {
    console.error('Failed to fetch public lead form:', error)
    return NextResponse.json(
      { error: 'Falha ao buscar formulário' },
      { status: 500, headers: corsHeaders() }
    )
  }
}
