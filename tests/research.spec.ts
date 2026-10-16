import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import {
  CYANO_REFERENCE,
  MOLECULAR_WEIGHT,
  REFERENCE_FLUX,
  REFERENCE_GROWTH,
  REFERENCE_MAX_GROWTH,
  glycogenSensitivity,
  nutrientScenarios,
  proinsulinMassFlux,
  proinsulinTradeoff,
  tagTradeoff,
} from '../src/data/research';

// Read the preserved author outputs as an independent source of truth. These
// checks protect scientific units, source precision, and comparison conditions.
const ecoliSource = readFileSync(new URL('../public/research/ecoli-output.txt', import.meta.url), 'utf8');
const cyanoSource = readFileSync(new URL('../public/research/cyanobacteria-output.txt', import.meta.url), 'utf8');
const nutrientTable = ecoliSource.split('===== NUTRIENT OPTIMIZATION GRID =====')[1]
  .split('===== BEST OPERATING CONDITIONS =====')[0];
const sourceRows = Array.from(nutrientTable.matchAll(
  /^\s+(1\.[012])\s+(1\.[012])\s+(Fixed|Adaptive)\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)\s/gm,
), ([, glucose, oxygen, policy, maxGrowth, requiredGrowth, flux]) => ({
  glucose: Number(glucose),
  oxygen: Number(oxygen),
  policy: policy === 'Fixed' ? 'fixed' as const : 'adaptive' as const,
  maxGrowth: Number(maxGrowth),
  requiredGrowth: Number(requiredGrowth),
  flux: Number(flux),
}));

function sourceNumber(source: string, label: string): number {
  const value = source.match(new RegExp(`${label}: ([\\d.e+-]+)`))?.[1];
  expect(value, `Source contains ${label}`).toBeDefined();
  return Number(value);
}

// The console prints intermediate entries to six decimal places. Endpoints
// have separately printed full precision, so allow at most half a last digit.
const printedTolerance = 0.5e-6;

test('nutrient table covers all nine distinct conditions and both growth policies', () => {
  expect(sourceRows).toHaveLength(18);
  expect(nutrientScenarios).toHaveLength(9);
  expect(new Set(nutrientScenarios.map(({ glucose, oxygen }) => `${glucose}/${oxygen}`)).size).toBe(9);
  for (const glucose of [1, 1.1, 1.2]) {
    for (const oxygen of [1, 1.1, 1.2]) {
      expect(nutrientScenarios.filter(row => row.glucose === glucose && row.oxygen === oxygen)).toHaveLength(1);
    }
  }
});

for (const row of sourceRows) {
  test(`source product and growth: glucose ${row.glucose}x, oxygen ${row.oxygen}x, ${row.policy}`, () => {
    const scenario = nutrientScenarios.find(item => item.glucose === row.glucose && item.oxygen === row.oxygen);
    expect(scenario).toBeDefined();
    if (!scenario) throw new Error('Missing nutrient condition');
    expect(Math.abs(scenario[row.policy] - row.flux)).toBeLessThanOrEqual(printedTolerance);
    expect(Math.abs(scenario.maxGrowth - row.maxGrowth)).toBeLessThanOrEqual(printedTolerance);
    const required = row.policy === 'fixed' ? REFERENCE_GROWTH : scenario.adaptiveRequiredGrowth;
    expect(Math.abs(required - row.requiredGrowth)).toBeLessThanOrEqual(printedTolerance);
    if (row.policy === 'adaptive') {
      // Both the maximum and required growth may have independently rounded
      // six-place values: 0.8 × 0.5e-6 + 0.5e-6 bounds their discrepancy.
      expect(Math.abs(required - 0.8 * scenario.maxGrowth)).toBeLessThanOrEqual(0.9e-6);
    }
  });
}

test('reference growth is the 80% requirement, distinct from maximum growth', () => {
  expect(REFERENCE_MAX_GROWTH).toBe(sourceNumber(ecoliSource, 'Reference max growth'));
  expect(REFERENCE_GROWTH).toBe(sourceNumber(ecoliSource, 'Required reference growth'));
  expect(REFERENCE_GROWTH).toBeCloseTo(0.8 * REFERENCE_MAX_GROWTH, 13);
  expect(REFERENCE_GROWTH).toBeCloseTo(0.6559959324744352, 13);
  expect(REFERENCE_GROWTH).toBeLessThan(REFERENCE_MAX_GROWTH);
});

test('reference and best endpoints preserve the full-precision final outputs', () => {
  const finalOutput = ecoliSource.split('===== FINAL METAFORGE RESULTS =====')[1];
  const reference = nutrientScenarios.find(row => row.glucose === 1 && row.oxygen === 1)!;
  const enriched = nutrientScenarios.find(row => row.glucose === 1.2 && row.oxygen === 1.2)!;
  expect(REFERENCE_FLUX).toBe(sourceNumber(finalOutput, 'Reference proinsulin'));
  expect(reference.fixed).toBe(REFERENCE_FLUX);
  expect(reference.adaptive).toBe(REFERENCE_FLUX);
  expect(enriched.fixed).toBe(sourceNumber(finalOutput, 'Best fixed-growth proinsulin'));
  expect(enriched.adaptive).toBe(sourceNumber(finalOutput, 'Best adaptive-growth proinsulin'));

  const fixedGain = (enriched.fixed / REFERENCE_FLUX - 1) * 100;
  const adaptiveGain = (enriched.adaptive / REFERENCE_FLUX - 1) * 100;
  expect(fixedGain).toBeCloseTo(sourceNumber(finalOutput, 'Fixed-growth production improvement'), 10);
  expect(adaptiveGain).toBeCloseTo(sourceNumber(finalOutput, 'Adaptive-growth production improvement'), 10);
  expect(fixedGain).toBeCloseTo(102.41968527941623, 10);
  expect(adaptiveGain).toBeCloseTo(21.03640965243696, 10);
  expect(enriched.adaptiveRequiredGrowth).toBeCloseTo(0.7939939241331285, 13);
  expect(enriched.adaptiveRequiredGrowth).toBeGreaterThan(REFERENCE_GROWTH);
});

