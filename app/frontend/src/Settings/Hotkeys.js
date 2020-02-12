import React from 'react'
import { objectOf, arrayOf, string, shape } from 'prop-types'
import { groupBy } from 'lodash'
import classNames from 'classnames'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons'

import { Button, Tooltip, ListSubheader, ListItemText, ListItem, List, Grid } from '@material-ui/core'

import controller from '../lib/controller'

import { OptionGrid, slotSizes } from './DynamicOptions'

import './Hotkeys.css'

const setHotkeys = ( option, value ) => controller.setSettings( {
  // [  ]: { [ option ]: value },
}, 'local' )

/**
 * Renders all hotkeys with descriptions.
 * @param {Object} keys The hotkeys themselves, correpsonding to a name.
 * @param {Object} shortcuts Which shortcuts in `keys` to actually render.
 */
const Hotkeys = ( { keys, shortcuts, device } ) => {
  const editable = device === 'local'

  return (
    <List className="hotkeys">
      {Object
        .entries( groupBy( shortcuts, ( { group } ) => group ) )
        .map( ( [ groupName, hotkeys ] ) => (
          <ListItem key={groupName} className="group">
            <ListSubheader className="name" disableSticky>{groupName}</ListSubheader>
            <List className="group-hotkeys">
              {Object.values( hotkeys ).map( ( { name, description } ) => (
                <ListItem key={name} className="hotkey">
                  <Grid container className="name" alignItems="center">

                    <Grid item xs={4}>
                      <ListItemText className="text">{name}</ListItemText>
                    </Grid>

                    <Grid item xs={1}>
                      {description && (
                      <Tooltip title={description}>
                        <span>
                          <FontAwesomeIcon icon={faQuestionCircle} />
                        </span>
                      </Tooltip>
                      )}
                    </Grid>

                    <Grid className={classNames( { editable }, 'keys' )} item xs={6}>
                      <Grid container wrap>
                        {keys[ name ].map( key => (
                          <Grid key={key} item xs={4}>
                            <Button disabled={!editable} className="key">{key}</Button>
                          </Grid>
                        ) )}
                      </Grid>
                    </Grid>

                  </Grid>
                </ListItem>
              ) )}
            </List>
          </ListItem>
        ) )}

      <OptionGrid container align="center">
        <Grid item {...slotSizes.single}>
          <Button disabled={!editable} variant="contained" onClick={() => controller.resetSettingGroup( 'hotkeys' )}>Reset to defaults</Button>
        </Grid>
      </OptionGrid>

    </List>
  )
}

Hotkeys.propTypes = {
  device: string,
  shortcuts: objectOf( shape( { name: string, group: string, description: string } ) ).isRequired,
  keys: objectOf( arrayOf( string ) ).isRequired,
}

Hotkeys.defaultProps = {
  device: null,
}

export default Hotkeys
