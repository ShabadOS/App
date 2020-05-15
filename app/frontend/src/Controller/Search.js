import React, { useRef, useState, useEffect, useCallback, useContext } from 'react'
import { func, string, oneOfType, number, instanceOf, shape } from 'prop-types'
import { useLocation, useHistory } from 'react-router-dom'
import classNames from 'classnames'

import {
  Input,
  InputAdornment,
  List,
  ListItem,
  IconButton,
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import { stringify } from 'querystring'
import { firstLetters, toAscii } from 'gurmukhi-utils'

import {
  SEARCH_TYPES,
  SEARCH_CHARS,
  LANGUAGE_NAMES,
  SEARCH_ANCHORS,
  MIN_SEARCH_CHARS,
  SOURCE_ABBREVIATIONS,
} from '../lib/consts'
import {
  getUrlState,
  stripPauses,
  getTranslation,
  getTransliteration,
} from '../lib/utils'
import { WritersContext, RecommendedSourcesContext, SettingsContext } from '../lib/contexts'
import controller from '../lib/controller'

import { withNavigationHotkeys } from '../shared/NavigationHotkeys'

import './Search.css'

// Generate the regex for capturing anchor chars, optionally
const searchRegex = new RegExp( `^([${Object.keys( SEARCH_ANCHORS ).map( anchor => `\\${anchor}` ).join( '' )}])?(.*)` )

const getSearchParams = searchQuery => {
  // Extract anchors and search query
  const [ , anchor, query ] = searchQuery.match( searchRegex )

  const inputValue = toAscii( query )

  // Get search type from anchor char, if any
  const type = SEARCH_ANCHORS[ anchor ] || SEARCH_TYPES.firstLetter

  const value = type === SEARCH_TYPES.firstLetter
    ? inputValue.slice().replace( new RegExp( SEARCH_CHARS.wildcard, 'g' ), '_' )
    : inputValue

  return { anchor, value, type }
}

// Separate the line into words before the match, the match, and after the match
const highlightMatches = gurmukhi => ( value, input, mode ) => {
  if ( !value ) return [ '', '', '' ]

  const [ query, splitChar ] = {
    [ SEARCH_TYPES.fullWord ]: () => [ gurmukhi, '' ],
    [ SEARCH_TYPES.firstLetter ]: () => [ firstLetters( gurmukhi ), ' ' ],
  }[ mode ]()

  // Remember to account for wildcard characters
  const pos = query.search( input.slice().replace( new RegExp( '_', 'g' ), '.' ) )
  const words = stripPauses( value ).split( splitChar )

  const beforeMatch = words.slice( 0, pos ).join( splitChar ) + splitChar
  const match = words.slice( pos, pos + input.length ).join( splitChar ) + splitChar
  const afterMatch = words.slice( pos + input.length ).join( splitChar ) + splitChar

  return [ beforeMatch, match, afterMatch ]
}

/**
 * Search Component.
 * Converts ASCII to unicode on input.
 * Displays results.
 */
const Search = ( { updateFocus, register, focused } ) => {
  const { local: {
    sources,
    search: { showResultCitations, resultTransliterationLanguage, resultTranslationLanguage },
  } = {} } = useContext( SettingsContext )

  // Set the initial search query from URL
  const history = useHistory()
  const { search } = useLocation()
  const { query = '' } = getUrlState( search )

  const [ searchedValue, setSearchedValue ] = useState( '' )

  const { anchor: initialAnchor, value: initialInputValue } = getSearchParams( query )
  const inputValue = useRef( initialInputValue )
  const [ anchor, setAnchor ] = useState( initialAnchor )

  const [ results, setResults ] = useState( [] )

  const [ isInputFocused, setInputFocused ] = useState( false )

  const inputRef = useRef( null )

  /**
   * Set the received results and update the searched vale.
   * @param {Object[]} results An array of the returned results.
   */
  const onResults = useCallback( results => {
    setSearchedValue( inputValue.current )
    setResults( results )

    updateFocus( 0 )
  }, [ updateFocus ] )
  /**
   * Run on change of value in the search box.
   * Converts ascii to unicode if need be.
   * Sends the search through to the controller.
   * @param {string} value The new value of the search box.
   */
  const onChange = useCallback( ( { target: { value } } ) => {
    const { anchor, type: searchType, value: searchValue } = getSearchParams( value )

    // Search if enough letters
    const doSearch = searchValue.length >= MIN_SEARCH_CHARS

    if ( doSearch ) {
      controller.search( searchValue, searchType, {
        translations: !!resultTranslationLanguage,
        transliterations: !!resultTransliterationLanguage,
        citations: !!showResultCitations,
      } )
    } else setResults( [] )

    inputValue.current = searchValue
    setAnchor( anchor )

    // Update URL with search
    history.push( { search: `?${stringify( {
      ...getUrlState( search ),
      query: value,
    } )}` } )
  }, [
    history,
    search,
    resultTranslationLanguage,
    resultTransliterationLanguage,
    showResultCitations,
  ] )

  const writers = useContext( WritersContext )
  const recommendedSources = useContext( RecommendedSourcesContext )

  /**
   * Renders a single result, highlighting the match.
   * @param {string} gurmukhi The shabad line to display.
   * @param {string} lineId The id of the line.
   * @param {string} shabadId The id of the shabad.
   * @param {Component} ref The ref to the component.
   * @param {int} sourceId The id of source.
   * @param {Object} shabad The object containng section information and other metadata.
   * @param {int} sourcePage The page number of shabad in source.
   * @param {string} translations The translations of shabad line to display.
   * @param {string} transliterations The transliterations of shabad line to display.
   */
  const Result = ( {
    gurmukhi,
    id: lineId,
    shabadId,
    ref,
    focused,
    sourceId,
    shabad,
    sourcePage,
    translations,
    transliterations,
  } ) => {
    const transliteration = resultTransliterationLanguage && transliterations && getTransliteration(
      { transliterations },
      resultTransliterationLanguage,
    )

    const translation = resultTranslationLanguage && translations && getTranslation( {
      line: { translations },
      shabad: { sourceId },
      recommendedSources,
      sources,
      languageId: resultTranslationLanguage,
    } )

    // Grab the search mode or assume it's first letter
    const mode = SEARCH_ANCHORS[ anchor ] || SEARCH_TYPES.firstLetter

    // Separate the line into words before the match, the match, and after the match
    const getMatches = highlightMatches( gurmukhi )
    const [ beforeMatch, match, afterMatch ] = getMatches( gurmukhi, searchedValue, mode )
    const [ translitBeforeMatch, translitMatch, translitAfterMatch ] = getMatches(
      transliteration,
      searchedValue,
      mode,
    )

    // Send the shabad id and line id to the server on click
    const onClick = () => controller.shabad( { shabadId, lineId } )

    // Helper render functions for citation
    const showCitation = showResultCitations && shabad && shabad.section
    const getEnglish = ( { nameEnglish } ) => nameEnglish
    const getWriterName = () => getEnglish( writers[ shabad.writerId ] )
    const getSection = () => getEnglish( shabad.section )
    const getPageName = () => recommendedSources[ shabad.sourceId ].pageNameEnglish

    return (
      <ListItem className={classNames( { focused } )} key={lineId} onClick={onClick} ref={ref}>
        <div className="result">
          <span className="gurmukhi text">
            {beforeMatch ? <span className="words">{beforeMatch}</span> : null}
            {match ? <span className="matched words">{match}</span> : null}
            {afterMatch ? <span className="words">{afterMatch}</span> : null}
          </span>

          <span className="secondary text">

            {translation && (
              <div className={classNames( LANGUAGE_NAMES[ resultTranslationLanguage ], 'translation' )}>
                {translation}
              </div>
            )}

            {transliteration && (
              <div className={classNames( LANGUAGE_NAMES[ resultTransliterationLanguage ], 'transliteration' )}>
                {translitBeforeMatch ? <span className="translit">{translitBeforeMatch}</span> : null}
                {translitMatch ? <span className="translit matched">{translitMatch}</span> : null}
                {translitAfterMatch ? <span className="translit">{translitAfterMatch}</span> : null}
              </div>
            )}

          </span>

          {showCitation && (
            <span className="citation">
              (
              {`${getWriterName()}. `}
              {[
                `"${getSection()}"`,
                SOURCE_ABBREVIATIONS[ sourceId ],
                `${getPageName()} ${sourcePage}`,
              ].reduce( ( prev, curr ) => [ prev, ', ', curr ] )}
              )
            </span>
          )}

        </div>
      </ListItem>
    )
  }

  Result.propTypes = {
    gurmukhi: string.isRequired,
    id: string.isRequired,
    shabadId: string.isRequired,
    ref: instanceOf( Result ).isRequired,
    sourceId: number.isRequired,
    shabad: shape( { } ).isRequired,
    sourcePage: number.isRequired,
    translations: string.isRequired,
    transliterations: string.isRequired,
  }

  const filterInputKeys = event => {
    const ignoreKeys = [ 'ArrowUp', 'ArrowDown' ]

    if ( ignoreKeys.includes( event.key ) ) event.preventDefault()
  }

  const refocus = ( { target } ) => {
    setInputFocused( false )
    target.focus()
  }

  const highlightSearch = () => inputRef.current.select()

  useEffect( () => {
    controller.on( 'results', onResults )
    return () => controller.off( 'results', onResults )
  }, [ onResults ] )

  useEffect( () => {
    if ( inputValue.current ) onChange( { target: { value: `${anchor || ''}${inputValue.current}` } } )
  }, [
    onChange,
    anchor,
    resultTransliterationLanguage,
    resultTranslationLanguage,
    showResultCitations,
  ] )

  useEffect( () => { highlightSearch() }, [] )

  return (
    <div className="search">
      <Input
        className={classNames( 'input', { 'input-focused': isInputFocused } )}
        inputRef={inputRef}
        onBlur={refocus}
        onKeyDown={filterInputKeys}
        onFocus={() => setInputFocused( true )}
        onChange={onChange}
        value={`${anchor || ''}${inputValue.current}`}
        placeholder="Koj"
        disableUnderline
        autoFocus
        endAdornment={inputValue.current && (
        <InputAdornment>
          <IconButton className="clear" onClick={() => onChange( { target: { value: '' } } )}>
            <FontAwesomeIcon icon={faTimes} />
          </IconButton>
        </InputAdornment>
        )}
        inputProps={{
          spellCheck: false,
          autoCapitalize: 'off',
          autoCorrect: 'off',
          autoComplete: 'off',
        }}
      />
      <List className="results">
        {results
          ? results
            .map( ( props, i ) => Result( {
              ...props,
              ref: c => register( i, c ),
              focused: focused === i,
            } ) )
          : ''}
      </List>
    </div>
  )
}

Search.propTypes = {
  focused: oneOfType( [ string, number ] ),
  register: func.isRequired,
  updateFocus: func.isRequired,
}

Search.defaultProps = {
  focused: undefined,
}

export default withNavigationHotkeys( {
  keymap: {
    next: [ 'down', 'tab' ],
    previous: [ 'up', 'shift+tab' ],
    first: null,
    last: null,
  },
} )( Search )
