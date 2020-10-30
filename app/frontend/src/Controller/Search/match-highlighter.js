import { stripVishraams, toAscii, firstLetters, stripAccents, toUnicode } from 'gurmukhi-utils'

import { SEARCH_TYPES } from '../../lib/consts'

/**
 * Highlights a full word query against a matched line.
 * Finds the position to highlight in the target string using the Gurmukhi matched line,
 * and using the position of the highlighted words, highlights the same words in the target
 * string.
 */
const fullWordMatches = query => ( { target, gurmukhi } ) => {
  // Remove vishraams to prevent query from not matching
  const baseGurmukhi = stripVishraams( gurmukhi )
  // Remove vishraams from target to prevent vishraams in output
  const baseTarget = stripVishraams( target )

  // Trailing spaces can cause mismatches
  const sanitisedQuery = query.trim()

  // Find the match position, and then backtrack to find the beginning of the word
  const foundPosition = baseGurmukhi.search( sanitisedQuery )
  const matchStartPosition = baseGurmukhi.lastIndexOf( ' ', foundPosition )

  // Search forward to find the end of the match
  const wordEndPosition = baseGurmukhi.indexOf( ' ', foundPosition + sanitisedQuery.length )
  // If the match finishes in the last word, no space will be detected, and wordEndPosition
  // will be -1. In this case, we want to end at the last position in the line.
  const matchEndPosition = wordEndPosition === -1 ? baseGurmukhi.length - 1 : wordEndPosition

  // Grab the start index and length of the entire matching words
  const [ wordMatchStart, wordMatchLength ] = [
    gurmukhi.substring( 0, matchStartPosition ).trim().split( ' ' ).length - 1,
    gurmukhi.substring( matchStartPosition, matchEndPosition ).trim().split( ' ' ).length,
  ]

  const words = baseTarget.split( ' ' )

  return [
    `${words.slice( 0, wordMatchStart ).join( ' ' )} `,
    `${words.slice( wordMatchStart, wordMatchStart + wordMatchLength ).join( ' ' )} `,
    `${words.slice( wordMatchStart + wordMatchLength ).join( ' ' )} `,
  ]
}

/**
 * Highlights a first letter query against a matched line.
 * Finds the words to match in the Gurmukhi string, and highlights
 * the corresponding target string.
 */
const firstLetterMatches = query => ( { target, gurmukhi } ) => {
  // Remove vishraams to prevent query from not matching
  const baseGurmukhi = stripVishraams( gurmukhi )
  // Remove vishraams from target to prevent vishraams in output
  const baseLine = stripVishraams( target )

  // Get only letters, so that simple first letters can be matched
  const letters = toAscii( firstLetters( stripAccents( toUnicode( baseGurmukhi ) ) ) )
  const words = baseLine.split( ' ' )

  // Find the start and end positions of the match, including the entire end word
  const startPosition = letters.search( stripAccents( query ) )
  const endPosition = startPosition + query.length

  return [
    `${words.slice( 0, startPosition ).join( ' ' )} `,
    `${words.slice( startPosition, endPosition ).join( ' ' )} `,
    `${words.slice( endPosition ).join( ' ' )} `,
  ]
}

/**
 * Supported search mode match highlighters.
 * Highlighters must support highlighting against a 1-1 transliteration or gurmukhi string.
 * Highlighters all receive the same parameters.
 * Highlights must return a tuple of [ beforeMatch, match, afterMatch ]
 */
const highlighters = {
  [ SEARCH_TYPES.fullWord ]: fullWordMatches,
  [ SEARCH_TYPES.firstLetter ]: firstLetterMatches,
}

/**
 * Separates the line into words before the first match, the first match, and after the match.
 * @param target The text to highlight.
 * @param context Contains gurmukhi and other contextual information required by all highlighters.
 * @param searchQuery The string inputted by the user.
 * @param searchMode The type of search being performed, either first word or full word.
 * @return An array of [ beforeMatch, match, afterMatch ],
 *   with `match` being the highlighted section.`.
 */
const getHighlighter = ( searchQuery, searchMode ) => context => target => {
  if ( !target ) return [ '', '', '' ]

  // Account for wildcard characters
  const sanitizedQuery = searchQuery.replace( new RegExp( '_', 'g' ), '.' )

  // Select the right highlighter
  const highlight = highlighters[ searchMode ]

  return highlight( sanitizedQuery )( { target, ...context } )
}

export default getHighlighter
