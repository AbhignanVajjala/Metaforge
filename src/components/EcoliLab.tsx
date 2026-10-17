import { useState } from 'react'
import { ArrowDownToLine, ArrowRight, Beaker, ChevronDown, CircleHelp, Dna, FlaskConical, Leaf, RotateCcw, Wind, Zap } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { chartAxisStyle, chartTooltipStyle, chartLegendStyle } from './chartTheme'
import { MOLECULAR_WEIGHT, REFERENCE_FLUX, REFERENCE_GROWTH, nutrientScenarios, proinsulinTradeoff, nutrientBars, translationSensitivity, growthProductionTradeoff } from '../data/research'

const PURPLE = '#b399ff'
const TEAL = '#43e4c1'
const tipStyle = chartTooltipStyle
const axisStyle = chartAxisStyle
const factors = [1, 1.1, 1.2]
const frontierMap = new Map<number, {flux:number; referenceGrowth?:number; enrichedGrowth?:number}>()
for (const point of growthProductionTradeoff) {
  frontierMap.set(point.referenceFlux, {...frontierMap.get(point.referenceFlux), flux:point.referenceFlux, referenceGrowth:point.referenceGrowth})
  frontierMap.set(point.enrichedFlux, {...frontierMap.get(point.enrichedFlux), flux:point.enrichedFlux, enrichedGrowth:point.enrichedGrowth})
}
const frontierData = [...frontierMap.values()].sort((a,b)=>a.flux-b.flux)
type Policy = 'fixed' | 'adaptive'
type Chart = 'comparison' | 'nutrients' | 'growth' | 'energy' | 'frontier'
const chartNames: {id: Chart; label: string}[] = [{ id:'comparison',label:'Your scenario' }, {id:'nutrients',label:'Nutrient effects'}, {id:'growth',label:'Growth trade-off'}, {id:'energy',label:'Energy sensitivity'}, {id:'frontier',label:'Growth frontier'}]

function ScenarioAxisTick({ x = 0, y = 0, payload }: { x?: number; y?: number; payload?: { value: string } }) {
  const words = String(payload?.value ?? '').split(' ')
  return <text className="recharts-cartesian-axis-tick-value" x={x} y={y} textAnchor="middle" style={chartAxisStyle}>
    {words.map((word, index) => <tspan key={index} x={x} dy={index === 0 ? 18 : 18}>{word}</tspan>)}
  </text>
}

