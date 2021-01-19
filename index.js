const fs = require('fs');
const fetch = require('node-fetch');
require('dotenv').config();

const ENV_API_KEY = process.env.API_KEY;
const ENV_FIGMA_ID = process.env.FIGMA_ID;

const rbaObj = (obj) => {
  return Math.round(item.fills[0].color[obj] * 255);
}

const colorObj = (item) => {
  return `rgba(${rbaObj('r')}, ${rbaObj('g')}, ${rbaObj('b')}, ${item.fills[0].color.a})`
};

const getPalette = (stylesArtboard) => {
  let palette = {};
  const paletteArtboard = stylesArtboard.filter(item => {
    return item.name === 'Theme Colors';
  })[0].children;
  
  const colorBlocks = paletteArtboard.filter(i => i.name == 'showcase/color');
  
  // -------------Let get what we want in Figma--------------- //
  // colorBlocks.forEach(block => {
  //   palette = {...palette, [block.name]: colorObj(block)}
  // });
  // return palette;
  // --------------------------------------------------------- //
  return colorBlocks;
}

async function getStylesArtboard(figmaApiKey, figmaId) {
  const result = await fetch('https://api.figma.com/v1/files/' + figmaId, {
    method: 'GET',
    headers: {
      'X-Figma-Token': figmaApiKey
    }
  });

  const figmaTreeStructure = await result.json();
  const stylesArtboard = figmaTreeStructure.document.children.filter(item => {
    return item.name === 'Product Approved'; // Change this to it's own page maybe
  })[0].children;
  
  return getPalette(stylesArtboard);
}

getStylesArtboard(ENV_API_KEY, ENV_FIGMA_ID).then((res => {
  const data = JSON.stringify(res, null, 2);
  console.log(data);
  fs.writeFileSync('palette.json', data);
}));
