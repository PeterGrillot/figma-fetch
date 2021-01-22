const fs = require('fs')
const mkdirp = require('mkdirp')

const DIST = './dist'
const OUTPUT_FILENAME = 'index.ts' // Output filename

const clean = (obj) => {
  for (const propName in obj) {
    if (!Object.keys(obj[propName]).length) {
      delete obj[propName]
    }
  }
  return obj
}
const rbaObj = (n) => {
  return Math.round(n * 255)
}

const isPaletteType = (name) => {
  return name === 'light' ||
         name === 'main' ||
         name === 'dark' ||
         name === 'contrastText'
}

const isActionType = (name) => {
  return name === 'active' ||
         name === 'hover' ||
         name === 'hoverOpacity' ||
         name === 'selected' ||
         name === 'selectedOpacity' ||
         name === 'disabled' ||
         name === 'disabledOpacity' ||
         name === 'disabledBackground' ||
         name === 'focus' ||
         name === 'focusOpacity' ||
         name === 'activatedOpacity'
}

const writeTSFile = async (content) => {
  await mkdirp(DIST)
  fs.writeFileSync(`./${DIST}/${OUTPUT_FILENAME}`, `import { ThemeOptions } from "@material-ui/core";\nconst customTheme: ThemeOptions = ${content};\nexport { customTheme }\n;
  `)
  console.log('\x1b[36m%s\x1b[0m', 'Done!')
}

const colorObj = (i) => {
  return `rgba(${rbaObj(i.fills[0].color.r)},` +
  `${rbaObj(i.fills[0].color.g)},` +
  `${rbaObj(i.fills[0].color.b)},` +
  `${i.fills[0].color.a})`
}

module.exports = {
  clean,
  isPaletteType,
  writeTSFile,
  colorObj,
  isActionType
}
