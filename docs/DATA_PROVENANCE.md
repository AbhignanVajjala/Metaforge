# FLUXNOVA research data provenance and interpretation

FLUXNOVA is a static exhibition of the research outputs supplied by the project author. It does not run COBRApy, an FBA solver, or a biological simulation in the browser. Interactive nutrient controls select among the nine reported nutrient conditions and two reported growth policies. Lines connecting sampled conditions are a visual guide, not additional solver predictions.

The original transcripts retain historical MetaForge labels verbatim for source traceability; the application is branded FLUXNOVA.

## Supplied sources

- `public/research/cyanobacteria-output.txt`: unchanged copy of the cyanobacteria console output, including DAGK corrections, light response, biomass controls, proposed TAG pathway, carbon-allocation comparison, and glycogen sensitivity.
- `public/research/ecoli-output.txt`: unchanged copy of the iHK1487 console output, including reference checks, nutrient grid, growth trade-offs, FSEOF candidates, FVA cross-checks, and energy sensitivity.
- The project brief identifies the organisms, scientific purpose, interface requirements, and proposed application framing. Its rounded example data agree with the console output. The supplied graph images were used as visual cross-checks. Plot values are taken from console data rather than estimated from pixels.

SHA-256 checksums of the preserved source files:

```text
cyanobacteria-output.txt  ff6d7fff9fae22873fcb2b596c4e4ae7a5231a708efcb504d33634b70b01c6a1
ecoli-output.txt          a24ed184b813ccaf935be8b42a57012cf0e480defba6d93bca85896c163aea1d
```

The transcript and graph images were provided, but the executable Python notebooks/scripts, original genome-scale model files, complete environment configuration, and versioned model provenance were not supplied. The website reproduces reported results; this implementation has not independently reproduced the solver runs. A successful web build does not validate a metabolic model.

## Data file mapping

All plotted numerical data live in `src/data/research.ts`.

| Export | Authoritative console-output section | Interpretation |
| --- | --- | --- |
| `nutrientScenarios` | E. coli: NUTRIENT OPTIMIZATION GRID; BEST OPERATING CONDITIONS; FINAL METAFORGE RESULTS | Nine glucose/oxygen uptake-limit pairs; fixed and adaptive product fluxes |
| `REFERENCE_FLUX` | E. coli: FINAL METAFORGE RESULTS | Recalculated reference, 0.024752978124691682 mmol/gDCW/h |
| `REFERENCE_GROWTH` | E. coli: MODEL VALIDATION | Required reference growth, 0.6559959324744352 h⁻¹ |
| `REFERENCE_MAX_GROWTH` | E. coli: MODEL VALIDATION | Reference maximum growth, 0.8199949155930439 h⁻¹ |
| `MOLECULAR_WEIGHT` | E. coli: APPROXIMATE MOLECULAR WEIGHT / MODEL VALIDATION | 9391.55414 g/mol for the 86-amino-acid proinsulin polypeptide |
| `proinsulinTradeoff` | E. coli: Growth requirement (%) table | Product flux at the reported minimum growth fractions, including separate molar and mass units |
| `nutrientBars` | E. coli: nutrient scenario table | Fixed-growth results, selected from the same nutrient grid |
| `translationSensitivity` | E. coli: TRANSLATION ENERGY SENSITIVITY | Four energy costs for reference/enriched nutrients and fixed/adaptive growth |
| `growthProductionTradeoff` | E. coli: GROWTH vs ENFORCED PROINSULIN | Separate product-flux x coordinates and maximum-growth y values for each nutrient condition |
| `candidates` / `engineeringTargets` | E. coli: PRIORITIZED METABOLIC CANDIDATES; FVA CROSS-CHECK | Five computational candidate reactions and their model gene identifiers |
| `lightResponse` | Cyanobacteria: OBSERVATIONS FROM LIGHT VARIATIONS | Eight sampled light conditions under the adapted Höper light constraint |
| `tagTradeoff` | Cyanobacteria: GLYCOGEN VS TAG CARBON-REDIRECTION TEST | Matched non-glycogen biomass demand; reference glycogen allocation versus released allocation |
| `glycogenSensitivity` | Cyanobacteria: GLYCOGEN STORAGE SENSITIVITY | Absolute TAG capacity gain at fixed matched biomass demand |
| `CYANO_REFERENCE` | Cyanobacteria: WT REFERENCE CONDITION and the controls above | Reference values and interpretation context |

