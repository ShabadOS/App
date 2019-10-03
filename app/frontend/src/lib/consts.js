import {
  faPaintBrush,
  faShieldAlt,
  faEllipsisH,
  faArrowsAltH,
  faWrench,
  faBook,
  faAlignCenter,
  faSignature,
  faGripLines,
  faBookReader,
  faClosedCaptioning,
  faAlignJustify,
  faFont,
  faPalette,
  faImage,
  faLowVision,
  faFill,
  faFillDrip,
  faAngleDoubleRight,
  faChartPie,
  faDoorOpen,
  faLock,
  faFlask,
  faPlug,
  faArchive,
  faDownload,
  faPowerOff,
} from '@fortawesome/free-solid-svg-icons'
import {
  faKeyboard,
  faClosedCaptioning as farClosedCaptioning,
  faDotCircle,
  faBell,
} from '@fortawesome/free-regular-svg-icons'

/* eslint-disable quote-props */
/**
 * Application Constants
 * @ignore
 */

export const isElectron = navigator.userAgent.indexOf( 'Electron' ) > -1
export const isDev = process.env.NODE_ENV !== 'production'

/* Backend Info */
// eslint-disable-next-line no-undef
export const BACKEND_HOST = window.location.hostname || 'localhost'
export const BACKEND_PORT = !isDev ? 1699 : 42425
export const BACKEND_URL = `http://${BACKEND_HOST}:${BACKEND_PORT}`
export const WS_URL = `ws://${BACKEND_HOST}:${BACKEND_PORT}`

/* Sentry Data Source Name */
export const SENTRY_DSN = 'https://51b714c1e7544cba86efb2cad85152ff@sentry.io/1363390'

/* Navigator */
// URLs
export const PRESENTER_URL = ''
export const CONTROLLER_URL = `${PRESENTER_URL}/controller`
export const MENU_URL = `${CONTROLLER_URL}/menu`
export const SEARCH_URL = `${CONTROLLER_URL}/search`
export const BOOKMARKS_URL = `${CONTROLLER_URL}/bookmarks`
export const NAVIGATOR_URL = `${CONTROLLER_URL}/navigator`
export const HISTORY_URL = `${CONTROLLER_URL}/history`
export const HISTORY_DOWNLOAD_URL = `${BACKEND_URL}/history.csv`
export const THEME_URL = `${BACKEND_URL}/themes`

export const SETTINGS_URL = '/settings'
export const SETTINGS_DEVICE_URL = `${SETTINGS_URL}/device`
export const SETTINGS_SERVER_URL = `${SETTINGS_DEVICE_URL}/server`

export const SETTINGS_ABOUT_URL = `${SETTINGS_SERVER_URL}/about`
export const SETTINGS_TOOLS_URL = `${SETTINGS_URL}/tools`
export const SETTINGS_OVERLAY_URL = `${SETTINGS_TOOLS_URL}/overlay`

export const OVERLAY_URL = '/overlay'
export const SCREEN_READER_URL = '/screenreader'

// URL states
export const STATES = {
  controllerOnly: 'controllerOnly', // Fullscreen controller
  query: 'query', // Search query
}

// Search
export const MIN_SEARCH_CHARS = 2
export const MAX_RESULTS = 20

// Detect vishraams/pauses with characters
export const PAUSE_CHARS = {
  heavy: ';',
  medium: ',',
  light: '.',
}

// Search type names
export const SEARCH_TYPES = {
  fullWord: 'full-word',
  firstLetter: 'first-letter',
}

// Searching modifiers
export const SEARCH_CHARS = {
  wildcard: ' ',
  wordAnywhere: '#',
  wordOrder: '^',
  larivaarAccentless: '%',
}

// Search modifier anchors
export const SEARCH_ANCHORS = {
  [ SEARCH_CHARS.wordAnywhere ]: SEARCH_TYPES.fullWord,
}

