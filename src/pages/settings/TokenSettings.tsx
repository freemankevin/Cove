import { Plus, X, Upload, FileText, CheckCircle2, XCircle, Loader2, Eye, EyeOff, ShieldCheck, ShieldAlert, Info, ChevronDown, ArrowRightFromLine } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import SettingRow from '../../components/SettingRow'
import { TokenRegistryIcon } from '../../components/ImageComponents'
import { TOKEN_REGISTRY_CONFIG_KEYS, TOKEN_REGISTRY_CONFIG, TokenRegistryId } from '../../constants/settings'
import { tokenApi, configApi } from '../../api'

interface TokenSettingsProps {
  getValue: (key: string) => any
  formData: any
  setFormData: (data: any) => void
  visibleTokens: TokenRegistryId[]
  setVisibleTokens: (tokens: TokenRegistryId[]) => void
  showAddToken: boolean
  setShowAddToken: (show: boolean) => void
  verifiedTokens: Record<TokenRegistryId, boolean>
  setVerifiedTokens: (tokens: Record<TokenRegistryId, boolean> | ((prev: Record<TokenRegistryId, boolean>) => Record<TokenRegistryId, boolean>)) => void
  onSwitchTab?: (tab: string) => void
}

interface TestStatus {
  registry: TokenRegistryId
  testing: boolean
  success: boolean | null
  message: string
  errorType?: string
  dockerHostConfigured?: boolean
}

