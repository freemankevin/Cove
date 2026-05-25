import { useState, useEffect, useCallback, useRef } from 'react'
import { RefreshCw, Hammer, FileText, Terminal, Upload, Download, Copy, X, CheckCircle2, AlertCircle, FileCode, Trash2, Folder } from 'lucide-react'
import Prism from 'prismjs'
import 'prismjs/components/prism-docker'
import { buildsApi, filesApi } from '../api'
import { useLanguage } from '../context/LanguageContext'
import { useToast } from '../context/ToastContext'
import { useNotification } from '../context/NotificationContext'

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  if (mb < 1024) return `${mb.toFixed(1)} MB`
  return `${(mb / 1024).toFixed(2)} GB`
}

// ── Log line highlighter ──
function highlightLogLine(line: string): string {
  const text = line.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  if (/\bERROR:\b|\bfailed\b|\bFAIL\b|\berror\b/i.test(line)) {
    return `<span class="log-line log-line-error">${text}</span>`
  }
  if (/\bWARN:\b|\bwarning\b|\bWARN\b/i.test(line)) {
    return `<span class="log-line log-line-warn">${text}</span>`
  }
  if (/\bSuccessfully\s+built\b|\bSuccessfully\s+tagged\b|\bdone\b|\bcomplete\b|\bwritten\b/i.test(line)) {
    return `<span class="log-line log-line-success">${text}</span>`
  }
  if (/^\s*Step\s+\d+/i.test(line)) {
    return `<span class="log-line log-line-step">${text}</span>`
  }
  if (/^►/.test(line)) {
    return `<span class="log-line log-line-info">${text}</span>`
  }
  return `<span class="log-line">${text}</span>`
}

function renderHighlightedLogs(logs: string): string {
  return logs.split('\n').map(highlightLogLine).join('')
}

// ── Dockerfile linter ──
interface LintIssue {
  line: number
  message: string
  severity: 'error' | 'warning'
}

const VALID_INSTRUCTIONS = new Set([
  'FROM', 'RUN', 'CMD', 'LABEL', 'MAINTAINER', 'EXPOSE', 'ENV', 'ADD', 'COPY',
  'ENTRYPOINT', 'VOLUME', 'USER', 'WORKDIR', 'ARG', 'ONBUILD', 'STOPSIGNAL',
  'HEALTHCHECK', 'SHELL',
])

function lintDockerfile(content: string): LintIssue[] {
  const issues: LintIssue[] = []
  const lines = content.split('\n')
  let foundFrom = false
  let firstInstructionLine = -1

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const match = trimmed.match(/^([A-Za-z]+)\s/)
    if (!match) {
      if (firstInstructionLine === -1) {
        issues.push({ line: i + 1, message: 'Line does not start with a valid instruction', severity: 'error' })
      }
      continue
    }

    const instr = match[1].toUpperCase()
    if (firstInstructionLine === -1) firstInstructionLine = i

    if (!VALID_INSTRUCTIONS.has(instr)) {
      issues.push({ line: i + 1, message: `Unknown instruction: ${instr}`, severity: 'warning' })
      continue
    }

    if (instr === 'FROM') {
      foundFrom = true
      const rest = trimmed.slice(4).trim()
      if (!rest) {
        issues.push({ line: i + 1, message: 'FROM requires a base image', severity: 'error' })
      }
    }
    if (instr === 'EXPOSE') {
      const rest = trimmed.slice(6).trim()
      if (rest && !/^\d+(\/\w+)?$/.test(rest.split(/\s/)[0])) {
        issues.push({ line: i + 1, message: 'EXPOSE should specify a port number', severity: 'warning' })
      }
    }
    if (instr === 'COPY' || instr === 'ADD') {
      const parts = trimmed.slice(instr.length).trim().split(/\s+/)
      if (parts.length < 2) {
        issues.push({ line: i + 1, message: `${instr} requires at least two arguments`, severity: 'error' })
      }
    }
    if (instr === 'HEALTHCHECK') {
      const rest = trimmed.slice(12).trim()
      if (!/^(NONE|CMD\s)/i.test(rest)) {
        issues.push({ line: i + 1, message: 'HEALTHCHECK should be NONE or CMD [...]', severity: 'warning' })
      }
    }
  }

  if (firstInstructionLine !== -1 && !foundFrom) {
    issues.push({ line: firstInstructionLine + 1, message: 'Dockerfile should start with a FROM instruction', severity: 'error' })
  }
  return issues
}

