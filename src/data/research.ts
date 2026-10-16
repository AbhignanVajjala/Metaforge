/**
 * Static research outputs supplied by the project author.
 * See docs/DATA_PROVENANCE.md and public/research/*-output.txt.
 * No values are produced by a live FBA solver in this application.
 */

export type GrowthPolicy = 'fixed' | 'adaptive';
export interface NutrientScenario {
  glucose: number;
  oxygen: number;
  fixed: number;
  adaptive: number;
  maxGrowth: number;
  adaptiveRequiredGrowth: number;
}

export const REFERENCE_FLUX = 0.024752978124691682; // mmol proinsulin / gDCW / h
export const REFERENCE_GROWTH = 0.6559959324744352; // required growth, h^-1
export const REFERENCE_MAX_GROWTH = 0.8199949155930439; // h^-1
export const MOLECULAR_WEIGHT = 9391.55414; // g/mol, canonical 86-aa proinsulin
export const PROINSULIN_LENGTH = 86;
export const BASELINE_TRANSLATION_ENERGY = 4; // ATP equivalents per amino acid
export const BASELINE_GLUCOSE_UPTAKE_LIMIT = 10; // mmol/gDCW/h
export const BASELINE_OXYGEN_UPTAKE_LIMIT = 18.5; // mmol/gDCW/h

// Grid entries retain printed precision. Reference and best endpoints use full precision.
export const nutrientScenarios: NutrientScenario[] = [
  {
    "glucose": 1.0,
    "oxygen": 1.0,
    "fixed": 0.024752978124691682,
    "adaptive": 0.024752978124691682,
    "maxGrowth": 0.8199949155930439,
    "adaptiveRequiredGrowth": 0.6559959324744352
  },
  {
    "glucose": 1.0,
    "oxygen": 1.1,
    "fixed": 0.028473,
    "adaptive": 0.023629,
    "maxGrowth": 0.871313,
    "adaptiveRequiredGrowth": 0.69705
  },
  {
    "glucose": 1.0,
    "oxygen": 1.2,
    "fixed": 0.028473,
    "adaptive": 0.021215,
    "maxGrowth": 0.896885,
    "adaptiveRequiredGrowth": 0.717508
  },
  {
    "glucose": 1.1,
    "oxygen": 1.0,
    "fixed": 0.030007,
    "adaptive": 0.025807,
    "maxGrowth": 0.854926,
    "adaptiveRequiredGrowth": 0.683941
  },
  {
    "glucose": 1.1,
    "oxygen": 1.1,
    "fixed": 0.037727,
    "adaptive": 0.027357,
    "maxGrowth": 0.906244,
    "adaptiveRequiredGrowth": 0.724995
  },
  {
    "glucose": 1.1,
    "oxygen": 1.2,
    "fixed": 0.039289,
    "adaptive": 0.026303,
    "maxGrowth": 0.957561,
    "adaptiveRequiredGrowth": 0.766049
  },
  {
    "glucose": 1.2,
    "oxygen": 1.0,
    "fixed": 0.035262,
    "adaptive": 0.026862,
    "maxGrowth": 0.889857,
    "adaptiveRequiredGrowth": 0.711886
  },
  {
    "glucose": 1.2,
    "oxygen": 1.1,
    "fixed": 0.042981,
    "adaptive": 0.028411,
    "maxGrowth": 0.941175,
    "adaptiveRequiredGrowth": 0.75294
  },
  {
    "glucose": 1.2,
    "oxygen": 1.2,
    "fixed": 0.050104900417283646,
    "adaptive": 0.029960116004179933,
    "maxGrowth": 0.992492,
    "adaptiveRequiredGrowth": 0.7939939241331285
  }
];

// Original growth-requirement sweep. The supplied plot used the massFlux column.
export const proinsulinTradeoff: { growthPercent: number; flux: number; massFlux: number }[] = [
  {
    "growthPercent": 20.0,
    "flux": 0.0865263,
    "massFlux": 0.8126164
  },
  {
    "growthPercent": 40.0,
    "flux": 0.06717518,
    "massFlux": 0.6308793
  },
  {
    "growthPercent": 60.0,
    "flux": 0.04782406,
    "massFlux": 0.4491422
  },
  {
    "growthPercent": 70.0,
    "flux": 0.03707689,
    "massFlux": 0.3482096
  },
  {
    "growthPercent": 80.0,
    "flux": 0.02475298,
    "massFlux": 0.2324689
  },
  {
    "growthPercent": 90.0,
    "flux": 0.01242907,
    "massFlux": 0.1167283
  },
  {
    "growthPercent": 95.0,
    "flux": 0.006232223,
    "massFlux": 0.05853026
  },
  {
    "growthPercent": 100.0,
    "flux": 1.523507e-16,
    "massFlux": 1.43081e-15
  }
];

