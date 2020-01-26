import React from 'react'
import styled from 'styled-components'

interface DaylioResponse {
  time: string
  mood: 'awful' | 'bad' | 'meh' | 'good' | 'rad'
  activities: string[]
  notes: string[]
}

interface DaylioState {
  data?: DaylioResponse
}

const DaylioMoodMapping = {
  awful: '😖',
  bad: '☹️/',
  meh: '😕',
  good: '😀',
  rad: '🥳',
}

const Emoji = styled.span`
  font-size: 9rem;
`

class Daylio extends React.Component<{}, DaylioState> {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    window
      .fetch('/api/daylio/today')
      .then(resp => resp.json())
      .then(data => this.setState({ data: data[0] }))
  }

  render() {
    if (!this.state.data) {
      return null
    }

    return (
      <div>
        <Emoji>{DaylioMoodMapping[this.state.data.mood]}</Emoji>
        <h3>I'm feeling {this.state.data.mood}</h3>
      </div>
    )
  }
}

export default Daylio
