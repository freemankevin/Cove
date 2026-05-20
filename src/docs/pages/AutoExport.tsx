import { useEffect } from 'react'
import { Check, Sparkles } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import CodeBlock from '../components/CodeBlock'
import '../components/DocPage.css'

export default function AutoExport() {
  const { t, language } = useLanguage()
  
  useEffect(() => {
    document.title = language === 'zh' ? '自动导出 - Cove 文档' : 'Auto Export - Cove Documentation'
  }, [language])

  return (
    <div className="doc-page">
      <div className="doc-page-header">
        <div className="doc-page-breadcrumb">
          <a href="/docs">Docs</a>
          <span className="doc-page-breadcrumb-separator">/</span>
          <span>{t('docs.section.coreFeatures')}</span>
        </div>
        <h1 className="doc-page-title">{t('docs.autoExport.title')}</h1>
        <p className="doc-page-description">{t('docs.autoExport.heroDesc')}</p>
      </div>

      <div className="doc-content">
        <h2>{t('docs.autoExport.how.title')}</h2>
        <p>{t('docs.autoExport.how.desc')}</p>

        <ol className="doc-ordered-steps">
          <li>
            <h3>{t('docs.autoExport.step1')}</h3>
            <p>{t('docs.autoExport.step1Desc')}</p>
          </li>
          <li>
            <h3>{t('docs.autoExport.step2')}</h3>
            <p>{t('docs.autoExport.step2Desc')}</p>
          </li>
          <li>
            <h3>{t('docs.autoExport.step3')}</h3>
            <p>{t('docs.autoExport.step3Desc')}</p>
          </li>
          <li>
            <h3>{t('docs.autoExport.step4')}</h3>
            <p>{t('docs.autoExport.step4Desc')}</p>
          </li>
        </ol>

        <h2>{t('docs.autoExport.naming.title')}</h2>
        <p>{t('docs.autoExport.naming.desc')}</p>

        <CodeBlock
          title={language === 'zh' ? '文件命名模式' : 'File Naming Pattern'}
          language="Text"
          code={`{name}_{tag}_{platform}.tar

Examples:
├── nginx_latest_linux-amd64.tar
├── nginx_latest_linux-arm64.tar
├── ghcr.io_myorg_myapp_v1.0.0_linux-amd64.tar`}
        />

        <div className="doc-callout doc-callout-info">
          <div className="doc-callout-header">
            <Check size={20} className="doc-callout-icon" />
            <span className="doc-callout-title">{t('docs.note')}</span>
          </div>
          <div className="doc-callout-body">
            <p className="doc-callout-text">{t('docs.autoExport.naming.note')}</p>
          </div>
        </div>

        <h2>{t('docs.autoExport.status.title')}</h2>
        <p>{t('docs.autoExport.status.desc')}</p>

        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>{t('docs.autoExport.statusTable.status')}</th>
                <th>{t('docs.autoExport.statusTable.description')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="doc-badge doc-badge-pending">—</span></td>
                <td>{t('docs.autoExport.status.none')}</td>
              </tr>
              <tr>
                <td><span className="doc-badge doc-badge-pulling">{t('status.pending')}</span></td>
                <td>{t('docs.autoExport.status.pending')}</td>
              </tr>
              <tr>
                <td><span className="doc-badge doc-badge-success">{t('images.exported')}</span></td>
                <td>{t('docs.autoExport.status.exported')}</td>
              </tr>
              <tr>
                <td><span className="doc-badge doc-badge-failed">{t('status.failed')}</span></td>
                <td>{t('docs.autoExport.status.failed')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="doc-callout doc-callout-tip">
          <div className="doc-callout-header">
            <Sparkles size={20} className="doc-callout-icon" />
            <span className="doc-callout-title">{t('docs.proTip')}</span>
          </div>
          <div className="doc-callout-body">
            <p className="doc-callout-text">{t('docs.autoExport.tip')}</p>
          </div>
        </div>

        <h2>{t('docs.autoExport.volume.title')}</h2>
        <p>{t('docs.autoExport.volume.desc')}</p>

        <CodeBlock
          title="Docker Compose"
          language="YAML"
          code={`services:
  cove:
    volumes:
      - ./exports:/app/exports
      - /shared/images:/app/exports/shared  # Mount to shared location`}
        />
      </div>

      <div className="doc-page-nav">
        <a href="/docs/multi-platform" className="doc-page-nav-prev">
          <span className="doc-page-nav-label">{t('docs.prev')}</span>
          <span className="doc-page-nav-title">← {t('docs.multiPlatform.title')}</span>
        </a>
        <a href="/docs/webhooks" className="doc-page-nav-next">
          <span className="doc-page-nav-label">{t('docs.next')}</span>
          <span className="doc-page-nav-title">{t('docs.webhooks.title')} →</span>
        </a>
      </div>
    </div>
  )
}