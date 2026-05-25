import { useEffect, useState } from 'react'
import { statsApi, dockerInfoApi } from '../api'
import { Package, CheckCircle, XCircle, Clock, TrendingUp, Server, Box, Activity, HardDrive, Monitor } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

interface DockerInfo {
  runtime: string
  docker_host: string
  connected: boolean
  version: string
  api_version: string
  os: string
  arch: string
  local_images: number
  containers_running: number
  containers_total: number
}

export default function Stats() {
  const [stats, setStats] = useState({ total: 0, success: 0, failed: 0, pending: 0 })
  const [dockerInfo, setDockerInfo] = useState<DockerInfo | null>(null)
  const { t } = useLanguage()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await statsApi.get()
        setStats(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchStats()
    const interval = setInterval(fetchStats, 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchDockerInfo = async () => {
      try {
        const res = await dockerInfoApi.get()
        setDockerInfo(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchDockerInfo()
  }, [])

  const successRate = stats.total > 0
    ? Math.round((stats.success / stats.total) * 100)
    : 0

  const cards = [
    {
      title: t('stats.total'),
      value: stats.total,
      icon: Package,
      color: 'purple',
      description: t('stats.totalDesc'),
    },
    {
      title: t('stats.success'),
      value: stats.success,
      icon: CheckCircle,
      color: 'green',
      description: t('stats.successDesc'),
    },
    {
      title: t('stats.failed'),
      value: stats.failed,
      icon: XCircle,
      color: 'red',
      description: t('stats.failedDesc'),
    },
    {
      title: t('stats.pending'),
      value: stats.pending,
      icon: Clock,
      color: 'yellow',
      description: t('stats.pendingDesc'),
    },
  ]

  return (
    <div className="content-center">
      {/* ── Page Header ── */}
      <div className="page-header">
        <h1>{t('stats.title')}</h1>
      </div>

      {/* ── Stats Grid ── */}
      <div className="stats-grid" style={{ marginBottom: '24px' }}>
        {cards.map((card) => (
          <div key={card.title} className={`stat-card stat-card-${card.color}`}>
            <div className="stat-card-content">
              <div className="stat-info">
                <p className="stat-title">{card.title}</p>
                <p className="stat-value">{card.value}</p>
                <p style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '6px' }}>
                  {card.description}
                </p>
              </div>
              <div className={`stat-icon-wrapper stat-icon-${card.color}`}>
                <card.icon size={20} strokeWidth={1.75} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Success Rate Panel ── */}
      {stats.total > 0 && (
        <div style={{
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-card)',
          padding: '18px 20px',
          border: '1px solid var(--border-color)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
<div style={{
               width: '32px',
               height: '32px',
               borderRadius: 'var(--radius-lg)',
               background: 'rgba(139, 92, 246, 0.15)',
               display: 'flex',
               alignItems: 'center',
               justifyContent: 'center',
             }}>
              <TrendingUp size={16} style={{ color: 'var(--purple-400)' }} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                {t('stats.successRate')}
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                {t('stats.successRateDesc').replace('{count}', String(stats.total))}
              </div>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
              {successRate}%
            </div>
          </div>

          {/* Progress bar */}
          <div style={{
            height: '6px',
            borderRadius: '3px',
            background: 'var(--bg-tertiary)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${successRate}%`,
              borderRadius: '3px',
              background: successRate >= 80
                ? 'var(--green-500)'
                : successRate >= 50
                  ? 'var(--yellow-500)'
                  : 'var(--red-500)',
              transition: 'width 0.5s ease',
            }} />
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: '20px', marginTop: '12px' }}>
            {[
              { label: t('stats.legend.success'), value: stats.success, color: 'var(--green-500)' },
              { label: t('stats.legend.failed'),  value: stats.failed,  color: 'var(--red-500)' },
              { label: t('stats.legend.pending'), value: stats.pending, color: 'var(--yellow-500)' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: item.color,
                  flexShrink: 0,
                }} />
                <span style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>
                  {item.label}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Docker Environment Panel ── */}
      {dockerInfo && (
        <div style={{
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-card)',
          padding: '18px 20px',
          border: '1px solid var(--border-color)',
          marginTop: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-lg)',
              background: dockerInfo.connected ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Server size={16} style={{ color: dockerInfo.connected ? 'var(--green-500)' : 'var(--red-500)' }} />
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                {t('stats.dockerEnv')}
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                {dockerInfo.connected ? t('stats.dockerConnected') : t('stats.dockerDisconnected')}
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: dockerInfo.connected ? 'var(--green-500)' : 'var(--red-500)',
              }} />
              <span style={{ fontSize: '13px', fontWeight: 500, color: dockerInfo.connected ? 'var(--green-500)' : 'var(--red-500)' }}>
                {dockerInfo.connected ? t('stats.online') : t('stats.offline')}
              </span>
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '12px',
          }}>
            {[
              {
                label: t('stats.runtime'),
                value: dockerInfo.runtime.charAt(0).toUpperCase() + dockerInfo.runtime.slice(1),
                icon: Server,
                color: 'var(--purple-400)',
                bg: 'rgba(139, 92, 246, 0.12)',
              },
              {
                label: t('stats.dockerHost'),
                value: dockerInfo.docker_host,
                icon: HardDrive,
                color: 'var(--blue-400)',
                bg: 'rgba(59, 130, 246, 0.12)',
              },
              {
                label: t('stats.version'),
                value: dockerInfo.version
                  ? dockerInfo.api_version
                    ? `${dockerInfo.version} (API ${dockerInfo.api_version})`
                    : dockerInfo.version
                  : '-',
                icon: Box,
                color: 'var(--orange-400)',
                bg: 'rgba(251, 146, 60, 0.12)',
              },
              {
                label: t('stats.platform'),
                value: dockerInfo.os && dockerInfo.arch
                  ? `${dockerInfo.os}/${dockerInfo.arch}`
                  : '-',
                icon: Monitor,
                color: 'var(--pink-400)',
                bg: 'rgba(236, 72, 153, 0.12)',
              },
              {
                label: t('stats.localImages'),
                value: String(dockerInfo.local_images),
                icon: Package,
                color: 'var(--cyan-400)',
                bg: 'rgba(34, 211, 238, 0.12)',
              },
              {
                label: t('stats.containers'),
                value: `${dockerInfo.containers_running} / ${dockerInfo.containers_total}`,
                icon: Activity,
                color: 'var(--green-400)',
                bg: 'rgba(34, 197, 94, 0.12)',
              },
            ].map(item => (
              <div key={item.label} style={{
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: 'var(--radius-md)',
                  background: item.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <item.icon size={14} style={{ color: item.color }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '2px' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