/* Hotkeys and shortcuts */
// Jump to navigation line ordered hot keys
export const LINE_HOTKEYS = Array.from( '1234567890qwertyuiopasdfg' )

// Global application shortcuts
export const SHORTCUTS = {
  toggleFullscreen: 'Toggle Fullscreen',
  toggleFullscreenController: 'Toggle Fullscreen Controller',
  refresh: 'Refresh',
  newController: 'New Controller',
  toggleController: 'Toggle Controller',
  historyBack: 'History Back',
  historyForward: 'History Forward',
  search: 'Search',
  menu: 'Menu',
  navigator: 'Navigator',
  history: 'History',
  bookmarks: 'Bookmarks',
  clearDisplay: 'Clear Display',
}

// Shortcut Keys
export const DEFAULT_SHORTCUT_MAP = {
  [ SHORTCUTS.toggleFullscreen ]: [ 'f11', 'ctrl+f' ],
  [ SHORTCUTS.toggleFullscreenController ]: [ 'shift+f' ],
  [ SHORTCUTS.refresh ]: [ 'ctrl+r' ],
  [ SHORTCUTS.newController ]: [ 'ctrl+x', 'ctrl+shift+x' ],
  [ SHORTCUTS.toggleController ]: [ 'ctrl+h', 'ctrl+shift+h' ],
  [ SHORTCUTS.historyBack ]: [ 'ctrl+left', 'alt+left' ],
  [ SHORTCUTS.historyForward ]: [ 'ctrl+right', 'alt+right' ],
  [ SHORTCUTS.search ]: [ 'ctrl+/' ],
  [ SHORTCUTS.menu ]: [ 'ctrl+p', 'ctrl+,' ],
  [ SHORTCUTS.navigator ]: [ 'ctrl+c', 'ctrl+enter' ],
  [ SHORTCUTS.history ]: [ 'ctrl+y' ],
  [ SHORTCUTS.bookmarks ]: [ 'ctrl+b' ],
  [ SHORTCUTS.clearDisplay ]: [ 'esc' ],
}

/* Options */
// Unique symbols for each option type
export const OPTION_TYPES = {
  dropdown: Symbol( 'Dropdown' ),
  toggle: Symbol( 'Toggle' ),
  slider: Symbol( 'Slider' ),
  colorPicker: Symbol( 'Color Picker' ),
}

export const PRIVACY_TYPES = {
  local: Symbol( 'Local' ),
  private: Symbol( 'Private Locally' ),
  global: Symbol( 'Server Global' ),
}

