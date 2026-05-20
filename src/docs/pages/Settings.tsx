import { useEffect } from 'react'
import { Settings as SettingsIcon, Sparkles } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import CodeBlock from '../components/CodeBlock'
import '../components/DocPage.css'

export default function SettingsPage() {
  const { t, language } = useLanguage()
  
  useEffect(() => {
    document.title = language === 'zh' ? '设置 - Cove 文档' : 'Settings - Cove Documentation'
  }, [language])

  return (
    <div className="doc-page">
      <div className="doc-page-header">
        <div className="doc-page-breadcrumb">
          <a href="/docs">Docs</a>
          <span className="doc-page-breadcrumb-separator">/</span>
          <span>{t('docs.section.configuration')}</span>
        </div>
        <h1 className="doc-page-title">{t('docs.settings.title')}</h1>
        <p className="doc-page-description">{t('docs.settings.heroDesc')}</p>
      </div>

      <div className="doc-content">
        <h2>{t('docs.settings.general.title')}</h2>
        <p>{t('docs.settings.general.desc')}</p>

        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>{t('docs.settings.table.setting')}</th>
                <th>{t('docs.settings.table.description')}</th>
                <th>{t('docs.settings.table.default')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{language === 'zh' ? '导出路径' : 'Export Path'}</td>
                <td>{t('docs.settings.general.exportPath')}</td>
                <td><code className="doc-inline-code">/app/exports</code></td>
              </tr>
              <tr>
                <td>{language === 'zh' ? '默认平台' : 'Default Platform'}</td>
                <td>{t('docs.settings.general.platform')}</td>
                <td>amd64, arm64</td>
              </tr>
              <tr>
                <td>{language === 'zh' ? '最大重试' : 'Max Retries'}</td>
                <td>{t('docs.settings.general.retries')}</td>
                <td>3</td>
              </tr>
              <tr>
                <td>{language === 'zh' ? '自动导出' : 'Auto Export'}</td>
                <td>{t('docs.settings.general.autoExport')}</td>
                <td>{language === 'zh' ? '禁用' : 'Disabled'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>{t('docs.settings.export.title')}</h2>
        <p>{t('docs.settings.export.desc')}</p>

        <ul>
          <li>{t('docs.settings.export.item1')}</li>
          <li>{t('docs.settings.export.item2')}</li>
          <li>{t('docs.settings.export.item3')}</li>
        </ul>

        <CodeBlock
          title={language === 'zh' ? 'Docker 卷挂载' : 'Docker Volume Mount'}
          language="YAML"
          code={`volumes:
  # Local directory
  - ./exports:/app/exports
  
  # Network share
  - /mnt/shared/images:/app/exports
  
  # Named volume
  - cove-exports:/app/exports`}
        />

        <h2>{t('docs.settings.platform.title')}</h2>
        <p>{t('docs.settings.platform.desc')}</p>

        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>{language === 'zh' ? '选项' : 'Option'}</th>
                <th>{language === 'zh' ? '描述' : 'Description'}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>linux/amd64 only</td>
                <td>{t('docs.settings.platform.amd64')}</td>
              </tr>
              <tr>
                <td>linux/arm64 only</td>
                <td>{t('docs.settings.platform.arm64')}</td>
              </tr>
              <tr>
                <td>{language === 'zh' ? '两者' : 'Both'}</td>
                <td>{t('docs.settings.platform.both')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="doc-callout doc-callout-info">
          <div className="doc-callout-header">
            <SettingsIcon size={20} className="doc-callout-icon" />
            <span className="doc-callout-title">{language === 'zh' ? '配置说明' : 'Configuration Note'}</span>
          </div>
          <div className="doc-callout-body">
            <p className="doc-callout-text">{t('docs.settings.note')}</p>
          </div>
        </div>

        <h2>{t('docs.settings.retry.title')}</h2>
        <p>{t('docs.settings.retry.desc')}</p>

        <ul>
          <li><strong>{t('docs.settings.retry.max')}</strong></li>
          <li><strong>{t('docs.settings.retry.delay')}</strong></li>
          <li><strong>{t('docs.settings.retry.backoff')}</strong></li>
        </ul>

        <div className="doc-callout doc-callout-tip">
          <div className="doc-callout-header">
            <Sparkles size={20} className="doc-callout-icon" />
            <span className="doc-callout-title">{t('docs.proTip')}</span>
          </div>
          <div className="doc-callout-body">
            <p className="doc-callout-text">{t('docs.settings.tip')}</p>
          </div>
        </div>

        <h2>{t('docs.settings.env.title')}</h2>
        <p>{t('docs.settings.env.desc')}</p>

        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>{t('docs.settings.envTable.variable')}</th>
                <th>{t('docs.settings.envTable.setting')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="doc-inline-code">EXPORT_PATH</code></td>
                <td>{t('docs.settings.env.exportPath')}</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">DEFAULT_PLATFORMS</code></td>
                <td>{t('docs.settings.env.platforms')}</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">MAX_RETRIES</code></td>
                <td>{t('docs.settings.env.retries')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="doc-page-nav">
        <a href="/docs/webhooks" className="doc-page-nav-prev">
          <span className="doc-page-nav-label">{t('docs.prev')}</span>
          <span className="doc-page-nav-title">← {t('docs.webhooks.title')}</span>
        </a>
        <a href="/docs/registries" className="doc-page-nav-next">
          <span className="doc-page-nav-label">{t('docs.next')}</span>
          <span className="doc-page-nav-title">{t('docs.registries.title')} →</span>
        </a>
      </div>
    </div>
  )
}