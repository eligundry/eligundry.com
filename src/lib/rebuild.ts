/**
 * Starts a production build and deploy by dispatching the deploy workflow on
 * GitHub. Returns false when no token is configured (local dev, previews).
 */
export const triggerSiteDeploy = async (reason: string) => {
  const token = process.env.GITHUB_DEPLOY_TOKEN

  if (!token) {
    return false
  }

  const resp = await fetch(
    'https://api.github.com/repos/eligundry/eligundry.com/actions/workflows/deploy.yml/dispatches',
    {
      method: 'POST',
      headers: {
        accept: 'application/vnd.github+json',
        authorization: `Bearer ${token}`,
        'user-agent': 'eligundry.com',
        'x-github-api-version': '2022-11-28',
      },
      body: JSON.stringify({ ref: 'main', inputs: { reason } }),
    }
  )

  if (!resp.ok) {
    throw new Error(
      `Failed to dispatch the deploy workflow: ${resp.status} ${await resp.text()}`
    )
  }

  return true
}