export default function TokenSettings({ getValue, formData, setFormData, visibleTokens, setVisibleTokens, showAddToken, setShowAddToken, verifiedTokens, setVerifiedTokens, onSwitchTab }: TokenSettingsProps) {
  const { t } = useLanguage()
  const [testStatuses, setTestStatuses] = useState<Record<TokenRegistryId, TestStatus>>({} as Record<TokenRegistryId, TestStatus>)
  const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({})
  const [harborTestStatuses, setHarborTestStatuses] = useState<Record<string, { testing: boolean; success: boolean | null; message: string }>>({})
  const [certInputModes, setCertInputModes] = useState<Record<string, 'paste' | 'upload'>>({})
  const [certExpanded, setCertExpanded] = useState<Record<string, boolean>>({})
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  useEffect(() => {
    const changedRegistries: TokenRegistryId[] = []
    const registryFields: Record<TokenRegistryId, string[]> = {
      dockerhub: ['dockerhub_username', 'dockerhub_token'],
      ghcr: ['ghcr_username', 'ghcr_token'],
      quay: ['quay_username', 'quay_password'],
      acr: ['acr_username', 'acr_password'],
      ecr: ['ecr_access_key_id', 'ecr_secret_access_key', 'ecr_region'],
      gar: ['gar_token'],
      harbor: ['harbor_url', 'harbor_username', 'harbor_password', 'harbor_tls_cert'],
      tencentcloud: ['tencentcloud_username', 'tencentcloud_password'],
      huaweicloud: ['huaweicloud_username', 'huaweicloud_password'],
    }

    for (const tokenId of visibleTokens) {
      if (tokenId === 'harbor') {
        const configs = getValue('harbor_configs')
        const formConfigs = formData.harbor_configs
        if (formConfigs !== undefined && JSON.stringify(formConfigs) !== JSON.stringify(configs)) {
          changedRegistries.push(tokenId)
        }
        continue
      }
      const fields = registryFields[tokenId]
      if (fields) {
        for (const field of fields) {
          if (formData[field] !== undefined && formData[field] !== getValue(field)) {
            changedRegistries.push(tokenId)
            break
          }
        }
      }
    }

    if (changedRegistries.length > 0) {
      setVerifiedTokens(prev => {
        const newVerified = { ...prev }
        for (const id of changedRegistries) {
          if (newVerified[id]) {
            newVerified[id] = false
          }
        }
        return newVerified
      })
      setTestStatuses(prev => {
        const newStatuses = { ...prev }
        for (const id of changedRegistries) {
          delete newStatuses[id]
        }
        return newStatuses
      })
    }
  }, [formData])

  const togglePasswordVisibility = (key: string) => {
    setVisiblePasswords(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const getTokenRegistryConfig = (tokenId: TokenRegistryId) => {
    return TOKEN_REGISTRY_CONFIG[tokenId]
  }

  const getAvailableTokens = (): TokenRegistryId[] => {
    const all = (Object.keys(TOKEN_REGISTRY_CONFIG_KEYS) as TokenRegistryId[]).filter(id => !visibleTokens.includes(id))
    return all.sort((a, b) => {
      const nameA = TOKEN_REGISTRY_CONFIG[a]?.name || a
      const nameB = TOKEN_REGISTRY_CONFIG[b]?.name || b
      return nameA.length - nameB.length
    })
  }

  const addTokenRegistry = (tokenId: TokenRegistryId) => {
    if (!visibleTokens.includes(tokenId)) {
      setVisibleTokens([...visibleTokens, tokenId])
      setShowAddToken(false)
    }
  }

  const removeTokenRegistry = (tokenId: TokenRegistryId) => {
    setVisibleTokens(visibleTokens.filter(id => id !== tokenId))
    const registry = getTokenRegistryConfig(tokenId)
    if (registry) {
      const newFormData = { ...getValue('formData') }
      registry.fields.forEach((field: { key: string }) => {
        newFormData[field.key] = ''
      })
      if (tokenId === 'harbor') {
        newFormData['harbor_tls_cert'] = ''
        newFormData['harbor_configs'] = []
        setHarborTestStatuses({})
      }
      setFormData(newFormData)
      setVerifiedTokens(prev => {
        const newVerified = { ...prev }
        delete newVerified[tokenId]
        return newVerified
      })
      setTestStatuses(prev => {
        const newStatuses = { ...prev }
        delete newStatuses[tokenId]
        return newStatuses
      })
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string
        updateHarborConfig(idx, 'cert', content)
      }
      reader.readAsText(file)
    }
  }

  const getVerifiedField = (tokenId: TokenRegistryId): string | null => {
    const fieldMap: Record<TokenRegistryId, string> = {
      dockerhub: 'dockerhub_verified',
      ghcr: 'ghcr_verified',
      quay: 'quay_verified',
      acr: 'acr_verified',
      ecr: 'ecr_verified',
      gar: 'gar_verified',
      harbor: 'harbor_verified',
      tencentcloud: 'tencentcloud_verified',
      huaweicloud: 'huaweicloud_verified',
    }
    return fieldMap[tokenId] || null
  }

  const getRegistryKey = (tokenId: TokenRegistryId): string => {
    switch (tokenId) {
      case 'dockerhub': return 'docker.io'
      case 'ghcr': return 'ghcr.io'
      case 'quay': return 'quay.io'
      case 'acr': return 'azurecr.io'
      case 'ecr': return 'public.ecr.aws'
      case 'gar': return 'pkg.dev'
      case 'harbor': return getValue('harbor_url') || 'harbor'
      case 'tencentcloud': return 'tencentcloudcr.com'
      case 'huaweicloud': return 'myhuaweicloud.com'
      default: return tokenId
    }
  }

  const testConnection = async (tokenId: TokenRegistryId) => {
    const registryKey = getRegistryKey(tokenId)
    setTestStatuses(prev => ({
      ...prev,
      [tokenId]: { registry: tokenId, testing: true, success: null, message: '' }
    }))
    
    const credentials: any = {}
    switch (tokenId) {
      case 'dockerhub':
        credentials.username = getValue('dockerhub_username')
        credentials.password = getValue('dockerhub_token')
        break
      case 'ghcr':
        credentials.username = getValue('ghcr_username')
        credentials.token = getValue('ghcr_token')
        break
      case 'quay':
        credentials.username = getValue('quay_username')
        credentials.password = getValue('quay_password')
        break
      case 'acr':
        credentials.username = getValue('acr_username')
        credentials.password = getValue('acr_password')
        break
      case 'ecr':
        credentials.username = getValue('ecr_access_key_id')
        credentials.password = getValue('ecr_secret_access_key')
        credentials.region = getValue('ecr_region')
        break
      case 'gar':
        credentials.token = getValue('gar_token')
        break
      case 'harbor':
        credentials.url = getValue('harbor_url')
        credentials.username = getValue('harbor_username')
        credentials.password = getValue('harbor_password')
        credentials.cert = getValue('harbor_tls_cert')
        break
      case 'tencentcloud':
        credentials.username = getValue('tencentcloud_username')
        credentials.password = getValue('tencentcloud_password')
        break
      case 'huaweicloud':
        credentials.username = getValue('huaweicloud_username')
        credentials.password = getValue('huaweicloud_password')
        break
    }
    
    try {
      const response = await tokenApi.test(registryKey, credentials)
      const data = response.data
      setTestStatuses(prev => ({
        ...prev,
        [tokenId]: {
          registry: tokenId,
          testing: false,
          success: data.success,
          message: data.message,
          errorType: data.error_type,
          dockerHostConfigured: data.docker_host_configured,
        }
      }))
      if (data.success) {
        setVerifiedTokens(prev => ({ ...prev, [tokenId]: true }))
        const verifiedField = getVerifiedField(tokenId)
        if (verifiedField) {
          configApi.update({ [verifiedField]: true }).catch(() => {})
        }
      } else {
        setVerifiedTokens(prev => ({ ...prev, [tokenId]: false }))
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.message || 'Connection failed'
      setTestStatuses(prev => ({
        ...prev,
        [tokenId]: { registry: tokenId, testing: false, success: false, message: errorMsg }
      }))
      setVerifiedTokens(prev => ({ ...prev, [tokenId]: false }))
    }
  }

  const getHarborConfigs = (): { id: string; url: string; username: string; password: string; cert: string; verified: boolean }[] => {
    const configs = getValue('harbor_configs')
    if (Array.isArray(configs) && configs.length > 0) return configs
    // Auto-migrate legacy single-harbor config
    const oldUrl = getValue('harbor_url')
    const oldUsername = getValue('harbor_username')
    const oldPassword = getValue('harbor_password')
    const oldCert = getValue('harbor_tls_cert')
    const oldVerified = getValue('harbor_verified')
    if (oldUrl || oldUsername || oldPassword) {
      return [{
        id: 'harbor-legacy',
        url: oldUrl || '',
        username: oldUsername || '',
        password: oldPassword || '',
        cert: oldCert || '',
        verified: !!oldVerified,
      }]
    }
    return []
  }

  const updateHarborConfig = (idx: number, field: string, value: any) => {
    const configs = getHarborConfigs()
    configs[idx] = { ...configs[idx], [field]: value }
    setFormData({ ...formData, harbor_configs: configs })
  }

  const addHarborInstance = () => {
    const configs = getHarborConfigs()
    configs.push({ id: `harbor-${Date.now()}`, url: '', username: '', password: '', cert: '', verified: false })
    setFormData({ ...formData, harbor_configs: configs })
  }

  const removeHarborInstance = (idx: number) => {
    const configs = getHarborConfigs()
    configs.splice(idx, 1)
    setFormData({ ...formData, harbor_configs: configs })
  }

  const testHarborInstance = async (idx: number) => {
    const configs = getHarborConfigs()
    const instance = configs[idx]
    if (!instance) return
    setHarborTestStatuses(prev => ({ ...prev, [instance.id]: { testing: true, success: null, message: '' } }))
    try {
      const response = await tokenApi.test(instance.url || 'harbor', {
        url: instance.url,
        username: instance.username,
        password: instance.password,
        cert: instance.cert,
      })
      const data = response.data
      setHarborTestStatuses(prev => ({ ...prev, [instance.id]: { testing: false, success: data.success, message: data.message } }))
      if (data.success) {
        configs[idx].verified = true
        setFormData({ ...formData, harbor_configs: [...configs] })
        configApi.update({ harbor_configs: [...configs] }).catch(() => {})
      } else {
        configs[idx].verified = false
        setFormData({ ...formData, harbor_configs: [...configs] })
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.message || 'Connection failed'
      setHarborTestStatuses(prev => ({ ...prev, [instance.id]: { testing: false, success: false, message: errorMsg } }))
      configs[idx].verified = false
      setFormData({ ...formData, harbor_configs: [...configs] })
    }
  }

  const getVerificationStatus = (tokenId: TokenRegistryId) => {
    const registry = getTokenRegistryConfig(tokenId)
    if (!registry?.requireTest) return null

    if (tokenId === 'harbor') {
      const configs = getHarborConfigs()
      const hasValue = configs.length > 0 && configs.some(c => c.url && c.url.trim() !== '' && c.username && c.username.trim() !== '')
      if (!hasValue) {
        return { status: 'empty', icon: null, text: '' }
      }
      const allVerified = configs.length > 0 && configs.every(c => c.verified)
      const anyTesting = Object.values(harborTestStatuses).some(s => s.testing)
      if (anyTesting) {
        return { status: 'testing', icon: <Loader2 size={14} className="spin" />, text: t('settings.testing') }
      }
      if (allVerified) {
        return { status: 'verified', icon: <ShieldCheck size={14} />, text: t('settings.tokens.verified') }
      }
      const anyFailed = Object.values(harborTestStatuses).some(s => s.success === false)
      if (anyFailed) {
        return { status: 'failed', icon: <ShieldAlert size={14} />, text: t('settings.tokens.failed') }
      }
      return { status: 'unverified', icon: <Info size={14} />, text: t('settings.tokens.unverified') }
    }

    const fields = registry.checkKeys
    const hasValue = fields.some(key => {
      const val = formData[key] !== undefined ? formData[key] : getValue(key)
      return val && val.trim() !== ''
    })

    if (!hasValue) {
      return { status: 'empty', icon: null, text: '' }
    }
    
    if (testStatuses[tokenId]?.testing) {
      return { status: 'testing', icon: <Loader2 size={14} className="spin" />, text: t('settings.testing') }
    }
    
    if (verifiedTokens[tokenId]) {
      return { status: 'verified', icon: <ShieldCheck size={14} />, text: t('settings.tokens.verified') }
    }
    
    if (testStatuses[tokenId]?.success === false) {
      return { status: 'failed', icon: <ShieldAlert size={14} />, text: testStatuses[tokenId]?.message || t('settings.tokens.failed') }
    }
    
    return { status: 'unverified', icon: <Info size={14} />, text: t('settings.tokens.unverified') }
  }

  return (
    <>
{visibleTokens.length === 0 && !showAddToken && (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          color: 'var(--text-muted)',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--border-color)',
        }}>
          <div style={{ marginBottom: '12px', opacity: 0.5, display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <TokenRegistryIcon tokenId="dockerhub" />
            <TokenRegistryIcon tokenId="ghcr" />
            <TokenRegistryIcon tokenId="quay" />
            <TokenRegistryIcon tokenId="acr" />
            <TokenRegistryIcon tokenId="ecr" />
            <TokenRegistryIcon tokenId="gar" />
          </div>
          <p style={{ margin: 0, fontSize: '15px' }}>{t('settings.tokens.none')}</p>
          <button
            onClick={() => setShowAddToken(true)}
            style={{
              marginTop: '16px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              fontSize: '14px',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-xs)',
              background: 'var(--bg-secondary)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            <Plus size={14} /> {t('settings.tokens.add')}
          </button>
        </div>
      )}

      {visibleTokens.map((tokenId, index) => {
        const registry = getTokenRegistryConfig(tokenId)
        if (!registry) return null
        
        const verification = getVerificationStatus(tokenId)
        const requiresVerification = registry.requireTest && verification?.status !== 'empty'

        return (
          <SettingRow
            key={tokenId}
label={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TokenRegistryIcon tokenId={tokenId} />
                <span>{registry.name}</span>
                {requiresVerification && verification && (
                  <span style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: verification.status === 'verified' ? 'var(--green-500)' : 
                           verification.status === 'failed' ? 'var(--red-500)' : 
                           verification.status === 'testing' ? 'var(--purple-500)' : 'var(--orange-500)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 6px',
                    borderRadius: 'var(--radius-xs)',
                    background: verification.status === 'verified' ? 'rgba(34, 197, 94, 0.1)' : 
                                verification.status === 'failed' ? 'rgba(239, 68, 68, 0.1)' : 
                                verification.status === 'testing' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(249, 115, 22, 0.1)',
                  }}>
                    {verification.icon}
                    {verification.text}
                  </span>
                )}
                <button
                  onClick={() => removeTokenRegistry(tokenId)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '2px',
                    border: 'none',
                    background: 'transparent',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    borderRadius: 'var(--radius-xs)',
                  }}
                  title={t('settings.tokens.remove')}
                >
                  <X size={14} />
                </button>
              </div>
            }
            hint={registry.hint}
            noBorder={index === visibleTokens.length - 1 && !showAddToken}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {tokenId === 'harbor' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {getHarborConfigs().map((instance, idx) => {
                    const status = harborTestStatuses[instance.id]
                    return (
                      <div key={instance.id} style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-card)', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text-secondary)' }}>
                            Harbor Instance {idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeHarborInstance(idx)}
                            style={{ display: 'inline-flex', alignItems: 'center', padding: '4px', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: 'var(--radius-xs)' }}
                            title={t('settings.tokens.remove')}
                          >
                            <X size={14} />
                          </button>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                          <div style={{ flex: 1, minWidth: '200px' }}>
                            <input
                              type="text"
                              className="form-control"
                              value={instance.url || ''}
                              onChange={e => updateHarborConfig(idx, 'url', e.target.value)}
                              placeholder="https://harbor.example.com"
                            />
                          </div>
                          <div style={{ flex: 1, minWidth: '200px' }}>
                            <input
                              type="text"
                              className="form-control"
                              value={instance.username || ''}
                              onChange={e => updateHarborConfig(idx, 'username', e.target.value)}
                              placeholder={t('token.harbor.usernamePlaceholder') || 'Username'}
                            />
                          </div>
                          <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
                            <input
                              type={visiblePasswords[`harbor-${instance.id}`] ? 'text' : 'password'}
                              className="form-control"
                              value={instance.password || ''}
                              onChange={e => updateHarborConfig(idx, 'password', e.target.value)}
                              placeholder={t('token.harbor.passwordPlaceholder') || 'Password'}
                              style={{ paddingRight: '40px' }}
                            />
                            <button
                              type="button"
                              onClick={() => togglePasswordVisibility(`harbor-${instance.id}`)}
                              style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', padding: '4px', border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                            >
                              {visiblePasswords[`harbor-${instance.id}`] ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                          <button
                            type="button"
                            onClick={() => setCertExpanded(prev => ({ ...prev, [instance.id]: !prev[instance.id] }))}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '8px 0',
                              fontSize: '15px',
                              border: 'none',
                              background: 'transparent',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                            }}
                          >
                            <ChevronDown
                              size={16}
                              style={{
                                transform: certExpanded[instance.id] ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.2s ease',
                              }}
                            />
                            {t('token.harbor.tlsCert')} ({t('token.harbor.optional')})
                            {instance.cert && !certExpanded[instance.id] && (
                              <span style={{ color: 'var(--green-500)', fontSize: '13px', marginLeft: '4px' }}>
                                <CheckCircle2 size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '2px' }} />
                                {t('token.harbor.certLoaded')}
                              </span>
                            )}
                          </button>
                          {certExpanded[instance.id] && (
                            <div style={{ marginTop: '8px' }}>
                              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                <button
                                  type="button"
                                  onClick={() => setCertInputModes(prev => ({ ...prev, [instance.id]: 'paste' }))}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '10px 16px',
                                    fontSize: '15px',
                                    border: certInputModes[instance.id] !== 'upload' ? '1px solid var(--purple-600)' : '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-sm)',
                                    background: certInputModes[instance.id] !== 'upload' ? 'var(--accent-bg)' : 'var(--bg-tertiary)',
                                    color: certInputModes[instance.id] !== 'upload' ? 'var(--purple-400)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                  }}
                                >
                                  <FileText size={16} />
                                  {t('token.harbor.paste')}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setCertInputModes(prev => ({ ...prev, [instance.id]: 'upload' }))}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '10px 16px',
                                    fontSize: '15px',
                                    border: certInputModes[instance.id] === 'upload' ? '1px solid var(--purple-600)' : '1px solid var(--border-color)',
                                    borderRadius: 'var(--radius-sm)',
                                    background: certInputModes[instance.id] === 'upload' ? 'var(--accent-bg)' : 'var(--bg-tertiary)',
                                    color: certInputModes[instance.id] === 'upload' ? 'var(--purple-400)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                  }}
                                >
                                  <Upload size={16} />
                                  {t('token.harbor.upload')}
                                </button>
                              </div>
                              {certInputModes[instance.id] === 'upload' ? (
                                <div>
                                  <input
                                    type="file"
                                    ref={el => { fileInputRefs.current[instance.id] = el }}
                                    accept=".crt,.cer,.cert,.pem"
                                    onChange={e => handleFileUpload(e, idx)}
                                    style={{ display: 'none' }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => fileInputRefs.current[instance.id]?.click()}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '8px',
                                      padding: '10px 20px',
                                      fontSize: '15px',
                                      border: '1px solid var(--border-color)',
                                      borderRadius: 'var(--radius-sm)',
                                      background: 'var(--bg-secondary)',
                                      color: 'var(--text-secondary)',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    <Upload size={16} />
                                    {t('token.harbor.selectFile')}
                                  </button>
                                  {instance.cert && (
                                    <div style={{ marginTop: '8px', fontSize: '15px', color: 'var(--green-500)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                      <CheckCircle2 size={16} /> {t('token.harbor.certLoaded')}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <textarea
                                  className="form-control"
                                  value={instance.cert || ''}
                                  onChange={e => updateHarborConfig(idx, 'cert', e.target.value)}
                                  placeholder={t('token.harbor.certPlaceholder')}
                                  rows={4}
                                  style={{ fontSize: '14px', fontFamily: 'var(--font-mono)' }}
                                />
                              )}
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <button
                            type="button"
                            onClick={() => testHarborInstance(idx)}
                            disabled={status?.testing}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '14px', fontWeight: '500',
                              border: '1px solid var(--purple-600)', borderRadius: 'var(--radius-sm)', background: 'var(--accent-bg)', color: 'var(--purple-400)',
                              cursor: status?.testing ? 'not-allowed' : 'pointer', opacity: status?.testing ? 0.6 : 1,
                            }}
                          >
                            {status?.testing ? <Loader2 size={14} className="spin" /> : <CheckCircle2 size={14} />}
                            {status?.testing ? t('settings.testing') : t('settings.test')}
                          </button>
                          {status && !status.testing && (
                            <span style={{ fontSize: '14px', fontWeight: '500', color: status.success ? 'var(--green-500)' : 'var(--red-500)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              {status.success ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                              {status.message}
                            </span>
                          )}
                          {instance.verified && !status?.testing && (
                            <span style={{ fontSize: '13px', color: 'var(--green-500)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <ShieldCheck size={12} /> {t('settings.tokens.verified')}
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                  <button
                    type="button"
                    onClick={addHarborInstance}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 16px', fontSize: '14px',
                      border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-sm)', background: 'var(--bg-secondary)',
                      color: 'var(--text-secondary)', cursor: 'pointer',
                    }}
                  >
                    <Plus size={14} /> {t('settings.tokens.addHarborInstance') || 'Add Harbor Instance'}
                  </button>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {registry.fields.map(field => (
                      <div key={field.key} style={{ position: 'relative', flex: registry.fields.length > 1 ? 1 : undefined, minWidth: '200px' }}>
                        <input
                          type={field.type === 'password' && !visiblePasswords[field.key] ? 'password' : 'text'}
                          className="form-control"
                          value={getValue(field.key) || ''}
                          onChange={e => setFormData({ ...formData, [field.key]: e.target.value })}
                          placeholder={field.placeholder}
                          style={{ paddingRight: field.type === 'password' ? '40px' : undefined }}
                        />
                        {field.type === 'password' && (
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(field.key)}
                            style={{
                              position: 'absolute',
                              right: '10px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              padding: '4px',
                              border: 'none',
                              background: 'transparent',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                            title={visiblePasswords[field.key] ? t('settings.hide') : t('settings.show')}
                          >
                            {visiblePasswords[field.key] ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                      type="button"
                      onClick={() => testConnection(tokenId)}
                      disabled={testStatuses[tokenId]?.testing}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        fontSize: '15px',
                        fontWeight: '500',
                        border: registry.requireTest ? '1px solid var(--purple-600)' : '1px solid var(--border-color)',
                        borderRadius: 'var(--radius-sm)',
                        background: registry.requireTest ? 'var(--accent-bg)' : 'var(--bg-secondary)',
                        color: registry.requireTest ? 'var(--purple-400)' : 'var(--text-primary)',
                        cursor: testStatuses[tokenId]?.testing ? 'not-allowed' : 'pointer',
                        opacity: testStatuses[tokenId]?.testing ? 0.6 : 1,
                      }}
                    >
                      {testStatuses[tokenId]?.testing ? (
                        <Loader2 size={16} className="spin" />
                      ) : (
                        <CheckCircle2 size={16} />
                      )}
                      {testStatuses[tokenId]?.testing ? t('settings.testing') : t('settings.test')}
                    </button>
                    {testStatuses[tokenId] && !testStatuses[tokenId].testing && (
                      <div style={{
                        fontSize: '15px',
                        fontWeight: '500',
                        color: testStatuses[tokenId].success ? 'var(--green-500)' : 'var(--red-500)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {testStatuses[tokenId].success ? (
                            <CheckCircle2 size={16} />
                          ) : (
                            <XCircle size={16} />
                          )}
                          {testStatuses[tokenId].message}
                        </span>
                        {!testStatuses[tokenId].success && tokenId === 'dockerhub' && testStatuses[tokenId].errorType === 'docker_unavailable' && (
                          <div style={{
                            padding: '12px 16px',
                            background: 'var(--bg-tertiary)',
                            borderRadius: 'var(--radius-sm)',
                            border: '1px solid var(--border-color)',
                            fontSize: '14px',
                            color: 'var(--text-secondary)',
                            fontWeight: '400',
                            lineHeight: '1.5',
                          }}>
                            <div style={{ marginBottom: '8px', fontWeight: '500', color: 'var(--text-primary)' }}>
                              {t('settings.tokens.dockerUnavailableHint') || 'Cannot verify Docker Hub credentials'}
                            </div>
                            <ul style={{ margin: '0 0 10px 16px', padding: 0 }}>
                              <li>{t('settings.tokens.checkLocalDocker') || 'Check if Docker Desktop or Podman is running locally'}</li>
                              <li>{t('settings.tokens.configureDockerHost') || 'Or configure a remote Docker host in Export Settings'}</li>
                            </ul>
                            {onSwitchTab && (
                              <button
                                type="button"
                                onClick={() => onSwitchTab('export')}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '8px 16px',
                                  fontSize: '14px',
                                  fontWeight: '500',
                                  border: '1px solid var(--purple-600)',
                                  borderRadius: 'var(--radius-sm)',
                                  background: 'var(--accent-bg)',
                                  color: 'var(--purple-400)',
                                  cursor: 'pointer',
                                }}
                              >
                                <ArrowRightFromLine size={14} />
                                {t('settings.tokens.goToExportSettings') || 'Go to Export Settings'}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    {registry.requireTest && !verifiedTokens[tokenId] && !testStatuses[tokenId]?.testing && (
                      <span style={{
                        fontSize: '13px',
                        color: 'var(--orange-500)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}>
                        <Info size={12} />
                        {t('settings.tokens.mustVerify')}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </SettingRow>
        )
      })}

      {showAddToken && (
<div style={{
           marginTop: visibleTokens.length > 0 ? '20px' : 0,
           padding: '16px',
           background: 'var(--bg-tertiary)',
           borderRadius: 'var(--radius-card)',
           border: '1px solid var(--border-color)',
         }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '12px'
          }}>
            <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              {t('settings.tokens.select')}
            </div>
            <button
              onClick={() => setShowAddToken(false)}
style={{
                 display: 'inline-flex',
                 alignItems: 'center',
                 padding: '2px',
                 border: 'none',
                 background: 'transparent',
                 color: 'var(--text-muted)',
                 cursor: 'pointer',
                 borderRadius: 'var(--radius-xs)',
               }}
              title={t('settings.tokens.close')}
            >
              <X size={14} />
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {getAvailableTokens().map(tokenId => {
              const registry = getTokenRegistryConfig(tokenId)
              if (!registry) return null
              return (
                <button
                  key={tokenId}
                  onClick={() => addTokenRegistry(tokenId)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '14px 18px',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-xs)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '15px',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <TokenRegistryIcon tokenId={tokenId} />
                    <span>{registry.name}</span>
                  </div>
                  {registry.requireTest && (
                    <span style={{
                      fontSize: '12px',
                      color: 'var(--orange-500)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-xs)',
                      background: 'rgba(249, 115, 22, 0.1)',
                    }}>
                      {t('settings.tokens.requiresVerification')}
                    </span>
                  )}
                </button>
              )
            })}
            {getAvailableTokens().length === 0 && (
              <div style={{ padding: '8px', color: 'var(--text-muted)', fontSize: '14px' }}>
                {t('settings.tokens.allConfigured')}
              </div>
            )}
          </div>
        </div>
      )}

      {visibleTokens.length > 0 && !showAddToken && (
        <button
          onClick={() => setShowAddToken(true)}
style={{
             marginTop: '20px',
             display: 'inline-flex',
             alignItems: 'center',
             gap: '6px',
             padding: '8px 16px',
             fontSize: '14px',
             border: '1px solid var(--border-color)',
             borderRadius: 'var(--radius-xs)',
             background: 'var(--bg-secondary)',
             color: 'var(--text-secondary)',
             cursor: 'pointer',
           }}
        >
          <Plus size={14} /> {t('settings.tokens.addAnother')}
        </button>
      )}
    </>
  )
}