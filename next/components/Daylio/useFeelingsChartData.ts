export default function useFeelingsChartData(timeWindow: Date) {
  // const entries = useStaticQuery<GatsbyTypes.UseFeelingsChartDataQuery>(graphql`
  //   query UseFeelingsChartData {
  //     allFeeling(limit: 100) {
  //       data: nodes {
  //         time
  //         mood
  //       }
  //     }
  //   }
  // `)

  // return entries.allFeeling.data
  //   .map((entry) => ({
  //     x: parseISO(entry.time),
  //     y: Object.keys(MoodMapping).findIndex((m) => m === entry.mood),
  //   }))
  //   .filter((entry) => entry.x >= timeWindow)
  //   .sort((a, b) => dateCompareAsc(a.x, b.x))
  //   .map((entry) => ({ ...entry, x: formatISO(entry.x) }))

  return []
}
