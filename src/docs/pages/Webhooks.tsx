import { useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import CodeBlock from '../components/CodeBlock'
import '../components/DocPage.css'

export default function Webhooks() {
  const { t, language } = useLanguage()
  
  useEffect(() => {
    document.title = language === 'zh' ? 'Webhooks - Cove 文档' : 'Webhooks - Cove Documentation'
  }, [language])

  return (
    <div className="doc-page">
      <div className="doc-page-header">
        <div className="doc-page-breadcrumb">
          <a href="/docs">Docs</a>
          <span className="doc-page-breadcrumb-separator">/</span>
          <span>{t('docs.section.coreFeatures')}</span>
        </div>
        <h1 className="doc-page-title">{t('docs.webhooks.title')}</h1>
        <p className="doc-page-description">{t('docs.webhooks.heroDesc')}</p>
      </div>

      <div className="doc-content">
        <h2>{t('docs.webhooks.config.title')}</h2>
        <p>{t('docs.webhooks.config.desc')}</p>

        <ol className="doc-ordered-steps">
          <li>
            <h3>{t('docs.webhooks.step1')}</h3>
            <p>{t('docs.webhooks.step1Desc')}</p>
          </li>
          <li>
            <h3>{t('docs.webhooks.step2')}</h3>
            <p>{t('docs.webhooks.step2Desc')}</p>
          </li>
          <li>
            <h3>{t('docs.webhooks.step3')}</h3>
            <p>{t('docs.webhooks.step3Desc')}</p>
          </li>
          <li>
            <h3>{t('docs.webhooks.step4')}</h3>
            <p>{t('docs.webhooks.step4Desc')}</p>
          </li>
        </ol>

        <h2>{t('docs.webhooks.payload.title')}</h2>
        <p>{t('docs.webhooks.payload.desc')}</p>

        <CodeBlock
          title={language === 'zh' ? 'Webhook 数据' : 'Webhook Payload'}
          language="JSON"
          code={`{
  "event": "image.pulled",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "id": 123,
    "name": "nginx",
    "tag": "latest",
    "full_name": "docker.io/library/nginx:latest",
    "platform": "linux/amd64",
    "status": "success",
    "export_path": "/app/exports/nginx_latest_linux-amd64.tar",
    "duration_seconds": 45
  }
}`}
        />

        <h2>{t('docs.webhooks.events.title')}</h2>
        <p>{t('docs.webhooks.events.desc')}</p>

        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>{t('docs.webhooks.eventsTable.event')}</th>
                <th>{t('docs.webhooks.eventsTable.description')}</th>
                <th>{t('docs.webhooks.eventsTable.when')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="doc-inline-code">image.pulled</code></td>
                <td>{t('docs.webhooks.events.pulled')}</td>
                <td>{t('docs.webhooks.events.pulledWhen')}</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">image.failed</code></td>
                <td>{t('docs.webhooks.events.failed')}</td>
                <td>{t('docs.webhooks.events.failedWhen')}</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">image.exported</code></td>
                <td>{t('docs.webhooks.events.exported')}</td>
                <td>{t('docs.webhooks.events.exportedWhen')}</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">image.retry</code></td>
                <td>{t('docs.webhooks.events.retry')}</td>
                <td>{t('docs.webhooks.events.retryWhen')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>{t('docs.webhooks.slack.title')}</h2>
        <p>{t('docs.webhooks.slack.desc')}</p>

        <CodeBlock
          title={language === 'zh' ? 'Slack Webhook 处理' : 'Slack Webhook Handler'}
          language="Node.js"
          code={`app.post('/webhook/cove', (req, res) => {
  const { event, data } = req.body;
  
  const message = {
    text: event === 'image.pulled' 
      ? \`✅ Successfully pulled \${data.full_name}\`
      : \`❌ Failed to pull \${data.full_name}\`
  };
  
  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  });
  
  res.status(200).send('OK');
});`}
        />

        <div className="doc-callout doc-callout-tip">
          <div className="doc-callout-header">
            <Sparkles size={20} className="doc-callout-icon" />
            <span className="doc-callout-title">{t('docs.proTip')}</span>
          </div>
          <div className="doc-callout-body">
            <p className="doc-callout-text">{t('docs.webhooks.tip')}</p>
          </div>
        </div>

        <h2>{t('docs.webhooks.security.title')}</h2>
        <ul>
          <li>{t('docs.webhooks.security.item1')}</li>
          <li>{t('docs.webhooks.security.item2')}</li>
          <li>{t('docs.webhooks.security.item3')}</li>
          <li>{t('docs.webhooks.security.item4')}</li>
        </ul>
      </div>

      <div className="doc-page-nav">
        <a href="/docs/auto-export" className="doc-page-nav-prev">
          <span className="doc-page-nav-label">{t('docs.prev')}</span>
          <span className="doc-page-nav-title">← {t('docs.autoExport.title')}</span>
        </a>
        <a href="/docs/settings" className="doc-page-nav-next">
          <span className="doc-page-nav-label">{t('docs.next')}</span>
          <span className="doc-page-nav-title">{t('docs.settings.title')} →</span>
        </a>
      </div>
    </div>
  )
}