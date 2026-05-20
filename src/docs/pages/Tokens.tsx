import { useEffect } from 'react'
import { Sparkles, Shield, Lock } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import '../components/DocPage.css'

export default function Tokens() {
  const { t, language } = useLanguage()
  
  useEffect(() => {
    document.title = language === 'zh' ? '访问令牌 - Cove 文档' : 'Access Tokens - Cove Documentation'
  }, [language])

  return (
    <div className="doc-page">
      <div className="doc-page-header">
        <div className="doc-page-breadcrumb">
          <a href="/docs">Docs</a>
          <span className="doc-page-breadcrumb-separator">/</span>
          <span>{t('docs.section.configuration')}</span>
        </div>
        <h1 className="doc-page-title">{language === 'zh' ? '访问令牌' : 'Access Tokens'}</h1>
        <p className="doc-page-description">{t('docs.tokens.heroDesc')}</p>
      </div>

      <div className="doc-content">
        <h2>{t('docs.tokens.support.title')}</h2>
        <p>{t('docs.tokens.support.desc')}</p>

        <div className="doc-feature-grid">
          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Lock size={20} />
            </div>
            <h3 className="doc-feature-title">Docker Hub</h3>
            <p className="doc-feature-description">{t('docs.tokens.dockerhub')}</p>
          </div>

          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Lock size={20} />
            </div>
            <h3 className="doc-feature-title">{language === 'zh' ? 'GitHub 容器仓库' : 'GitHub Container Registry'}</h3>
            <p className="doc-feature-description">{t('docs.tokens.ghcr')}</p>
          </div>

          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Lock size={20} />
            </div>
            <h3 className="doc-feature-title">Quay.io</h3>
            <p className="doc-feature-description">{t('docs.tokens.quay')}</p>
          </div>

          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Lock size={20} />
            </div>
            <h3 className="doc-feature-title">{language === 'zh' ? '阿里云 ACR' : 'Alibaba ACR'}</h3>
            <p className="doc-feature-description">{t('docs.tokens.acr')}</p>
          </div>

          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Lock size={20} />
            </div>
            <h3 className="doc-feature-title">AWS ECR</h3>
            <p className="doc-feature-description">{t('docs.tokens.ecr')}</p>
          </div>

          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Lock size={20} />
            </div>
            <h3 className="doc-feature-title">{language === 'zh' ? 'Google GAR' : 'Google GAR'}</h3>
            <p className="doc-feature-description">{t('docs.tokens.gar')}</p>
          </div>
        </div>

        <h2>{t('docs.tokens.add.title')}</h2>

        <ol className="doc-ordered-steps">
          <li>
            <h3>{t('docs.tokens.step1')}</h3>
            <p>{t('docs.tokens.step1Desc')}</p>
          </li>
          <li>
            <h3>{t('docs.tokens.step2')}</h3>
            <p>{t('docs.tokens.step2Desc')}</p>
          </li>
          <li>
            <h3>{t('docs.tokens.step3')}</h3>
            <p>{t('docs.tokens.step3Desc')}</p>
          </li>
          <li>
            <h3>{t('docs.tokens.step4')}</h3>
            <p>{t('docs.tokens.step4Desc')}</p>
          </li>
        </ol>

        <h2>{t('docs.tokens.config.title')}</h2>

        <h3>Docker Hub</h3>
        <ul>
          <li>{t('docs.tokens.dockerhubConfig.item1')}</li>
          <li>{t('docs.tokens.dockerhubConfig.item2')}</li>
          <li>{t('docs.tokens.dockerhubConfig.item3')}</li>
          <li>{t('docs.tokens.dockerhubConfig.item4')}</li>
        </ul>

        <h3>{language === 'zh' ? 'GitHub 容器仓库 (ghcr.io)' : 'GitHub Container Registry (ghcr.io)'}</h3>
        <ul>
          <li>{t('docs.tokens.ghcrConfig.item1')}</li>
          <li>{t('docs.tokens.ghcrConfig.item2')}</li>
          <li>{t('docs.tokens.ghcrConfig.item3')}</li>
          <li>{t('docs.tokens.ghcrConfig.item4')}</li>
        </ul>

        <h3>Quay.io</h3>
        <ul>
          <li>{t('docs.tokens.quayConfig.item1')}</li>
          <li>{t('docs.tokens.quayConfig.item2')}</li>
          <li>{t('docs.tokens.quayConfig.item3')}</li>
          <li>{t('docs.tokens.quayConfig.item4')}</li>
        </ul>

        <h3>{language === 'zh' ? '阿里云容器仓库 (ACR)' : 'Alibaba Container Registry (ACR)'}</h3>
        <ul>
          <li>{t('docs.tokens.acrConfig.item1')}</li>
          <li>{t('docs.tokens.acrConfig.item2')}</li>
          <li>{t('docs.tokens.acrConfig.item3')}</li>
          <li>{t('docs.tokens.acrConfig.item4')}</li>
        </ul>

        <h3>{language === 'zh' ? 'AWS 弹性容器仓库 (ECR)' : 'AWS Elastic Container Registry (ECR)'}</h3>
        <ul>
          <li>{t('docs.tokens.ecrConfig.item1')}</li>
          <li>{t('docs.tokens.ecrConfig.item2')}</li>
          <li>{t('docs.tokens.ecrConfig.item3')}</li>
          <li>{t('docs.tokens.ecrConfig.item4')}</li>
        </ul>

        <h3>{language === 'zh' ? 'Google Artifact Registry (GAR)' : 'Google Artifact Registry (GAR)'}</h3>
        <ul>
          <li>{t('docs.tokens.garConfig.item1')}</li>
          <li>{t('docs.tokens.garConfig.item2')}</li>
          <li>{t('docs.tokens.garConfig.item3')}</li>
          <li>{t('docs.tokens.garConfig.item4')}</li>
        </ul>

        <div className="doc-callout doc-callout-danger">
          <div className="doc-callout-header">
            <Shield size={20} className="doc-callout-icon" />
            <span className="doc-callout-title">{t('docs.tokens.security.title')}</span>
          </div>
          <div className="doc-callout-body">
            <p className="doc-callout-text">{t('docs.tokens.security.desc')}</p>
          </div>
        </div>

        <h2>{t('docs.tokens.rate.title')}</h2>
        <p>{t('docs.tokens.rate.desc')}</p>

        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>{t('docs.tokens.rateTable.registry')}</th>
                <th>{t('docs.tokens.rateTable.anonymous')}</th>
                <th>{t('docs.tokens.rateTable.authenticated')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Docker Hub</td>
                <td>{t('docs.tokens.rate.dockerhub.anon')}</td>
                <td>{t('docs.tokens.rate.dockerhub.auth')}</td>
              </tr>
              <tr>
                <td>{language === 'zh' ? 'GitHub 容器仓库' : 'GitHub Container Registry'}</td>
                <td>{t('docs.tokens.rate.ghcr.anon')}</td>
                <td>{t('docs.tokens.rate.ghcr.auth')}</td>
              </tr>
              <tr>
                <td>Quay.io</td>
                <td>{t('docs.tokens.rate.quay.anon')}</td>
                <td>{t('docs.tokens.rate.quay.auth')}</td>
              </tr>
              <tr>
                <td>{language === 'zh' ? '阿里云 ACR' : 'Alibaba ACR'}</td>
                <td>{t('docs.tokens.rate.acr.anon')}</td>
                <td>{t('docs.tokens.rate.acr.auth')}</td>
              </tr>
              <tr>
                <td>AWS ECR</td>
                <td>{t('docs.tokens.rate.ecr.anon')}</td>
                <td>{t('docs.tokens.rate.ecr.auth')}</td>
              </tr>
              <tr>
                <td>{language === 'zh' ? 'Google GAR' : 'Google GAR'}</td>
                <td>{t('docs.tokens.rate.gar.anon')}</td>
                <td>{t('docs.tokens.rate.gar.auth')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>{t('docs.tokens.best.title')}</h2>

        <ul>
          <li><strong>{t('docs.tokens.best.item1')}</strong> - {t('docs.tokens.best.item1Desc')}</li>
          <li><strong>{t('docs.tokens.best.item2')}</strong> - {t('docs.tokens.best.item2Desc')}</li>
          <li><strong>{t('docs.tokens.best.item3')}</strong> - {t('docs.tokens.best.item3Desc')}</li>
          <li><strong>{t('docs.tokens.best.item4')}</strong> - {t('docs.tokens.best.item4Desc')}</li>
          <li><strong>{t('docs.tokens.best.item5')}</strong> - {t('docs.tokens.best.item5Desc')}</li>
        </ul>

        <div className="doc-callout doc-callout-tip">
          <div className="doc-callout-header">
            <Sparkles size={20} className="doc-callout-icon" />
            <span className="doc-callout-title">{t('docs.proTip')}</span>
          </div>
          <div className="doc-callout-body">
            <p className="doc-callout-text">{t('docs.tokens.tip')}</p>
          </div>
        </div>

        <h2>{t('docs.tokens.troubleshoot.title')}</h2>

        <h3>{t('docs.tokens.authFailed.title')}</h3>
        <ul>
          <li>{t('docs.tokens.authFailed.item1')}</li>
          <li>{t('docs.tokens.authFailed.item2')}</li>
          <li>{t('docs.tokens.authFailed.item3')}</li>
          <li>{t('docs.tokens.authFailed.item4')}</li>
        </ul>

        <h3>{t('docs.tokens.rateError.title')}</h3>
        <ul>
          <li>{t('docs.tokens.rateError.item1')}</li>
          <li>{t('docs.tokens.rateError.item2')}</li>
          <li>{t('docs.tokens.rateError.item3')}</li>
        </ul>
      </div>

      <div className="doc-page-nav">
        <a href="/docs/registries" className="doc-page-nav-prev">
          <span className="doc-page-nav-label">{t('docs.prev')}</span>
          <span className="doc-page-nav-title">← {t('docs.registries.title')}</span>
        </a>
        <a href="/docs/api-reference" className="doc-page-nav-next">
          <span className="doc-page-nav-label">{t('docs.next')}</span>
          <span className="doc-page-nav-title">{t('docs.apiRef.title')} →</span>
        </a>
      </div>
    </div>
  )
}