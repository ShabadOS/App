/**
 * Loads and exports settings instance.
 * @ignore
 */

import { readJSONSync, writeJSON, writeJSONSync, ensureFileSync } from 'fs-extra'

import { SETTINGS_FILE, DEFAULT_SETTINGS_FILE } from './consts'
import logger from './logger'

/**
 * Simple class to manage application settings
 */
class Settings {
  /**
   * Initialises the Settings class.
   * Loads in the existing settings.
   */
  constructor() {
    this.settings = {}

    this.loadSettings()
  }

  /**
   * Loads settings, merging them with the defaults.
   */
  loadSettings() {
    logger.info( 'Loading settings' )

    // Load both settings files
    const defaultSettings = readJSONSync( DEFAULT_SETTINGS_FILE )
    const settings = Settings.checkCreateSettings()

    // Merge and store them
    this.settings = { ...defaultSettings, ...settings }

    // Save them for good measure
    this.saveSettings()
  }

  /**
   * Saves the settings back to disk.
   */
  async saveSettings() {
    writeJSON( SETTINGS_FILE, this.settings, { spaces: 2 } )
  }

  /**
   * Returns all settings if no parameters, else the path provided.
   * @param {String} path The setting path to deep-get.
   * @returns {*} The value at `path`.
   */
  get( path ) {
    return path
      ? path.split( '.' ).reduce( ( settings, key ) => settings[ key ], this.settings )
      : this.settings
  }

  /**
   * Sets a key-value pair and saves.
   * @param {String} key The key to set the value for.
   * @param {*} value The new value of the key.
   */
  set( key, value ) {
    this.settings[ key ] = value
    this.saveSettings()
  }

  /**
   * Merges a given settings object with the current settings and saves.
   * @param {Object} settings The settings object to merge with.
   */
  merge( settings = {} ) {
    this.settings = { ...this.settings, ...settings }
    this.saveSettings()
  }

  /**
   * Creates a settings.json file if it doesn't already exist, or is corrupt.
   * @static
   * @returns {Object} An object containing the settings.
   */
  static checkCreateSettings() {
    // If we can't read the JSON file, recreate it
    try {
      return readJSONSync( SETTINGS_FILE )
    } catch ( err ) {
      logger.warn( 'Settings file is corrupt or non-existent. Recreating.' )
      ensureFileSync( SETTINGS_FILE )
      writeJSONSync( SETTINGS_FILE, {} )
      return {}
    }
  }
}

// Export the instance
export default new Settings()
