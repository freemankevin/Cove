export interface SearchItem {
  title: string
  path: string
  content: string
  headings: string[]
}

export const searchData: SearchItem[] = [
  {
    title: 'Introduction',
    path: '/docs/introduction',
    headings: ['Why Cove?', 'Architecture Overview'],
    content: `Welcome to Cove. A modern container image management platform for pulling, storing, and distributing Docker images across multiple platforms with ease.
Why Cove? Cove simplifies the process of managing container images from multiple registries. Whether you are working with Docker Hub, GitHub Container Registry, Quay, or Google Container Registry, Cove provides a unified interface to handle all your image operations.
Multi-Registry Support. Pull from Docker Hub, GHCR, Quay, GCR, and more with unified management.
Multi-Platform Images. Handle amd64 and arm64 architectures automatically for seamless deployment.
Auto Export. Configure automatic export paths to streamline your CI/CD pipeline.
Webhook Notifications. Get real-time notifications when images are pulled or failures occur.
Architecture Overview. Cove uses a pull-based architecture that ensures images are always verified before export. The system works by connecting to your configured registries, pulling the requested images, and optionally exporting them to your specified directory.
Pro Tip. Cove uses a pull-based architecture, ensuring images are always verified before export. This provides an additional layer of security and validation.`
  },
  {
    title: 'Quick Start',
    path: '/docs/quick-start',
    headings: ['Access the Dashboard', 'Add Your First Image', 'Monitor Progress', 'Export Images', 'Common Image Formats'],
    content: `Quick Start. Get up and running with Cove in under 5 minutes. Follow these simple steps to start managing your container images.
Step 1. Access the Dashboard. After logging in, you will see the Overview page displaying real-time statistics about your image operations.
Step 2. Add Your First Image. Navigate to the Images page and click the Add button. Enter the full image name like nginx:latest. Select target platforms amd64, arm64, or both. Enable auto-export if needed. Click Add to start pulling.
Step 3. Monitor Progress. Image status updates in real-time. You can track the progress of your pulls and see when they complete. Status types: Pending, Pulling, Success, Failed.
Step 4. Export Images. Once successfully pulled, click the Download button to export the image as a tar file. The file will be saved to your configured export path.
Pro Tip. Use the batch mode to add multiple images at once — perfect for initial setup! Duplicates are automatically skipped.
Common Image Formats. Docker Hub: nginx:latest or docker.io/library/nginx:latest. GitHub Container Registry: ghcr.io/owner/repo:v1.0. Quay.io: quay.io/org/image:tag. Alibaba ACR: registry.cn-hangzhou.aliyuncs.com/myapp:v1. AWS ECR Public: public.ecr.aws/nginx/nginx:latest. Google GAR: us-docker.pkg.dev/project/repo/image:tag`
  },
  {
    title: 'Installation',
    path: '/docs/installation',
    headings: ['Docker Compose', 'Environment Variables', 'Directory Structure', 'Docker Run', 'Accessing the Application'],
    content: `Installation. Deploy Cove using Docker for easy setup and management.
Docker Compose Recommended. The easiest way to get started with Cove is using Docker Compose. This method handles all the configuration and dependencies automatically.
Environment Variables. SECRET_KEY: Secret key for session encryption Required. ADMIN_PASSWORD: Initial admin password Required. EXPORT_PATH: Default export directory Optional default /app/exports. PORT: Server port Optional default 8080.
Directory Structure. /app/data/ Database and configuration. /app/exports/ Exported image tar files. /app/logs/ Application logs.
Docker Run Alternative. If you prefer not to use Docker Compose, you can run Cove directly with docker run command.
Accessing the Application. Once running, access the Cove web interface at http://localhost:8080. Log in with the admin credentials you configured.`
  },
  {
    title: 'Image Management',
    path: '/docs/image-management',
    headings: ['Adding Images', 'Supported Formats', 'Batch Mode', 'Status Types', 'Platform Selection', 'Managing Images', 'Auto-Export'],
    content: `Image Management. Learn how to add, monitor, and manage container images across multiple registries and platforms.
Adding Images. Cove supports multiple image formats from various container registries. You can add images individually or in batch mode.
Supported Formats. Docker Hub nginx:latest Optional auth. GitHub Container Registry ghcr.io/owner/repo:v1.0 Recommended auth. Quay.io quay.io/org/image:tag For private. Alibaba ACR registry.cn-hangzhou.aliyuncs.com. AWS ECR Public public.ecr.aws. AWS ECR Private *.amazonaws.com Required auth. Google Artifact Registry *.pkg.dev.
Batch Mode. Add multiple images at once by toggling batch mode. Enter one image per line. Duplicates are automatically skipped with a summary of added vs skipped items.
Status Types. Pending: Queued for processing. Pulling: Currently downloading. Success: Successfully pulled. Failed: Pull failed.
Platform Selection. linux/amd64 Standard x86_64 architecture. linux/arm64 ARM64 architecture for Apple Silicon AWS Graviton.
Managing Images. Pull: Manually trigger a pull. Export: Download the image as a tar file. Delete: Remove the image from Cove. View Logs: Check detailed pull logs.
Auto-Export. Enable auto-export when adding an image to automatically export it after a successful pull.`
  },
  {
    title: 'Multi-Platform Support',
    path: '/docs/multi-platform',
    headings: ['Supported Platforms', 'How It Works', 'Platform Detection', 'File Naming Convention', 'Use Cases'],
    content: `Multi-Platform Support. Handle multi-architecture container images automatically. Cove makes it easy to work with images for different CPU architectures.
Supported Platforms. linux/amd64 x86_64 architecture for standard servers VMs and cloud instances. linux/arm64 ARM64 for Apple Silicon M1/M2 AWS Graviton Raspberry Pi.
How It Works. Step 1: Select Platforms. Choose target platforms when adding an image. Step 2: Registry Query. Cove queries the registry for available platforms. Step 3: Parallel Pulls. Each platform creates a separate pull task. Step 4: Individual Export. Each platform is exported as a separate tar file.
Platform Detection. Cove can check which platforms are available for an image before pulling using the API check-platforms endpoint.
File Naming Convention. Format: {name}_{tag}_{platform}.tar. Examples: nginx_latest_linux-amd64.tar, nginx_latest_linux-arm64.tar.
Use Cases. Development Teams: Support both Intel and Apple Silicon Macs. Hybrid Infrastructure: Mix of x86_64 and ARM servers. Cost Optimization: Use cheaper ARM instances. Edge Deployments: Raspberry Pi and ARM edge devices.`
  },
  {
    title: 'Auto Export',
    path: '/docs/auto-export',
    headings: ['How It Works', 'Enable Auto Export', 'Configure Export Path', 'Automatic Export', 'File Naming Convention', 'Export Status', 'Volume Mounting'],
    content: `Auto Export. Automatically export pulled images to a specified directory. Streamline your CI/CD pipeline with hands-free exports.
How It Works. Auto Export automatically saves successfully pulled images to your configured export directory, eliminating the need for manual downloads.
Enable Auto Export. Toggle Auto Export when adding an image. This can also be set as the default in Settings.
Configure Export Path. Set your default export path in Settings. Make sure Cove has write permissions to this directory.
Automatic Export. Images export automatically after successful pull. Check the Export Status column for confirmation.
File Naming Convention. {name}_{tag}_{platform}.tar. Registry prefixes like ghcr.io or quay.io are sanitized for filesystem compatibility.
Export Status. No export configured. Pending: Waiting for pull to complete. Exported: Successfully exported to path. Failed: Export failed check permissions.
Volume Mounting. When using Docker, mount your export directory as a volume for persistence.`
  },
  {
    title: 'Webhook Notifications',
    path: '/docs/webhooks',
    headings: ['Configuration', 'Payload Format', 'Event Types', 'Slack Integration', 'Security Considerations'],
    content: `Webhook Notifications. Receive real-time notifications for image events. Integrate Cove with your CI/CD pipeline or notification systems.
Configuration. Set up webhooks to receive HTTP POST requests when specific events occur. Navigate to Settings → Webhook. Enter the HTTPS endpoint. Test connection. Save configuration.
Payload Format. JSON structure with event type, timestamp, and data including image name, tag, platform, status, export path, and duration.
Event Types. image.pulled: Successfully pulled image. image.failed: Pull attempt failed. image.exported: Image exported to file. image.retry: Retry initiated.
Slack Integration. Integrate with Slack for team notifications. Post webhook events to Slack webhook URL with formatted messages.
Security Considerations. Use HTTPS endpoints only. Validate the payload in your webhook handler. Implement retry logic for failed deliveries. Consider using webhook signatures.`
  },
  {
    title: 'Settings',
    path: '/docs/settings',
    headings: ['General Settings', 'Export Configuration', 'Platform Defaults', 'Retry Configuration', 'Environment Variables'],
    content: `Settings. Configure Cove to match your workflow. Customize export paths, default platforms, and notification preferences.
General Settings. Export Path: Directory for exported images default /app/exports. Default Platform: Pre-selected platforms for new images default amd64 arm64. Max Retries: Retry attempts for failed pulls default 3. Auto Export: Auto-export on success by default default Disabled.
Export Configuration. The export path is where all exported images are saved. Make sure the directory exists and is writable. There is sufficient disk space. Consider mounting to a shared location.
Platform Defaults. linux/amd64 only. linux/arm64 only. Both platforms.
Retry Configuration. Max Retries: Number of retry attempts 0-10. Retry Delay: Seconds between retry attempts. Exponential Backoff: Increase delay between retries.
Environment Variables. EXPORT_PATH: Default export directory. DEFAULT_PLATFORMS: Comma-separated platform list. MAX_RETRIES: Maximum retry attempts.`
  },
  {
    title: 'Registry Support',
    path: '/docs/registries',
    headings: ['Supported Registries', 'Registry Detection', 'Authentication Requirements', 'Registry-Specific Notes', 'Configuring Access Tokens'],
    content: `Registry Support. Pull from multiple container registries with unified management. Cove supports Docker Hub, GHCR, Quay, Alibaba ACR, AWS ECR, and Google GAR.
Supported Registries. Docker Hub: Largest collection of public container images. GitHub Container Registry: ghcr.io integrated with GitHub Actions. Quay.io: Red Hat's registry with security scanning. Alibaba Container Registry: cr.aliyun.com fast access in Asia-Pacific. AWS ECR: Elastic Container Registry for AWS deployments. Google Artifact Registry: Unified artifact management.
Registry Detection. Automatically detects registry based on image name format: nginx:latest → docker.io. ghcr.io/owner/repo → GitHub. quay.io/org/image → Quay. registry.cn-*.aliyuncs.com → Alibaba. public.ecr.aws → AWS ECR Public. *.pkg.dev → Google GAR.
Authentication Requirements. Docker Hub: No auth for public, username + token for private. GitHub GHCR: Token recommended. Quay.io: No auth for public, token for private. Alibaba ACR: Depends on repo. AWS ECR: AWS credentials for private.
Registry-Specific Notes. Docker Hub official images need no prefix. GitHub GHCR format: ghcr.io/OWNER/IMAGE:TAG. Quay.io built-in security scanning. Alibaba multiple region endpoints. AWS ECR public and private registries. Google GAR unified with Google Cloud services.`
  },
  {
    title: 'Access Tokens',
    path: '/docs/tokens',
    headings: ['Supported Registries', 'Adding Tokens', 'Registry-Specific Configuration', 'Rate Limits', 'Best Practices', 'Troubleshooting'],
    content: `Access Tokens. Configure authentication for multiple container registries. Securely store credentials for Docker Hub, GHCR, Quay, Alibaba ACR, AWS ECR, and Google GAR.
Supported Registries. Docker Hub: Username + access token. GitHub Container Registry: Personal access token with read:packages scope. Quay.io: Robot account token or OAuth token. Alibaba ACR: Username + password. AWS ECR: Access Key ID + Secret Access Key + Region. Google GAR: Service account JSON key.
Adding Tokens. Navigate to Settings → Tokens. Select Registry. Enter Credentials. Save Configuration.
Registry-Specific Configuration. Docker Hub: Create token at hub.docker.com/settings/security. GitHub: Create token at github.com/settings/tokens with read:packages scope. Quay.io: Create robot account. Alibaba: Use Alibaba Cloud account. AWS ECR: IAM user with ecr:GetAuthorizationToken. Google GAR: Service account with Artifact Registry Reader role.
Rate Limits. Docker Hub: 100 pulls/6hrs anonymous, 200 authenticated. GitHub: 5000 requests/hr authenticated. Quay.io: Unlimited public, based on plan private.
Best Practices. Use dedicated tokens with minimal permissions. Read-only access only. Regular rotation every 90 days. Monitor usage in audit logs. Store securely.
Troubleshooting. Authentication Failed: Verify token not expired, check permissions, ensure correct username format. Rate Limit Errors: Use authenticated pulls, upgrade plan, space out pulls.`
  },
  {
    title: 'API Reference',
    path: '/docs/api-reference',
    headings: ['Authentication', 'Images Endpoints', 'Create Image', 'Stats Endpoints', 'Settings Endpoints', 'Platform Check', 'Error Responses', 'Status Codes'],
    content: `API Reference. Programmatic access via REST API. Integrate Cove into your automation workflows and CI/CD pipelines.
Authentication. All API requests require authentication via session cookie. Log in through the web interface to obtain a valid session.
API Base URL. All API endpoints are prefixed with /api. Example: GET /api/images.
Images Endpoints. GET /api/images: List all images. POST /api/images: Create image task. POST /api/images/:id/pull: Trigger pull. POST /api/images/:id/export: Export image. DELETE /api/images/:id: Delete image.
Create Image. POST /api/images with JSON body containing name, tag, platform, is_auto_export.
Stats Endpoints. GET /api/stats: Get statistics including total_images, pending, pulling, success, failed, exported.
Settings Endpoints. GET /api/settings: Get settings. PUT /api/settings: Update settings.
Platform Check. GET /api/images/check-platforms?name=nginx&tag=latest returns available platforms.
Error Responses. JSON format with error, message, and code fields.
Status Codes. 200 OK: Request successful. 201 Created: Resource created. 400 Bad Request: Invalid parameters. 401 Unauthorized: Authentication required. 404 Not Found: Resource not found. 500 Internal Error: Server error.`
  }
]

