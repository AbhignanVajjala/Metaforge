import { useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  ChartLine,
  Check,
  Dna,
  Download,
  FlaskConical,
  Leaf,
  Network,
  Sigma,
  SlidersHorizontal,
} from 'lucide-react';
import { engineeringTargets } from '../data/research';
import './research-context.css';

const fbaStages = [
  {
    title: 'Start with a cell',
    label: 'Genome-scale model',
    icon: Dna,
    heading: 'A map of what metabolism can do.',
    detail: 'A genome-scale model connects metabolites, biochemical reactions, and their associated genes. Here, iRH783 represents Synechocystis, while iHK1487 represents E. coli BL21(DE3).',
    equation: 'S · v = 0',
    equationLabel: 'Steady-state mass balance',
    explanation: 'S describes reaction stoichiometry; v is the vector of reaction fluxes. Internal metabolites are balanced at steady state.',
  },
  {
    title: 'Set the conditions',
    label: 'Environmental constraints',
    icon: SlidersHorizontal,
    heading: 'Define the resources a cell can use.',
    detail: 'Light, glucose, oxygen, reaction directionality, and maintenance demands set the feasible space. Adjusting nutrient limits or the growth requirement changes which flux distributions are possible.',
    equation: 'vₘᵢₙ ≤ v ≤ vₘₐₓ',
    equationLabel: 'Reaction and uptake bounds',
    explanation: 'Bounds encode the modeled environment. A larger uptake limit permits more resource use; it does not establish that cells will consume it.',
  },
  {
    title: 'Find the balance',
    label: 'Mathematical optimization',
    icon: Sigma,
    heading: 'Ask a precise biological question.',
    detail: 'A linear program searches for a feasible flux distribution that maximizes an objective, such as growth or product synthesis. Product optimization can retain a minimum growth requirement.',
    equation: 'max cᵀv',
    equationLabel: 'Optimize the chosen objective',
    explanation: 'The objective vector c selects the reaction to optimize. Multiple different flux distributions may achieve the same optimum.',
  },
  {
    title: 'Explore the possibilities',
    label: 'Predicted growth & fluxes',
    icon: ChartLine,
    heading: 'Turn a feasible solution into a testable idea.',
    detail: 'Compare predicted growth and product capacity across scenarios. Flux variability and sensitivity analyses help identify which hypotheses merit further investigation in the laboratory.',
    equation: 'μ ≥ μᵣₑq',
    equationLabel: 'Retain a required growth rate',
    explanation: 'These outputs are model-dependent predictions, not measured production rates. The interactive labs display precomputed results supplied for this project.',
  },
];

export function HowFBAWorks() {
  const [activeStage, setActiveStage] = useState(0);
  const stage = fbaStages[activeStage];

  return (
    <section className="section-shell ctx-method" id="method" aria-labelledby="method-title">
      <div className="ctx-section-heading">
        <div>
          <p className="eyebrow">THE METHOD</p>
          <h2 className="section-title" id="method-title">A living system. A mathematical lens.</h2>
        </div>
        <p className="section-intro">Flux Balance Analysis explores how a cell can allocate its resources. Follow the journey from biological map to computational prediction.</p>
      </div>
      <div className="ctx-pipeline" aria-label="Explore the four steps of Flux Balance Analysis">
        {fbaStages.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              className={`ctx-stage ${activeStage === index ? 'ctx-stage-active' : ''}`}
              aria-pressed={activeStage === index}
              aria-controls="fba-stage-detail"
              onClick={() => setActiveStage(index)}
            >
              <span className="ctx-stage-top"><span className="ctx-stage-icon"><Icon size={23} strokeWidth={1.5} /></span><span className="ctx-stage-number">0{index + 1}</span></span>
              <span className="ctx-stage-title">{item.title}</span>
              <span className="ctx-stage-label">{item.label}</span>
              <span className="ctx-stage-link" aria-hidden="true"><ArrowRight size={16} /></span>
            </button>
          );
        })}
      </div>
      <div className="ctx-method-detail" id="fba-stage-detail" aria-live="polite" aria-atomic="true">
        <div className="ctx-method-copy">
          <span className="ctx-micro-label">STEP 0{activeStage + 1} / 04</span>
          <h3>{stage.heading}</h3>
          <p>{stage.detail}</p>
        </div>
        <div className="ctx-equation-panel">
          <div className="ctx-equation">{stage.equation}</div>
          <span>{stage.equationLabel}</span>
          <p>{stage.explanation}</p>
        </div>
      </div>
      <p className="ctx-method-footnote"><span className="ctx-status-dot" /> Computational predictions · Steady-state assumptions · Testable hypotheses</p>
    </section>
  );
}

const networkPositions: Record<string, { x: number; y: number; subtitle: string }> = {
  THD2pp: { x: 130, y: 65, subtitle: 'Redox balance' },
  GLUDy: { x: 390, y: 235, subtitle: 'Nitrogen metabolism' },
  ICDHyr: { x: 268, y: 175, subtitle: 'Carbon + NADPH' },
  ACONTa: { x: 140, y: 235, subtitle: 'Citrate conversion' },
  CS: { x: 70, y: 155, subtitle: 'TCA entry' },
};

