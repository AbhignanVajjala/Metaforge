# FLUXNOVA

**Redirecting Metabolism. Redefining Possibilities.**

An interactive scientific exhibition exploring two applications of Flux Balance Analysis (FBA): cyanobacteria as a potential source of biodiesel precursors, and *E. coli* as a host for recombinant proinsulin synthesis.

FLUXNOVA is the project presented at the MetaForge hackathon. The GitHub repository remains `AbhignanVajjala/Metaforge`, and the existing Vercel project remains unchanged.

Event theme: **Sustainable Technologies · Emerging Innovations · Ground-Zero Impact Solutions**

The application uses React, TypeScript, Vite, Tailwind CSS, Recharts, Motion, Lucide, and custom SVG/CSS illustrations. It runs entirely in the browser with typed, precomputed research data. It does not require a backend, database, authentication, paid API, Python server, or environment secrets.

## Run locally

Use **Node.js 24 LTS** (recommended) or **Node.js 22.12 or later**, with npm.

```bash
npm ci
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`. The development command binds to `0.0.0.0`, allowing access through a cloud environment's forwarded port.

Build the static application and preview the result:

```bash
npm run build
npm run preview
```

The build runs TypeScript checks before Vite creates the production files in `dist/`. Preview normally runs at `http://localhost:4173`.

## Explore the exhibition

- **Landing and guided tour:** an animated metabolic network, selectable research modules, smooth section navigation, and a guided path through the scientific story.
- **How FBA works:** four interactive stages covering the metabolic model, constraints, optimization, and predicted fluxes.
- **Cyanobacteria lab:** a native/reference versus proposed engineered-pathway selector, an animated carbon-allocation diagram, and three chart views for TAG allocation, light response, and glycogen-burden sensitivity. The numeric table and original-output download support closer inspection.
- **E. coli lab:** independent glucose and oxygen uptake-limit selectors at 1.0×, 1.1×, and 1.2×, with fixed or adaptive minimum growth. Controls update proinsulin flux, required growth, reference improvement, theoretical mass flux, and the comparison chart. Additional views show nutrient effects, growth trade-offs, translation-energy sensitivity, and the growth–production frontier. Clickable heatmaps expose all nine nutrient pairs under both policies.
- **Engineering insights:** interactive model-reaction candidates, biochemical roles, and supplied gene associations for THD2pp, GLUDy, ICDHyr, ACONTa, and CS.
- **Impact and limitations:** the potential applications, interpretation limits, and source-output downloads.

Explanatory copy uses a shared 16–18px type scale, with 14–15px scientific notes, chart labels, and controls. Main heading sizes and the teal/violet design are preserved. Layouts adapt to mobile and desktop. Controls include accessible names and state, charts have textual context, and motion respects reduced-motion preferences. Cyanobacteria chart tabs also support Arrow Left/Right, Home, and End.

## Scientific data and interpretation

All numerical datasets are in [`src/data/research.ts`](src/data/research.ts). The original supplied console outputs are preserved in [`public/research/cyanobacteria-output.txt`](public/research/cyanobacteria-output.txt) and [`public/research/ecoli-output.txt`](public/research/ecoli-output.txt). The uploaded graph images were used to cross-check interpretation; chart values come from the numerical output rather than estimates from pixels.

Read [`docs/DATA_PROVENANCE.md`](docs/DATA_PROVENANCE.md) for source mappings, preserved precision, checksums, derivations, and the important differences between control experiments.

### Units and comparisons

| Quantity | Displayed unit / interpretation |
| --- | --- |
| E. coli proinsulin flux | mmol proinsulin/gDCW/h; gDCW means grams of dry cell weight |
| Theoretical proinsulin mass flux | g proinsulin/gDCW/h, calculated as molar flux × 9391.55414 g/mol ÷ 1000 |
| Predicted growth | h⁻¹ |
| Cyanobacteria TAG capacity | Model flux units, as labeled in the supplied results |
| Red-light intensity | µmol photons m⁻² s⁻¹ |
| Glucose and oxygen selectors | Multipliers on uptake limits, not guaranteed actual uptake |

The reference proinsulin flux is **0.024752978124691682 mmol/gDCW/h**. Fixed growth holds the minimum at **0.6559959324744352 h⁻¹**. Adaptive growth requires **80% of the maximum growth for the selected nutrient condition**.

