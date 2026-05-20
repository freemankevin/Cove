import { useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import '../components/DocPage.css'

export default function QuickStart() {
  const { t, language } = useLanguage()
  
  useEffect(() => {
    document.title = language === 'zh' ? '快速开始 - Cove 文档' : 'Quick Start - Cove Documentation'
  }, [language])

  return (
    <div className="doc-page">
      <div className="doc-page-header">
        <div className="doc-page-breadcrumb">
          <a href="/docs">Docs</a>
          <span className="doc-page-breadcrumb-separator">/</span>
          <span>{t('docs.section.gettingStarted')}</span>
        </div>
        <h1 className="doc-page-title">{t('docs.quickStart.title')}</h1>
        <p className="doc-page-description">{t('docs.quickStart.heroDesc')}</p>
      </div>

      <div className="doc-content">
        <ol className="doc-ordered-steps">
          <li>
            <h3>{t('docs.quickStart.step1.title')}</h3>
            <p>{t('docs.quickStart.step1.desc')}</p>
          </li>
          <li>
            <h3>{t('docs.quickStart.step2.title')}</h3>
            <p>{t('docs.quickStart.step2.desc')}</p>
            <ul>
              <li>{t('docs.quickStart.step2.item1')}</li>
              <li>{t('docs.quickStart.step2.item2')}</li>
              <li>{t('docs.quickStart.step2.item3')}</li>
              <li>{t('docs.quickStart.step2.item4')}</li>
            </ul>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
              <span className="doc-badge doc-badge-pending">{t('status.pending')}</span>
              <span className="doc-badge doc-badge-pulling">{t('status.pulling')}</span>
              <span className="doc-badge doc-badge-success">{t('status.success')}</span>
              <span className="doc-badge doc-badge-failed">{t('status.failed')}</span>
            </div>
          </li>
          <li>
            <h3>{t('docs.quickStart.step3.title')}</h3>
            <p>{t('docs.quickStart.step3.desc')}</p>
          </li>
          <li>
            <h3>{t('docs.quickStart.step4.title')}</h3>
            <p>{t('docs.quickStart.step4.desc')}</p>
          </li>
        </ol>

        <div className="doc-callout doc-callout-tip">
          <div className="doc-callout-header">
            <Sparkles size={20} className="doc-callout-icon" />
            <span className="doc-callout-title">{t('docs.proTip')}</span>
          </div>
          <div className="doc-callout-body">
            <p className="doc-callout-text">{t('docs.quickStart.tip')}</p>
          </div>
        </div>

        <h2>{t('docs.quickStart.formatTitle')}</h2>
        <p>{t('docs.quickStart.formatDesc')}</p>

        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>{t('docs.quickStart.formatTable.format')}</th>
                <th>{t('docs.quickStart.formatTable.registry')}</th>
                <th>{t('docs.quickStart.formatTable.example')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="doc-inline-code">image:tag</code></td>
                <td>Docker Hub</td>
                <td><code className="doc-inline-code">nginx:latest</code></td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">docker.io/...</code></td>
                <td>Docker Hub (explicit)</td>
                <td><code className="doc-inline-code">docker.io/library/nginx:latest</code></td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">ghcr.io/...</code></td>
                <td>GitHub Container Registry</td>
                <td><code className="doc-inline-code">ghcr.io/owner/repo:v1.0</code></td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">quay.io/...</code></td>
                <td>Quay.io</td>
                <td><code className="doc-inline-code">quay.io/org/image:tag</code></td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">registry.cn-*.aliyuncs.com/...</code></td>
                <td>Alibaba ACR</td>
                <td><code className="doc-inline-code">registry.cn-hangzhou.aliyuncs.com/myapp:v1</code></td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">public.ecr.aws/...</code></td>
                <td>AWS ECR Public</td>
                <td><code className="doc-inline-code">public.ecr.aws/nginx/nginx:latest</code></td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">*.pkg.dev/...</code></td>
                <td>Google GAR</td>
                <td><code className="doc-inline-code">us-docker.pkg.dev/project/repo/image:tag</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        </div>

      <div className="doc-page-nav">
        <a href="/docs/introduction" className="doc-page-nav-prev">
          <span className="doc-page-nav-label">{t('docs.prev')}</span>
          <span className="doc-page-nav-title">← {t('docs.intro.title')}</span>
        </a>
        <a href="/docs/installation" className="doc-page-nav-next">
          <span className="doc-page-nav-label">{t('docs.next')}</span>
          <span className="doc-page-nav-title">{t('docs.installation.title')} →</span>
        </a>
      </div>
    </div>
  )
}