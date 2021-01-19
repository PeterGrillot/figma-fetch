# figma-fetch

Fetch Figma File artboard as JSON. You will need to organize and tweak if your Artboard looks diffent than the example shown below.

### Install

```
npm install
```

### Create `.env`

Add Figma API Key and Figma ID (artboard URL) to `.env` file. E.g. https://www.figma.com/file/<FIGMA_ID>/

```
API_KEY=********
FIGMA_ID=*******
```

### Run

```
npm run start
```

Fetches and formats Figma JSON.

#### Input Figma File

![Figma File](./docs/figma.png)

#### Output JSON

![Code Output](./docs/code.png)