// Option names and possible values
export const OPTIONS = {
  spacing: {
    name: 'Spacing',
    type: OPTION_TYPES.dropdown,
    icon: faAlignCenter,
    privacy: PRIVACY_TYPES.local,
    values: [
      { name: 'Space Around', value: 'space-around' },
      { name: 'Space Evenly', value: 'space-evenly' },
      { name: 'Space Between', value: 'space-between' },
      { name: 'Top', value: 'flex-start' },
      { name: 'Middle', value: 'center' },
      { name: 'Bottom', value: 'flex-end' },
    ],
  },
  larivaarGurbani: { name: 'Larivaar Gurbani', icon: faSignature, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  larivaarAssist: { name: 'Larivaar Assist', icon: faBookReader, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  splitOnVishraam: { name: 'Split Long Gurbani Lines on Vishraams', icon: faGripLines, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  englishTranslation: { name: 'English Translation', icon: faClosedCaptioning, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  punjabiTranslation: { name: 'Punjabi Translation', icon: faClosedCaptioning, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  englishTransliteration: { name: 'English Transliteration', icon: farClosedCaptioning, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  previousLines: { name: 'Previous Lines', icon: faAlignJustify, type: OPTION_TYPES.slider, max: 5, step: 1, privacy: PRIVACY_TYPES.local },
  nextLines: { name: 'Next Lines', icon: faAlignJustify, type: OPTION_TYPES.slider, max: 5, step: 1, privacy: PRIVACY_TYPES.local },
  fontSize: { name: 'Font Size', icon: faFont, type: OPTION_TYPES.slider, min: 3, max: 13, step: 0.1, privacy: PRIVACY_TYPES.local },
  themeName: { name: 'Theme Name', icon: faPalette, type: OPTION_TYPES.dropdown, values: [], privacy: PRIVACY_TYPES.local },
  backgroundImage: { name: 'Background Image', icon: faImage, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  simpleGraphics: { name: 'Simple Graphics', icon: faLowVision, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  vishraamColors: { name: 'Vishraam Colors', icon: faFill, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  vishraamTransliterationColors: { name: 'Transliteration Vishraam Colors', icon: faFill, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  vishraamCharacters: { name: 'Vishraam Characters', icon: faDotCircle, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  vishraamLight: { name: 'Vishraam Light', icon: faFillDrip, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  vishraamMedium: { name: 'Vishraam Medium', icon: faFillDrip, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  vishraamHeavy: { name: 'Vishraam Heavy', icon: faFillDrip, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  autoNextShabad: { name: 'Automatic Next Shabad', icon: faAngleDoubleRight, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.local },
  analytics: { name: 'Usage Analytics', icon: faChartPie, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.global },
  launchOnStartup: { name: 'Launch On Startup', icon: faDoorOpen, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.global },
  betaOptIn: { name: 'Beta Updates', icon: faFlask, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.global },
  private: { name: 'Private Settings', icon: faLock, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.private },
  connectionEvents: { name: 'Connections', icon: faPlug, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.global },
  disconnectionEvents: { name: 'Disconnections', icon: faPowerOff, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.global },
  downloadEvents: { name: 'Update Download', icon: faDownload, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.global },
  downloadedEvents: { name: 'Update Download Complete', icon: faArchive, type: OPTION_TYPES.toggle, privacy: PRIVACY_TYPES.global },
}

// Possible options groups
export const OPTION_GROUPS = {
  layout: {
    name: 'Layout',
    icon: faArrowsAltH,
  },
  theme: {
    name: 'Theme',
    icon: faPaintBrush,
  },
  vishraams: {
    name: 'Vishraams',
    icon: faEllipsisH,
  },
  sources: {
    name: 'Sources',
    icon: faBook,
  },
  hotkeys: {
    name: 'Hotkeys',
    icon: faKeyboard,
  },
  security: {
    name: 'Security',
    icon: faShieldAlt,
  },
  notifications: {
    name: 'Notifications',
    icon: faBell,
  },
  system: {
    name: 'System Options',
    icon: faWrench,
  },
}

// Options with default values
export const DEFAULT_OPTIONS = {
  local: {
    layout: {
      spacing: OPTIONS.spacing.values[ 0 ].value,
      larivaarGurbani: false,
      larivaarAssist: false,
      splitOnVishraam: true,
      fontSize: 8,
      englishTranslation: true,
      punjabiTranslation: false,
      englishTransliteration: true,
      nextLines: 1,
      previousLines: 0,
      autoNextShabad: false,
    },
    theme: {
      themeName: 'Day',
      backgroundImage: true,
      fontSize: 40,
      simpleGraphics: false,
    },
    vishraams: {
      vishraamColors: true,
      vishraamTransliterationColors: true,
      vishraamCharacters: false,
      vishraamLight: true,
      vishraamMedium: true,
      vishraamHeavy: true,
    },
    sources: {},
    hotkeys: DEFAULT_SHORTCUT_MAP,
    security: {
      private: false,
    },
  },
  // Special serverside settings
  // ! Must be in sync with settings.default.json
  global: {
    system: {
      launchOnStartup: false,
      analytics: true,
      betaOptIn: false,
    },
    notifications: {
      connectionEvents: true,
      disconnectionEvents: false,
      downloadEvents: true,
      downloadedEvents: true,
    },
  },
}
