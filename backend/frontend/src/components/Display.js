import React from 'react'
import PropTypes from 'prop-types'

import Line from './Line'

import './Display.css'

/**
 * Display Component.
 * Displays the current Shabad, with visual settings.
 * @param shabad The Shabad to render.
 * @param lineId The current line in the Shabad.
 */
const Display = ( { shabad, lineId } ) => {
  // Get the lines from the shabad, if they exist
  const { lines = [] } = shabad || {}

  // Find the correct line in the Shabad
  const line = lines.find( ( { id } ) => lineId === id )

  return (
    <div className="display">
      {line ? <Line {...line} /> : null}
    </div>
  )
}

Display.defaultProps = {
  shabad: null,
  lineId: null,
}

Display.propTypes = {
  lineId: PropTypes.number,
  shabad: PropTypes.shape( {
    lines: PropTypes.arrayOf( PropTypes.shape( Line.PropTypes ) ),
  } ),
}

export default Display
