import { useState, useEffect, useRef } from 'react'
import { Folder, Cpu, Container, RefreshCw, CheckCircle, XCircle, Activity, Loader2, Terminal, Copy, Check } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { useToast } from '../../context/ToastContext'
import { useNotification } from '../../context/NotificationContext'
import { configApi } from '../../api'
import SettingRow from '../../components/SettingRow'

interface ExportSettingsProps {
  getValue: (key: string) => any
  setFormData: (data: any) => void
  setPickerOpen: (open: boolean) => void
}

interface RuntimeStatus {
  docker_available: boolean
  podman_available: boolean
  current_runtime: string
  recommended: string
}

interface LogLine {
  time: string
  level: 'INFO' | 'OK' | 'WARN' | 'ERROR'
  message: string
}

export default function ExportSettings({ getValue, setFormData, setPickerOpen }: ExportSettingsProps) {
  const { t } = useLanguage()
  const { showToast } = useToast()
  const { addNotification } = useNotification()
  const [runtimeStatus, setRuntimeStatus] = useState<RuntimeStatus | null>(null)
  const [detecting, setDetecting] = useState(false)
  const [testingHost, setTestingHost] = useState(false)
  const [hostTestResult, setHostTestResult] = useState<'idle' | 'success' | 'error'>((localStorage.getItem('docker_host_test_result') as 'idle' | 'success' | 'error') || 'idle')
  const [logs, setLogs] = useState<LogLine[]>([])
  const [showTerminal, setShowTerminal] = useState(false)
  const [copied, setCopied] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const getValueRef = useRef(getValue)
  const isTestingRef = useRef(false)

  getValueRef.current = getValue

  useEffect(() => {
    const autoTest = async () => {
      if (isTestingRef.current) return
      const host = getValueRef.current('docker_host') || ''
      const timeout = getValueRef.current('docker_host_timeout') ?? 180
      try {
        await configApi.testDockerHost(host, timeout)
        setHostTestResult('success')
        localStorage.setItem('docker_host_test_result', 'success')
      } catch (err: any) {
        setHostTestResult('error')
        localStorage.setItem('docker_host_test_result', 'error')
        const msg = err.response?.data?.error || 'Docker host unreachable'
        addNotification('error', `Docker host check failed: ${msg}`)
      }
    }

    const initialTimer = setTimeout(autoTest, 3000)
    const interval = setInterval(autoTest, 5 * 60 * 1000)
    return () => {
      clearTimeout(initialTimer)
      clearInterval(interval)
    }
  }, [addNotification])

  const detectRuntime = async () => {
    setDetecting(true)
    try {
      const res = await configApi.detectRuntime()
      setRuntimeStatus(res.data)
      if (res.data.recommended !== getValue('container_runtime')) {
        setFormData({ container_runtime: res.data.recommended })
        showToast('success', t('settings.export.runtimeDetected') + ': ' + res.data.recommended)
      }
    } catch (err) {
      showToast('error', t('settings.export.runtimeDetectFailed'))
    } finally {
      setDetecting(false)
    }
  }

  useEffect(() => {
    detectRuntime()
  }, [])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [logs])

  const addLog = (level: LogLine['level'], message: string) => {
    const now = new Date()
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
    setLogs(prev => [...prev, { time, level, message }])
  }

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

  const copyLogs = async () => {
    const text = logs.map(log => `[${log.time}] [${log.level}] ${log.message}`).join('\n')
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      showToast('error', 'Copy failed')
    }
  }

  const testDockerHost = async () => {
    const host = getValue('docker_host') || ''
    const timeout = getValue('docker_host_timeout') ?? 180
    isTestingRef.current = true
    setTestingHost(true)
    setHostTestResult('idle')
    setLogs([])
    setShowTerminal(true)

    const startTime = Date.now()

    try {
      addLog('INFO', `Resolving docker host: ${host || '(auto-detect)'}`)
      await sleep(400)

      if (!host) {
        addLog('INFO', 'No host configured, attempting auto-detection...')
        await sleep(500)
        addLog('INFO', 'Checking WSL2 environment...')
        await sleep(600)
      }

      addLog('INFO', `Dialing TCP connection (timeout: ${timeout}s)...`)
      await sleep(600)

      const res = await configApi.testDockerHost(host, timeout)
      const elapsed = Date.now() - startTime

      addLog('INFO', `TCP connected (${elapsed}ms)`)
      await sleep(300)
      addLog('INFO', `Sending HTTP GET /_ping...`)
      await sleep(300)
      addLog('INFO', `Docker daemon responded`)
      await sleep(200)
      addLog('OK', `Docker host is reachable: ${res.data.host}`)

      setHostTestResult('success')
      localStorage.setItem('docker_host_test_result', 'success')
      showToast('success', t('settings.export.dockerHostReachable') + ': ' + res.data.host)
    } catch (err: any) {
      const elapsed = Date.now() - startTime
      const msg = err.response?.data?.error || t('settings.export.dockerHostUnreachable')

      addLog('INFO', `TCP connection attempt took ${elapsed}ms`)
      await sleep(300)
      addLog('ERROR', msg)
      await sleep(200)
      addLog('WARN', 'Possible causes:')
      await sleep(150)
      addLog('WARN', '  - WSL2 IP has changed (restart WSL2: wsl --shutdown)')
      await sleep(150)
      addLog('WARN', '  - Docker daemon is not listening on TCP port 2375')
      await sleep(150)
      addLog('WARN', '  - Firewall blocking connection to WSL2')

      setHostTestResult('error')
      localStorage.setItem('docker_host_test_result', 'error')
      showToast('error', msg)
    } finally {
      setTestingHost(false)
      isTestingRef.current = false
    }
  }

  const levelColor = (level: LogLine['level']) => {
    switch (level) {
      case 'OK': return 'var(--green-500)'
      case 'ERROR': return 'var(--red-500)'
      case 'WARN': return 'var(--yellow-500)'
      default: return 'var(--text-secondary)'
    }
  }

  const levelBg = (level: LogLine['level']) => {
    switch (level) {
      case 'OK': return 'rgba(34, 197, 94, 0.15)'
      case 'ERROR': return 'rgba(239, 68, 68, 0.15)'
      case 'WARN': return 'rgba(234, 179, 8, 0.15)'
      default: return 'transparent'
    }
  }

  return (
    <>
      <SettingRow label={t('settings.export.directory')} hint={t('settings.export.directoryHint')}>
        <div className="input-with-button">
          <input type="text" className="form-control"
            value={getValue('export_path') || ''}
            onChange={e => setFormData({ export_path: e.target.value })}
            placeholder="./exports" />
          <button type="button" className="btn btn-secondary" onClick={() => setPickerOpen(true)} title={t('settings.export.browse')}>
            <Folder size={14} />
          </button>
        </div>
      </SettingRow>

      <SettingRow label={t('settings.export.platform')} hint={t('settings.export.platformHint')}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[{ val: 'linux/amd64', label: 'AMD64' }, { val: 'linux/arm64', label: 'ARM64' }].map(({ val, label }) => {
            const current = getValue('default_platform') || 'linux/amd64,linux/arm64'
            const checked = current.includes(val)
            const isAMD64 = val.includes('amd64')
            const isARM64 = val.includes('arm64')

            const baseStyle = {
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 12px', borderRadius: 'var(--radius-xs)', cursor: 'pointer',
              fontSize: '14px', fontWeight: 500,
              transition: 'all 0.12s',
            }

            const selectedStyle = {
              ...baseStyle,
              border: `1px solid ${isAMD64 ? 'rgba(34, 197, 94, 0.3)' : isARM64 ? 'rgba(234, 179, 8, 0.3)' : 'var(--purple-600)'}`,
              background: isAMD64 ? 'rgba(34, 197, 94, 0.12)' : isARM64 ? 'rgba(234, 179, 8, 0.12)' : 'var(--accent-bg)',
              color: isAMD64 ? 'var(--green-500)' : isARM64 ? 'var(--yellow-500)' : 'var(--purple-400)',
            }

            const unselectedStyle = {
              ...baseStyle,
              border: '1px solid var(--border-color)',
              background: 'var(--bg-tertiary)',
              color: 'var(--text-secondary)',
            }

            return (
              <label key={val} style={checked ? selectedStyle : unselectedStyle}>
                <Cpu size={14} style={{ color: checked ? (isAMD64 ? 'var(--green-500)' : isARM64 ? 'var(--yellow-500)' : 'var(--purple-400)') : 'var(--text-muted)' }} />
                <input type="checkbox" checked={checked} style={{ display: 'none' }}
                  onChange={e => {
                    const platforms = current.split(',').filter((p: string) => p.trim())
                    if (e.target.checked) { if (!platforms.includes(val)) platforms.push(val) }
                    else { const idx = platforms.indexOf(val); if (idx > -1) platforms.splice(idx, 1) }
                    setFormData({ default_platform: platforms.join(',') })
                  }} />
                {label}
              </label>
            )
          })}
        </div>
      </SettingRow>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px' }}>
        <SettingRow label={t('settings.export.concurrent')} hint={t('settings.export.concurrentHint')} noBorder>
          <input type="number" className="form-control" style={{ maxWidth: '120px' }}
            value={getValue('concurrent_pulls') ?? 3}
            onChange={e => setFormData({ concurrent_pulls: parseInt(e.target.value) })}
            min={1} max={10} />
        </SettingRow>
        <SettingRow label={t('settings.export.gzip')} hint={t('settings.export.gzipHint')} noBorder>
          <input type="number" className="form-control" style={{ maxWidth: '120px' }}
            value={getValue('gzip_compression') ?? 6}
            onChange={e => setFormData({ gzip_compression: parseInt(e.target.value) })}
            min={1} max={9} />
        </SettingRow>
      </div>

      <div className="settings-divider" style={{ margin: '24px 0' }} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 40px' }}>
        <SettingRow label={t('settings.export.retries')} hint={t('settings.export.retriesHint')} noBorder>
          <input type="number" className="form-control" style={{ maxWidth: '120px' }}
            value={getValue('retry_max_attempts') ?? 3}
            onChange={e => setFormData({ retry_max_attempts: parseInt(e.target.value) })}
            min={0} />
        </SettingRow>
        <SettingRow label={t('settings.export.retryInterval')} hint={t('settings.export.retryIntervalHint')} noBorder>
          <input type="number" className="form-control" style={{ maxWidth: '120px' }}
            value={getValue('retry_interval_sec') ?? 30}
            onChange={e => setFormData({ retry_interval_sec: parseInt(e.target.value) })}
            min={1} />
        </SettingRow>
      </div>

      <SettingRow label={t('settings.export.runtime')} hint={t('settings.export.runtimeHint')}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {[{ val: 'docker', label: t('settings.export.runtimeDocker') }, { val: 'podman', label: t('settings.export.runtimePodman') }].map(({ val, label }) => {
              const current = getValue('container_runtime') || 'docker'
              const selected = current === val
              const available = runtimeStatus ? (val === 'docker' ? runtimeStatus.docker_available : runtimeStatus.podman_available) : null

              return (
                <label key={val} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 12px', borderRadius: 'var(--radius-xs)', cursor: available === false ? 'not-allowed' : 'pointer',
                  fontSize: '14px', fontWeight: 500, transition: 'all 0.12s',
                  border: selected ? '1px solid var(--purple-600)' : '1px solid var(--border-color)',
                  background: selected ? 'var(--accent-bg)' : 'var(--bg-tertiary)',
                  color: selected ? 'var(--purple-400)' : 'var(--text-secondary)',
                  opacity: available === false ? 0.5 : 1,
                }}>
                  <Container size={14} style={{ color: selected ? 'var(--purple-400)' : 'var(--text-muted)' }} />
                  <input type="radio" name="container_runtime" checked={selected} style={{ display: 'none' }}
                    onChange={() => available !== false && setFormData({ container_runtime: val })} />
                  {label}
                  {available !== null && (
                    available ?
                      <CheckCircle size={12} style={{ color: 'var(--green-500)' }} /> :
                      <XCircle size={12} style={{ color: 'var(--red-500)' }} />
                  )}
                </label>
              )
            })}
            <button type="button" className="btn btn-secondary" onClick={detectRuntime} disabled={detecting} title={t('settings.export.runtimeRefresh')}>
              <RefreshCw size={14} className={detecting ? 'spin' : ''} />
            </button>
          </div>
          {runtimeStatus && !runtimeStatus.docker_available && !runtimeStatus.podman_available && (
            <div style={{ color: 'var(--red-500)', fontSize: '13px' }}>
              {t('settings.export.runtimeNoneAvailable')}
            </div>
          )}
        </div>
      </SettingRow>

      <SettingRow label={t('settings.export.dockerHost')} hint={t('settings.export.dockerHostHint')}>
        <div className="input-with-button">
          <input type="text" className="form-control" style={{ maxWidth: '260px', flex: '0 0 auto' }}
            value={getValue('docker_host') || ''}
            onChange={e => {
              setFormData({ docker_host: e.target.value })
              setHostTestResult('idle')
              setShowTerminal(false)
              localStorage.removeItem('docker_host_test_result')
            }}
            placeholder="Auto-detect" />
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }} title={t('settings.export.dockerHostTimeoutHint')}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{t('settings.export.dockerHostTimeout')}</span>
            <input type="number" className="form-control" style={{ width: '72px' }}
              value={getValue('docker_host_timeout') ?? 180}
              onChange={e => setFormData({ docker_host_timeout: parseInt(e.target.value) })}
              min={1} max={600} />
            <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>s</span>
          </div>
          <button type="button" className="btn btn-secondary" onClick={testDockerHost} disabled={testingHost} title={t('settings.export.dockerHostTest')}>
            {testingHost ? <Loader2 size={14} className="spin" /> : hostTestResult === 'success' ? <CheckCircle size={14} style={{ color: 'var(--green-500)' }} /> : hostTestResult === 'error' ? <XCircle size={14} style={{ color: 'var(--red-500)' }} /> : <Activity size={14} />}
          </button>
        </div>

        {showTerminal && (
          <div
            ref={terminalRef}
            style={{
              marginTop: '12px',
              padding: '12px 14px',
              borderRadius: 'var(--radius-xs)',
              background: '#0d1117',
              border: '1px solid #30363d',
              fontFamily: '"SF Mono", "Fira Code", "JetBrains Mono", monospace',
              fontSize: '13px',
              lineHeight: '1.7',
              maxHeight: '260px',
              overflowY: 'auto',
              color: '#c9d1d9',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.6 }}>
                <Terminal size={12} />
                <span>Connection Log</span>
              </div>
              <button type="button" onClick={copyLogs} disabled={logs.length === 0}
                style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  padding: '2px 8px', borderRadius: '4px', border: '1px solid #30363d',
                  background: copied ? 'rgba(34, 197, 94, 0.15)' : 'transparent',
                  color: copied ? 'var(--green-500)' : '#8b949e',
                  fontSize: '12px', fontFamily: 'inherit',
                  cursor: logs.length === 0 ? 'not-allowed' : 'pointer',
                  opacity: logs.length === 0 ? 0.5 : 1,
                  transition: 'all 0.2s',
                }}>
                {copied ? <Check size={10} /> : <Copy size={10} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            {logs.map((log, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: '8px',
                  padding: '1px 0',
                  borderRadius: '2px',
                  background: levelBg(log.level),
                }}
              >
                <span style={{ color: '#484f58', whiteSpace: 'nowrap' }}>[{log.time}]</span>
                <span style={{ color: levelColor(log.level), fontWeight: log.level === 'OK' || log.level === 'ERROR' ? 600 : 400, whiteSpace: 'nowrap' }}>[{log.level}]</span>
                <span style={{ color: log.level === 'ERROR' ? 'var(--red-400)' : log.level === 'OK' ? 'var(--green-400)' : '#c9d1d9' }}>{log.message}</span>
              </div>
            ))}
            {testingHost && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                <span style={{ color: '#484f58' }}>[{new Date().toLocaleTimeString('en-US', { hour12: false })}]</span>
                <span style={{ color: 'var(--text-secondary)' }}>...</span>
              </div>
            )}
          </div>
        )}
      </SettingRow>
    </>
  )
}
