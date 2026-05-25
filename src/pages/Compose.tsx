import { useState, useEffect, useCallback, useRef } from 'react'
import { RefreshCw, Play, Square, FolderGit, Search, Save, FolderOpen, Terminal } from 'lucide-react'
import { composeApi, filesApi } from '../api'
import { useLanguage } from '../context/LanguageContext'
import { useToast } from '../context/ToastContext'
import { useNotification } from '../context/NotificationContext'
import type { ComposeProject, ComposeService } from '../types'

export default function Compose() {
  const { t } = useLanguage()
  const { showToast } = useToast()
  const { addNotification } = useNotification()
  const [projects, setProjects] = useState<ComposeProject[]>([])
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState<string | null>(null)
  const [scanPath, setScanPath] = useState('.')
  const [search, setSearch] = useState('')
  const [selectedPath, setSelectedPath] = useState<string | null>(null)
  const [editorContent, setEditorContent] = useState('')
  const [logs, setLogs] = useState('')
  const [savingFile, setSavingFile] = useState(false)
  const isFetchingRef = useRef(false)
  const logsEndRef = useRef<HTMLDivElement>(null)

  const fetchProjects = useCallback(async (isInitial = false) => {
    if (isFetchingRef.current) return
    isFetchingRef.current = true
    if (isInitial) addNotification('info', 'Loading compose projects...')
    try {
      const res = await composeApi.list(scanPath)
      const data = res.data || []
      setProjects(data)
      if (!selectedPath && data.length > 0) {
        setSelectedPath(data[0].path)
        loadYaml(data[0].path)
      }
      if (isInitial) addNotification('success', `Loaded ${data.length} compose projects`)
    } catch (err: any) {
      if (isInitial) {
        addNotification('error', `Failed to load compose projects: ${err.response?.data?.error || err.message}`)
        showToast('error', t('compose.loadFailed'))
      }
    } finally { setLoading(false); isFetchingRef.current = false }
  }, [showToast, t, addNotification, scanPath, selectedPath])

  useEffect(() => {
    fetchProjects(true)
    const interval = setInterval(() => fetchProjects(false), 30000)
    return () => clearInterval(interval)
  }, [fetchProjects])

  useEffect(() => {
    if (logsEndRef.current) logsEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  const loadYaml = async (path: string) => {
    try {
      const res = await filesApi.read(path)
      setEditorContent(res.data.content || '')
    } catch { setEditorContent('') }
  }

  const handleSelect = (project: ComposeProject) => {
    setSelectedPath(project.path)
    loadYaml(project.path)
  }

  const saveYaml = async () => {
    if (!selectedPath) return
    setSavingFile(true)
    try {
      await filesApi.write(selectedPath, editorContent)
      showToast('success', t('builds.saved'))
    } catch (err: any) {
      showToast('error', err.response?.data?.error || 'Save failed')
    } finally { setSavingFile(false) }
  }

  const handleUp = async (project: ComposeProject) => {
    if (acting) return
    setActing(project.path)
    setLogs(prev => prev + `\n► [${project.name}] docker compose up -d\n`)
    addNotification('info', `Starting ${project.name}...`)
    try {
      const res = await composeApi.up(project.path)
      setLogs(prev => prev + '\n' + (res.data.logs || 'Compose up completed'))
      addNotification('success', `Started ${project.name}`)
      showToast('success', t('compose.upSuccess'))
      await fetchProjects(false)
    } catch (err: any) {
      setLogs(prev => prev + '\n' + (err.response?.data?.logs || err.response?.data?.error || err.message || 'Failed'))
      addNotification('error', `Failed to start ${project.name}`)
      showToast('error', t('compose.upFailed'))
    } finally { setActing(null) }
  }

  const handleDown = async (project: ComposeProject) => {
    if (acting) return
    setActing(project.path)
    setLogs(prev => prev + `\n► [${project.name}] docker compose down\n`)
    addNotification('info', `Stopping ${project.name}...`)
    try {
      const res = await composeApi.down(project.path)
      setLogs(prev => prev + '\n' + (res.data.logs || 'Compose down completed'))
      addNotification('success', `Stopped ${project.name}`)
      showToast('success', t('compose.downSuccess'))
      await fetchProjects(false)
    } catch (err: any) {
      setLogs(prev => prev + '\n' + (err.response?.data?.logs || err.response?.data?.error || err.message || 'Failed'))
      addNotification('error', `Failed to stop ${project.name}`)
      showToast('error', t('compose.downFailed'))
    } finally { setActing(null) }
  }

  const filteredProjects = !search.trim() ? projects : projects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.path.toLowerCase().includes(search.toLowerCase()))

  const getStatusPill = (status: string) => {
    const cls = ({ running: 'running', stopped: 'stopped', partial: 'partial', unknown: 'unknown' } as any)[status] || 'unknown'
    return <span className={`status-pill status-pill--${cls}`}><span className="status-pill-dot" />{status}</span>
  }

  return (
    <div className="content-center">
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h1>{t('compose.title')}</h1>
          {projects.length > 0 && <span className="header-badge">{projects.length}</span>}
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={() => fetchProjects(true)} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} />{t('compose.refresh')}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', padding: '40px 0' }}>
          <div className="spin loading-spinner" />{t('compose.loading')}
        </div>
      ) : projects.length === 0 ? (
        <div className="empty-state-wrapper" style={{ minHeight: '400px' }}>
          <div className="empty-state" style={{ height: 'auto', padding: '48px' }}>
            <div className="empty-state-compact">
              <div className="empty-state-compact-icon"><FolderGit size={24} /></div>
              <div className="empty-state-compact-title">{t('compose.empty.title')}</div>
              <div className="empty-state-compact-desc">{t('compose.empty.desc')}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="compose-layout">
          <div className="page-toolbar" style={{ marginBottom: 0 }}>
            <div className="page-toolbar-left">
              <div className="search-input-wrapper"><Search size={15} /><input type="text" className="search-input" placeholder={t('compose.searchPlaceholder')} value={search} onChange={e => setSearch(e.target.value)} /></div>
            </div>
            <div className="page-toolbar-right">
              <input type="text" className="search-input" value={scanPath} onChange={e => setScanPath(e.target.value)} onBlur={() => fetchProjects(true)} placeholder={t('compose.scanPath')} style={{ maxWidth: '200px' }} />
            </div>
          </div>

          <div className="compose-split">
            {/* Left: Project List */}
            <div className="compose-sidebar">
              {filteredProjects.map((project) => (
                <div key={project.path} className={`compose-list-item ${selectedPath === project.path ? 'active' : ''}`} onClick={() => handleSelect(project)}>
                  <div className="compose-list-header">
                    <div className="compose-list-name">{project.name}</div>
                    {getStatusPill(project.status)}
                  </div>
                  <div className="compose-list-path">{project.path}</div>
                  {project.services && project.services.length > 0 && (
                    <div className="compose-list-services">
                      {project.services.slice(0, 4).map((svc: ComposeService, idx: number) => (
                        <div key={idx} className="compose-list-svc">
                          <div className={`compose-list-svc-dot ${svc.state === 'running' ? 'running' : 'stopped'}`} />
                          {svc.name}
                        </div>
                      ))}
                      {project.services.length > 4 && <div className="compose-list-svc" style={{ color: 'var(--text-muted)' }}>+{project.services.length - 4} more</div>}
                    </div>
                  )}
                  <div className="compose-list-actions">
                    <button className="btn btn-compact btn-success" onClick={e => { e.stopPropagation(); handleUp(project) }} disabled={acting === project.path || project.status === 'running'}>
                      {acting === project.path ? <RefreshCw size={12} className="spin" /> : <Play size={12} />}{t('compose.up')}
                    </button>
                    <button className="btn btn-compact btn-danger" onClick={e => { e.stopPropagation(); handleDown(project) }} disabled={acting === project.path || project.status === 'stopped'}>
                      {acting === project.path ? <RefreshCw size={12} className="spin" /> : <Square size={12} />}{t('compose.down')}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Editor + Logs */}
            <div className="compose-workspace">
              {/* YAML Editor */}
              <div className="build-editor-panel">
                <div className="build-editor-toolbar">
                  <div className="build-editor-toolbar-left">
                    <FolderGit size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{selectedPath || '—'}</span>
                    <button className="btn btn-compact btn-secondary" onClick={() => selectedPath && loadYaml(selectedPath)} title="Reload"><FolderOpen size={13} />Reload</button>
                    <button className="btn btn-compact btn-secondary" onClick={saveYaml} disabled={savingFile || !selectedPath} title="Save">
                      {savingFile ? <RefreshCw size={13} className="spin" /> : <Save size={13} />}Save
                    </button>
                  </div>
                </div>
                <div className="build-editor-body">
                  <textarea value={editorContent} onChange={e => setEditorContent(e.target.value)} placeholder="# docker-compose.yml&#10;version: '3.8'&#10;services:&#10;  app:&#10;    image: nginx:latest&#10;    ports:&#10;      - '80:80'" spellCheck={false} />
                </div>
              </div>

              {/* Logs */}
              <div className="build-log-panel">
                <div className="build-log-header">
                  <div className="build-log-title"><Terminal size={13} />Compose Output</div>
                  {acting && <div className="build-log-running"><div className="spin loading-spinner" style={{ width: '14px', height: '14px', borderWidth: '1.5px' }} />Running...</div>}
                </div>
                <div className="build-log-body">
                  {logs ? <pre>{logs}</pre> : <div className="build-log-empty">Compose output will appear here</div>}
                  <div ref={logsEndRef} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