## Precision and derived quantities

Full-precision values are retained when printed in the source. Most intermediate E. coli grid cells and sensitivity entries are printed to six decimals, so the data file retains that precision. The reference and best fixed/adaptive endpoints use the full-precision values in FINAL METAFORGE RESULTS. Repeated reference solver outputs differ at approximately 10⁻¹⁵ and are numerically consistent; the final recalculated value is the common reference used by the interface.

The maximum growth for intermediate nutrient scenarios is printed to six decimals. Required adaptive growth is stored from the printed required-growth column, rather than recomputed from an already-rounded maximum. For the enriched 1.2× / 1.2× condition, the full-precision required growth is available in BEST OPERATING CONDITIONS. This avoids adding precision absent from the source.

The E. coli growth-requirement sweep retains its own printed product/mass values and its tiny near-zero 100% point. The cyanobacteria 100% WT TAG value is also preserved as the reported near-zero solver value. These are numerical residuals, not evidence of meaningful product formation at those limits. Percent improvements with a near-zero denominator should not be emphasized.

Theoretical proinsulin mass flux is calculated as:

```text
mass flux [g/gDCW/h] = product flux [mmol/gDCW/h] × 9391.55414 [g/mol] / 1000
```

Percent product improvement is calculated relative to the same reference product flux. This is distinct from glucose-normalized yield improvement. Neither is a concentration, fermentation titer, measured production rate, or predicted manufacturing cost.

## E. coli: what the comparison establishes

The reference glucose and oxygen uptake limits are 10 and 18.5 mmol/gDCW/h. Multipliers in the interface alter these limits; they do not imply identical changes in actual uptake. For example, the fixed-growth oxygen-only +10% and +20% scenarios have the same reported maximum product, and actual oxygen uptake is about 19.401963 rather than the full allowed limit.

The fixed policy preserves the reference minimum growth, approximately 0.655996 h⁻¹, across nutrient conditions. The adaptive policy requires 80% of the maximum growth in each nutrient condition. At 1.2× glucose and 1.2× oxygen, the adaptive requirement rises to 0.7939939241331285 h⁻¹. The reference adaptive and fixed requirements coincide.

The highest fixed-growth product flux, 0.050104900417283646 mmol/gDCW/h, is a 102.41968527941623% increase over reference. The highest adaptive-growth product flux, 0.029960116004179933, is a 21.03640965243696% increase. These improvements arise from nutrient constraints and growth policy. They do not demonstrate a gene-overexpression gain. The separately reported glucose-normalized yield gains are 68.68307106618015% and 0.863674710364104%, respectively.

The first uploaded E. coli growth–proinsulin chart uses **g/gDCW/h** on its y axis; the underlying table also gives **mmol/gDCW/h**. `proinsulinTradeoff` stores both as `massFlux` and `flux`. Other product charts use mmol/gDCW/h. These columns must not be interchanged without changing the label.

Translation sensitivity spans 3–6 ATP equivalents per amino acid. The baseline assumption is 4, or 344 ATP equivalents for an 86-amino-acid product. The supplied output reports a balanced product synthesis reaction, but it does not model transcription capacity, translation capacity, folding, soluble expression, maturation to insulin, purification, or pharmaceutical product quality.

Candidate identifiers and genes are copied from the supplied model. Role descriptions provide general biochemical context. The supplied reaction-level FVA cross-check supports the direction of the THD2pp, GLUDy, ICDHyr, and ACONTa flux responses; CS is marked not tested. FVA support does not validate overexpression or an experimental genetic intervention. GLUDy is a reported **reverse** flux response, unlike the other four selected forward responses. Gene lists are not replacements for the source's AND/OR gene-protein-reaction rules.

