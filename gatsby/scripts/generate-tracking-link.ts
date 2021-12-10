import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

const main = async () => {
  const argv = await yargs(hideBin(process.argv)).options({
    source: { type: 'string', default: 'recruiter-reply' },
    medium: { type: 'string', default: 'gmail' },
    company: { type: 'string' },
    contactName: { type: 'string' },
    content: { type: 'string', default: 'signature-link' },
    path: { type: 'string', default: '/' },
  }).argv

  const p = new URLSearchParams({
    utm_source: argv.source,
    utm_medium: argv.medium,
    utm_campaign: argv.company ?? argv.contactName ?? 'none',
    utm_content: argv.content,
  })

  if (argv.company) {
    p.set('utm_term', 'company')
  } else if (argv.contactName) {
    p.set('utm_term', 'person')
  }

  console.log(`https://eligundry.com${argv.path}?${p.toString()}`)
}

main()
