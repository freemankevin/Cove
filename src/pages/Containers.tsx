import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Play, Square, RotateCw, Trash2, RefreshCw, Terminal, Container as ContainerIcon, Search, Boxes, Activity, StopCircle, PauseCircle, X, ChevronUp } from 'lucide-react'
import { containersApi } from '../api'
import { useLanguage } from '../context/LanguageContext'
import { useToast } from '../context/ToastContext'
import { useNotification } from '../context/NotificationContext'
import ConfirmDialog from '../components/ConfirmDialog'
import type { Container as ContainerType, ContainerPort } from '../types'

function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function formatPorts(ports: ContainerPort[]): string {
  if (!ports || ports.length === 0) return '-'
  return ports.map(p => p.public_port ? `${p.ip}:${p.public_port}:${p.private_port}/${p.type}` : `${p.private_port}/${p.type}`).join(', ')
}

export default function Containers() {
  const { t } = useLanguage()
  const { showToast } = useToast()
  const { addNotification } = useNotification()
  const [containers, setContainers] = useState<ContainerType[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(true)
  const [search, setSearch] = useState('')
  const [expandedLog, setExpandedLog] = useState<string | null>(null)
  const [logContent, setLogContent] = useState<string>('')
  const [confirmDialog, setConfirmDialog] = useState<{ open: boolean; id: string; name: string } | null>(null)
  const isFetchingRef = useRef(false)

  const fetchContainers = useCallback(async (isInitial = false) => {
    if (isFetchingRef.current) return
    isFetchingRef.current = true
    if (isInitial) addNotification('info', 'Loading containers...')
    try {
      const res = await containersApi.list(showAll)
      setContainers(res.data || [])
      if (isInitial) addNotification('success', `Loaded ${(res.data || []).length} containers`)
    } catch (err: any) {
      if (isInitial) {
        addNotification('error', `Failed to load containers: ${err.response?.data?.error || err.message}`)
        showToast('error', t('containers.loadFailed'))
      }
    } finally { setLoading(false); isFetchingRef.current = false }
  }, [showToast, t, addNotification, showAll])

  useEffect(() => {
    fetchContainers(true)
    const interval = setInterval(() => fetchContainers(false), 15000)
    return () => clearInterval(interval)
  }, [fetchContainers])

  const filteredContainers = useMemo(() => {
    if (!search.trim()) return containers
    const q = search.toLowerCase()
    return containers.filter(c => (c.names[0] || c.id).toLowerCase().includes(q) || c.image.toLowerCase().includes(q) || c.state.toLowerCase().includes(q))
  }, [containers, search])

  const stats = useMemo(() => {
    const total = containers.length
    const running = containers.filter(c => c.state === 'running').length
    const stopped = containers.filter(c => c.state === 'exited').length
    const paused = containers.filter(c => c.state === 'paused').length
    return { total, running, stopped, paused }
  }, [containers])

  const handleAction = async (id: string, name: string, action: 'start' | 'stop' | 'restart') => {
    if (acting) return
    setActing(id)
    const labels: Record<string, { ing: string; ed: string; fail: string }> = {
      start: { ing: 'Starting', ed: 'Started', fail: t('containers.startFailed') },
      stop: { ing: 'Stopping', ed: 'Stopped', fail: t('containers.stopFailed') },
      restart: { ing: 'Restarting', ed: 'Restarted', fail: t('containers.restartFailed') },
    }
    const label = labels[action]
    addNotification('info', `${label.ing} ${name}...`)
    try {
      await (action === 'start' ? containersApi.start(id) : action === 'stop' ? containersApi.stop(id) : containersApi.restart(id))
      addNotification('success', `${label.ed} ${name}`)
      await fetchContainers(false)
    } catch (err: any) {
      addNotification('error', `Failed to ${action} ${name}: ${err.response?.data?.error || err.message}`)
      showToast('error', label.fail)
    } finally { setActing(null) }
  }

  const handleRemove = (id: string, name: string) => {
    if (acting) return
    setConfirmDialog({ open: true, id, name })
  }

  const handleConfirmRemove = async () => {
    if (!confirmDialog) return
    const { id, name } = confirmDialog
    setConfirmDialog(null)
    setActing(id)
    addNotification('info', `Removing ${name}...`)
    try {
      await containersApi.remove(id, true)
      addNotification('success', `Removed ${name}`)
      await fetchContainers(false)
    } catch (err: any) {
      addNotification('error', `Failed to remove ${name}: ${err.response?.data?.error || err.message}`)
      showToast('error', t('containers.removeFailed'))
    } finally { setActing(null) }
  }

  const toggleLogs = async (id: string, _name: string) => {
    if (expandedLog === id) {
      setExpandedLog(null)
      setLogContent('')
      return
    }
    setExpandedLog(id)
    try {
      const res = await containersApi.logs(id, 200)
      setLogContent(res.data.logs || '')
    } catch (err: any) {
      setLogContent(err.response?.data?.error || 'Failed to load logs')
    }
  }

  const getStatusPill = (state: string) => {
    const validStates = ['running', 'exited', 'paused', 'restarting', 'dead', 'created']
    const cls = validStates.includes(state) ? state : 'unknown'
    return <span className={`status-pill status-pill--${cls}`}><span className="status-pill-dot" />{state}</span>
  }

  return (
    <div className="content-center">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h1>{t('containers.title')}</h1>
          {containers.length > 0 && <span className="header-badge">{containers.length}</span>}
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={() => fetchContainers(true)} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} />{t('containers.refresh')}
          </button>
        </div>
      </div>

      {!loading && containers.length > 0 && (
        <div className="page-stats-grid">
          <div className="page-stat-card">
            <div className="page-stat-info"><div className="page-stat-label">{t('containers.stats.total')}</div><div className="page-stat-value">{stats.total}</div></div>
            <div className="page-stat-icon page-stat-icon--purple"><Boxes size={18} /></div>
          </div>
          <div className="page-stat-card">
            <div className="page-stat-info"><div className="page-stat-label">{t('containers.stats.running')}</div><div className="page-stat-value">{stats.running}</div></div>
            <div className="page-stat-icon page-stat-icon--green"><Activity size={18} /></div>
          </div>
          <div className="page-stat-card">
            <div className="page-stat-info"><div className="page-stat-label">{t('containers.stats.stopped')}</div><div className="page-stat-value">{stats.stopped}</div></div>
            <div className="page-stat-icon page-stat-icon--gray"><StopCircle size={18} /></div>
          </div>
          <div className="page-stat-card">
            <div className="page-stat-info"><div className="page-stat-label">{t('containers.stats.paused')}</div><div className="page-stat-value">{stats.paused}</div></div>
            <div className="page-stat-icon page-stat-icon--orange"><PauseCircle size={18} /></div>
          </div>
        </div>
      )}

      {!loading && containers.length > 0 && (
        <div className="page-toolbar">
          <div className="page-toolbar-left">
            <div className="search-input-wrapper"><Search size={15} /><input type="text" className="search-input" placeholder={t('containers.searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)} /></div>
          </div>
          <div className="page-toolbar-right">
            <label className="checkbox-label"><input type="checkbox" checked={showAll} onChange={e => setShowAll(e.target.checked)} /><span>{t('containers.showAll')}</span></label>
          </div>
        </div>
      )}

      {loading ? (
        <div className="empty-state-wrapper"><div className="empty-state"><div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)' }}><div className="spin loading-spinner" />{t('containers.loading')}</div></div></div>
      ) : filteredContainers.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead><tr><th>{t('containers.table.name')}</th><th>{t('containers.table.image')}</th><th>{t('containers.table.status')}</th><th>{t('containers.table.ports')}</th><th>{t('containers.table.created')}</th><th style={{ textAlign: 'right' }}>{t('containers.table.actions')}</th></tr></thead>
            <tbody>
              {filteredContainers.map((container) => (
                <>
                  <tr key={container.id}>
                    <td><div className="name-cell"><div className="name-cell-icon"><ContainerIcon size={16} /></div><div className="name-cell-content"><div className="name-cell-title">{container.names[0] || container.id.slice(0, 12)}</div><div className="name-cell-subtitle">{container.id.slice(0, 12)}</div></div></div></td>
                    <td className="text-secondary text-sm"><div className="truncate" style={{ maxWidth: '220px' }} title={container.image}>{container.image}</div></td>
                    <td>{getStatusPill(container.state)}</td>
                    <td style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{formatPorts(container.ports)}</td>
                    <td className="text-tertiary text-sm">{formatDate(container.created)}</td>
                    <td><div className="action-btn-group" style={{ justifyContent: 'flex-end' }}>
                      <button className="action-btn action-btn--start" onClick={() => handleAction(container.id, container.names[0] || container.id.slice(0, 12), 'start')} disabled={acting === container.id || container.state === 'running'} title={t('containers.start')}>{acting === container.id ? <RefreshCw size={13} className="spin" /> : <Play size={13} />}</button>
                      <button className="action-btn action-btn--stop" onClick={() => handleAction(container.id, container.names[0] || container.id.slice(0, 12), 'stop')} disabled={acting === container.id || container.state !== 'running'} title={t('containers.stop')}>{acting === container.id ? <RefreshCw size={13} className="spin" /> : <Square size={13} />}</button>
                      <button className="action-btn action-btn--restart" onClick={() => handleAction(container.id, container.names[0] || container.id.slice(0, 12), 'restart')} disabled={acting === container.id} title={t('containers.restart')}>{acting === container.id ? <RefreshCw size={13} className="spin" /> : <RotateCw size={13} />}</button>
                      <button className={`action-btn ${expandedLog === container.id ? 'action-btn--logs' : ''}`} onClick={() => toggleLogs(container.id, container.names[0] || container.id.slice(0, 12))} title={t('containers.logs')} style={expandedLog === container.id ? { background: 'var(--bg-tertiary)', color: 'var(--text-primary)', borderColor: 'var(--border-color-hover)' } : {}}>{expandedLog === container.id ? <ChevronUp size={13} /> : <Terminal size={13} />}</button>
                      <button className="action-btn action-btn--delete" onClick={() => handleRemove(container.id, container.names[0] || container.id.slice(0, 12))} disabled={acting === container.id} title={t('containers.remove')}>{acting === container.id ? <RefreshCw size={13} className="spin" /> : <Trash2 size={13} />}</button>
                    </div></td>
                  </tr>
                  {expandedLog === container.id && (
                    <tr className="table-expand-row"><td colSpan={6}>
                      <div className="table-expand-content">
                        <div className="inline-log-panel" style={{ marginBottom: 0 }}>
                          <div className="inline-log-header">
                            <div className="inline-log-title"><Terminal size={14} />{t('containers.logsTitle')} — {container.names[0] || container.id.slice(0, 12)}</div>
                            <button className="btn-close" onClick={() => { setExpandedLog(null); setLogContent('') }} style={{ width: '22px', height: '22px' }}><X size={14} /></button>
                          </div>
                          <div className="inline-log-body">
                            {logContent ? <pre>{logContent}</pre> : <div className="inline-log-empty">{t('containers.noLogs')}</div>}
                          </div>
                        </div>
                      </div>
                    </td></tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state-wrapper"><div className="empty-state"><div className="empty-state-compact">
          <div className="empty-state-compact-icon"><ContainerIcon size={24} /></div>
          <div className="empty-state-compact-title">{search.trim() ? 'No containers match your search' : t('containers.empty.title')}</div>
          <div className="empty-state-compact-desc">{search.trim() ? 'Try adjusting your search terms' : t('containers.empty.desc')}</div>
        </div></div></div>
      )}

      {confirmDialog?.open && (
        <ConfirmDialog isOpen={true} title={t('modal.confirmDelete')} message={t('containers.deleteConfirm').replace('{container}', confirmDialog.name)} confirmText={t('containers.remove')} cancelText={t('modal.cancel')} onConfirm={handleConfirmRemove} onCancel={() => setConfirmDialog(null)} variant="danger" />
      )}
    </div>
  )
}
