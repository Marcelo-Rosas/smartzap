'use client';

import React from 'react';
import { Calendar, Edit2, ExternalLink, X, Loader2, Check } from 'lucide-react';
import type { CalendarBookingConfig } from '../../../types';
import {
  useCalendarBooking,
  CALENDAR_WEEK_LABELS,
  type UseCalendarBookingProps,
} from '../../../hooks/settings/useCalendarBooking';

export interface CalendarBookingPanelProps extends UseCalendarBookingProps {
  // Additional props can be added here if needed
}

export function CalendarBookingPanel({
  isConnected,
  calendarBooking,
  calendarBookingLoading,
  saveCalendarBooking,
  isSavingCalendarBooking,
}: CalendarBookingPanelProps) {
  const {
    // Config state
    calendarConfig,
    isEditingCalendarBooking,
    setIsEditingCalendarBooking,
    calendarDraft,
    updateCalendarDraft,
    updateWorkingHours,
    handleSaveCalendarBooking,

    // Auth status
    calendarAuthStatus,
    calendarAuthLoading,
    calendarAuthError,
    fetchCalendarAuthStatus,

    // Creds status
    calendarCredsStatus,
    calendarCredsLoading,
    calendarCredsError,
    calendarCredsSaving,
    calendarClientIdDraft,
    setCalendarClientIdDraft,
    calendarClientSecretDraft,
    setCalendarClientSecretDraft,
    handleSaveCalendarCreds,
    handleRemoveCalendarCreds,

    // Calendar list
    calendarList,
    calendarListLoading,
    calendarListError,
    calendarSelectionId,
    setCalendarSelectionId,
    calendarSelectionSaving,
    calendarListQuery,
    setCalendarListQuery,
    filteredCalendarList,
    fetchCalendarList,
    handleSaveCalendarSelection,

    // Wizard state
    isCalendarWizardOpen,
    setIsCalendarWizardOpen,
    calendarWizardStep,
    setCalendarWizardStep,
    calendarWizardError,
    setCalendarWizardError,
    handleCalendarWizardStepClick,
    handleCalendarWizardBack,
    handleCalendarWizardNext,

    // Connect/Disconnect
    calendarConnectLoading,
    handleConnectCalendar,
    handleDisconnectCalendar,

    // Test event
    calendarTestLoading,
    calendarTestResult,
    handleCalendarTestEvent,

    // Base URL
    calendarBaseUrl,
    calendarBaseUrlDraft,
    setCalendarBaseUrlDraft,
    calendarBaseUrlEditing,
    setCalendarBaseUrlEditing,

    // Computed values
    calendarRedirectUrl,
    calendarWebhookUrl,
    calendarStep,
    calendarCredsSourceLabel,
    calendarClientIdValid,
    calendarClientSecretValid,
    calendarCredsFormValid,
    selectedCalendarTimeZone,
    hasCalendarSelection,
    calendarWizardCanContinue,

    // Actions
    handlePrimaryCalendarAction,
    handleCopyCalendarValue,
    handleCopyCalendarBundle,
  } = useCalendarBooking({
    isConnected,
    calendarBooking,
    calendarBookingLoading,
    saveCalendarBooking,
    isSavingCalendarBooking,
  });

  return (
    <div className="glass-panel rounded-2xl p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
            <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
            <Calendar size={18} className="text-emerald-300" />
            Agendamento (Google Calendar)
          </h3>
          <p className="text-sm text-gray-400">
            Define as regras padrao para gerar slots e validar reservas no Google Calendar.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsEditingCalendarBooking(!isEditingCalendarBooking)}
          className="h-10 px-4 rounded-lg bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all text-sm font-medium inline-flex items-center gap-2 whitespace-nowrap"
        >
          <Edit2 size={14} /> {isEditingCalendarBooking ? 'Cancelar' : 'Editar regras'}
        </button>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-zinc-900/60 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-white">Google Calendar</div>
            <div className="mt-1 text-xs text-gray-400">
              {calendarAuthLoading
                ? 'Verificando...'
                : calendarAuthStatus?.connected
                  ? 'Conectado'
                  : 'Desconectado'}
            </div>
            {calendarAuthStatus?.calendar?.calendarSummary && (
              <div className="mt-2 text-xs text-gray-400">
                Calendario: {calendarAuthStatus.calendar.calendarSummary}
              </div>
            )}
            {calendarAuthStatus?.connected && (
              <div className="mt-2 text-xs text-gray-400">
                Conta: {calendarAuthStatus?.calendar?.accountEmail || 'nao disponivel'}
              </div>
            )}
            {calendarTestResult?.ok && calendarTestResult?.link && (
              <a
                href={calendarTestResult.link}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-200 hover:text-emerald-100"
              >
                <ExternalLink size={12} />
                Evento de teste criado
              </a>
            )}
            {calendarTestResult?.ok === false && (
              <div className="mt-2 text-xs text-red-400">
                Falha ao criar evento de teste.
              </div>
            )}
            {!calendarAuthStatus?.connected && (
              <div className="mt-2 text-xs text-gray-500">
                Conecte uma vez para liberar o agendamento no WhatsApp.
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrimaryCalendarAction}
              className="h-9 px-4 rounded-lg bg-emerald-500/90 text-white text-xs font-medium hover:bg-emerald-500 transition-colors"
            >
              {calendarAuthStatus?.connected ? 'Gerenciar conexao' : 'Conectar Google Calendar'}
            </button>
            {calendarAuthStatus?.connected && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setCalendarWizardStep(3);
                    setCalendarWizardError(null);
                    setIsCalendarWizardOpen(true);
                  }}
                  className="h-9 px-3 rounded-lg border border-white/10 bg-white/5 text-xs text-white hover:bg-white/10 transition-colors"
                >
                  Trocar calendario
                </button>
                <button
                  type="button"
                  onClick={handleCalendarTestEvent}
                  disabled={calendarTestLoading}
                  className="h-9 px-3 rounded-lg border border-white/10 bg-white/5 text-xs text-white hover:bg-white/10 transition-colors disabled:opacity-50"
                >
                  {calendarTestLoading ? 'Testando...' : 'Testar evento'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Calendar Wizard Modal */}
      {isCalendarWizardOpen && (
        <div className="fixed inset-0 z-50 bg-zinc-950 text-white">
          <div className="flex h-full flex-col lg:flex-row">
            <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-white/10 bg-zinc-950/80 p-6">
              <div className="text-xs text-gray-400">Progresso</div>
              <div className="mt-4 space-y-2">
                {[{ id: 0, label: 'Checklist 60s' }, { id: 1, label: 'Credenciais' }, { id: 2, label: 'Conectar' }, { id: 3, label: 'Calendario' }].map((step) => {
                  const isActive = calendarWizardStep === step.id;
                  const isUnlocked = step.id === 0
                    || step.id === 1
                    || (step.id === 2 && calendarCredsStatus?.isConfigured)
                    || (step.id === 3 && calendarAuthStatus?.connected);
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => handleCalendarWizardStepClick(step.id)}
                      disabled={!isUnlocked}
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-xs transition-colors ${
                        isActive
                          ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-100'
                          : isUnlocked
                            ? 'border-white/10 bg-white/5 text-gray-300 hover:bg-white/10'
                            : 'border-white/5 bg-white/5 text-gray-600 cursor-not-allowed'
                      }`}
                    >
                      <span>{step.id}. {step.label}</span>
                      {isActive ? <Check size={14} className="text-emerald-300" /> : null}
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 text-xs text-gray-300">
                <div className="text-xs font-semibold text-white">Ajuda rapida</div>
                <div className="mt-2 space-y-2">
                  <a
                    href="https://developers.google.com/calendar/api/quickstart/js"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-200 hover:text-emerald-100"
                  >
                    <ExternalLink size={12} />
                    Guia oficial
                  </a>
                  <a
                    href="https://www.youtube.com/results?search_query=google+calendar+oauth+setup"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-emerald-200 hover:text-emerald-100"
                  >
                    <ExternalLink size={12} />
                    Video rapido (2 min)
                  </a>
                </div>
              </div>

              <div className="mt-4 text-[11px] text-gray-500">
                Seu progresso fica salvo automaticamente.
              </div>
            </aside>

            <main className="flex-1 overflow-y-auto p-6 lg:p-10">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="text-xl font-semibold text-white">Conectar Google Calendar</div>
                  <div className="mt-1 text-sm text-gray-400">
                    Voce so faz isso uma vez. Depois o agendamento roda sozinho.
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCalendarWizardOpen(false)}
                    className="h-9 px-4 rounded-lg border border-white/10 bg-white/5 text-xs text-white hover:bg-white/10 transition-colors"
                  >
                    Salvar e sair
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCalendarWizardOpen(false)}
                    className="h-9 w-9 inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-6 max-w-3xl space-y-5">
                {(calendarWizardError || (calendarWizardStep === 1 && calendarCredsError) || (calendarWizardStep === 2 && calendarAuthError) || (calendarWizardStep === 3 && calendarListError)) && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-100">
                    {calendarWizardError || (calendarWizardStep === 1 && calendarCredsError) || (calendarWizardStep === 2 && calendarAuthError) || (calendarWizardStep === 3 && calendarListError)}
                  </div>
                )}

                {/* Step 0: Checklist */}
                {calendarWizardStep === 0 && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="text-sm font-semibold text-white">Checklist de 60s</div>
                    <div className="mt-1 text-xs text-gray-400">
                      Em 3 passos voce libera o Google Calendar.
                    </div>
                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                      {[
                        { title: 'Ative a API', desc: 'Habilite Google Calendar API.' },
                        { title: 'Crie OAuth', desc: 'Cliente web com redirect.' },
                        { title: 'Cole as URLs', desc: 'Redirect + Webhook.' },
                      ].map((item) => (
                        <div key={item.title} className="rounded-xl border border-white/10 bg-black/30 p-3">
                          <div className="text-xs font-semibold text-white">{item.title}</div>
                          <div className="mt-1 text-[11px] text-gray-400">{item.desc}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4">
                      <a
                        href="https://console.cloud.google.com/apis/credentials"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-9 items-center gap-2 rounded-lg bg-emerald-500/90 px-4 text-xs font-semibold text-white hover:bg-emerald-500"
                      >
                        <ExternalLink size={14} />
                        Abrir Console
                      </a>
                    </div>
                  </div>
                )}

                {/* Step 1: Credentials */}
                {calendarWizardStep === 1 && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-white">1) Credenciais</div>
                        <div className="text-xs text-gray-400">Cole o Client ID e o Client Secret.</div>
                        {calendarCredsStatus && (
                          <div className="mt-1 text-[11px] text-gray-500">Fonte: {calendarCredsSourceLabel}</div>
                        )}
                      </div>
                      {calendarCredsStatus?.isConfigured && (
                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-200">Pronto</span>
                      )}
                    </div>

                    {calendarCredsLoading ? (
                      <div className="mt-3 text-xs text-gray-400">Carregando credenciais...</div>
                    ) : (
                      <>
                        {!calendarCredsStatus?.isConfigured && (
                          <div className="mt-3 text-xs text-gray-500">
                            Ainda nao configurado.
                          </div>
                        )}
                        {calendarCredsStatus?.source === 'env' && (
                          <div className="mt-2 text-[11px] text-amber-200">
                            Credenciais vindas do servidor. Salvar aqui sobrescreve no banco.
                          </div>
                        )}

                        <div className="mt-3 rounded-lg border border-white/10 bg-black/40 px-3 py-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400">
                            <span>URL detectada do app</span>
                            <button
                              type="button"
                              onClick={() => setCalendarBaseUrlEditing(!calendarBaseUrlEditing)}
                              className="text-emerald-200 hover:text-emerald-100"
                            >
                              {calendarBaseUrlEditing ? 'OK' : 'Editar'}
                            </button>
                          </div>
                          {calendarBaseUrlEditing ? (
                            <input
                              type="text"
                              value={calendarBaseUrlDraft}
                              onChange={(e) => setCalendarBaseUrlDraft(e.target.value)}
                              className="mt-2 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-xs text-white font-mono"
                              placeholder="https://app.seudominio.com"
                            />
                          ) : (
                            <div className="mt-2 text-xs text-white font-mono break-all">{calendarBaseUrl || 'https://seu-dominio.com'}</div>
                          )}
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-gray-400">
                          <a
                            href="https://console.cloud.google.com/apis/credentials"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-200 hover:text-emerald-100"
                          >
                            <ExternalLink size={12} />
                            Google Cloud Console
                          </a>
                          <span className="text-gray-600">|</span>
                          <a
                            href="https://console.cloud.google.com/apis/library/calendar-json.googleapis.com"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-200 hover:text-emerald-100"
                          >
                            <ExternalLink size={12} />
                            Ativar Calendar API
                          </a>
                        </div>

                        <div className="mt-3 rounded-lg border border-white/10 bg-black/40 px-3 py-3 text-[11px] text-gray-400">
                          <div className="text-[11px] font-semibold text-gray-300">Checklist rapido</div>
                          <div className="mt-2 space-y-1">
                            <div>1. Ative a Google Calendar API.</div>
                            <div>2. Crie credenciais OAuth (aplicacao web).</div>
                            <div>3. Cole o Redirect URI e o Webhook URL.</div>
                          </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="rounded-lg border border-white/10 bg-black/40 px-3 py-2">
                            <div className="text-[11px] text-gray-400">Client ID</div>
                            <input
                              type="text"
                              value={calendarClientIdDraft}
                              onChange={(e) => setCalendarClientIdDraft(e.target.value)}
                              className="mt-1 w-full bg-transparent text-sm text-white font-mono outline-none"
                              placeholder="ex: 1234.apps.googleusercontent.com"
                            />
                            {!calendarClientIdValid && (
                              <div className="mt-1 text-[11px] text-amber-200">Use um Client ID valido.</div>
                            )}
                          </div>
                          <div className="rounded-lg border border-white/10 bg-black/40 px-3 py-2">
                            <div className="text-[11px] text-gray-400">Client Secret</div>
                            <input
                              type="password"
                              value={calendarClientSecretDraft}
                              onChange={(e) => setCalendarClientSecretDraft(e.target.value)}
                              className="mt-1 w-full bg-transparent text-sm text-white font-mono outline-none"
                              placeholder="cole seu secret"
                            />
                            {!calendarClientSecretValid && (
                              <div className="mt-1 text-[11px] text-amber-200">Secret parece curto demais.</div>
                            )}
                          </div>
                        </div>

                        <div className="mt-4 rounded-lg border border-white/10 bg-zinc-950/40 px-3 py-3">
                          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-400">
                            <span>Copie e cole no Google Cloud</span>
                            <button
                              type="button"
                              onClick={handleCopyCalendarBundle}
                              className="text-emerald-200 hover:text-emerald-100"
                            >
                              Copiar tudo
                            </button>
                          </div>
                          <div className="mt-2 text-[11px] text-gray-400">Redirect URI</div>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <div className="text-xs text-white font-mono break-all">{calendarRedirectUrl}</div>
                            <button
                              type="button"
                              onClick={() => handleCopyCalendarValue(calendarRedirectUrl, 'Redirect URI')}
                              className="h-7 px-2 rounded-md border border-white/10 bg-white/5 text-[11px] text-white hover:bg-white/10 transition-colors"
                            >
                              Copiar
                            </button>
                          </div>
                          <div className="mt-3 text-[11px] text-gray-400">Webhook URL</div>
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            <div className="text-xs text-white font-mono break-all">{calendarWebhookUrl}</div>
                            <button
                              type="button"
                              onClick={() => handleCopyCalendarValue(calendarWebhookUrl, 'Webhook URL')}
                              className="h-7 px-2 rounded-md border border-white/10 bg-white/5 text-[11px] text-white hover:bg-white/10 transition-colors"
                            >
                              Copiar
                            </button>
                          </div>
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                          {calendarCredsStatus?.source === 'db' && calendarCredsStatus?.isConfigured && (
                            <button
                              type="button"
                              onClick={handleRemoveCalendarCreds}
                              disabled={calendarCredsSaving}
                              className="h-9 px-4 rounded-lg border border-red-500/30 bg-red-500/10 text-xs text-red-200 hover:bg-red-500/20 transition-colors"
                            >
                              Remover
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={handleSaveCalendarCreds}
                            disabled={calendarCredsSaving || !calendarCredsFormValid}
                            className="h-9 px-4 rounded-lg bg-emerald-500/90 text-white text-xs font-medium hover:bg-emerald-500 transition-colors disabled:opacity-50"
                          >
                            {calendarCredsSaving ? 'Salvando...' : 'Salvar credenciais'}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Step 2: Connect */}
                {calendarWizardStep === 2 && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-white">2) Conectar</div>
                        <div className="text-xs text-gray-400">Abra o Google e autorize o acesso.</div>
                        {calendarAuthStatus?.connected && (
                          <div className="mt-2 text-xs text-gray-300">
                            Conta conectada:{' '}
                            <span className="font-mono text-white">
                              {calendarAuthStatus?.calendar?.accountEmail || 'nao disponivel'}
                            </span>
                          </div>
                        )}
                      </div>
                      {calendarAuthStatus?.connected && (
                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-200">Conectado</span>
                      )}
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleConnectCalendar}
                        disabled={!calendarCredsStatus?.isConfigured}
                        className="h-9 px-4 rounded-lg bg-white text-black text-xs font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
                      >
                        {calendarConnectLoading && <Loader2 className="mr-2 size-3 animate-spin" />}
                        {calendarConnectLoading ? 'Abrindo Google...' : calendarAuthStatus?.connected ? 'Reautorizar no Google' : 'Autorizar no Google'}
                      </button>
                      <button
                        type="button"
                        onClick={fetchCalendarAuthStatus}
                        className="h-9 px-3 rounded-lg border border-white/10 bg-white/5 text-xs text-white hover:bg-white/10 transition-colors"
                      >
                        Verificar status
                      </button>
                      {calendarAuthStatus?.connected && (
                        <button
                          type="button"
                          onClick={handleDisconnectCalendar}
                          className="h-9 px-3 rounded-lg border border-white/10 bg-white/5 text-xs text-white hover:bg-white/10 transition-colors"
                        >
                          Desconectar
                        </button>
                      )}
                      {!calendarCredsStatus?.isConfigured && (
                        <span className="text-[11px] text-gray-500">Adicione as credenciais primeiro.</span>
                      )}
                    </div>

                    {!calendarAuthStatus?.connected && (
                      <div className="mt-4 rounded-lg border border-white/10 bg-black/30 p-3 text-[11px] text-gray-400">
                        <div className="text-[11px] font-semibold text-gray-300">Causas comuns</div>
                        <div className="mt-2 space-y-1">
                          <div>1. Redirect URI diferente do cadastrado.</div>
                          <div>2. API nao habilitada no projeto.</div>
                          <div>3. Client ID/Secret incorretos.</div>
                        </div>
                      </div>
                    )}
                    <div className="text-[11px] text-gray-500">
                      Ao concluir, criamos um evento de teste de 30 minutos.
                    </div>
                  </div>
                )}

                {/* Step 3: Calendar Selection */}
                {calendarWizardStep === 3 && (
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-white">3) Escolha o calendario</div>
                        <div className="text-xs text-gray-400">Usamos este calendario para disponibilidade e eventos.</div>
                        {selectedCalendarTimeZone && (
                          <div className="mt-2 text-xs text-gray-300">
                            Fuso horario: <span className="font-mono text-white">{selectedCalendarTimeZone}</span>
                          </div>
                        )}
                      </div>
                      {calendarAuthStatus?.connected && calendarAuthStatus?.calendar?.calendarSummary && (
                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] text-emerald-200">
                          {calendarAuthStatus.calendar.calendarSummary}
                        </span>
                      )}
                    </div>

                    {!calendarAuthStatus?.connected ? (
                      <div className="mt-3 text-xs text-gray-500">Conecte o Google Calendar para escolher.</div>
                    ) : (
                      <div className="mt-3 space-y-3">
                        {calendarListLoading ? (
                          <div className="text-xs text-gray-400">Carregando calendarios...</div>
                        ) : calendarListError ? (
                          <div className="text-xs text-red-400">{calendarListError}</div>
                        ) : (
                          <>
                            {calendarList.length === 0 ? (
                              <div className="flex flex-wrap items-center gap-2">
                                <div className="text-xs text-gray-500">Nenhum calendario encontrado.</div>
                                <a
                                  href="https://calendar.google.com/calendar/u/0/r/settings/createcalendar"
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs text-emerald-200 hover:text-emerald-100"
                                >
                                  Criar novo calendario
                                </a>
                                <button
                                  type="button"
                                  onClick={fetchCalendarList}
                                  className="h-9 px-3 rounded-lg border border-white/10 bg-white/5 text-xs text-white hover:bg-white/10 transition-colors"
                                >
                                  Atualizar lista
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <input
                                  type="text"
                                  value={calendarListQuery}
                                  onChange={(e) => setCalendarListQuery(e.target.value)}
                                  placeholder="Buscar calendario..."
                                  className="h-9 w-full rounded-lg border border-white/10 bg-zinc-900/60 px-3 text-xs text-white"
                                />
                                {filteredCalendarList.length === 0 ? (
                                  <div className="text-xs text-gray-500">Nenhum calendario com esse filtro.</div>
                                ) : (
                                  <div className="flex flex-wrap items-center gap-2">
                                    <select
                                      value={calendarSelectionId}
                                      onChange={(e) => setCalendarSelectionId(e.target.value)}
                                      className="h-9 rounded-lg border border-white/10 bg-zinc-900/60 px-3 text-xs text-white"
                                    >
                                      {filteredCalendarList.map((item) => (
                                        <option key={item.id} value={item.id}>
                                          {item.summary || item.id}
                                          {item.primary ? ' (principal)' : ''}
                                        </option>
                                      ))}
                                    </select>
                                    <button
                                      type="button"
                                      onClick={fetchCalendarList}
                                      className="h-9 px-3 rounded-lg border border-white/10 bg-white/5 text-xs text-white hover:bg-white/10 transition-colors"
                                    >
                                      Atualizar lista
                                    </button>
                                    <button
                                      type="button"
                                      onClick={handleSaveCalendarSelection}
                                      disabled={!calendarSelectionId || calendarSelectionSaving}
                                      className="h-9 px-4 rounded-lg bg-emerald-500/90 text-white text-xs font-medium hover:bg-emerald-500 transition-colors disabled:opacity-50"
                                    >
                                      {calendarSelectionSaving ? 'Salvando...' : 'Salvar calendario'}
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Wizard Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleCalendarWizardBack}
                    className="h-9 px-4 rounded-lg border border-white/10 bg-white/5 text-xs text-white hover:bg-white/10 transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={handleCalendarWizardNext}
                    disabled={!calendarWizardCanContinue || calendarTestLoading}
                    className="h-9 px-4 rounded-lg bg-emerald-500/90 text-white text-xs font-medium hover:bg-emerald-500 transition-colors disabled:opacity-40"
                  >
                    {calendarWizardStep === 3
                      ? (calendarTestLoading ? 'Testando...' : 'Concluir e testar')
                      : 'Continuar'}
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      )}

      {/* Booking Configuration */}
      {calendarBookingLoading ? (
        <div className="mt-6 text-sm text-gray-400">Carregando configuracoes...</div>
      ) : (
        <>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-4">
              <div className="text-xs text-gray-400">Fuso horario</div>
              {isEditingCalendarBooking ? (
                <input
                  type="text"
                  value={calendarDraft.timezone}
                  onChange={(e) => updateCalendarDraft({ timezone: e.target.value })}
                  className="mt-2 w-full px-3 py-2 bg-zinc-900/50 border border-white/10 rounded-lg text-sm text-white font-mono"
                  placeholder="America/Sao_Paulo"
                />
              ) : (
                <div className="mt-2 text-sm text-white font-mono">{calendarDraft.timezone}</div>
              )}
            </div>

            <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-4">
              <div className="text-xs text-gray-400">Duracao (min)</div>
              {isEditingCalendarBooking ? (
                <input
                  type="number"
                  min={5}
                  max={240}
                  value={calendarDraft.slotDurationMinutes}
                  onChange={(e) => updateCalendarDraft({ slotDurationMinutes: Number(e.target.value) })}
                  className="mt-2 w-full px-3 py-2 bg-zinc-900/50 border border-white/10 rounded-lg text-sm text-white font-mono"
                />
              ) : (
                <div className="mt-2 text-sm text-white font-mono">{calendarDraft.slotDurationMinutes} min</div>
              )}
            </div>

            <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-4">
              <div className="text-xs text-gray-400">Buffer (min)</div>
              {isEditingCalendarBooking ? (
                <input
                  type="number"
                  min={0}
                  max={120}
                  value={calendarDraft.slotBufferMinutes}
                  onChange={(e) => updateCalendarDraft({ slotBufferMinutes: Number(e.target.value) })}
                  className="mt-2 w-full px-3 py-2 bg-zinc-900/50 border border-white/10 rounded-lg text-sm text-white font-mono"
                />
              ) : (
                <div className="mt-2 text-sm text-white font-mono">{calendarDraft.slotBufferMinutes} min</div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <div className="text-xs text-gray-400 mb-3">Horario de funcionamento</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {calendarDraft.workingHours.map((day) => (
                <div key={day.day} className="flex items-center gap-3 rounded-xl border border-white/10 bg-zinc-900/40 px-4 py-3">
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={day.enabled}
                      onChange={(e) => updateWorkingHours(day.day, { enabled: e.target.checked })}
                      disabled={!isEditingCalendarBooking}
                      className="accent-emerald-500"
                    />
                    <span className="w-10">{CALENDAR_WEEK_LABELS[day.day] || day.day}</span>
                  </label>
                  <div className="flex items-center gap-2 ml-auto">
                    <input
                      type="time"
                      value={day.start}
                      disabled={!isEditingCalendarBooking || !day.enabled}
                      onChange={(e) => updateWorkingHours(day.day, { start: e.target.value })}
                      className="px-2 py-1 bg-zinc-900/60 border border-white/10 rounded text-xs text-white font-mono"
                    />
                    <span className="text-gray-500 text-xs">ate</span>
                    <input
                      type="time"
                      value={day.end}
                      disabled={!isEditingCalendarBooking || !day.enabled}
                      onChange={(e) => updateWorkingHours(day.day, { end: e.target.value })}
                      className="px-2 py-1 bg-zinc-900/60 border border-white/10 rounded text-xs text-white font-mono"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Fonte: {calendarBooking?.source || 'default'}
            </div>
          </div>

          {isEditingCalendarBooking && (
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditingCalendarBooking(false);
                }}
                className="h-10 px-4 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSaveCalendarBooking}
                disabled={!!isSavingCalendarBooking}
                className="h-10 px-6 rounded-lg bg-emerald-500/90 text-white hover:bg-emerald-500 transition-colors text-sm font-medium inline-flex items-center gap-2"
              >
                {isSavingCalendarBooking ? 'Salvando...' : 'Salvar regras'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