export const nutrientBars: { label: string; flux: number }[] = [
  {
    "label": "Reference",
    "flux": 0.024752978124691682
  },
  {
    "label": "Glucose +10%",
    "flux": 0.030007
  },
  {
    "label": "Oxygen +10%",
    "flux": 0.028473
  },
  {
    "label": "Both +10%",
    "flux": 0.037727
  },
  {
    "label": "Glucose +20%",
    "flux": 0.035262
  },
  {
    "label": "Oxygen +20%",
    "flux": 0.028473
  },
  {
    "label": "Both +20%",
    "flux": 0.050104900417283646
  }
];

export const translationSensitivity: { atp: number; referenceFixed: number; referenceAdaptive: number; enrichedFixed: number; enrichedAdaptive: number }[] = [
  {
    "atp": 3,
    "referenceFixed": 0.027698,
    "referenceAdaptive": 0.027698,
    "enrichedFixed": 0.052082,
    "enrichedAdaptive": 0.033525
  },
  {
    "atp": 4,
    "referenceFixed": 0.024752978124691682,
    "referenceAdaptive": 0.024752978124691682,
    "enrichedFixed": 0.050104900417283646,
    "enrichedAdaptive": 0.029960116004179933
  },
  {
    "atp": 5,
    "referenceFixed": 0.022374,
    "referenceAdaptive": 0.022374,
    "enrichedFixed": 0.045828,
    "enrichedAdaptive": 0.027081
  },
  {
    "atp": 6,
    "referenceFixed": 0.020412,
    "referenceAdaptive": 0.020412,
    "enrichedFixed": 0.04181,
    "enrichedAdaptive": 0.024706
  }
];

// These are distinct x coordinates for the two nutrient conditions.
export const growthProductionTradeoff: { targetFraction: number; referenceFlux: number; referenceGrowth: number; enrichedFlux: number; enrichedGrowth: number }[] = [
  {
    "targetFraction": 0.0,
    "referenceFlux": 0.0,
    "referenceGrowth": 0.819995,
    "enrichedFlux": 0.0,
    "enrichedGrowth": 0.992492
  },
  {
    "targetFraction": 0.2,
    "referenceFlux": 0.004951,
    "referenceGrowth": 0.787427,
    "enrichedFlux": 0.005992,
    "enrichedGrowth": 0.953073
  },
  {
    "targetFraction": 0.4,
    "referenceFlux": 0.009901,
    "referenceGrowth": 0.754815,
    "enrichedFlux": 0.011984,
    "enrichedGrowth": 0.913601
  },
  {
    "targetFraction": 0.6,
    "referenceFlux": 0.014852,
    "referenceGrowth": 0.721875,
    "enrichedFlux": 0.017976,
    "enrichedGrowth": 0.873732
  },
  {
    "targetFraction": 0.8,
    "referenceFlux": 0.019802,
    "referenceGrowth": 0.688936,
    "enrichedFlux": 0.023968,
    "enrichedGrowth": 0.833863
  },
  {
    "targetFraction": 0.95,
    "referenceFlux": 0.023515,
    "referenceGrowth": 0.664231,
    "enrichedFlux": 0.028462,
    "enrichedGrowth": 0.803961
  }
];

export const lightResponse: { light: number; growth: number }[] = [
  {
    "light": 27.5,
    "growth": 0.026395767524675394
  },
  {
    "light": 50.0,
    "growth": 0.03755741214965074
  },
  {
    "light": 100.0,
    "growth": 0.05686303712190109
  },
  {
    "light": 200.0,
    "growth": 0.08102826115681673
  },
  {
    "light": 400.0,
    "growth": 0.10164484920547336
  },
  {
    "light": 660.0,
    "growth": 0.10637625052728819
  },
  {
    "light": 800.0,
    "growth": 0.10437085661222514
  },
  {
    "light": 1100.0,
    "growth": 0.09481469036304309
  }
];

// Both curves include the engineered TAG route. "engineered" releases glycogen allocation.
export const tagTradeoff: { biomassPercent: number; wt: number; engineered: number }[] = [
  {
    "biomassPercent": 0.0,
    "wt": 0.09934611125823917,
    "engineered": 0.09934611125823917
  },
  {
    "biomassPercent": 20.0,
    "wt": 0.07947688900659267,
    "engineered": 0.07987211759841004
  },
  {
    "biomassPercent": 40.0,
    "wt": 0.059607666754945166,
    "engineered": 0.06039812393858008
  },
  {
    "biomassPercent": 60.0,
    "wt": 0.039738444503297936,
    "engineered": 0.04092413027875017
  },
  {
    "biomassPercent": 80.0,
    "wt": 0.019869222251650897,
    "engineered": 0.021450136618920267
  },
  {
    "biomassPercent": 90.0,
    "wt": 0.009934611125827244,
    "engineered": 0.0117131397890053
  },
  {
    "biomassPercent": 95.0,
    "wt": 0.004967305562915266,
    "engineered": 0.006844641374047819
  },
  {
    "biomassPercent": 99.0,
    "wt": 0.0009934611125860388,
    "engineered": 0.002949842642081995
  },
  {
    "biomassPercent": 100.0,
    "wt": 5.400921138410339e-15,
    "engineered": 0.001976142959090352
  }
];

