import React, { useMemo } from 'react'
import parseISO from 'date-fns/parseISO'
import { DaylioEntry } from './types'

export interface DaylioState<TimeType extends string | Date = Date> {
  entries: DaylioEntry<TimeType>[]
  chartData: {
    x: string
    y: number
  }[]
}

export interface LimitedDaylioPageProps {
  daylio: Pick<DaylioState<string>, 'entries'>
}

export interface FullDaylioPageProps {
  daylio: DaylioState<string>
}

const defaultState = Object.freeze<DaylioState>({
  entries: [],
  chartData: [],
})

export const DaylioContext = React.createContext<DaylioState>(defaultState)

const DaylioProvider: React.FC<Partial<DaylioState<string>>> = ({
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
          x,
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