test('proinsulin mass uses mmol-to-mol conversion and agrees with source mass units', () => {
  expect(MOLECULAR_WEIGHT).toBe(9391.55414);
  // One mmol has mass 9.39155414 g, not 9391.55414 g.
  expect(proinsulinMassFlux(1)).toBeCloseTo(9.39155414, 10);
  expect(proinsulinMassFlux(REFERENCE_FLUX)).toBeCloseTo(
    sourceNumber(ecoliSource, 'THEORETICAL PROTEIN MASS FLUX'), 12,
  );
  const enriched = nutrientScenarios.find(row => row.glucose === 1.2 && row.oxygen === 1.2)!;
  expect(Math.abs(proinsulinMassFlux(enriched.fixed) - 0.470563)).toBeLessThan(printedTolerance);
  expect(Math.abs(proinsulinMassFlux(enriched.adaptive) - 0.281372)).toBeLessThan(printedTolerance);

  // The supplied growth-tradeoff plot uses g/gDCW/h, while most other plots
  // use mmol/gDCW/h. Retain both columns and verify they are not interchanged.
  expect(proinsulinTradeoff).toHaveLength(8);
  expect(proinsulinTradeoff[0].flux).toBe(0.0865263);
  expect(proinsulinTradeoff[0].massFlux).toBe(0.8126164);
  for (const row of proinsulinTradeoff) {
    expect(Math.abs(proinsulinMassFlux(row.flux) - row.massFlux)).toBeLessThan(1e-7);
  }
  const fullGrowth = proinsulinTradeoff.find(row => row.growthPercent === 100)!;
  expect(Math.abs(fullGrowth.flux)).toBeLessThan(1e-12);
});

test('cyanobacteria 7.9566% gain belongs to the 80% matched allocation comparison', () => {
  const allocationSource = cyanoSource.split('GLYCOGEN VS TAG CARBON-REDIRECTION TEST:')[1]
    .split('GLYCOGEN STORAGE SENSITIVITY:')[0];
  const referenceBlock = allocationSource.match(/Biomass demand: 80\.0 %[^]*?(?=Biomass demand:)/)?.[0];
  expect(referenceBlock).toBeDefined();
  if (!referenceBlock) throw new Error('Missing source 80% allocation comparison');
  const row = tagTradeoff.find(item => item.biomassPercent === 80)!;
  expect(row.wt).toBe(sourceNumber(referenceBlock, 'WT TAG'));
  expect(row.engineered).toBe(sourceNumber(referenceBlock, 'GLGC-KO TAG'));
  expect(row.wt).toBe(0.019869222251650897);
  expect(row.engineered).toBe(0.021450136618920267);
  const gain = row.engineered - row.wt;
  const percent = gain / row.wt * 100;
  expect(gain).toBeCloseTo(sourceNumber(referenceBlock, 'Absolute TAG gain'), 15);
  expect(percent).toBeCloseTo(7.956599142364595, 10);
  expect(CYANO_REFERENCE.biomassPercent).toBe(80);
  expect(CYANO_REFERENCE.biomassDemand).toBeCloseTo(0.8 * CYANO_REFERENCE.growth, 14);
  expect(CYANO_REFERENCE.tagGainPercent).toBeCloseTo(percent, 10);
  expect(glycogenSensitivity.find(item => item.burden === 1)!.gain).toBeCloseTo(gain, 15);

  // A different comparison in the source (same glycogen-free biomass with
  // only GLGC toggled) has no gain. Do not turn allocation gain into a claim
  // that a knockout alone boosts TAG by 7.96%.
  expect(CYANO_REFERENCE.knockoutOnlyGainPercent).toBe(0);
  const controlSource = cyanoSource.split('GLGC-ONLY EFFECT ON TAG:')[1]
    .split('GLYCOGEN SYNTHESIS REACTIONS:')[0];
  const controlledRows = Array.from(controlSource.matchAll(
    /GLGC-active TAG: ([\d.e+-]+) \| GLGC-KO TAG: ([\d.e+-]+)/g,
  ));
  expect(controlledRows).toHaveLength(9);
  for (const [, active, knockout] of controlledRows) {
    expect(Number(active)).toBe(Number(knockout));
  }
});

test('zero biomass allocation and zero glycogen burden show zero TAG gain', () => {
  const noBiomassDemand = tagTradeoff.find(row => row.biomassPercent === 0)!;
  expect(noBiomassDemand.wt).toBe(noBiomassDemand.engineered);
  expect(noBiomassDemand.wt).toBeCloseTo(CYANO_REFERENCE.unconstrainedTag, 13);
  expect(glycogenSensitivity.find(row => row.burden === 0)!.gain).toBe(0);
  // At 100% demand the WT comparison reaches numerical zero; an enormous
  // relative percentage there would be a denominator artifact.
  expect(Math.abs(tagTradeoff.find(row => row.biomassPercent === 100)!.wt)).toBeLessThan(1e-12);
});
