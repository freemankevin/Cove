import { useEffect } from 'react'
import { Sparkles, Globe, Layers, Download, Bell, FolderOpen } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import '../components/DocPage.css'

export default function Introduction() {
  const { t, language } = useLanguage()
  
  useEffect(() => {
    document.title = language === 'zh' ? '介绍 - Cove 文档' : 'Introduction - Cove Documentation'
  }, [language])

  return (
    <div className="doc-page">
      <div className="doc-hero">
        <h1 className="doc-hero-title">{t('docs.intro.heroTitle')}</h1>
        <p className="doc-hero-description">{t('docs.intro.heroDesc')}</p>
      </div>

      <div className="doc-content">
        <h2>{t('docs.intro.whyTitle')}</h2>
        <p>{t('docs.intro.whyDesc')}</p>

        <div className="doc-feature-grid">
          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Globe size={22} />
            </div>
            <h3 className="doc-feature-title">{t('docs.intro.feature.multiRegistry')}</h3>
            <p className="doc-feature-description">{t('docs.intro.feature.multiRegistryDesc')}</p>
          </div>

          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Layers size={22} />
            </div>
            <h3 className="doc-feature-title">{t('docs.intro.feature.multiPlatform')}</h3>
            <p className="doc-feature-description">{t('docs.intro.feature.multiPlatformDesc')}</p>
          </div>

          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Download size={22} />
            </div>
            <h3 className="doc-feature-title">{t('docs.intro.feature.autoExport')}</h3>
            <p className="doc-feature-description">{t('docs.intro.feature.autoExportDesc')}</p>
          </div>

          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Bell size={22} />
            </div>
            <h3 className="doc-feature-title">{t('docs.intro.feature.webhook')}</h3>
            <p className="doc-feature-description">{t('docs.intro.feature.webhookDesc')}</p>
          </div>
        </div>

        <h2>{t('docs.intro.archTitle')}</h2>
        <p>{t('docs.intro.archDesc')}</p>

        <div className="doc-architecture-diagram">
          <div className="doc-architecture-header">
            <span className="doc-architecture-title">{t('docs.intro.archDiagram')}</span>
            <span className="doc-architecture-badge">DIAGRAM</span>
          </div>
          <div className="doc-architecture-content">
            <div className="doc-architecture-flow">
              <div className="doc-arch-node">
                <div className="doc-arch-icon doc-arch-icon-registry">
                  <Globe size={24} />
                </div>
                <div className="doc-arch-label">{t('docs.intro.archRegistry')}</div>
                <div className="doc-arch-sublabel">{t('docs.intro.archRegistrySub')}</div>
              </div>

              <div className="doc-arch-arrow">
                <div className="doc-arch-arrow-line"></div>
                <div className="doc-arch-arrow-head">▶</div>
              </div>

              <div className="doc-arch-node doc-arch-node-main">
                <div className="doc-arch-icon doc-arch-icon-main">
                  <Download size={26} />
                </div>
                <div className="doc-arch-label">{t('docs.intro.archCove')}</div>
                <div className="doc-arch-sublabel">{t('docs.intro.archCoveSub')}</div>
              </div>

              <div className="doc-arch-arrow">
                <div className="doc-arch-arrow-line"></div>
                <div className="doc-arch-arrow-head">▶</div>
              </div>

              <div className="doc-arch-node">
                <div className="doc-arch-icon doc-arch-icon-export">
                  <FolderOpen size={24} />
                </div>
                <div className="doc-arch-label">{t('docs.intro.archExport')}</div>
                <div className="doc-arch-sublabel">{t('docs.intro.archExportSub')}</div>
              </div>
            </div>

            <div className="doc-arch-webhook-section">
              <div className="doc-arch-webhook-connector">
                <div className="doc-arch-webhook-line"></div>
                <div className="doc-arch-webhook-arrow">▼</div>
              </div>
              <div className="doc-arch-node doc-arch-node-webhook">
                <div className="doc-arch-icon doc-arch-icon-webhook">
                  <Bell size={22} />
                </div>
                <div className="doc-arch-label">{t('docs.intro.archWebhook')}</div>
                <div className="doc-arch-sublabel">{t('docs.intro.archWebhookSub')}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="doc-callout doc-callout-tip">
          <div className="doc-callout-header">
            <Sparkles size={20} className="doc-callout-icon" />
            <span className="doc-callout-title">{t('docs.intro.tipTitle')}</span>
          </div>
          <div className="doc-callout-body">
            <p className="doc-callout-text">{t('docs.intro.tipDesc')}</p>
          </div>
        </div>
      </div>

      <div className="doc-page-nav">
        <div></div>
        <a href="/docs/quick-start" className="doc-page-nav-next">
          <span className="doc-page-nav-label">{t('docs.next')}</span>
          <span className="doc-page-nav-title">{t('docs.quickStart.title')} →</span>
        </a>
      </div>
    </div>
  )
}
