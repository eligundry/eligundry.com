import React, { useMemo } from 'react'
import parseISO from 'date-fns/parseISO'
import type { DaylioEntry } from './types'

export interface DaylioState<TimeType extends string | Date = Date> {
  entries: DaylioEntry<TimeType>[]
  chartData: {
    x: DaylioEntry<TimeType>['time']
    y: DaylioEntry<TimeType>['mood']
  }[]
}

const defaultState = Object.freeze<DaylioState>({
  entries: [],
  chartData: [],
})

export const DaylioContext = React.createContext<DaylioState>(defaultState)

export const DaylioProvider: React.FC<Partial<DaylioState<string>>> = ({
  children,
  ...props
}) => {
  const value = useMemo<DaylioState>(
    () => ({
      entries:
        props?.entries?.map((entry) => ({
          ...entry,
          time: parseISO(entry.time),
        })) ?? [],
      chartData:
        props?.chartData?.map(({ x, y }) => ({
          x: parseISO(x),
          y,
        })) ?? [],
    }),
    [props.chartData, props.entries]
  )

  return (
    <DaylioContext.Provider value={value}>{children}</DaylioContext.Provider>
  )
}

export default DaylioProvider