function CandidateNetwork({ activeId }: { activeId: string }) {
  const connections = [
    { from: 'CS', to: 'ACONTa', path: 'M 70 155 Q 64 218 140 235' },
    { from: 'ACONTa', to: 'ICDHyr', path: 'M 140 235 Q 212 259 268 175' },
    { from: 'ICDHyr', to: 'GLUDy', path: 'M 268 175 Q 350 160 390 235' },
    { from: 'THD2pp', to: 'ICDHyr', path: 'M 130 65 Q 248 42 268 175' },
    { from: 'THD2pp', to: 'GLUDy', path: 'M 130 65 Q 420 31 390 235' },
  ];
  return (
    <div className="ctx-network-panel">
      <div className="ctx-network-heading"><span><Network size={14} /> METABOLIC CONNECTIONS</span><span>iHK1487</span></div>
      <svg viewBox="0 0 490 320" className="ctx-network" role="img" aria-label={`Conceptual metabolic network highlighting ${activeId}. Connections summarize broad biological roles, not complete reaction stoichiometry.`}>
        <defs>
          <pattern id="ctx-network-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="#26323f" /></pattern>
          <radialGradient id="ctx-node-glow"><stop offset="0%" stopColor="#b399ff" stopOpacity="0.17" /><stop offset="100%" stopColor="#b399ff" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="490" height="320" fill="url(#ctx-network-dots)" />
        {connections.map((connection) => {
          const active = connection.from === activeId || connection.to === activeId;
          return <path key={`${connection.from}-${connection.to}`} d={connection.path} className={`ctx-network-path ${active ? 'ctx-network-path-active' : ''}`} />;
        })}
        <text x="215" y="93" className="ctx-network-caption">NADPH</text>
        <text x="189" y="291" className="ctx-network-caption">CENTRAL CARBON</text>
        {Object.entries(networkPositions).map(([id, node]) => {
          const active = id === activeId;
          return (
            <g key={id} className={active ? 'ctx-network-node-active' : 'ctx-network-node'}>
              {active && <circle cx={node.x} cy={node.y} r="65" fill="url(#ctx-node-glow)" />}
              <circle cx={node.x} cy={node.y} r="26" className="ctx-node-outer" />
              <circle cx={node.x} cy={node.y} r="5" className="ctx-node-inner" />
              <text x={node.x} y={node.y + 45} textAnchor="middle" className="ctx-node-label">{id}</text>
              <text x={node.x} y={node.y + 60} textAnchor="middle" className="ctx-node-description">{node.subtitle}</text>
            </g>
          );
        })}
      </svg>
      <p className="ctx-network-note"><span className="ctx-violet-dot" /> Selected pathway <span>Conceptual network · not reaction stoichiometry</span></p>
    </div>
  );
}

export function EngineeringInsights() {
  const [activeId, setActiveId] = useState('THD2pp');
  const selected = engineeringTargets.find((candidate) => candidate.id === activeId) ?? engineeringTargets[0];
  if (!selected) return null;

  return (
    <section className="section-shell ctx-insights" id="insights" aria-labelledby="insights-title">
      <div className="ctx-section-heading">
        <div><p className="eyebrow">FROM SIMULATION TO HYPOTHESIS</p><h2 className="section-title" id="insights-title">Where could engineering begin?</h2></div>
        <p className="section-intro">Explore reactions whose fluxes respond as proinsulin demand increases. These are starting points for investigation, not demonstrated genetic improvements.</p>
      </div>
      <div className="ctx-insights-panel">
        <div className="ctx-candidate-tabs" aria-label="Select a metabolic engineering candidate">
          {engineeringTargets.map((candidate) => (
            <button type="button" className={candidate.id === activeId ? 'ctx-candidate-tab ctx-candidate-tab-active' : 'ctx-candidate-tab'} key={candidate.id} onClick={() => setActiveId(candidate.id)} aria-pressed={candidate.id === activeId} aria-controls="candidate-details">
              <span>{candidate.id}</span><ArrowUpRight size={14} aria-hidden="true" />
            </button>
          ))}
        </div>
        <div className="ctx-insights-body">
          <CandidateNetwork activeId={activeId} />
          <div className="ctx-candidate-detail" id="candidate-details" aria-live="polite" aria-atomic="true">
            <span className="ctx-candidate-tag">COMPUTATIONAL CANDIDATE</span>
            <h3>{selected.name}</h3>
            <p className="ctx-candidate-role">{selected.role}</p>
            <div className="ctx-candidate-facts">
              <div><span>Modeled flux response</span><strong>{selected.direction} direction</strong></div>
              <div><span>Flux variability cross-check</span><strong className={selected.fvaSupported ? 'ctx-supported' : ''}>{selected.fvaSupported && <Check size={13} />} {selected.fvaSupported ? 'Supported in supplied analysis' : 'Not tested in supplied analysis'}</strong></div>
            </div>
            <div className="ctx-gene-section"><span className="ctx-micro-label">ASSOCIATED MODEL GENE IDS</span><div className="ctx-gene-tags">{selected.genes.map((gene) => <code key={gene}>{gene}</code>)}</div></div>
            <p className="ctx-candidate-caveat">A flux association does not establish that overexpressing these genes will increase production. Gene regulation, enzyme capacity, and laboratory validation remain outside this analysis.</p>
          </div>
        </div>
      </div>
      <p className="ctx-source-line">Source: supplied iHK1487 FSEOF candidate screen and flux variability cross-check. Gene IDs are model annotations.</p>
    </section>
  );
}

