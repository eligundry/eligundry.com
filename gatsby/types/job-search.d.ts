declare module 'src/components/JobSearch/*.json' {
  type StatusEmoji = string | '✅' | '❌' | '🙅‍♂️' | ''

  export interface JobSearchItem {
    Company: string
    Date: string
    'Applied?': StatusEmoji
    'Callback?': StatusEmoji
    'Code Test?': StatusEmoji
    'On Site?': StatusEmoji
    'Offer?': StatusEmoji
  }
  const items: JobSearchItem[]
  export default items
}
