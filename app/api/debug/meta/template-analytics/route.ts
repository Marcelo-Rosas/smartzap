import { NextRequest, NextResponse } from 'next/server'
import { getWhatsAppCredentials } from '@/lib/whatsapp-credentials'

// GET /api/debug/meta/template-analytics?name=<template_name>&start=<unix>&end=<unix>&granularity=daily
// Retorna métricas oficiais da Meta (sent/delivered/read) para um template em um intervalo.
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const name = url.searchParams.get('name')?.trim()
    const start = url.searchParams.get('start')?.trim()
    const end = url.searchParams.get('end')?.trim()
    const granularity = (url.searchParams.get('granularity') || 'daily').trim().toLowerCase()

    if (!name) {
      return NextResponse.json({ error: 'Parâmetro "name" é obrigatório.' }, { status: 400 })
    }
    if (!start || !end) {
      return NextResponse.json(
        { error: 'Parâmetros "start" e "end" (timestamps UNIX) são obrigatórios.' },
        { status: 400 }
      )
    }

    const startNum = Number(start)
    const endNum = Number(end)
    if (!Number.isFinite(startNum) || !Number.isFinite(endNum) || startNum <= 0 || endNum <= 0 || endNum <= startNum) {
      return NextResponse.json(
        { error: '"start" e "end" devem ser timestamps UNIX válidos e end > start.' },
        { status: 400 }
      )
    }

    // Meta usa DAILY (maiúsculo) nos exemplos/docs; aceitamos daily/day e normalizamos.
    const granularityMeta = (() => {
      if (granularity === 'day' || granularity === 'daily') return 'daily'
      if (granularity === 'half_hour' || granularity === 'halfhour') return 'half_hour'
      if (granularity === 'month' || granularity === 'monthly') return 'monthly'
      return 'daily'
    })()

    const credentials = await getWhatsAppCredentials()
    if (!credentials?.businessAccountId || !credentials?.accessToken) {
      return NextResponse.json({ error: 'Credenciais não configuradas.' }, { status: 401 })
    }

    // 1) Descobrir o template_id (Meta) a partir do nome
    const templateLookupUrl = new URL(
      `https://graph.facebook.com/v24.0/${credentials.businessAccountId}/message_templates`
    )
    templateLookupUrl.searchParams.set('name', name)
    templateLookupUrl.searchParams.set('fields', 'id,name,language,category,status')

    const lookupRes = await fetch(templateLookupUrl.toString(), {
      headers: { Authorization: `Bearer ${credentials.accessToken}` },
    })

    const lookupJson = await lookupRes.json().catch(() => null)
    if (!lookupRes.ok) {
      return NextResponse.json(
        {
          error: lookupJson?.error?.message || 'Erro ao buscar template na Meta.',
          metaError: lookupJson?.error || null,
        },
        { status: lookupRes.status }
      )
    }

    const template = lookupJson?.data?.[0]
    const metaTemplateId: string | undefined = template?.id

    if (!metaTemplateId) {
      return NextResponse.json(
        { error: `Template "${name}" não encontrado na Meta (ou sem id).` },
        { status: 404 }
      )
    }

    // 2) Consultar template_analytics (sent/delivered/read)
    const analyticsUrl = new URL(`https://graph.facebook.com/v24.0/${credentials.businessAccountId}/template_analytics`)
    analyticsUrl.searchParams.set('start', String(startNum))
    analyticsUrl.searchParams.set('end', String(endNum))
    analyticsUrl.searchParams.set('granularity', granularityMeta)
    analyticsUrl.searchParams.set('metric_types', 'sent,delivered,read')
    // A API espera array de ids no formato [<id1>,<id2>] (docs). Mantemos isso.
    analyticsUrl.searchParams.set('template_ids', `[${metaTemplateId}]`)

    const analyticsRes = await fetch(analyticsUrl.toString(), {
      headers: { Authorization: `Bearer ${credentials.accessToken}` },
    })

    const analyticsJson = await analyticsRes.json().catch(() => null)
    if (!analyticsRes.ok) {
      return NextResponse.json(
        {
          error: analyticsJson?.error?.message || 'Erro ao consultar template_analytics na Meta.',
          metaError: analyticsJson?.error || null,
        },
        { status: analyticsRes.status }
      )
    }

    return NextResponse.json({
      source: 'meta',
      requestedAt: new Date().toISOString(),
      wabaId: credentials.businessAccountId,
      template: {
        name,
        metaTemplateId,
        language: template?.language || null,
        category: template?.category || null,
        status: template?.status || null,
      },
      query: { start: startNum, end: endNum, granularity: granularityMeta },
      meta: analyticsJson,
    })
  } catch (error) {
    console.error('Debug Meta Template Analytics Error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno' },
      { status: 500 }
    )
  }
}