export function ImpactAndLimitations() {
  return (
    <>
      <section className="section-shell ctx-impact" id="impact" aria-labelledby="impact-title">
        <div className="ctx-impact-heading"><p className="eyebrow">THE BIGGER PICTURE</p><h2 className="section-title" id="impact-title">Small metabolic shifts.<br />Meaningful questions.</h2><p className="section-intro">Two organisms. Two applications. One approach to exploring what sustainable biotechnology could make possible.</p></div>
        <div className="ctx-impact-grid">
          <article className="ctx-impact-application ctx-impact-cyano"><div className="ctx-application-icon"><Leaf size={25} strokeWidth={1.5} /></div><span className="ctx-micro-label">SUSTAINABLE FUEL PRECURSORS</span><h3>Rethinking carbon allocation.</h3><p>Explore how carbon that supports glycogen storage could instead support a proposed engineered TAG pathway in cyanobacteria. TAGs can become biodiesel feedstocks after appropriate processing.</p><div className="ctx-model-label"><span>iRH783</span><em>Synechocystis sp. PCC 6803</em></div></article>
          <article className="ctx-impact-application ctx-impact-ecoli"><div className="ctx-application-icon"><FlaskConical size={25} strokeWidth={1.5} /></div><span className="ctx-micro-label">THERAPEUTIC PROTEIN RESEARCH</span><h3>Understanding the cost of a protein.</h3><p>Explore nutrient availability, growth, and the metabolic demands of an 86-amino-acid human proinsulin precursor. Proinsulin synthesis is one step; maturation and pharmaceutical production require further processes.</p><div className="ctx-model-label"><span>iHK1487</span><em>E. coli BL21(DE3)</em></div></article>
        </div>
        <div className="ctx-limitations"><div className="ctx-limitations-heading"><span className="ctx-micro-label">READING THE RESULTS RESPONSIBLY</span><h3>A model is a starting point<br />for discovery.</h3><p>In-silico analysis helps prioritize hypotheses before laboratory experiments.</p></div><div className="ctx-limitations-list">
          <div><span>01</span><p><strong>Feasible under stated assumptions.</strong> FBA assumes steady-state mass balance. Predicted capacities depend on uptake limits, growth requirements, reaction bounds, and energy assumptions.</p></div>
          <div><span>02</span><p><strong>Computational capacity, not measured output.</strong> The results do not establish biodiesel yields, recombinant expression rates, soluble protein titers, or mature insulin production.</p></div>
          <div><span>03</span><p><strong>Biology extends beyond flux balance.</strong> Regulation, enzyme kinetics, translation capacity, protein folding, and process scale-up require additional modeling and experiments.</p></div>
          <div><span>04</span><p><strong>Context changes the comparison.</strong> Nutrient-related gains reflect changed model constraints. They do not demonstrate genetic improvements or measured industrial cost reductions.</p></div>
        </div></div>
      </section>
      <footer className="ctx-footer">
        <div className="ctx-footer-main">
          <div className="ctx-footer-brand"><a href="#overview" aria-label="Meta Forge, back to top"><Network size={23} strokeWidth={1.7} /><span>META<span className="ctx-brand-light">FORGE</span><span className="ctx-brand-dot">.</span></span></a><p>Engineering metabolism.<br />Exploring possibility.</p></div>
          <div className="ctx-footer-sources"><span className="ctx-micro-label">EXPLORE THE EVIDENCE</span><a href="/research/cyanobacteria-output.txt" download><Download size={14} /> Cyanobacteria research output <span>TXT</span></a><a href="/research/ecoli-output.txt" download><Download size={14} /> E. coli research output <span>TXT</span></a></div>
          <div className="ctx-footer-references"><span className="ctx-micro-label">SCIENTIFIC REFERENCES</span><a href="https://doi.org/10.1038/nbt.1614" target="_blank" rel="noreferrer">What is flux balance analysis? <ArrowUpRight size={14} /></a><span>Orth, Thiele & Palsson · 2010</span><a href="https://cobrapy.readthedocs.io/" target="_blank" rel="noreferrer">COBRApy documentation <ArrowUpRight size={14} /></a></div>
        </div>
        <div className="ctx-footer-bottom"><span>Meta Forge · Research outputs supplied by the project author.</span><span>COMPUTATIONAL EXPLORATION. REAL-WORLD QUESTIONS.</span></div>
      </footer>
    </>
  );
}
