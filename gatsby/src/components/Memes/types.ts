export interface Meme {
  id: number
  url: string
  size: (number | null)[]
  notes: string
  created_at: Date
}
