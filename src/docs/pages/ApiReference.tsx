import { useEffect } from 'react'
import { Code, Sparkles } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import CodeBlock from '../components/CodeBlock'
import '../components/DocPage.css'

export default function ApiReference() {
  const { t, language } = useLanguage()
  
  useEffect(() => {
    document.title = language === 'zh' ? 'API 参考 - Cove 文档' : 'API Reference - Cove Documentation'
  }, [language])

  return (
    <div className="doc-page">
      <div className="doc-page-header">
        <div className="doc-page-breadcrumb">
          <a href="/docs">Docs</a>
          <span className="doc-page-breadcrumb-separator">/</span>
          <span>{t('docs.section.reference')}</span>
        </div>
        <h1 className="doc-page-title">{t('docs.apiRef.title')}</h1>
        <p className="doc-page-description">{t('docs.apiRef.heroDesc')}</p>
      </div>

      <div className="doc-content">
        <h2>{t('docs.apiRef.auth.title')}</h2>
        <p>{t('docs.apiRef.auth.desc')}</p>

        <div className="doc-callout doc-callout-info">
          <div className="doc-callout-header">
            <Code size={20} className="doc-callout-icon" />
            <span className="doc-callout-title">{language === 'zh' ? 'API 基础 URL' : 'API Base URL'}</span>
          </div>
          <div className="doc-callout-body">
            <p className="doc-callout-text">{t('docs.apiRef.baseUrl')}</p>
          </div>
        </div>

        <h2>{t('docs.apiRef.images.title')}</h2>

        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>{t('docs.apiRef.table.method')}</th>
                <th>{t('docs.apiRef.table.endpoint')}</th>
                <th>{t('docs.apiRef.table.description')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="doc-method doc-method-get">GET</span></td>
                <td><code className="doc-inline-code">/api/images</code></td>
                <td>{t('docs.apiRef.images.list')}</td>
              </tr>
              <tr>
                <td><span className="doc-method doc-method-post">POST</span></td>
                <td><code className="doc-inline-code">/api/images</code></td>
                <td>{t('docs.apiRef.images.create')}</td>
              </tr>
              <tr>
                <td><span className="doc-method doc-method-post">POST</span></td>
                <td><code className="doc-inline-code">/api/images/:id/pull</code></td>
                <td>{t('docs.apiRef.images.pull')}</td>
              </tr>
              <tr>
                <td><span className="doc-method doc-method-post">POST</span></td>
                <td><code className="doc-inline-code">/api/images/:id/export</code></td>
                <td>{t('docs.apiRef.images.export')}</td>
              </tr>
              <tr>
                <td><span className="doc-method doc-method-delete">DELETE</span></td>
                <td><code className="doc-inline-code">/api/images/:id</code></td>
                <td>{t('docs.apiRef.images.delete')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>{t('docs.apiRef.create.title')}</h3>
        <CodeBlock
          title={language === 'zh' ? '请求' : 'Request'}
          language="HTTP"
          code={`POST /api/images
Content-Type: application/json

{
  "name": "nginx",
  "tag": "latest",
  "platform": "linux/amd64",
  "is_auto_export": false
}`}
        />

        <CodeBlock
          title={language === 'zh' ? '响应' : 'Response'}
          language="JSON"
          code={`{
  "id": 123,
  "name": "nginx",
  "tag": "latest",
  "full_name": "docker.io/library/nginx:latest",
  "platform": "linux/amd64",
  "status": "pending",
  "created_at": "2024-01-15T10:30:00Z"
}`}
        />

        <h2>{t('docs.apiRef.stats.title')}</h2>

        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>{t('docs.apiRef.table.method')}</th>
                <th>{t('docs.apiRef.table.endpoint')}</th>
                <th>{t('docs.apiRef.table.description')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="doc-method doc-method-get">GET</span></td>
                <td><code className="doc-inline-code">/api/stats</code></td>
                <td>{t('docs.apiRef.stats.get')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CodeBlock
          title={language === 'zh' ? '响应' : 'Response'}
          language="JSON"
          code={`{
  "total_images": 42,
  "pending": 3,
  "pulling": 1,
  "success": 35,
  "failed": 3,
  "exported": 28
}`}
        />

        <h2>{t('docs.apiRef.settings.title')}</h2>

        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>{t('docs.apiRef.table.method')}</th>
                <th>{t('docs.apiRef.table.endpoint')}</th>
                <th>{t('docs.apiRef.table.description')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="doc-method doc-method-get">GET</span></td>
                <td><code className="doc-inline-code">/api/settings</code></td>
                <td>{t('docs.apiRef.settings.get')}</td>
              </tr>
              <tr>
                <td><span className="doc-method doc-method-put">PUT</span></td>
                <td><code className="doc-inline-code">/api/settings</code></td>
                <td>{t('docs.apiRef.settings.update')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>{t('docs.apiRef.platform.title')}</h2>
        <p>{t('docs.apiRef.platform.desc')}</p>

        <CodeBlock
          title={language === 'zh' ? '请求' : 'Request'}
          language="HTTP"
          code={`GET /api/images/check-platforms?name=nginx&tag=latest`}
        />

        <CodeBlock
          title={language === 'zh' ? '响应' : 'Response'}
          language="JSON"
          code={`{
  "platforms": ["linux/amd64", "linux/arm64"],
  "available": true
}`}
        />

        <h2>{t('docs.apiRef.errors.title')}</h2>
        <p>{t('docs.apiRef.errors.desc')}</p>

        <CodeBlock
          title={language === 'zh' ? '错误响应' : 'Error Response'}
          language="JSON"
          code={`{
  "error": "Invalid platform",
  "message": "Platform linux/arm64 is not available for this image",
  "code": "PLATFORM_NOT_AVAILABLE"
}`}
        />

        <h2>{t('docs.apiRef.codes.title')}</h2>
        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>{t('docs.apiRef.codesTable.code')}</th>
                <th>{t('docs.apiRef.codesTable.description')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="doc-inline-code">200 OK</code></td>
                <td>{t('docs.apiRef.codes.200')}</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">201 Created</code></td>
                <td>{t('docs.apiRef.codes.201')}</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">400 Bad Request</code></td>
                <td>{t('docs.apiRef.codes.400')}</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">401 Unauthorized</code></td>
                <td>{t('docs.apiRef.codes.401')}</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">404 Not Found</code></td>
                <td>{t('docs.apiRef.codes.404')}</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">500 Internal Error</code></td>
                <td>{t('docs.apiRef.codes.500')}</td>
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
            <p className="doc-callout-text">{t('docs.apiRef.tip')}</p>
          </div>
        </div>
      </div>

      <div className="doc-page-nav">
        <a href="/docs/tokens" className="doc-page-nav-prev">
          <span className="doc-page-nav-label">{t('docs.prev')}</span>
          <span className="doc-page-nav-title">← {language === 'zh' ? '访问令牌' : 'Access Tokens'}</span>
        </a>
        <div></div>
      </div>
    </div>
  )
}