// Fuzzy search function
export function searchDocs(query: string): SearchItem[] {
  if (!query.trim()) return []
  
  const searchTerm = query.toLowerCase().trim()
  const terms = searchTerm.split(/\s+/)
  
  return searchData
    .map(item => {
      let score = 0
      const titleLower = item.title.toLowerCase()
      const contentLower = item.content.toLowerCase()
      const headingsLower = item.headings.map(h => h.toLowerCase())
      
      // Title match (highest weight)
      if (titleLower.includes(searchTerm)) {
        score += 100
      }
      
      // Individual word matches in title
      terms.forEach(term => {
        if (titleLower.includes(term)) {
          score += 20
        }
      })
      
      // Heading matches
      headingsLower.forEach(heading => {
        if (heading.includes(searchTerm)) {
          score += 50
        }
        terms.forEach(term => {
          if (heading.includes(term)) {
            score += 10
          }
        })
      })
      
      // Content matches
      if (contentLower.includes(searchTerm)) {
        score += 30
      }
      
      // Individual word matches in content
      terms.forEach(term => {
        const matches = (contentLower.match(new RegExp(term, 'g')) || []).length
        score += matches * 2
      })
      
      return { item, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item)
}

// Get search result excerpt
export function getExcerpt(item: SearchItem, query: string, maxLength: number = 120): string {
  const content = item.content.toLowerCase()
  const searchTerm = query.toLowerCase().trim()
  const index = content.indexOf(searchTerm)
  
  if (index === -1) {
    // Try to find any word from the query
    const terms = searchTerm.split(/\s+/)
    for (const term of terms) {
      const idx = content.indexOf(term)
      if (idx !== -1) {
        const start = Math.max(0, idx - 40)
        const end = Math.min(item.content.length, idx + maxLength)
        return '...' + item.content.slice(start, end) + '...'
      }
    }
    // Return first part of content
    return item.content.slice(0, maxLength) + '...'
  }
  
  const start = Math.max(0, index - 40)
  const end = Math.min(item.content.length, index + maxLength)
  return '...' + item.content.slice(start, end) + '...'
}
