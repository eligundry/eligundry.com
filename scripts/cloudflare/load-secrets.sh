# Sourced at the top of the Workers Builds scripts: re-runs the calling script
# with .env.secrets decrypted into its environment. --overload lets the file
# win over CLOUDFLARE_API_TOKEN, which Workers Builds sets to its own build
# token. Needs DOTENV_PRIVATE_KEY_SECRETS (a build variable).
if [ -z "${SECRETS_LOADED:-}" ]; then
  exec env SECRETS_LOADED=1 pnpm exec dotenvx run -q --overload -f .env.secrets -- "$0" "$@"
fi