export const glycogenSensitivity: { burden: number; gain: number }[] = [
  {
    "burden": 0.0,
    "gain": 0.0
  },
  {
    "burden": 0.5,
    "gain": 0.0007904571836349662
  },
  {
    "burden": 1.0,
    "gain": 0.0015809143672693704
  },
  {
    "burden": 2.0,
    "gain": 0.0031618287345389733
  },
  {
    "burden": 3.0,
    "gain": 0.00474274310180834
  },
  {
    "burden": 4.0,
    "gain": 0.00632365746907757
  },
  {
    "burden": 5.0,
    "gain": 0.007904571836346979
  },
  {
    "burden": 5.8,
    "gain": 0.009169303330162375
  },
  {
    "burden": 6.0,
    "gain": 0.009485486203616304
  },
  {
    "burden": 7.0,
    "gain": 0.011066400570885822
  }
];

export const CYANO_REFERENCE = {
  "light": 400,
  "growth": 0.10164484920547336,
  "mutantGrowth": 0.10052749975127177,
  "growthChangePercent": -1.0992681507578261,
  "usablePhotons": 74.02782271300231,
  "atpMaintenance": 15.198594000000002,
  "glycogenBurden": 1,
  "glycogenStorage": 0.017565715191883043,
  "biomassPercent": 80,
  "biomassDemand": 0.08131587936437869,
  "wtTag": 0.019869222251650897,
  "engineeredTag": 0.021450136618920267,
  "tagGainPercent": 7.956599142364595,
  "tagGain": 0.0015809143672693704,
  "unconstrainedTag": 0.09934611125823954,
  "glycogenBiomassFraction": 0.0345,
  "glycogenUnitsPerBiomass": 0.2160182651800467,
  "knockoutOnlyGainPercent": 0
} as const;

export interface EngineeringTarget {
  id: string;
  name: string;
  role: string;
  genes: string[];
  direction: 'Forward' | 'Reverse';
  fvaSupported: boolean;
  caveat: string;
}

export const candidates: EngineeringTarget[] = [
  {
    "id": "THD2pp",
    "name": "NADH/NADPH transhydrogenase",
    "role": "Transfers reducing power between NADH and NADPH, connecting energy metabolism with biosynthesis.",
    "genes": [
      "ECD_01571",
      "ECD_01572"
    ],
    "direction": "Forward",
    "fvaSupported": true,
    "caveat": "Computational flux response supported by the supplied FVA cross-check; no overexpression gain was demonstrated."
  },
  {
    "id": "GLUDy",
    "name": "Glutamate dehydrogenase",
    "role": "Connects nitrogen assimilation and glutamate supply to central carbon metabolism and reducing power.",
    "genes": [
      "ECD_01730",
      "ECD_03077",
      "ECD_03078"
    ],
    "direction": "Reverse",
    "fvaSupported": true,
    "caveat": "The reported increase is in reverse flux magnitude; it is not evidence of a beneficial gene-expression change."
  },
  {
    "id": "ICDHyr",
    "name": "Isocitrate dehydrogenase",
    "role": "Connects TCA-cycle carbon flow with 2-oxoglutarate and NADPH supply.",
    "genes": [
      "ECD_01134"
    ],
    "direction": "Forward",
    "fvaSupported": true,
    "caveat": "FVA supports the predicted directional flux shift; laboratory validation remains necessary."
  },
  {
    "id": "ACONTa",
    "name": "Aconitase",
    "role": "Catalyzes the first half of the citrate-to-isocitrate conversion in the TCA cycle.",
    "genes": [
      "ECD_00117",
      "ECD_01253"
    ],
    "direction": "Forward",
    "fvaSupported": true,
    "caveat": "Genes are alternative model associations, not a validated combination of engineering targets."
  },
  {
    "id": "CS",
    "name": "Citrate synthase",
    "role": "Channels acetyl-CoA into citrate, linking carbon supply with the TCA cycle.",
    "genes": [
      "ECD_00680"
    ],
    "direction": "Forward",
    "fvaSupported": false,
    "caveat": "Prioritized by FSEOF; this candidate was not included in the supplied FVA cross-check."
  }
];

export const engineeringTargets = candidates;

/** Convert mmol/gDCW/h to g/gDCW/h; this is a theoretical mass flux, not a titer. */
export const proinsulinMassFlux = (flux: number): number => flux * MOLECULAR_WEIGHT / 1000;
