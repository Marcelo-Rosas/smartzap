/**
 * GET/POST /api/campaigns/tags - List and create campaign tags
 */

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { campaignTagDb } from '@/lib/supabase-db'

const postSchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().default('#6B7280'),
})

function isMissingTableError(error: unknown, tableName: string): boolean {
  const code = String((error as any)?.code || '')
  const msg = String((error as any)?.message || (error instanceof Error ? error.message : error || ''))
  const m = msg.toLowerCase()
  const t = tableName.toLowerCase()

  // Postgres undefined_table
  if (code === '42P01') return true

  // PostgREST / Supabase cache errors often include the table name.
  if (m.includes('does not exist') && m.includes(t)) return true
  if (m.includes('relation') && m.includes(t)) return true
  if (m.includes('schema cache') && m.includes(t)) return true

  return false
}

export async function GET() {
  try {
    const tags = await campaignTagDb.getAll()
    return NextResponse.json(tags)
  } catch (error) {
    console.error('[GET /api/campaigns/tags]', error)
    if (isMissingTableError(error, 'campaign_tags')) {
      console.warn('[GET /api/campaigns/tags] campaign_tags missing, returning empty list')
      return NextResponse.json([])
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const parsed = postSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request body', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const tag = await campaignTagDb.create(parsed.data)

    return NextResponse.json(tag, { status: 201 })
  } catch (error) {
    console.error('[POST /api/campaigns/tags]', error)

    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('duplicate')) {
      return NextResponse.json(
        { error: 'Já existe uma tag com este nome' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
