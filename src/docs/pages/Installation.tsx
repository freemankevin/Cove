import { useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import '../components/DocPage.css'
import CodeBlock from '../components/CodeBlock'

export default function Installation() {
  const { t, language } = useLanguage()
  
  useEffect(() => {
    document.title = language === 'zh' ? '安装 - Cove 文档' : 'Installation - Cove Documentation'
  }, [language])

  return (
    <div className="doc-page">
      <div className="doc-page-header">
        <div className="doc-page-breadcrumb">
          <a href="/docs">Docs</a>
          <span className="doc-page-breadcrumb-separator">/</span>
          <span>{t('docs.section.gettingStarted')}</span>
        </div>
        <h1 className="doc-page-title">{t('docs.installation.title')}</h1>
        <p className="doc-page-description">{t('docs.installation.heroDesc')}</p>
      </div>

      <div className="doc-content">
        <h2>{t('docs.installation.compose.title')}</h2>
        <p>{t('docs.installation.compose.desc')}</p>

        <CodeBlock
          title="docker-compose.yml"
          language="YAML"
          code={`version: '3.8'

services:
  cove:
    image: cove:latest
    container_name: cove
    ports:
      - "8080:8080"
    volumes:
      - ./data:/app/data
      - ./exports:/app/exports
    environment:
      - SECRET_KEY=your-secret-key-here
      - ADMIN_PASSWORD=your-admin-password
      - EXPORT_PATH=/app/exports
    restart: unless-stopped`}
        />

        <p>{language === 'zh' ? '保存文件并运行：' : 'Save the file and run:'}</p>

        <CodeBlock
          title="Terminal"
          language="Bash"
          code={`docker-compose up -d`}
        />

        <h2>{t('docs.installation.env.title')}</h2>
        <p>{t('docs.installation.env.desc')}</p>

        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>{t('docs.installation.envTable.variable')}</th>
                <th>{t('docs.installation.envTable.description')}</th>
                <th>{t('docs.installation.envTable.required')}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="doc-inline-code">SECRET_KEY</code></td>
                <td>{t('docs.installation.env.secretKey')}</td>
                <td>{t('docs.installation.env.yes')}</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">ADMIN_PASSWORD</code></td>
                <td>{t('docs.installation.env.adminPassword')}</td>
                <td>{t('docs.installation.env.yes')}</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">EXPORT_PATH</code></td>
                <td>{t('docs.installation.env.exportPath')}</td>
                <td>{t('docs.installation.env.no')}</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">PORT</code></td>
                <td>{t('docs.installation.env.port')}</td>
                <td>{t('docs.installation.env.noPort')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>{t('docs.installation.dir.title')}</h2>
        <p>{t('docs.installation.dir.desc')}</p>

        <div className="doc-file-tree">
          <div className="doc-file-tree-line">
            <span className="doc-file-tree-dir">/app</span>
          </div>
          <div className="doc-file-tree-line">
            <span>├── </span>
            <span className="doc-file-tree-dir">data/</span>
            <span className="doc-file-tree-comment">{t('docs.installation.dir.comment')}</span>
          </div>
          <div className="doc-file-tree-line">
            <span>│   └── </span>
            <span className="doc-file-tree-file">cove.db</span>
            <span className="doc-file-tree-comment">{t('docs.installation.dir.comment2')}</span>
          </div>
          <div className="doc-file-tree-line">
            <span>├── </span>
            <span className="doc-file-tree-dir">exports/</span>
            <span className="doc-file-tree-comment">{t('docs.installation.dir.comment3')}</span>
          </div>
          <div className="doc-file-tree-line">
            <span>│   └── </span>
            <span className="doc-file-tree-file">nginx_latest_linux-amd64.tar</span>
          </div>
          <div className="doc-file-tree-line">
            <span>└── </span>
            <span className="doc-file-tree-dir">logs/</span>
            <span className="doc-file-tree-comment">{t('docs.installation.dir.comment4')}</span>
          </div>
        </div>

        <div className="doc-callout doc-callout-tip">
          <div className="doc-callout-header">
            <Sparkles size={20} className="doc-callout-icon" />
            <span className="doc-callout-title">{t('docs.proTip')}</span>
          </div>
          <div className="doc-callout-body">
            <p className="doc-callout-text">{t('docs.installation.tip')}</p>
          </div>
        </div>

        <h2>{t('docs.installation.run.title')}</h2>
        <p>{t('docs.installation.run.desc')}</p>

        <CodeBlock
          title="Terminal"
          language="Bash"
          code={`docker run -d \\
  --name cove \\
  -p 8080:8080 \\
  -v $(pwd)/data:/app/data \\
  -v $(pwd)/exports:/app/exports \\
  -e SECRET_KEY=your-secret-key \\
  -e ADMIN_PASSWORD=your-password \\
  cove:latest`}
        />

        <h2>{t('docs.installation.access.title')}</h2>
        <p>{t('docs.installation.access.desc')}</p>

        <CodeBlock
          title="URL"
          language="Text"
          code={`http://localhost:8080`}
        />

        <p>{t('docs.installation.access.login')}</p>
      </div>

      <div className="doc-page-nav">
        <a href="/docs/quick-start" className="doc-page-nav-prev">
          <span className="doc-page-nav-label">{t('docs.prev')}</span>
          <span className="doc-page-nav-title">← {t('docs.quickStart.title')}</span>
        </a>
        <a href="/docs/image-management" className="doc-page-nav-next">
          <span className="doc-page-nav-label">{t('docs.next')}</span>
          <span className="doc-page-nav-title">{t('docs.imageManagement.title')} →</span>
        </a>
      </div>
    </div>
  )
}