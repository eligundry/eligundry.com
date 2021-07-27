import React, { useState, useCallback, useMemo, useContext } from 'react'
import { IconContext } from 'react-icons'

interface UserInterfaceState {
  animateHeader: boolean
  disableHeaderAnimation: () => void
}

const defaultState = Object.freeze<UserInterfaceState>({
  animateHeader: true,
  disableHeaderAnimation: () =>
    console.warn(
      'disableHeaderAnimation called without the UserInterfaceProvider being setup'
    ),
})

const UserInterfaceContext = React.createContext<UserInterfaceState>(
  defaultState
)
UserInterfaceContext.displayName = 'UserInterfaceContext'

export const UserInterfaceProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<UserInterfaceState>(defaultState)

  const disableHeaderAnimation = useCallback(
    () =>
      setState(s => ({
        ...s,
        animateHeader: false,
      })),
    []
  )

  const value = useMemo<UserInterfaceState>(
    () => ({
      animateHeader: state.animateHeader,
      disableHeaderAnimation,
    }),
    [state.animateHeader, disableHeaderAnimation]
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
