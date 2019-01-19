/* eslint-disable global-require, no-global-assign */
const { spawn } = require( 'child_process' )

const LAUNCH_FLAG = '--start-server'

// Patch require to allow for ES6 imports
require = require( 'esm' )( module )

const { execPath, argv, env } = process
env.NODE_ENV = 'production'

/**
 * Launches a server in a separate process, with flag.
 */
const spawnServer = () => spawn( execPath, [ LAUNCH_FLAG ] )

// Define loader functions

/**
 * Function to load server.
 */
const loadServer = () => { require( '../server' ) }

/**
 * Function to load the electron wrapper for frontend.
 */
const loadElectron = () => { require( './electron-wrapper' ) }

// Load either Electron shell or backend server depending on flag
const [ , processFlag ] = argv

if ( processFlag === LAUNCH_FLAG ) {
  loadServer()
} else {
  const server = spawnServer()
  const killServer = () => server.kill()

  process.on( 'SIGINT', killServer )
  process.on( 'uncaughtException', killServer )
  process.on( 'exit', killServer )

  loadElectron()
}
