import { useEffect } from 'react'
import { Globe, Container, Sparkles, Lock } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import '../components/DocPage.css'

export default function Registries() {
  const { t, language } = useLanguage()
  
  useEffect(() => {
    document.title = language === 'zh' ? '镜像仓库 - Cove 文档' : 'Registries - Cove Documentation'
  }, [language])

  return (
    <div className="doc-page">
      <div className="doc-page-header">
        <div className="doc-page-breadcrumb">
          <a href="/docs">Docs</a>
          <span className="doc-page-breadcrumb-separator">/</span>
          <span>{t('docs.section.configuration')}</span>
        </div>
        <h1 className="doc-page-title">{language === 'zh' ? '镜像仓库支持' : 'Registry Support'}</h1>
        <p className="doc-page-description">{t('docs.registries.heroDesc')}</p>
      </div>

      <div className="doc-content">
        <h2>{t('docs.registries.support.title')}</h2>
        <p>{t('docs.registries.support.desc')}</p>

        <div className="doc-feature-grid">
          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Container size={22} />
            </div>
            <h3 className="doc-feature-title">Docker Hub</h3>
            <p className="doc-feature-description">{t('docs.registries.dockerhub')}</p>
          </div>

          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Globe size={22} />
            </div>
            <h3 className="doc-feature-title">{language === 'zh' ? 'GitHub 容器仓库' : 'GitHub Container Registry'}</h3>
            <p className="doc-feature-description">{t('docs.registries.ghcr')}</p>
          </div>

          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Container size={22} />
            </div>
            <h3 className="doc-feature-title">Quay.io</h3>
            <p className="doc-feature-description">{t('docs.registries.quay')}</p>
          </div>

          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Globe size={22} />
            </div>
            <h3 className="doc-feature-title">{language === 'zh' ? '阿里云容器仓库' : 'Alibaba Container Registry'}</h3>
            <p className="doc-feature-description">{t('docs.registries.acr')}</p>
          </div>

          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Lock size={22} />
            </div>
            <h3 className="doc-feature-title">AWS ECR</h3>
            <p className="doc-feature-description">{t('docs.registries.ecr')}</p>
          </div>

          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Globe size={22} />
            </div>
            <h3 className="doc-feature-title">{language === 'zh' ? 'Google Artifact Registry' : 'Google Artifact Registry'}</h3>
            <p className="doc-feature-description">{t('docs.registries.gar')}</p>
          </div>
        </div>

        <h2>{t('docs.registries.detection.title')}</h2>
        <p>{t('docs.registries.detection.desc')}</p>

        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>{t('docs.registries.table.image')}</th>
                <th>{t('docs.registries.table.registry')}</th>
                <th>{t('docs.registries.table.notes')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="doc-inline-code">nginx:latest</code></td>
                <td>docker.io</td>
                <td>{t('docs.registries.implicit')}</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">docker.io/library/nginx:latest</code></td>
                <td>docker.io</td>
                <td>{t('docs.registries.explicit')}</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">ghcr.io/myorg/myapp:tag</code></td>
                <td>ghcr.io</td>
                <td>{language === 'zh' ? 'GitHub 容器仓库' : 'GitHub Container Registry'}</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">quay.io/org/image:tag</code></td>
                <td>quay.io</td>
                <td>{language === 'zh' ? 'Red Hat Quay' : 'Red Hat Quay'}</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">registry.cn-hangzhou.aliyuncs.com/...)</code></td>
                <td>{language === 'zh' ? '阿里云 ACR' : 'Alibaba ACR'}</td>
                <td>{t('docs.registries.region')}</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">public.ecr.aws/...</code></td>
                <td>{language === 'zh' ? 'AWS ECR 公共' : 'AWS ECR Public'}</td>
                <td>{t('docs.registries.public')}</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">*.amazonaws.com/...</code></td>
                <td>{language === 'zh' ? 'AWS ECR 私有' : 'AWS ECR Private'}</td>
                <td>{t('docs.registries.private')}</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">*.pkg.dev/...</code></td>
                <td>{language === 'zh' ? 'Google GAR' : 'Google GAR'}</td>
                <td>{t('docs.registries.project')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>{t('docs.registries.auth.title')}</h2>
        <p>{t('docs.registries.auth.desc')}</p>

        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>{t('docs.registries.authTable.registry')}</th>
                <th>{t('docs.registries.authTable.public')}</th>
                <th>{t('docs.registries.authTable.private')}</th>
                <th>{t('docs.registries.authTable.rate')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Docker Hub</td>
                <td>{t('docs.registries.auth.noAuth')}</td>
                <td>{t('docs.registries.auth.userPass')}</td>
                <td>100-200 {language === 'zh' ? '次/6小时' : 'pulls/6hrs'}</td>
              </tr>
              <tr>
                <td>{language === 'zh' ? 'GitHub GHCR' : 'GitHub GHCR'}</td>
                <td>{t('docs.registries.auth.tokenRec')}</td>
                <td>{t('docs.registries.auth.tokenReq')}</td>
                <td>5000 {language === 'zh' ? '请求/小时' : 'requests/hr'}</td>
              </tr>
              <tr>
                <td>Quay.io</td>
                <td>{t('docs.registries.auth.noAuth')}</td>
                <td>{t('docs.registries.auth.tokenReq')}</td>
                <td>{t('docs.registries.auth.basedPlan')}</td>
              </tr>
              <tr>
                <td>{language === 'zh' ? '阿里云 ACR' : 'Alibaba ACR'}</td>
                <td>{t('docs.registries.auth.depends')}</td>
                <td>{t('docs.registries.auth.userPass')}</td>
                <td>{t('docs.registries.auth.basedAccount')}</td>
              </tr>
              <tr>
                <td>{language === 'zh' ? 'AWS ECR 公共' : 'AWS ECR Public'}</td>
                <td>{t('docs.registries.auth.noAuth')}</td>
                <td>{t('docs.registries.auth.awsCred')}</td>
                <td>{t('docs.registries.auth.unlimited')}</td>
              </tr>
              <tr>
                <td>{language === 'zh' ? 'AWS ECR 私有' : 'AWS ECR Private'}</td>
                <td>{t('docs.registries.auth.na')}</td>
                <td>{t('docs.registries.auth.awsCred')}</td>
                <td>{t('docs.registries.auth.basedUsage')}</td>
              </tr>
              <tr>
                <td>{language === 'zh' ? 'Google GAR' : 'Google GAR'}</td>
                <td>{t('docs.registries.auth.depends')}</td>
                <td>{t('docs.registries.auth.sa')}</td>
                <td>{t('docs.registries.auth.basedUsage')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>{t('docs.registries.notes.title')}</h2>

        <h3>Docker Hub</h3>
        <ul>
          <li>{t('docs.registries.dockerhubNotes.item1')}</li>
          <li>{t('docs.registries.dockerhubNotes.item2')}</li>
          <li>{t('docs.registries.dockerhubNotes.item3')}</li>
          <li>{t('docs.registries.dockerhubNotes.item4')}</li>
        </ul>

        <h3>{language === 'zh' ? 'GitHub 容器仓库' : 'GitHub Container Registry'}</h3>
        <ul>
          <li>{t('docs.registries.ghcrNotes.item1')}</li>
          <li>{t('docs.registries.ghcrNotes.item2')}</li>
          <li>{t('docs.registries.ghcrNotes.item3')}</li>
          <li>{t('docs.registries.ghcrNotes.item4')}</li>
        </ul>

        <h3>Quay.io</h3>
        <ul>
          <li>{t('docs.registries.quayNotes.item1')}</li>
          <li>{t('docs.registries.quayNotes.item2')}</li>
          <li>{t('docs.registries.quayNotes.item3')}</li>
        </ul>

        <h3>{language === 'zh' ? '阿里云容器仓库' : 'Alibaba Container Registry'}</h3>
        <ul>
          <li>{t('docs.registries.acrNotes.item1')}</li>
          <li>{t('docs.registries.acrNotes.item2')}</li>
          <li>{t('docs.registries.acrNotes.item3')}</li>
        </ul>

        <h3>AWS ECR</h3>
        <ul>
          <li>{t('docs.registries.ecrNotes.item1')}</li>
          <li>{t('docs.registries.ecrNotes.item2')}</li>
          <li>{t('docs.registries.ecrNotes.item3')}</li>
          <li>{t('docs.registries.ecrNotes.item4')}</li>
        </ul>

        <h3>{language === 'zh' ? 'Google Artifact Registry' : 'Google Artifact Registry'}</h3>
        <ul>
          <li>{t('docs.registries.garNotes.item1')}</li>
          <li>{t('docs.registries.garNotes.item2')}</li>
          <li>{t('docs.registries.garNotes.item3')}</li>
        </ul>

        <div className="doc-callout doc-callout-warning">
          <div className="doc-callout-header">
            <Container size={20} className="doc-callout-icon" />
            <span className="doc-callout-title">{t('docs.registries.rateLimit.title')}</span>
          </div>
          <div className="doc-callout-body">
            <p className="doc-callout-text">{t('docs.registries.rateLimit.desc')}</p>
          </div>
        </div>

        <h2>{t('docs.registries.tokens.title')}</h2>
        <p>{t('docs.registries.tokens.desc')}</p>

        <ul>
          <li><strong>Docker Hub</strong> - {t('docs.registries.tokens.dockerhub')}</li>
          <li><strong>{language === 'zh' ? 'GitHub GHCR' : 'GitHub GHCR'}</strong> - {t('docs.registries.tokens.ghcr')}</li>
          <li><strong>Quay.io</strong> - {t('docs.registries.tokens.quay')}</li>
          <li><strong>{language === 'zh' ? '阿里云 ACR' : 'Alibaba ACR'}</strong> - {t('docs.registries.tokens.acr')}</li>
          <li><strong>AWS ECR</strong> - {t('docs.registries.tokens.ecr')}</li>
          <li><strong>{language === 'zh' ? 'Google GAR' : 'Google GAR'}</strong> - {t('docs.registries.tokens.gar')}</li>
        </ul>

        <div className="doc-callout doc-callout-tip">
          <div className="doc-callout-header">
            <Sparkles size={20} className="doc-callout-icon" />
            <span className="doc-callout-title">{t('docs.proTip')}</span>
          </div>
          <div className="doc-callout-body">
            <p className="doc-callout-text">{t('docs.registries.tip')}</p>
          </div>
        </div>
      </div>

      <div className="doc-page-nav">
        <a href="/docs/settings" className="doc-page-nav-prev">
          <span className="doc-page-nav-label">{t('docs.prev')}</span>
          <span className="doc-page-nav-title">← {t('docs.settings.title')}</span>
        </a>
        <a href="/docs/tokens" className="doc-page-nav-next">
          <span className="doc-page-nav-label">{t('docs.next')}</span>
          <span className="doc-page-nav-title">{language === 'zh' ? '访问令牌' : 'Access Tokens'} →</span>
        </a>
      </div>
    </div>
  )
}