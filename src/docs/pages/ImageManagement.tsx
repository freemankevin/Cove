import { useEffect } from 'react'
import { Check, Sparkles } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import CodeBlock from '../components/CodeBlock'
import '../components/DocPage.css'

export default function ImageManagement() {
  const { t, language } = useLanguage()
  
  useEffect(() => {
    document.title = language === 'zh' ? '镜像管理 - Cove 文档' : 'Image Management - Cove Documentation'
  }, [language])

  return (
    <div className="doc-page">
      <div className="doc-page-header">
        <div className="doc-page-breadcrumb">
          <a href="/docs">Docs</a>
          <span className="doc-page-breadcrumb-separator">/</span>
          <span>{t('docs.section.coreFeatures')}</span>
        </div>
        <h1 className="doc-page-title">{t('docs.imageManagement.title')}</h1>
        <p className="doc-page-description">{t('docs.imageManagement.heroDesc')}</p>
      </div>

      <div className="doc-content">
        <h2>{t('docs.imageManagement.add.title')}</h2>
        <p>{t('docs.imageManagement.add.desc')}</p>

        <h3>{t('docs.imageManagement.format.title')}</h3>
        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>{t('docs.imageManagement.format.format')}</th>
                <th>{t('docs.imageManagement.format.registry')}</th>
                <th>{t('docs.imageManagement.format.auth')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="doc-inline-code">nginx:latest</code></td>
                <td>Docker Hub</td>
                <td>{t('docs.imageManagement.format.optional')}</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">docker.io/library/nginx:latest</code></td>
                <td>Docker Hub (explicit)</td>
                <td>{t('docs.imageManagement.format.optional')}</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">ghcr.io/owner/repo:v1.0</code></td>
                <td>GitHub Container Registry</td>
                <td>{t('docs.imageManagement.format.recommended')}</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">quay.io/org/image:tag</code></td>
                <td>Quay.io</td>
                <td>{t('docs.imageManagement.format.forPrivate')}</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">registry.cn-hangzhou.aliyuncs.com/...</code></td>
                <td>Alibaba ACR</td>
                <td>{t('docs.imageManagement.format.forPrivate')}</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">public.ecr.aws/...</code></td>
                <td>AWS ECR Public</td>
                <td>{t('docs.imageManagement.format.no')}</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">*.amazonaws.com/...</code></td>
                <td>AWS ECR Private</td>
                <td>{t('docs.imageManagement.format.required')}</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">*.pkg.dev/...</code></td>
                <td>Google Artifact Registry</td>
                <td>{t('docs.imageManagement.format.forPrivate')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>{t('docs.imageManagement.batch.title')}</h3>
        <p>{t('docs.imageManagement.batch.desc')}</p>

        <CodeBlock
          title={language === 'zh' ? '批量输入示例' : 'Example Batch Input'}
          language="Text"
          code={`nginx:latest
redis:7-alpine
ghcr.io/myorg/myapp:v2.1.0
quay.io/prometheus/prometheus:v2.45.0`}
        />

        <div className="doc-callout doc-callout-info">
          <div className="doc-callout-header">
            <Check size={20} className="doc-callout-icon" />
            <span className="doc-callout-title">{t('docs.note')}</span>
          </div>
          <div className="doc-callout-body">
            <p className="doc-callout-text">{t('docs.imageManagement.batch.note')}</p>
          </div>
        </div>

        <h2>{t('docs.imageManagement.status.title')}</h2>
        <p>{t('docs.imageManagement.status.desc')}</p>

        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>{t('docs.imageManagement.statusTable.status')}</th>
                <th>{t('docs.imageManagement.statusTable.description')}</th>
                <th>{t('docs.imageManagement.statusTable.action')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="doc-badge doc-badge-pending">{t('status.pending')}</span></td>
                <td>{t('docs.imageManagement.status.pending')}</td>
                <td>{t('docs.imageManagement.status.pendingAction')}</td>
              </tr>
              <tr>
                <td><span className="doc-badge doc-badge-pulling">{t('status.pulling')}</span></td>
                <td>{t('docs.imageManagement.status.pulling')}</td>
                <td>{t('docs.imageManagement.status.pullingAction')}</td>
              </tr>
              <tr>
                <td><span className="doc-badge doc-badge-success">{t('status.success')}</span></td>
                <td>{t('docs.imageManagement.status.success')}</td>
                <td>{t('docs.imageManagement.status.successAction')}</td>
              </tr>
              <tr>
                <td><span className="doc-badge doc-badge-failed">{t('status.failed')}</span></td>
                <td>{t('docs.imageManagement.status.failed')}</td>
                <td>{t('docs.imageManagement.status.failedAction')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>{t('docs.imageManagement.platform.title')}</h2>
        <p>{t('docs.imageManagement.platform.desc')}</p>

        <ul>
          <li><strong>linux/amd64</strong> - {t('docs.imageManagement.platform.amd64')}</li>
          <li><strong>linux/arm64</strong> - {t('docs.imageManagement.platform.arm64')}</li>
        </ul>

        <div className="doc-callout doc-callout-tip">
          <div className="doc-callout-header">
            <Sparkles size={20} className="doc-callout-icon" />
            <span className="doc-callout-title">{t('docs.proTip')}</span>
          </div>
          <div className="doc-callout-body">
            <p className="doc-callout-text">{t('docs.imageManagement.tip')}</p>
          </div>
        </div>

        <h2>{t('docs.imageManagement.manage.title')}</h2>
        <p>{t('docs.imageManagement.manage.desc')}</p>

        <ul>
          <li><strong>{language === 'zh' ? '拉取' : 'Pull'}</strong> - {t('docs.imageManagement.manage.pull')}</li>
          <li><strong>{language === 'zh' ? '导出' : 'Export'}</strong> - {t('docs.imageManagement.manage.export')}</li>
          <li><strong>{language === 'zh' ? '删除' : 'Delete'}</strong> - {t('docs.imageManagement.manage.delete')}</li>
          <li><strong>{language === 'zh' ? '查看日志' : 'View Logs'}</strong> - {t('docs.imageManagement.manage.logs')}</li>
        </ul>

        <h2>{t('docs.imageManagement.auto.title')}</h2>
        <p>{t('docs.imageManagement.auto.desc')}</p>
      </div>

      <div className="doc-page-nav">
        <a href="/docs/installation" className="doc-page-nav-prev">
          <span className="doc-page-nav-label">{t('docs.prev')}</span>
          <span className="doc-page-nav-title">← {t('docs.installation.title')}</span>
        </a>
        <a href="/docs/multi-platform" className="doc-page-nav-next">
          <span className="doc-page-nav-label">{t('docs.next')}</span>
          <span className="doc-page-nav-title">{t('docs.multiPlatform.title')} →</span>
        </a>
      </div>
    </div>
  )
}