import { mapValues } from 'lodash'
import React from 'react'
import { GlobalHotKeys as HotKeys, configure } from 'react-hotkeys/es'
import KeyEventManager from 'react-hotkeys/es/lib/KeyEventManager'

import { mapPlatformKeys } from '../lib/utils'

/**
 * React hotkeys activates `g g` twice when pressing `g g g`,
 * because it listens to a "rolling window" of keyChords.
 *
 * Clear the key history after each sequence using this workaround:
 * https://github.com/greena13/react-hotkeys/issues/255#issuecomment-558199060.
 */
export const clearHotKey = handler => event => {
  // eslint-disable-next-line no-underscore-dangle
  KeyEventManager.getInstance()._clearKeyHistory()
  return handler( event )
}

configure( {
  ignoreKeymapAndHandlerChangesByDefault: false,
  ignoreTags: [],
} )

const GlobalHotKeys = ( { keyMap, handlers, ...props } ) => (
  <HotKeys
    keyMap={mapPlatformKeys( keyMap )}
    handlers={mapValues( handlers, clearHotKey )}
    {...props}
  />
)

GlobalHotKeys.propTypes = HotKeys.propTypes

export default GlobalHotKeys
