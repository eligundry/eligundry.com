import { DaylioEntry } from './types'

export default function useLatestFeelings(): DaylioEntry | null {
  // const entry = useStaticQuery<GatsbyTypes.UseLatestFeelingsQuery>(
  //   graphql`
  //     query UseLatestFeelings {
  //       feeling {
  //         time
  //         mood
  //         activities
  //         notes
  //       }
  //     }
  //   `
  // )

  // return {
  //   ...entry.feeling,
  //   // @ts-ignore
  //   time: parseISO(entry.feeling.time),
  // } as DaylioEntry

  return null
}
