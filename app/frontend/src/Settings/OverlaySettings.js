import React, { useState, useEffect } from 'react'

import { Grid, Typography } from '@material-ui/core'
import { faShareSquare } from '@fortawesome/free-solid-svg-icons'

import { BACKEND_URL, OVERLAY_PORT, isElectron } from '../lib/consts'
import controller from '../lib/controller'

import CopyButton from './CopyButton'
import TutorialButton from './TutorialButton'
import DynamicOptions, { slotSizes, IconSlot, OptionGrid } from './DynamicOptions'
import { Button } from './SettingComponents'

import './OverlaySettings.css'

const OverlaySettings = () => {
  const [ addresses, setAddresses ] = useState( [] )

  useEffect( () => {
    fetch( `${BACKEND_URL}/about` )
      .then( res => res.json() )
      .then( ( { addresses } ) => setAddresses( addresses ) )
  }, [] )

  return (
    <div className="overlay-settings">

      <OptionGrid container>
        <Grid item {...slotSizes.single}>
          <Typography>
            Overlays provide a convenient second screen for projectors,
            live streaming broadcasts, and vision impaired monitors.
          </Typography>
          <br />
          <Typography>
              When a line is activated in the controller and seen on the presenter,
              the same information is used to generate the overlay.
              Choose what to display and how to display it with the options below.
              You can choose from a variety of pre-configured overlays or
              create your own using the theme tool.
          </Typography>
        </Grid>
      </OptionGrid>

      <OptionGrid container align="center">
        <Grid item {...slotSizes.single}>

          <Grid container justify="space-around">
            <TutorialButton className="tutorial-button" href="https://tutorials.shabados.com/tutorials/1.0.0/overlay/overlay.html">
            Learn More
            </TutorialButton>
            <TutorialButton className="theme-tool" href="https://themes.shabados.com">
            Theme Tool
            </TutorialButton>
          </Grid>

        </Grid>
      </OptionGrid>

      <OptionGrid container>
        <IconSlot icon={faShareSquare} />
        <Grid item {...slotSizes.name}><Typography>Overlay URL</Typography></Grid>
        <Grid item {...slotSizes.option} align="center">
          {Object.entries( addresses ).map( ( [ name, address ] ) => (
            <CopyButton style={{ textAlign: 'center' }} copyText={`http://${address}:${OVERLAY_PORT}/overlay`}>{`${address}:${OVERLAY_PORT}/overlay (${name})`}</CopyButton>
          ) )}
        </Grid>
      </OptionGrid>

      <DynamicOptions device="global" group="overlay" />

      <OptionGrid container align="center">
        <Grid item {...slotSizes.single}>
          <Button className="folder-button" disabled={!isElectron} variant="contained" onClick={() => controller.action( 'open-overlay-folder' )}>Open Overlay Folder</Button>
        </Grid>
      </OptionGrid>

    </div>
  )
}

export default OverlaySettings