## Cyanobacteria: keep the controls distinct

The source describes *Synechocystis* sp. PCC 6803 model iRH783. At the selected 400 µmol photons m⁻² s⁻¹ condition, WT maximum growth is 0.10164484920547336 h⁻¹. The maximum sampled growth in the light-response sweep occurs at 660, but 400 is the author's selected reference, not a claimed optimum.

Nine DAGK reactions were changed from reversible bounds (−1000, 1000) to forward-only bounds (0, 1000). Their supplied equations describe ATP-consuming diacylglycerol kinase activity. The showcased outputs are downstream of this directionality correction; they must not be represented as unmodified-model results or as experimental verification of reaction directionality.

The proposed TAG route adds TES160, FADD160, ATFA160, and a DM_TAG160 product demand. It is distinct from native glycerolipid metabolism. The output reports empty mass-balance residual dictionaries for the three synthetic reactions. No native reactions associated with slr2103 or slr1609 were found in the supplied search. The website must not imply these are verified native TAG routes or assign the engineered reactions to unsupported genes.

Several distinct cyanobacteria comparisons appear in the output:

1. **Direct GLGC knockout with the original WT biomass objective** gives approximately zero growth because that biomass reaction requires glycogen.
2. **Removing glycogen from and renormalizing the biomass composition** restores mutant growth to 0.10052749975127177 h⁻¹, a reported 1.099268% decrease relative to WT. Changing biomass composition changes the comparison; this is not a measured growth effect.
3. **TAG optimization without a growth demand** gives about 0.09934611125824 model flux units in both WT and knockout models, with approximately zero biomass. This is not productive growth at that TAG rate.
4. **GLGC-only control with the same glycogen-free biomass objective** shows no TAG gain from the knockout across the printed growth range. GLGC is already inactive under those optimal conditions.
5. **The plotted carbon-allocation comparison** holds matched non-glycogen biomass demand and compares a reference BOF-equivalent glycogen allocation with no glycogen allocation. Both curves include the engineered TAG pathway. At 80% of the WT reference BM0009 flux, WT TAG capacity is 0.019869222251650897 and the allocation-released value is 0.021450136618920267 model flux units: an absolute gain of 0.0015809143672693704, or 7.956599142364595%.

The plotted comparison is item 5, not the earlier common-growth WT-versus-renormalized-mutant sweep, which shows a different result. Labels should say **matched non-glycogen biomass demand**, not simply equal whole-cell growth. The `engineered` data-field name denotes the no-glycogen-allocation comparison; it does not mean the other curve lacks the engineered TAG route.

The biomass objective contains a glycogen coefficient of 0.0345. Its reported equivalent is 0.2160182651800467 glycogen units per biomass flux. The sensitivity graph fixes matched biomass demand at 0.08131587936437869 and varies the imposed glycogen allocation burden. At burden 1×, glycogen allocation is 0.017565715191883043 model flux units. The graph illustrates sensitivity to an allocation assumption, not measured environmental stress or an experimentally adjustable cellular control.

The supplied TAG graphs explicitly use **model flux units**. No TAG mass productivity or biodiesel conversion yield is inferred. TAGs are potential feedstocks for biodiesel after appropriate processing; the data do not demonstrate biodiesel production, extraction performance, fuel quality, or an industrial process.

## Missing information for independent scientific reproduction

- Original Python/Colab notebooks and exact runtime/package/solver versions.
- Original model files, their version or checksum, complete medium constraints, and all modification scripts.
- The exact source and implementation of the adapted Höper light constraint.
- Experimental measurements of growth, TAG, recombinant proinsulin, and candidate interventions.
- Any downstream biodiesel or proinsulin-to-insulin process validation.

These gaps do not prevent reproducing the supplied frontend visualizations. They do limit independent reproduction and scientific validation of the underlying model results.