At 1.2× glucose and 1.2× oxygen, the best fixed-growth flux is **0.050104900417283646 mmol/gDCW/h (+102.42%)**; the best adaptive-growth flux is **0.029960116004179933 (+21.04%)**. These improvements result from changed nutrient constraints and growth policy. They do **not** establish an improvement from genetic engineering. The product is the modeled **86-amino-acid proinsulin precursor**, not mature insulin or a pharmaceutical-grade product. Mass flux is not a measured titer or fermentation yield.

The cyanobacteria **+7.96% theoretical TAG capacity** result compares reference glycogen allocation with no glycogen allocation at **80% matched non-glycogen biomass demand**. Both models include the added engineered TAG pathway. A separate GLGC-only control shows no TAG benefit. The result must not be interpreted as a validated knockout improvement or biodiesel yield. Native glycerolipids, the proposed TAG extension, and downstream processing to biodiesel remain distinct.

These are static FBA predictions subject to model assumptions. Selecting a scenario looks up a reported result; it does not execute a new optimization. Lines connecting sampled points do not create additional simulated observations.

### What is still missing

The original Python/Colab scripts, genome-scale model files, exact model versions, solver/runtime versions, full medium configuration, and executable implementation of the adapted light constraint were not supplied. They would be needed to independently reproduce the underlying COBRApy solver runs. They are **not required to run or deploy this static application**.

Experimental validation, measured product titers, validated genetic interventions, and downstream biodiesel or proinsulin-to-insulin process validation are also absent. A successful frontend build or browser test does not establish scientific or experimental validity.

## Validate

The automated checks cover data consistency and browser interactions, including scenario changes, scientific labels, responsive layout, and chart controls.

```bash
npm run build
npm test
```

Playwright starts the production preview server at `http://127.0.0.1:4173`. The test configuration uses `/usr/bin/chromium` when that browser is available; otherwise, install Playwright's managed Chromium before running the tests:

```bash
npx playwright install chromium
npm test
```

For another existing Chromium executable, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to its absolute path. This variable is only a test-runner override, not a requirement for the application or Vercel deployment. Test failure screenshots and traces are written under ignored test-output directories.

## Project structure

```text
src/
  App.tsx                    Page composition, navigation, guided tour
  main.tsx                   React entry point
  styles.css                 Global design and E. coli styling
  components/
    MetabolicNetwork.tsx     Hero network and organism illustrations
    CyanobacteriaLab.tsx     Carbon pathway and cyanobacteria charts
    cyanobacteria.css        Cyanobacteria layout and responsive pathway
    EcoliLab.tsx             Nutrient controls, metrics, charts, heatmaps
    ResearchContext.tsx      FBA, candidate insights, impact, references
    research-context.css     Scientific context styling
    chartTheme.ts            Shared accessible chart typography
  data/research.ts           Typed source datasets and constants
public/
  favicon.svg
  research/                  Preserved original research outputs
docs/DATA_PROVENANCE.md       Scientific source and interpretation notes
tests/                       Data and browser checks
playwright.config.ts         Browser-test configuration
vite.config.ts               Vite configuration
```

## Commit and deploy

The project is maintained in `AbhignanVajjala/Metaforge` on `main`. The existing deployment is https://metaforge-xi.vercel.app/. Pushes to the connected production branch can trigger Vercel deployment; verify each deployment before sharing it.

Review future changes, then commit and push when ready:

```bash
git status --short
git add .gitignore README.md index.html package.json package-lock.json tsconfig.json vite.config.ts playwright.config.ts src public docs tests
git diff --cached --stat
git commit -m "Update FLUXNOVA biotechnology showcase"
git push -u origin main
```

In Vercel, import `AbhignanVajjala/Metaforge` and configure:

| Setting | Value |
| --- | --- |
| Framework preset | Vite |
| Root directory | Repository root |
| Node.js version | 24.x |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Environment variables | None required |

Create the deployment from `main`. The app uses in-page navigation and relative static assets; it requires no backend functions or client-side route rewrites. Verify the resulting deployment's interactive controls and research downloads before sharing its URL.

## Attribution

FLUXNOVA showcases research outputs supplied by the project author for *Synechocystis* sp. PCC 6803 (iRH783) and *Escherichia coli* BL21(DE3) (iHK1487). Model identifiers and supplied output files are documented in the provenance notes; original papers and complete versioned model metadata should be added when available.
