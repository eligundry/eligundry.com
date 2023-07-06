const triggerSiteDeploy = async () => {
  if (!import.meta.env.NETLIFY_BUILD_HOOK) {
    return false
  }

  const resp = await fetch(import.meta.env.NETLIFY_BUILD_HOOK, {
    method: 'POST',
  })

  if (!resp.ok) {
    const text = await resp.text()
    throw new Error(`Failed to trigger Netlify deploy: ${text}`)
  }

  return true
}

const api = { triggerSiteDeploy }

export default api