interface FileEntry {
  name: string
  is_dir: boolean
  size: number
}

export default function Builds() {
  const { t } = useLanguage()
  const { showToast } = useToast()
  const { addNotification } = useNotification()

  const workspaceDir = './workspace'
  const [files, setFiles] = useState<FileEntry[]>([])
  const [selectedFile, setSelectedFile] = useState(() => sessionStorage.getItem('cove_build_selectedFile') || '')
  const [editorContent, setEditorContent] = useState(() => sessionStorage.getItem('cove_build_editorContent') || '')
  const [buildTag, setBuildTag] = useState(() => sessionStorage.getItem('cove_build_buildTag') || '')
  const [buildArgs] = useState(() => sessionStorage.getItem('cove_build_buildArgs') || '')
  const [logs, setLogs] = useState(() => sessionStorage.getItem('cove_build_logs') || '')
  const [building, setBuilding] = useState(false)
  const [copiedLog, setCopiedLog] = useState(false)
  const [loadingFiles, setLoadingFiles] = useState(false)
  const [dragOver, setDragOver] = useState(false)

  // Persist build page state across navigation
  useEffect(() => { sessionStorage.setItem('cove_build_selectedFile', selectedFile) }, [selectedFile])
  useEffect(() => { sessionStorage.setItem('cove_build_editorContent', editorContent) }, [editorContent])
  useEffect(() => { sessionStorage.setItem('cove_build_buildTag', buildTag) }, [buildTag])
  // Build args persistence removed until UI input is added
  useEffect(() => {
    try { sessionStorage.setItem('cove_build_logs', logs) } catch {}
  }, [logs])

  const logsEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dirInputRef = useRef<HTMLInputElement>(null)
  const dockerfileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const lineNumbersRef = useRef<HTMLDivElement>(null)
  const highlightRef = useRef<HTMLPreElement>(null)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isDockerfile = selectedFile.toLowerCase().includes('dockerfile')
  const lintIssues = isDockerfile ? lintDockerfile(editorContent) : []
  const hasErrors = lintIssues.some(i => i.severity === 'error')

  const fetchFiles = useCallback(async () => {
    setLoadingFiles(true)
    try {
      const res = await filesApi.list(workspaceDir)
      const list: FileEntry[] = res.data.files || []
      list.sort((a, b) => {
        const aIsDf = a.name.toLowerCase().includes('dockerfile')
        const bIsDf = b.name.toLowerCase().includes('dockerfile')
        if (aIsDf && !bIsDf) return -1
        if (!aIsDf && bIsDf) return 1
        if (a.is_dir !== b.is_dir) return a.is_dir ? -1 : 1
        return a.name.localeCompare(b.name)
      })
      setFiles(list)
    } catch (err: any) {
      showToast('error', err.response?.data?.error || 'Failed to list files')
    } finally { setLoadingFiles(false) }
  }, [workspaceDir, showToast, selectedFile])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  useEffect(() => {
    if (logsEndRef.current) logsEndRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  // Auto-save editor content
  useEffect(() => {
    if (!selectedFile) return
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(async () => {
      try { await filesApi.write(selectedFile, editorContent) } catch {}
    }, 1500)
    return () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current) }
  }, [editorContent, selectedFile])

  // Sync highlight layer with textarea
  useEffect(() => {
    if (highlightRef.current) {
      if (isDockerfile) {
        const html = Prism.highlight(editorContent, Prism.languages.docker || Prism.languages.bash, 'docker')
        highlightRef.current.innerHTML = html + '<br>'
      } else {
        highlightRef.current.innerHTML = editorContent.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '<br>'
      }
    }
  }, [editorContent, isDockerfile])

  const syncScroll = () => {
    if (textareaRef.current && highlightRef.current) {
      highlightRef.current.scrollTop = textareaRef.current.scrollTop
      highlightRef.current.scrollLeft = textareaRef.current.scrollLeft
    }
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  const loadFile = async (path: string) => {
    try {
      const res = await filesApi.read(path)
      setEditorContent(res.data.content || '')
      setSelectedFile(path)
    } catch (err: any) {
      showToast('error', err.response?.data?.error || 'Failed to read file')
    }
  }

  const handleImportFiles = async (fileList: FileList | null) => {
    if (!fileList) return
    const filesArray = Array.from(fileList)
    let count = 0
    for (const file of filesArray) {
      const content = await file.text()
      const relPath = (file as any).webkitRelativePath || file.name
      const targetPath = workspaceDir.replace(/\/$/, '') + '/' + relPath
      try {
        await filesApi.write(targetPath, content)
        count++
      } catch (err: any) {
        showToast('error', `Failed to import ${file.name}: ${err.response?.data?.error || err.message}`)
      }
    }
    showToast('success', `${count} ${t('builds.imported')}`)
    await fetchFiles()
  }

  const handleImportDockerfile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''
    const content = await file.text()
    const targetPath = workspaceDir.replace(/\/$/, '') + '/' + file.name
    try {
      await filesApi.write(targetPath, content)
      setSelectedFile(targetPath)
      setEditorContent(content)
      showToast('success', t('builds.imported'))
      await fetchFiles()
    } catch (err: any) {
      showToast('error', err.response?.data?.error || 'Import failed')
    }
  }

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImportFiles(e.target.files)
    e.target.value = ''
  }

  const onDirInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImportFiles(e.target.files)
    e.target.value = ''
  }

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOver(false)
    }
  }
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleImportFiles(e.dataTransfer.files)
  }

  const handleDeleteFile = async (name: string) => {
    const path = workspaceDir.replace(/\/$/, '') + '/' + name
    try {
      await filesApi.delete(path)
      showToast('success', t('builds.deleted'))
      if (selectedFile === path) {
        setSelectedFile('')
        setEditorContent('')
      }
      await fetchFiles()
    } catch (err: any) {
      showToast('error', err.response?.data?.error || 'Delete failed')
    }
  }

  const exportFile = () => {
    if (!selectedFile) return
    const blob = new Blob([editorContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = selectedFile.split(/[\\/]/).pop() || 'file'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('success', t('builds.exported'))
  }

  const generateImageTag = () => {
    const rand = Math.random().toString(36).substring(2, 8)
    return `image-${rand}:latest`
  }

  const handleBuild = async () => {
    if (!selectedFile) {
      showToast('error', 'Dockerfile is required')
      return
    }
    const tag = buildTag.trim() || generateImageTag()
    setBuildTag(tag)
    setBuilding(true)
    setLogs(`► Starting build for ${tag}...\n► Context: ${workspaceDir}\n► Dockerfile: ${selectedFile.split(/[\\/]/).pop()}\n${t('builds.pullHint')}\n`)
    addNotification('info', `Building ${tag}...`)
    try {
      const args: Record<string, string> = {}
      if (buildArgs.trim()) {
        buildArgs.split('\n').forEach(line => {
          const idx = line.indexOf('=')
          if (idx > 0) args[line.slice(0, idx).trim()] = line.slice(idx + 1).trim()
        })
      }
      const res = await buildsApi.build({
        context_dir: workspaceDir,
        dockerfile_path: selectedFile,
        tag: tag,
        build_args: args,
      })
      setLogs(prev => prev + '\n' + (res.data.logs || 'Build completed successfully'))
      addNotification('success', `Built ${tag}`)
      showToast('success', t('builds.buildSuccess'))
    } catch (err: any) {
      const errorLogs = err.response?.data?.logs || ''
      const errorMsg = err.response?.data?.error || err.message || 'Build failed'
      setLogs(prev => prev + '\n' + (errorLogs ? errorLogs + '\n' + errorMsg : errorMsg))
      addNotification('error', `Failed to build ${tag}: ${errorMsg}`)
      showToast('error', t('builds.buildFailed'))
    } finally { setBuilding(false) }
  }

  const clearLogs = () => {
    setLogs('')
    showToast('success', t('builds.logsCleared'))
  }

  const copyLogs = async () => {
    if (!logs) return
    try {
      await navigator.clipboard.writeText(logs)
      setCopiedLog(true)
      setTimeout(() => setCopiedLog(false), 2000)
    } catch {
      showToast('error', t('builds.copyFailed'))
    }
  }

  const exportLogs = () => {
    if (!logs) return
    const blob = new Blob([logs], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `build-${new Date().toISOString().replace(/[:.]/g, '-')}.log`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('success', t('builds.exported'))
  }

  return (
    <div className="content-center">
      <div className="page-header">
        <h1>{t('builds.title')}</h1>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={fetchFiles} disabled={loadingFiles}>
            <RefreshCw size={16} className={loadingFiles ? 'spin' : ''} />{t('builds.refresh')}
          </button>
        </div>
      </div>

      <div className="build-layout">
        {/* File tree / upload area */}
        <div
          className={`build-file-tree ${files.length === 0 ? 'build-file-tree-empty' : ''} ${dragOver ? 'build-file-tree-dragover' : ''}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          {files.length === 0 && !dragOver && (
            <div className="build-upload-prompt" onClick={() => fileInputRef.current?.click()}>
              <Upload size={32} />
              <span className="build-upload-prompt-title">{t('builds.dropFiles')}</span>
              <span className="build-upload-prompt-hint">{t('builds.clickToBrowse')}</span>
              <span className="build-upload-prompt-types">Dockerfile, tar, .zip, etc.</span>
            </div>
          )}
          {files.length === 0 && dragOver && (
            <div className="build-upload-prompt">
              <Upload size={32} />
              <span className="build-upload-prompt-title">{t('builds.dropFiles')}</span>
            </div>
          )}
          {files.length > 0 && (
            <>
              <div className="build-file-tree-header">
                <span className="build-file-tree-path">{workspaceDir}</span>
                <div className="build-file-tree-actions">
                  <button className="btn btn-icon btn-secondary" onClick={() => fileInputRef.current?.click()} data-tooltip={t('builds.importFile')}>
                    <Upload size={12} />
                  </button>
                  <button className="btn btn-icon btn-secondary" onClick={() => dirInputRef.current?.click()} data-tooltip={t('builds.importDir')}>
                    <Folder size={12} />
                  </button>
                </div>
              </div>
              <div className="build-file-tree-body">
                {files.map(f => (
                  <div
                    key={f.name}
                    className={`build-file-tree-item ${selectedFile.endsWith('/' + f.name) ? 'active' : ''}`}
                    onClick={() => loadFile(workspaceDir.replace(/\/$/, '') + '/' + f.name)}
                  >
                    {f.is_dir ? <Folder size={13} /> : <FileCode size={13} />}
                    <span className="build-file-tree-name">{f.name}</span>
                    <span className="build-file-tree-meta">{f.is_dir ? '' : formatSize(f.size)}</span>
                    {!f.is_dir && (
                      <button
                        className="build-file-tree-delete"
                        onClick={(e) => { e.stopPropagation(); handleDeleteFile(f.name) }}
                        data-tooltip={t('builds.delete')}
                      >
                        <Trash2 size={11} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} multiple onChange={onFileInputChange} />
          {/* @ts-ignore webkitdirectory is non-standard but widely supported */}
          <input type="file" ref={dirInputRef} style={{ display: 'none' }} webkitdirectory="" directory="" onChange={onDirInputChange} />
        </div>

        {/* Editor + Logs */}
        <div className="build-workspace" style={{ position: 'relative' }}>
          {/* Editor */}
          <div className="build-editor-panel">
            <div className="build-editor-toolbar">
              <div className="build-editor-toolbar-left">
                <FileText size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                <span className="build-editor-filename">{selectedFile ? selectedFile.split(/[\\/]/).pop() : t('builds.noFile')}</span>
                <div className="toolbar-divider" />
                <button className="btn btn-icon btn-secondary" onClick={() => dockerfileInputRef.current?.click()} data-tooltip={t('builds.import')}><Upload size={14} /></button>
                <button className="btn btn-icon btn-secondary" onClick={exportFile} data-tooltip={t('builds.export')}><Download size={14} /></button>
                <button className="btn btn-icon btn-secondary" onClick={() => setEditorContent('')} data-tooltip={t('builds.clear')}><X size={14} /></button>
                <input type="file" ref={dockerfileInputRef} style={{ display: 'none' }} accept=".dockerfile,Dockerfile,.txt,*" onChange={handleImportDockerfile} />
              </div>
              <div className="build-editor-toolbar-right">
                <input className="form-control" style={{ width: '260px', padding: '6px 10px', fontSize: '13px' }} value={buildTag} onChange={e => setBuildTag(e.target.value)} placeholder="app:v1" />
                <button className="btn btn-icon btn-primary build-btn-run" onClick={handleBuild} disabled={building || !selectedFile} data-tooltip={t('builds.build')}>
                  {building ? <RefreshCw size={14} className="spin" /> : <Hammer size={14} />}
                </button>
              </div>
            </div>
            <div className="build-editor-body">
              <div ref={lineNumbersRef} className="build-line-numbers">
                {Array.from({ length: editorContent.split('\n').length }, (_, i) => {
                  const lineNum = i + 1
                  const hasIssue = lintIssues.some(issue => issue.line === lineNum)
                  return (
                    <div key={lineNum} className={`build-line-num ${hasIssue ? 'build-line-num-error' : ''}`}>
                      {lineNum}
                    </div>
                  )
                })}
              </div>
              <pre ref={highlightRef} className="build-editor-highlight" aria-hidden="true" />
              <textarea
                ref={textareaRef}
                value={editorContent}
                onChange={e => setEditorContent(e.target.value)}
                onScroll={syncScroll}
                placeholder="# Dockerfile&#10;FROM node:18&#10;..."
                spellCheck={false}
              />
            </div>
            {isDockerfile && (
              <div className="build-lint-bar">
                {lintIssues.length === 0 ? (
                  <span className="build-lint-ok"><CheckCircle2 size={13} />{t('builds.lintOk')}</span>
                ) : (
                  <span className={`build-lint-bad ${hasErrors ? 'build-lint-error' : 'build-lint-warn'}`}>
                    <AlertCircle size={13} />
                    {lintIssues.length} {lintIssues.length === 1 ? t('builds.lintIssue') : t('builds.lintIssues')} — {lintIssues[0].message} ({t('builds.lintLine')} {lintIssues[0].line})
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Logs */}
          <div className="build-log-panel">
            <div className="build-log-header">
              <div className="build-log-title"><Terminal size={13} />{t('builds.buildOutput')}</div>
              <div className="build-log-actions">
                {building && <div className="build-log-running"><div className="spin loading-spinner" style={{ width: '14px', height: '14px', borderWidth: '1.5px' }} />{t('builds.running')}</div>}
                {logs && (
                  <>
                    <button className="btn btn-icon btn-secondary" onClick={exportLogs} data-tooltip={t('builds.export')}>
                      <Download size={14} />
                    </button>
                    <button className="btn btn-icon btn-secondary" onClick={copyLogs} data-tooltip={copiedLog ? t('builds.copied') : t('builds.copy')}>
                      {copiedLog ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                    </button>
                    <button className="btn btn-icon btn-secondary" onClick={clearLogs} data-tooltip={t('builds.clear')}><X size={14} /></button>
                  </>
                )}
              </div>
            </div>
            <div className="build-log-body">
              {logs ? (
                <pre dangerouslySetInnerHTML={{ __html: renderHighlightedLogs(logs) }} />
              ) : (
                <div className="build-log-empty">{t('builds.noLogs')}</div>
              )}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
