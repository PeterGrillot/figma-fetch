const fs = require('fs');
const mkdirp = require('mkdirp');

const fetch = require('node-fetch');
require('dotenv').config();

const ENV_API_KEY = process.env.API_KEY;
const ENV_FIGMA_ID = process.env.FIGMA_ID;

const DIST = './dist';
const ARTBOARD_NAME = 'baseTheme'; // Change this to your Artboard

const writeJSON = async (name, content) => {
  await mkdirp(DIST);
  fs.writeFileSync(`./${DIST}/${name}.json`, content);
}

const rbaObj = (n) => {
  return Math.round(n * 255);
}

const colorObj = (i) => {
  return `rgba(${rbaObj(i.fills[0].color.r)}, ${rbaObj(i.fills[0].color.g)}, ${rbaObj(i.fills[0].color.b)}, ${i.fills[0].color.a})`
};

const getPalette = (stylesArtboard) => {
  let palette = {};
  stylesArtboard.forEach(block => {
    palette = {...palette, [block.name]: colorObj(block)}
  });
  return palette;
}

async function getStylesArtboard(figmaApiKey, figmaId) {
  const result = await fetch('https://api.figma.com/v1/files/' + figmaId, {
    method: 'GET',
    headers: {
      'X-Figma-Token': figmaApiKey
    }
  });

  const figmaTreeStructure = await result.json();
  // Could be nested, check nesting via console
  const nestedGroup = figmaTreeStructure.document.children[0].children
  const stylesArtboard = nestedGroup.filter(i => {
    return i.name === ARTBOARD_NAME;
  })[0].children;
  
  writeJSON('artboard', JSON.stringify(figmaTreeStructure, null, 2));
  
  return getPalette(stylesArtboard);
}

getStylesArtboard(ENV_API_KEY, ENV_FIGMA_ID).then((res => {
  // Do what you want
  const data = JSON.stringify(res, null, 2);
  
  console.log(data);
  writeJSON('palette', data);
}));
