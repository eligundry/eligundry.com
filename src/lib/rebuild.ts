/**
 * Starts a production build and deploy through the Workers Builds deploy
 * hook for main (Settings > Builds > Deploy Hooks). Returns false when no
 * hook is configured (local dev, previews).
 */
export const triggerSiteDeploy = async (reason: string) => {
  const hook = process.env.DEPLOY_HOOK_URL

  if (!hook) {
    return false
  }

  const resp = await fetch(hook, { method: 'POST' })

  if (!resp.ok) {
    throw new Error(
      `Failed to trigger a build (${reason}): ${resp.status} ${await resp.text()}`
    )
  }

  console.log(`Triggered a build: ${reason}`)
  return true
}
