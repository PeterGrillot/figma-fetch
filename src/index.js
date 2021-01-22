const util = require('util')
const ora = require('ora')

const camelCase = require('lodash.camelcase')
const fetch = require('node-fetch')

require('dotenv').config()

const {
  clean,
  isPaletteType,
  writeTSFile,
  colorObj,
  isActionType
} = require('./helpers')

console.log('\x1b[36m%s\x1b[0m', 'Starting...')
const spinner = ora('Fetching Figma... ').start()

const ENV_API_KEY = process.env.API_KEY
const ENV_FIGMA_ID = process.env.FIGMA_ID

const ARTBOARD_NAME = 'Custom' // Change this to your Artboard

const getThemePalette = (stylesArtboard) => {
  spinner.text = 'Building Palette'
  let themeColors = {}
  stylesArtboard.forEach(themeColor => {
    if (themeColor.name === 'Theme Colors') {
      let tokens = {}
      themeColor.children.forEach(token => {
        if (
          token.name !== 'Action'
        ) {
          let colors = {}
          token.children.forEach(color => {
            const colorName = camelCase(color.name)
            if (isPaletteType(colorName)) {
              colors = {
                ...colors,
                [colorName]: colorObj(color)
              }
            }
          })
          tokens = {
            ...tokens,
            [camelCase(token.name)]: colors
          }
        }
        if (
          token.name === 'Action'
        ) {
          let colors = {}
          token.children.forEach(color => {
            const colorName = camelCase(color.name)
            if (isActionType(colorName)) {
              colors = {
                ...colors,
                [colorName]: colorObj(color)
              }
            }
          })
          tokens = {
            ...tokens,
            [camelCase(token.name)]: colors
          }
        }
      })
      themeColors = { palette: clean(tokens) }
    }
  })
  spinner.stop()
  return themeColors
}

async function getStylesArtboard (figmaApiKey, figmaId) {
  try {
    const result = await fetch('https://api.figma.com/v1/files/' + figmaId, {
      method: 'GET',
      headers: {
        'X-Figma-Token': figmaApiKey
      }
    })
    if (result.status !== 200) {
      console.log('\x1b[31m%s\x1b[0m', `Status ${result.status}`)
      return false
    }
    const figmaTreeStructure = await result.json()
    const nestedGroup = figmaTreeStructure.document.children
    const stylesArtboard = nestedGroup.filter(i => i.name === ARTBOARD_NAME)[0].children

    return getThemePalette(stylesArtboard)
  } catch (error) {
    console.log('\x1b[31m%s\x1b[0m', error)
    return false
  }
}
async function main () {
  try {
    const data = await getStylesArtboard(ENV_API_KEY, ENV_FIGMA_ID)
    writeTSFile(util.inspect(data))
  } catch (error) {
    return false
  }
}

main()
