/**
 * Database related utility functions.
 * @ignore
 */

import { groupBy, last, keyBy } from 'lodash'
import { Lines, Shabads, Banis, Sources, Languages, Writers } from '@shabados/database'

import { MAX_RESULTS } from './consts'

/**
 * Decorates a query function with the ability to accept modifier options.
 * @param {*} queryFn A query function that returns a knex instance.
 */
const withSearchOptions = queryFn => ( query, options = {} ) => [
  [ options.transliterations, model => model.withTransliterations() ],
  [ options.translations, model => model.eager( 'shabad' ).withTranslations() ],
  [ options.citations, model => model.eager( 'shabad.section' ) ],
].reduce(
  ( model, [ option, modifier ] ) => ( option ? modifier( model ) : model ),
  queryFn( query ).limit( MAX_RESULTS ),
)

/**
 * Queries the database for all lines with the first letters of each word.
 * @param {string} letters The letters to search for.
 * @async
 * @returns {Array} A list of lines with the provided first letters of each word.
 */
export const firstLetterSearch = withSearchOptions(
  letters => Lines.query().firstLetters( letters ),
)

/**
 * Queries the database for all lines, containing the full word.
 * @param {string} words The words to search for.
 * @async
 * @returns {Array} A list of lines containing the full word.
 */
export const fullWordSearch = withSearchOptions(
  words => Lines.query().fullWord( words ),
)

/**
 * Gets the Shabad of given `shabadId`, along with all the lines.
 * @param {number|string} shabadId The id of the Shabad to fetch results for.
 * @async
 * @returns {Object} The Shabad with the given `shabadId`.
 */
export const getShabad = shabadId => Shabads
  .query()
  .where( 'shabads.id', shabadId )
  .eager( '[lines, section]' )
  .withTransliterations()
  .withTranslations()
  .then( ( [ shabad ] ) => shabad )

/**
 * Gets the Shabad of given `shabadId`, along with all the lines.
 * @param {number|string} shabadId The id of the Shabad to fetch results for.
 * @async
 * @returns {Object} The Shabad with the given `shabadId`.
 */
export const getShabadByOrderId = orderId => Shabads
  .query()
  .where( 'shabads.order_id', orderId )
  .eager( '[lines, section]' )
  .withTransliterations()
  .withTranslations()
  .then( ( [ shabad ] ) => shabad )

/**
 * Retrieves a list of the available Banis.
 * @async
 * @returns {Array} A list of all banis.
 */
export const getBanis = () => Banis.query()

/**
 * Gets all the lines in a given Bani.
 * @param {number|string} baniId The id of the Bani to fetch lines for.
 * @async
 * @returns {Array} A list of all lines with translations and transliterations.
 */
export const getBaniLines = baniId => Banis
  .query()
  .joinEager( 'lines.shabad' )
  .orderBy( [ 'line_group', 'l.order_id' ] )
  .where( 'banis.id', baniId )
  .withTranslations()
  .withTransliterations()
  .eagerOptions( { minimize: false, aliases: { lines: 'l' } } )
  .then( ( [ bani ] ) => bani )

/**
 * Gets all the sources, with possible translations per source.
 * @async
 * @returns {Array} A list of all sources, with possible translations.
 */
export const getSources = () => Sources
  .query()
  .eager( 'translationSources' )
  .then( sources => sources.reduce( (
    ( acc, { translationSources, id, ...source } ) => ( {
      ...acc,
      [ id ]: {
        ...source,
        translationSources: groupBy(
          translationSources,
          ( { languageId } ) => languageId,
        ),
      },
    } ) ), {} ) )
  .then( sources => ( {
    sources,
    recommended: Object.entries( sources ).reduce( (
      ( acc, [ id, { translationSources, ...source } ] ) => ( {
        ...acc,
        [ id ]: {
          ...source,
          translationSources: Object.entries( translationSources )
            .reduce( ( acc, [ id, sources ] ) => ( { ...acc, [ id ]: last( sources ) } ), {} ),
        },
      } ) ), {} ),
  } ) )

/**
 * Gets all the languages.
 * @async
 * @returns {Array} A list of all languages.
 */
export const getLanguages = () => Languages.query()

export const getWriters = async () => keyBy( await Writers.query(), 'id' )

/**
 * Gets the range of the order IDs of all lines.
 */
export const getShabadRange = () => Shabads
  .query()
  .min( 'order_id AS min' )
  .max( 'order_id AS max' )
  .first()
  .then( ( { min, max } ) => [ min, max ] )
