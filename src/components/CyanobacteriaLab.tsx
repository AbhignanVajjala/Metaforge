import { useState } from 'react'
import { ArrowDown, ArrowDownRight, ArrowUpRight, FlaskConical, Leaf, MoveRight, Sun, Table2 } from 'lucide-react'
import {
  Area, AreaChart, CartesianGrid, Line, LineChart, ReferenceDot, ReferenceLine,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts'
import { CYANO_REFERENCE, glycogenSensitivity, lightResponse, tagTradeoff } from '../data/research'
import { chartAxisStyle, chartTooltipStyle } from './chartTheme'
import './cyanobacteria.css'

type ChartView = 'allocation' | 'light' | 'glycogen'

const chartCopy: Record<ChartView, { title: string; subtitle: string; xLabel: string; yLabel: string }> = {
  allocation: {
    title: 'A different destination for carbon',
    subtitle: 'Theoretical TAG capacity at matched non-glycogen biomass demand',
    xLabel: 'Non-glycogen biomass demand (% of WT reference)',
    yLabel: 'TAG demand flux · model units',
  },
  light: {
    title: 'More light has a limit',
    subtitle: 'Wild-type growth under the adapted Höper light constraint',
    xLabel: 'Red-light intensity (µmol photons m⁻² s⁻¹)',
    yLabel: 'Predicted growth · h⁻¹',
  },
  glycogen: {
    title: 'Storage changes the opportunity',
    subtitle: 'TAG capacity gain at fixed 80% non-glycogen biomass demand',
    xLabel: 'Glycogen burden (× reference BOF-derived burden)',
    yLabel: 'Absolute TAG gain · model units',
  },
}

function CarbonPathway({ engineered }: { engineered: boolean }) {
  const nativeColor = engineered ? '#536d74' : '#43e4c1'
  const routeColor = engineered ? '#43e4c1' : '#4f686d'
  return (
    <svg className={`cyano-pathway ${engineered ? 'cyano-pathway-engineered' : ''}`} viewBox="0 0 730 340" role="img" aria-labelledby="cyano-pathway-title cyano-pathway-desc">
      <title id="cyano-pathway-title">Carbon allocation in Synechocystis</title>
      <desc id="cyano-pathway-desc">Light and carbon dioxide support carbon fixation, then central carbon metabolism branches into glycogen storage and native glycerolipids. A proposed engineered pathway adds TAG synthesis. {engineered ? 'The engineered TAG branch is highlighted.' : 'The native glycogen storage branch is highlighted.'}</desc>
      <defs>
        <pattern id="cyano-grid" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#536d74" opacity=".17" /></pattern>
        <radialGradient id="cyano-cell-glow"><stop offset="0" stopColor="#43e4c1" stopOpacity=".12" /><stop offset="1" stopColor="#43e4c1" stopOpacity="0" /></radialGradient>
        <marker id="cyano-arrow-native" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L6 3L0 6" fill={nativeColor} /></marker>
        <marker id="cyano-arrow-route" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L6 3L0 6" fill={routeColor} /></marker>
      </defs>
      <rect width="730" height="340" fill="url(#cyano-grid)" />
      <ellipse cx="338" cy="179" rx="200" ry="155" fill="url(#cyano-cell-glow)" />
      <path className="cyano-flowline" d="M90 148 C111 148 108 178 133 178" stroke="#43e4c1" />
      <path className="cyano-flowline" d="M90 224 C111 224 108 193 133 193" stroke="#43e4c1" />
      <path className="cyano-flowline" d="M230 186H294" stroke="#43e4c1" />
      <path className={`cyano-flowline ${!engineered ? 'cyano-flowline-active' : ''}`} d="M410 171C450 171 433 98 469 98" stroke={nativeColor} markerEnd="url(#cyano-arrow-native)" />
      <path className={`cyano-flowline ${engineered ? 'cyano-flowline-active' : ''}`} d="M410 199C450 199 433 260 469 260" stroke={routeColor} markerEnd="url(#cyano-arrow-route)" />
      <path className={`cyano-flowline cyano-proposed ${engineered ? 'cyano-flowline-active' : ''}`} d="M596 260H622" stroke={routeColor} markerEnd="url(#cyano-arrow-route)" />
      <g className="cyano-input">
        <circle cx="58" cy="139" r="24" /><circle cx="58" cy="139" r="7" fill="none" stroke="#d6c894" strokeWidth="1.5" />
        <path d="M58 125v-3M58 156v-3M44 139h-3M75 139h-3M48 129l-2-2M68 149l2 2M48 149l-2 2M68 129l2-2" stroke="#d6c894" strokeWidth="1.5" />
        <text x="58" y="180" textAnchor="middle" className="cyano-svg-small">Sunlight</text>
        <circle cx="58" cy="224" r="24" /><text x="58" y="229" textAnchor="middle" className="cyano-svg-label">CO₂</text>
        <text x="58" y="265" textAnchor="middle" className="cyano-svg-small">Carbon input</text>
      </g>
      <g className="cyano-node">
        <rect x="134" y="154" width="96" height="64" rx="12" />
        <text x="182" y="181" textAnchor="middle" className="cyano-svg-label">Carbon</text><text x="182" y="200" textAnchor="middle" className="cyano-svg-label">fixation</text>
      </g>
      <g className="cyano-core">
        <circle cx="352" cy="186" r="69" className="cyano-core-orbit" />
        <circle cx="352" cy="186" r="58" />
        <circle cx="352" cy="117" r="3.5" fill="#43e4c1" />
        <text x="352" y="178" textAnchor="middle" className="cyano-svg-label">Central carbon</text>
        <text x="352" y="198" textAnchor="middle" className="cyano-svg-label">metabolism</text>
      </g>
      <g className="cyano-node" opacity={engineered ? '.8' : '1'}>
        <rect x="470" y="68" width="126" height="60" rx="12" stroke={nativeColor} />
        <text x="533" y="93" textAnchor="middle" className="cyano-svg-label">Glycogen</text><text x="533" y="111" textAnchor="middle" className="cyano-svg-small">Carbon storage</text>
        <text x="533" y="49" textAnchor="middle" className="cyano-svg-overline">NATIVE ALLOCATION</text>
      </g>
      <g className="cyano-node">
        <rect x="470" y="230" width="126" height="60" rx="12" stroke={routeColor} />
        <text x="533" y="255" textAnchor="middle" className="cyano-svg-label">Glycerolipids</text><text x="533" y="274" textAnchor="middle" className="cyano-svg-small">Native metabolism</text>
      </g>
      <g className="cyano-tag-node" opacity={engineered ? '1' : '.8'}>
        <rect x="624" y="230" width="96" height="60" rx="12" />
        <text x="672" y="255" textAnchor="middle" className="cyano-svg-label">TAG</text><text x="672" y="273" textAnchor="middle" className="cyano-svg-small">Precursor</text>
        <text x="612" y="211" textAnchor="middle" className="cyano-svg-overline">ENGINEERED ROUTE</text>
      </g>
      <text x="352" y="316" textAnchor="middle" className="cyano-svg-small">Conceptual pathway · branch widths do not represent flux</text>
    </svg>
  )
}

export default function CyanobacteriaLab() {
  const [engineered, setEngineered] = useState(false)
  const [chartView, setChartView] = useState<ChartView>('allocation')
  const [tableOpen, setTableOpen] = useState(false)
  const copy = chartCopy[chartView]

  return (
    <section className="cyano-section section-shell" id="cyanobacteria" aria-labelledby="cyano-heading">
      <div className="cyano-heading-row">
        <div>
          <p className="eyebrow cyano-eyebrow"><span className="cyano-lab-number">01</span> THE CYANOBACTERIA LAB</p>
          <h2 className="section-title" id="cyano-heading">Sunlight in. <span className="cyano-text-accent">Possibility out.</span></h2>
          <p className="section-intro">Explore how redirecting photosynthetic carbon could create a new route to sustainable fuel precursors.</p>
        </div>
        <div className="cyano-organism"><Leaf size={18} /><div><em>Synechocystis sp. PCC 6803</em><span>iRH783 · COBRApy FBA</span></div></div>
      </div>

      <div className="cyano-pathway-panel">
        <div className="cyano-panel-header">
          <div><span className="cyano-panel-kicker">FOLLOW THE CARBON</span><h3>One cell. Two destinations.</h3></div>
          <div className="cyano-segmented" role="group" aria-label="Carbon allocation scenario">
            <button type="button" aria-pressed={!engineered} onClick={() => setEngineered(false)}>WT / reference</button>
            <button type="button" aria-pressed={engineered} onClick={() => setEngineered(true)}>Engineered concept <ArrowUpRight size={13} /></button>
          </div>
        </div>
        <div className="cyano-pathway-content">
          <div className="cyano-diagram-wrap"><CarbonPathway engineered={engineered} /><div className={`cyano-mobile-pathway ${engineered ? 'cyano-mobile-engineered' : ''}`} role="img" aria-label={`Sunlight and carbon dioxide support carbon fixation and central metabolism, which branches into glycogen storage and glycerolipids. ${engineered ? 'The proposed engineered TAG route is highlighted.' : 'Native glycogen storage is highlighted.'}`}>
            <div className="cyano-mobile-inputs"><span><Sun size={14} />Sunlight</span><span>CO₂</span></div>
            <ArrowDown className="cyano-mobile-arrow" size={17} /><span className="cyano-mobile-fixation">Photosynthetic carbon fixation</span>
            <div className="cyano-mobile-core">Central carbon metabolism</div>
            <div className="cyano-mobile-branches"><div className="cyano-mobile-storage"><ArrowDown size={17} /><div><strong>Glycogen</strong><span>Native carbon storage</span></div></div><div className="cyano-mobile-lipids"><ArrowDown size={17} /><div><strong>Glycerolipids</strong><span>Native metabolism</span></div><ArrowDown size={17} /><div className="cyano-mobile-tag"><strong>TAG precursor</strong><span>Engineered extension</span></div></div></div>
          </div></div>
          <div className="cyano-scenario-copy" aria-live="polite">
            <span className="cyano-state-label"><span />{engineered ? 'PROPOSED PATHWAY' : 'NATIVE METABOLISM'}</span>
            <h4>{engineered ? 'Rethink carbon storage.' : 'Capture. Grow. Store.'}</h4>
            <p>{engineered ? 'The model adds TES160, FADD160 and ATFA160 to create a theoretical TAG synthesis route. Relaxing glycogen allocation leaves more carbon available to that route.' : 'Photosynthetic carbon supports cell growth, glycogen storage and native membrane lipids. Glycogen is a carbon reserve; TAG synthesis here requires an added engineered pathway.'}</p>
            <div className="cyano-product-route"><FlaskConical size={17} /><span>TAG feedstock</span><MoveRight size={15} /><span>Biodiesel</span></div>
            <p className="cyano-caption">Downstream extraction and chemical processing would be required. No biodiesel yield is measured here.</p>
          </div>
        </div>
        <div className="cyano-pathway-footer"><span><i className="cyano-line-solid" />Native metabolic branch</span><span><i className="cyano-line-dashed" />Proposed engineered extension</span><span className="cyano-computational-label">COMPUTATIONAL HYPOTHESIS</span></div>
      </div>

      <div className="cyano-evidence-panel">
        <div className="cyano-chart-main">
          <div className="cyano-chart-tabs" role="tablist" aria-label="Cyanobacteria research charts">
            {([['allocation', 'Carbon allocation'], ['light', 'Light response'], ['glycogen', 'Glycogen burden']] as const).map(([view, label], index) => <button key={view} type="button" id={`cyano-tab-${view}`} role="tab" tabIndex={chartView === view ? 0 : -1} aria-selected={chartView === view} aria-controls="cyano-chart-panel" onKeyDown={(event) => {
              const tabs: ChartView[] = ['allocation', 'light', 'glycogen']
              const nextIndex = event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : -1
              if (nextIndex >= 0) { event.preventDefault(); setChartView(tabs[nextIndex]); setTableOpen(false); document.getElementById(`cyano-tab-${tabs[nextIndex]}`)?.focus() }
            }} onClick={() => { setChartView(view); setTableOpen(false) }}>{label}</button>)}
          </div>
          <div id="cyano-chart-panel" role="tabpanel" aria-labelledby={`cyano-tab-${chartView}`}>
            <div className="cyano-chart-heading"><h3>{copy.title}</h3><p>{copy.subtitle}</p></div>
            <div className="cyano-chart-unit">{copy.yLabel}</div>
            <div className="cyano-chart" aria-label={`${copy.title}. ${copy.subtitle}`}>
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                {chartView === 'allocation' ? (
                  <LineChart data={tagTradeoff} margin={{ top: 14, right: 24, bottom: 12, left: 0 }} accessibilityLayer>
                    <CartesianGrid stroke="#243140" strokeDasharray="3 5" vertical={false} />
                    <XAxis dataKey="biomassPercent" type="number" domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} axisLine={false} tickLine={false} tick={chartAxisStyle} dy={8} height={38} minTickGap={24} interval="preserveStartEnd" />
                    <YAxis domain={[0, 0.11]} ticks={[0, 0.025, 0.05, 0.075, 0.1]} width={54} tickFormatter={(v: number) => v.toFixed(2)} axisLine={false} tickLine={false} tick={chartAxisStyle} />
                    <Tooltip contentStyle={chartTooltipStyle} wrapperStyle={{ maxWidth: 'calc(100vw - 64px)', whiteSpace: 'normal' }} labelFormatter={(v) => `${v}% matched biomass demand`} formatter={(v) => `${Number(v).toFixed(6)} model units`} />
                    <ReferenceLine x={80} stroke="#798897" strokeDasharray="4 5" />
                    <Line type="linear" dataKey="wt" name="WT + glycogen allocation" stroke="#8295aa" strokeWidth={2} dot={{ r: 3, fill: '#8295aa', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                    <Line type="linear" dataKey="engineered" name="No glycogen allocation (ΔGLGC)" stroke="#43e4c1" strokeWidth={2.5} dot={{ r: 3, fill: '#43e4c1', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                    <ReferenceDot x={80} y={CYANO_REFERENCE.engineeredTag} r={5} fill="#43e4c1" stroke="#0d1723" strokeWidth={2} />
                  </LineChart>
                ) : chartView === 'light' ? (
                  <AreaChart data={lightResponse} margin={{ top: 14, right: 24, bottom: 12, left: 0 }} accessibilityLayer>
                    <defs><linearGradient id="cyano-light-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#43e4c1" stopOpacity={0.17} /><stop offset="100%" stopColor="#43e4c1" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid stroke="#243140" strokeDasharray="3 5" vertical={false} />
                    <XAxis dataKey="light" type="number" domain={[0, 1100]} ticks={[0, 200, 400, 600, 800, 1000]} axisLine={false} tickLine={false} tick={chartAxisStyle} dy={8} height={38} minTickGap={24} interval="preserveStartEnd" />
                    <YAxis domain={[0, 0.12]} ticks={[0, 0.03, 0.06, 0.09, 0.12]} width={54} axisLine={false} tickLine={false} tick={chartAxisStyle} />
                    <Tooltip contentStyle={chartTooltipStyle} wrapperStyle={{ maxWidth: 'calc(100vw - 64px)', whiteSpace: 'normal' }} labelFormatter={(v) => `${v} µmol photons m⁻² s⁻¹`} formatter={(v) => `${Number(v).toFixed(6)} h⁻¹`} />
                    <ReferenceLine x={400} stroke="#798897" strokeDasharray="4 5" />
                    <Area type="linear" dataKey="growth" name="Predicted growth" stroke="#43e4c1" strokeWidth={2.5} fill="url(#cyano-light-fill)" dot={{ r: 3, fill: '#43e4c1', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                    <ReferenceDot x={400} y={CYANO_REFERENCE.growth} r={5} fill="#f0c77c" stroke="#0d1723" strokeWidth={2} />
                  </AreaChart>
                ) : (
                  <AreaChart data={glycogenSensitivity} margin={{ top: 14, right: 24, bottom: 12, left: 0 }} accessibilityLayer>
                    <defs><linearGradient id="cyano-gain-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#43e4c1" stopOpacity={0.17} /><stop offset="100%" stopColor="#43e4c1" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid stroke="#243140" strokeDasharray="3 5" vertical={false} />
                    <XAxis dataKey="burden" type="number" domain={[0, 7]} ticks={[0, 1, 2, 3, 4, 5, 6, 7]} axisLine={false} tickLine={false} tick={chartAxisStyle} dy={8} height={38} minTickGap={24} interval="preserveStartEnd" />
                    <YAxis domain={[0, 0.012]} ticks={[0, 0.003, 0.006, 0.009, 0.012]} width={54} axisLine={false} tickLine={false} tick={chartAxisStyle} />
                    <Tooltip contentStyle={chartTooltipStyle} wrapperStyle={{ maxWidth: 'calc(100vw - 64px)', whiteSpace: 'normal' }} labelFormatter={(v) => `${v}× reference glycogen burden`} formatter={(v) => `${Number(v).toFixed(6)} model units`} />
                    <ReferenceLine x={1} stroke="#798897" strokeDasharray="4 5" />
                    <Area type="linear" dataKey="gain" name="Absolute TAG capacity gain" stroke="#43e4c1" strokeWidth={2.5} fill="url(#cyano-gain-fill)" dot={{ r: 3, fill: '#43e4c1', strokeWidth: 0 }} activeDot={{ r: 5 }} />
                    <ReferenceDot x={1} y={CYANO_REFERENCE.engineeredTag - CYANO_REFERENCE.wtTag} r={5} fill="#f0c77c" stroke="#0d1723" strokeWidth={2} />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
            <div className="cyano-x-label">{copy.xLabel}</div>
            {chartView === 'allocation' && <div className="cyano-chart-legend"><span><i className="cyano-dot-wt" />WT + glycogen allocation</span><span><i className="cyano-dot-tag" />No glycogen allocation</span></div>}
          </div>
        </div>
        <aside className="cyano-chart-insight" aria-live="polite">
          <div className="cyano-insight-icon">{chartView === 'light' ? <Sun size={21} /> : <ArrowDownRight size={21} />}</div>
          <span className="cyano-panel-kicker">{chartView === 'light' ? 'SELECTED WT REFERENCE' : chartView === 'glycogen' ? 'AT REFERENCE BURDEN' : 'THE ALLOCATION EFFECT'}</span>
          <div className="cyano-insight-number">{chartView === 'allocation' ? '+7.96' : chartView === 'light' ? '0.10164' : '+0.001581'}<span>{chartView === 'allocation' ? '%' : chartView === 'light' ? 'h⁻¹' : ''}</span></div>
          <p className="cyano-insight-label">{chartView === 'allocation' ? 'theoretical TAG capacity' : chartView === 'light' ? 'predicted growth rate' : 'TAG flux in model units'}</p>
          <div className="cyano-insight-divider" />
          <p>{chartView === 'allocation' ? 'At 80% matched non-glycogen biomass demand, removing the reference glycogen allocation raises TAG capacity from 0.019869 to 0.021450 model units.' : chartView === 'light' ? 'The chosen reference uses 400 µmol photons m⁻² s⁻¹. Across the sampled conditions, predicted growth peaks at 660 before declining as the modeled light burden rises.' : 'The gain increases with imposed glycogen burden. At 1× the reference biomass-objective-function (BOF) burden, removing that allocation frees additional TAG capacity.'}</p>
          <p className="cyano-insight-note">{chartView === 'light' ? 'An adapted light-constraint model; these values are predictions, not a measured growth curve.' : 'Both quantitative scenarios include the added TAG pathway. The matched glycogen-free control shows no GLGC-only benefit.'}</p>
        </aside>
      </div>
      <div className="cyano-data-footer"><p><span />Precomputed model outputs · original numerical precision retained</p><button type="button" className="cyano-data-button" aria-expanded={tableOpen} aria-controls="cyano-source-table" onClick={() => setTableOpen(!tableOpen)}><Table2 size={14} />{tableOpen ? 'Hide data' : 'View data'}</button></div>
      {tableOpen && <div className="cyano-table-wrap" id="cyano-source-table">
        <table>
          <caption>{copy.title} · supplied simulation output</caption>
          <thead><tr>{(chartView === 'allocation' ? ['Biomass demand (%)', 'WT + glycogen allocation', 'No glycogen allocation'] : chartView === 'light' ? ['Red light (µmol photons m⁻² s⁻¹)', 'Growth (h⁻¹)'] : ['Glycogen burden (×)', 'Absolute TAG gain (model units)']).map((heading) => <th key={heading} scope="col">{heading}</th>)}</tr></thead>
          <tbody>{chartView === 'allocation' ? tagTradeoff.map((row) => <tr key={row.biomassPercent}><th scope="row">{row.biomassPercent}</th><td>{row.wt.toPrecision(7)}</td><td>{row.engineered.toPrecision(7)}</td></tr>) : chartView === 'light' ? lightResponse.map((row) => <tr key={row.light}><th scope="row">{row.light}</th><td>{row.growth.toPrecision(7)}</td></tr>) : glycogenSensitivity.map((row) => <tr key={row.burden}><th scope="row">{row.burden}</th><td>{row.gain.toPrecision(7)}</td></tr>)}</tbody>
        </table>
        <a href="/research/cyanobacteria-output.txt" download>Download original cyanobacteria output <ArrowUpRight size={13} /></a>
      </div>}
    </section>
  )
}
