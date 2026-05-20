import { useEffect } from 'react'
import { Container, Sparkles } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import CodeBlock from '../components/CodeBlock'
import '../components/DocPage.css'

export default function MultiPlatform() {
  const { t, language } = useLanguage()
  
  useEffect(() => {
    document.title = language === 'zh' ? '多平台支持 - Cove 文档' : 'Multi-Platform - Cove Documentation'
  }, [language])

  return (
    <div className="doc-page">
      <div className="doc-page-header">
        <div className="doc-page-breadcrumb">
          <a href="/docs">Docs</a>
          <span className="doc-page-breadcrumb-separator">/</span>
          <span>{t('docs.section.coreFeatures')}</span>
        </div>
        <h1 className="doc-page-title">{t('docs.multiPlatform.title')}</h1>
        <p className="doc-page-description">{t('docs.multiPlatform.heroDesc')}</p>
      </div>

      <div className="doc-content">
        <h2>{t('docs.multiPlatform.support.title')}</h2>
        <p>{t('docs.multiPlatform.support.desc')}</p>

        <div className="doc-feature-grid">
          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Container size={22} />
            </div>
            <h3 className="doc-feature-title">linux/amd64</h3>
            <p className="doc-feature-description">{t('docs.multiPlatform.amd64')}</p>
          </div>

          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Container size={22} />
            </div>
            <h3 className="doc-feature-title">linux/arm64</h3>
            <p className="doc-feature-description">{t('docs.multiPlatform.arm64')}</p>
          </div>
        </div>

        <h2>{t('docs.multiPlatform.how.title')}</h2>
        <p>{t('docs.multiPlatform.how.desc')}</p>

        <ol className="doc-ordered-steps">
          <li>
            <h3>{t('docs.multiPlatform.how.step1')}</h3>
            <p>{t('docs.multiPlatform.how.step1Desc')}</p>
          </li>
          <li>
            <h3>{t('docs.multiPlatform.how.step2')}</h3>
            <p>{t('docs.multiPlatform.how.step2Desc')}</p>
          </li>
          <li>
            <h3>{t('docs.multiPlatform.how.step3')}</h3>
            <p>{t('docs.multiPlatform.how.step3Desc')}</p>
          </li>
          <li>
            <h3>{t('docs.multiPlatform.how.step4')}</h3>
            <p>{t('docs.multiPlatform.how.step4Desc')}</p>
          </li>
        </ol>

        <h2>{t('docs.multiPlatform.detection.title')}</h2>
        <p>{t('docs.multiPlatform.detection.desc')}</p>

        <CodeBlock
          title={language === 'zh' ? 'API 检查示例' : 'API Check Example'}
          language="HTTP"
          code={`GET /api/images/check-platforms?name=nginx&tag=latest

Response:
{
  "platforms": ["linux/amd64", "linux/arm64"],
  "available": true
}`}
        />

        <h2>{t('docs.multiPlatform.naming.title')}</h2>
        <p>{t('docs.multiPlatform.naming.desc')}</p>

        <CodeBlock
          title={language === 'zh' ? '导出文件名' : 'Export File Names'}
          language="Text"
          code={`nginx_latest_linux-amd64.tar
nginx_latest_linux-arm64.tar

# Format: {name}_{tag}_{platform}.tar`}
        />

        <div className="doc-callout doc-callout-tip">
          <div className="doc-callout-header">
            <Sparkles size={20} className="doc-callout-icon" />
            <span className="doc-callout-title">{t('docs.proTip')}</span>
          </div>
          <div className="doc-callout-body">
            <p className="doc-callout-text">{t('docs.multiPlatform.tip')}</p>
          </div>
        </div>

        <h2>{t('docs.multiPlatform.useCases.title')}</h2>
        <p>{t('docs.multiPlatform.useCases.desc')}</p>

        <ul>
          <li><strong>{t('docs.multiPlatform.useCases.dev')}</strong> - {t('docs.multiPlatform.useCases.devDesc')}</li>
          <li><strong>{t('docs.multiPlatform.useCases.hybrid')}</strong> - {t('docs.multiPlatform.useCases.hybridDesc')}</li>
          <li><strong>{t('docs.multiPlatform.useCases.cost')}</strong> - {t('docs.multiPlatform.useCases.costDesc')}</li>
          <li><strong>{t('docs.multiPlatform.useCases.edge')}</strong> - {t('docs.multiPlatform.useCases.edgeDesc')}</li>
        </ul>
      </div>

      <div className="doc-page-nav">
        <a href="/docs/image-management" className="doc-page-nav-prev">
          <span className="doc-page-nav-label">{t('docs.prev')}</span>
          <span className="doc-page-nav-title">← {t('docs.imageManagement.title')}</span>
        </a>
        <a href="/docs/auto-export" className="doc-page-nav-next">
          <span className="doc-page-nav-label">{t('docs.next')}</span>
          <span className="doc-page-nav-title">{t('docs.autoExport.title')} →</span>
        </a>
      </div>
    </div>
  )
}