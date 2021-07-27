import React, { useState, useCallback, useMemo, useContext } from 'react'
import { IconContext } from 'react-icons'

interface UserInterfaceState {
  animateHeader: boolean
  headerWidth: number
  updateState: (update: Partial<UpdateableUserInterfaceState>) => void
}

type UpdateableUserInterfaceState = Omit<UserInterfaceState, 'updateState'>

const defaultState = Object.freeze<UserInterfaceState>({
  animateHeader: true,
  headerWidth: 0,
  updateState: update =>
    console.warn(
      'updateState called without the UserInterfaceProvider being setup',
      { update }
    ),
})

const UserInterfaceContext = React.createContext<UserInterfaceState>(
  defaultState
)
UserInterfaceContext.displayName = 'UserInterfaceContext'

export const UserInterfaceProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<UserInterfaceState>(defaultState)

  const updateState = useCallback(
    (update: Partial<UpdateableUserInterfaceState>) =>
      setState(s => ({
        ...s,
        ...update,
      })),
    []
  )

  const value = useMemo<UserInterfaceState>(
    () => ({
      animateHeader: state.animateHeader,
      headerWidth: state.headerWidth,
      updateState,
    }),
    [state.animateHeader, state.headerWidth, updateState]
  )

  return (
    <IconContext.Provider value={{}}>
      <UserInterfaceContext.Provider value={value}>
        {children}
      </UserInterfaceContext.Provider>
    </IconContext.Provider>
  )
}

export function useUserInterfaceState() {
  return useContext(UserInterfaceContext)
}