export default function EcoliLab() {
  const [glucose, setGlucose] = useState(1)
  const [oxygen, setOxygen] = useState(1)
  const [policy, setPolicy] = useState<Policy>('fixed')
  const [chart, setChart] = useState<Chart>('comparison')
  const [heatmaps, setHeatmaps] = useState(false)
  const scenario = nutrientScenarios.find(s => s.glucose === glucose && s.oxygen === oxygen)!
  const flux = scenario[policy]
  const growth = policy === 'fixed' ? REFERENCE_GROWTH : scenario.adaptiveRequiredGrowth
  const change = (flux / REFERENCE_FLUX - 1) * 100
  const compare = [{ label:'Reference', flux:REFERENCE_FLUX }, { label:'Selected fixed', flux:scenario.fixed }, { label:'Selected adaptive', flux:scenario.adaptive }]
  const reset = () => { setGlucose(1); setOxygen(1); setPolicy('fixed') }
  const download = () => {
    const rows = ['glucose_multiplier,oxygen_multiplier,policy,proinsulin_mmol_per_gDCW_h,required_growth_per_h,theoretical_mass_g_per_gDCW_h', ...nutrientScenarios.flatMap(s => (['fixed','adaptive'] as const).map(p => `${s.glucose},${s.oxygen},${p},${s[p]},${p === 'fixed' ? REFERENCE_GROWTH : s.adaptiveRequiredGrowth},${s[p] * MOLECULAR_WEIGHT / 1000}`))]
    const url = URL.createObjectURL(new Blob([rows.join('\n')], {type:'text/csv'}))
    const a = document.createElement('a'); a.href = url; a.download = 'fluxnova-proinsulin-scenarios.csv'; a.click(); URL.revokeObjectURL(url)
  }
  const titles: Record<Chart,string> = { comparison:'One cell. Different possibilities.', nutrients:'What changes when nutrients increase?', growth:'Growth and production share resources.', energy:'The energetic cost of a protein.', frontier:'More resources shift the feasible frontier.' }
  const captions: Record<Chart,string> = {
    comparison:'Compare both growth policies under your selected nutrient limits. Every value is a precomputed model result.',
    nutrients:'All seven scenarios use the same fixed minimum growth. Increasing oxygen alone reaches a plateau in this model.',
    growth:'Higher minimum growth leaves less modeled capacity for recombinant proinsulin. Nutrients are held at reference limits.',
    energy:'Higher assumed ATP equivalents per amino acid reduce predicted proinsulin capacity. Reference fixed and adaptive curves overlap.',
    frontier:'Growth is maximized at each enforced product flux. Reference and enriched conditions use different product targets; compare their absolute axes.'
  }
  return <section id="ecoli" className="section-shell ecoli-section">
    <div className="lab-heading"><div><p className="eyebrow violet-text"><span className="section-index">02 /</span> THE PROTEIN LAB</p><h2 className="section-title">A small organism.<br /><span className="violet-text">A therapeutic possibility.</span></h2><p className="section-intro">Explore how nutrient availability and growth requirements shape the theoretical production of human proinsulin.</p></div><span className="model-label"><Dna size={16}/> E. coli BL21(DE3) <span>iHK1487</span></span></div>
    <div className="ecoli-process" aria-label="Proinsulin metabolic process"><span><Leaf size={18}/>Glucose + oxygen</span><ArrowRight size={15}/><span><Zap size={18}/>Amino acids + energy</span><ArrowRight size={15}/><span className="violet-text"><Dna size={18}/>86-aa proinsulin precursor</span></div>
    <div className="simulation-workbench">
      <aside className="simulation-controls">
        <div className="panel-heading"><span><FlaskConical size={16}/> Set the conditions</span><button className="icon-button" aria-label="Reset nutrient scenario" onClick={reset}><RotateCcw size={15}/></button></div>
        <p className="control-intro">Change an input. Explore the response.</p>
        <fieldset className="nutrient-control"><legend><Leaf size={15}/> Glucose uptake limit</legend><div className="segmented" aria-label="Glucose uptake multiplier">{factors.map(f => <button key={f} aria-pressed={glucose === f} onClick={() => setGlucose(f)}>{f.toFixed(1)}×</button>)}</div><span className="control-detail">{(glucose * 10).toFixed(1)} mmol/gDCW/h maximum uptake</span></fieldset>
        <fieldset className="nutrient-control"><legend><Wind size={15}/> Oxygen uptake limit</legend><div className="segmented" aria-label="Oxygen uptake multiplier">{factors.map(f => <button key={f} aria-pressed={oxygen === f} onClick={() => setOxygen(f)}>{f.toFixed(1)}×</button>)}</div><span className="control-detail">{(oxygen * 18.5).toFixed(2)} mmol/gDCW/h maximum uptake</span></fieldset>
        <fieldset className="growth-control"><legend>Growth policy <span title="Fixed holds the reference growth requirement. Adaptive requires 80% of the maximum growth for the selected nutrients."><CircleHelp size={13}/></span></legend>{(['fixed','adaptive'] as const).map(p => <button key={p} className="policy-option" aria-pressed={policy === p} onClick={() => setPolicy(p)}><span className="radio-dot"/><span>{p === 'fixed' ? 'Fixed minimum growth' : 'Adaptive minimum growth'}<small>{p === 'fixed' ? 'Hold the reference requirement' : '80% of condition-specific maximum'}</small></span></button>)}</fieldset>
        <div className="model-note"><Beaker size={16}/><p>Precomputed FBA results.<br/>No live solver or experimental titers.</p></div>
      </aside>
      <div className="simulation-output">
        <div className="output-heading"><span className="eyebrow violet-text"><span className="status-dot"/> MODEL PREDICTION</span><button className="text-button" onClick={download}><ArrowDownToLine size={14}/> Export data</button></div>
        <div className="primary-result" aria-live="polite" aria-atomic="true"><div><span className="result-label">Theoretical proinsulin flux</span><strong data-testid="proinsulin-flux">{flux.toFixed(6)}</strong><span className="result-unit">mmol / gDCW / h</span></div><span className={`change-pill ${change < 0 ? 'negative' : ''}`} data-testid="flux-improvement">{change >= 0 ? '+' : ''}{change.toFixed(2)}%<small>vs. reference</small></span></div>
        <div className="chart-tabs" aria-label="Proinsulin chart">{chartNames.map(c => <button key={c.id} aria-pressed={chart === c.id} onClick={() => setChart(c.id)}>{c.label}</button>)}</div>
        <div className="chart-title-row"><h3>{titles[chart]}</h3><span>{chart === 'frontier' ? 'Growth · h⁻¹' : 'Proinsulin · mmol/gDCW/h'}</span></div>
        <div className={`ecoli-chart ecoli-chart-${chart}`} role="group" aria-label={titles[chart] + ' ' + captions[chart]}>
          <ResponsiveContainer width="100%" height="100%">
          {chart === 'comparison' ? <BarChart data={compare} margin={{top:18,right:16,left:0,bottom:8}} barSize={65}><CartesianGrid vertical={false} stroke="#243140" strokeDasharray="3 5"/><XAxis dataKey="label" tick={<ScenarioAxisTick/>} axisLine={false} tickLine={false} interval={0} height={54}/><YAxis tick={axisStyle} axisLine={false} tickLine={false} width={56} domain={[0,0.06]} ticks={[0,0.02,0.04,0.06]} tickFormatter={v=>Number(v).toFixed(2)}/><Tooltip contentStyle={tipStyle} cursor={{fill:'#ffffff05'}} formatter={v=>[Number(v).toFixed(6),'Proinsulin flux']}/><Bar dataKey="flux" radius={[5,5,0,0]} isAnimationActive={false}>{compare.map((_,i)=><Cell key={i} fill={i===0?'#435267':i===1?PURPLE:TEAL}/>)}</Bar></BarChart>
          : chart === 'nutrients' ? <BarChart data={nutrientBars} layout="vertical" margin={{top:12,right:24,left:0,bottom:12}} barSize={22}><CartesianGrid horizontal={false} stroke="#243140" strokeDasharray="3 5"/><XAxis type="number" tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={v=>Number(v).toFixed(2)} ticks={[0,0.02,0.04,0.06]} domain={[0,0.06]} minTickGap={20} height={36}/><YAxis type="category" dataKey="label" tick={axisStyle} width={112} axisLine={false} tickLine={false} interval={0}/><Tooltip contentStyle={tipStyle} formatter={v=>[Number(v).toFixed(6),'Proinsulin flux']}/><Bar dataKey="flux" fill={PURPLE} radius={[4,4,0,0]}/></BarChart>
          : chart === 'growth' ? <LineChart data={proinsulinTradeoff} margin={{top:18,right:24,left:0,bottom:12}}><CartesianGrid stroke="#243140" strokeDasharray="3 5"/><XAxis dataKey="growthPercent" type="number" domain={[20,100]} tick={axisStyle} tickFormatter={v=>`${v}%`} ticks={[20,40,60,80,100]} minTickGap={24} height={36} axisLine={false} tickLine={false}/><YAxis tick={axisStyle} width={56} axisLine={false} tickLine={false}/><Tooltip contentStyle={tipStyle} labelFormatter={v=>`${v}% of reference growth`} formatter={v=>[Number(v).toFixed(6),'Proinsulin flux']}/><ReferenceLine x={80} stroke="#8290a6" strokeDasharray="4 4"/><Line type="linear" dataKey="flux" stroke={PURPLE} strokeWidth={2.5} dot={{r:4,fill:PURPLE,stroke:'#111e2b',strokeWidth:2}}/></LineChart>
          : chart === 'energy' ? <LineChart data={translationSensitivity} margin={{top:18,right:24,left:0,bottom:8}}><CartesianGrid stroke="#243140" strokeDasharray="3 5"/><XAxis dataKey="atp" tick={axisStyle} height={36} minTickGap={24} axisLine={false} tickLine={false}/><YAxis tick={axisStyle} width={56} axisLine={false} tickLine={false}/><Tooltip contentStyle={tipStyle} labelFormatter={v=>`${v} ATP equivalents / amino acid`} formatter={v=>Number(v).toFixed(6)}/><Legend wrapperStyle={chartLegendStyle}/><Line dataKey="enrichedFixed" name="1.2× nutrients · fixed" stroke={PURPLE} strokeWidth={2}/><Line dataKey="enrichedAdaptive" name="1.2× nutrients · adaptive" stroke={TEAL} strokeWidth={2}/><Line dataKey="referenceFixed" name="Reference · fixed" stroke="#f4bb77" strokeWidth={2}/><Line dataKey="referenceAdaptive" name="Reference · adaptive" stroke="#8eb9ff" strokeDasharray="4 5" strokeWidth={2}/></LineChart>
          : <LineChart data={frontierData} margin={{top:18,right:24,left:0,bottom:8}}><CartesianGrid stroke="#243140" strokeDasharray="3 5"/><XAxis type="number" dataKey="flux" domain={[0,0.03]} tick={axisStyle} ticks={[0,0.01,0.02,0.03]} minTickGap={24} height={36} axisLine={false} tickLine={false} tickFormatter={v=>Number(v).toFixed(3)}/><YAxis domain={[0.6,1.05]} tick={axisStyle} width={56} axisLine={false} tickLine={false}/><Tooltip contentStyle={tipStyle} labelFormatter={v=>`${Number(v).toFixed(5)} mmol/gDCW/h`} formatter={v=>Number(v).toFixed(5)}/><Legend wrapperStyle={chartLegendStyle}/><Line connectNulls dataKey="enrichedGrowth" name="Both +20%" stroke={PURPLE} strokeWidth={2.5}/><Line connectNulls dataKey="referenceGrowth" name="Reference" stroke={TEAL} strokeWidth={2.5}/></LineChart>}
          </ResponsiveContainer>
        </div>
        <div className="ecoli-x-label">{chart === 'growth' ? 'Minimum growth (% of reference)' : chart === 'energy' ? 'ATP equivalents per amino acid' : chart === 'frontier' ? 'Enforced proinsulin (mmol/gDCW/h)' : chart === 'nutrients' ? 'Proinsulin (mmol/gDCW/h)' : 'Nutrient / growth-policy scenario'}</div><p className="chart-caption">{captions[chart]}</p>
      </div>
    </div>
    <div className="result-strip" aria-live="polite"><div><span>Required bacterial growth</span><strong data-testid="required-growth">{growth.toFixed(6)} <small>h⁻¹</small></strong></div><div><span>Theoretical mass production</span><strong data-testid="mass-flux">{(flux*MOLECULAR_WEIGHT/1000).toFixed(6)} <small>g/gDCW/h</small></strong></div><div><span>Selected nutrient condition</span><strong>{glucose.toFixed(1)}× <small>glucose</small> · {oxygen.toFixed(1)}× <small>O₂</small></strong></div></div>
    <p className="scientific-callout"><CircleHelp size={17}/><span><strong>Read the result in context.</strong> The best fixed-growth result is 0.050105 mmol/gDCW/h (+102.42%); the best adaptive result is 0.029960 (+21.04%). These changes reflect nutrient and growth constraints. Proinsulin is a precursor that requires folding and processing into mature insulin.</span></p>
    <button className="heatmap-toggle" aria-expanded={heatmaps} aria-controls="nutrient-heatmaps" onClick={()=>setHeatmaps(!heatmaps)}><span><span className="eyebrow">THE COMPLETE PICTURE</span><strong>Explore the nutrient landscape</strong></span><span>18 precomputed conditions <ChevronDown className={heatmaps?'rotated':''} size={20}/></span></button>
    {heatmaps && <div id="nutrient-heatmaps" className="heatmap-exhibit">{(['fixed','adaptive'] as const).map(p=><div key={p} className="heatmap-panel"><h3>{p==='fixed'?'Fixed minimum growth':'Adaptive minimum growth'}</h3><p>{p==='fixed'?'Same growth requirement across all nutrient conditions.':'80% of each condition’s maximum growth.'}</p><div className="heatmap-wrapper"><span className="heatmap-y-label">Oxygen uptake limit</span><div className="heatmap-grid"><span/>{factors.map(f=><span className="heatmap-axis" key={f}>{f.toFixed(1)}×</span>)}{[...factors].reverse().map(o=><div className="heatmap-row" key={o}><span className="heatmap-axis">{o.toFixed(1)}×</span>{factors.map(g=>{const s=nutrientScenarios.find(v=>v.glucose===g&&v.oxygen===o)!;return <button key={g} style={{background:`rgba(179,153,255,${0.1+s[p]/0.051*0.65})`}} className={glucose===g&&oxygen===o&&policy===p?'selected':''} aria-label={`${p}, glucose ${g.toFixed(1)}, oxygen ${o.toFixed(1)}, flux ${s[p].toFixed(6)}`} onClick={()=>{setGlucose(g);setOxygen(o);setPolicy(p);setChart('comparison')}}>{s[p].toFixed(4)}</button>})}</div>)}</div></div><span className="heatmap-x-label">Glucose uptake limit · click a cell to explore</span></div>)}<p className="heatmap-footnote">Both heatmaps share the same color scale. Values are mmol proinsulin/gDCW/h. Mass uses the supplied molecular weight of 9,391.55414 g/mol.</p></div>}
  </section>
}
