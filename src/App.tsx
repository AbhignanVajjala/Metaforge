import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronLeft, ChevronRight, FlaskConical, Menu, Play, X } from 'lucide-react'
import { motion, MotionConfig } from 'motion/react'
import MetabolicNetwork, { CellIllustration } from './components/MetabolicNetwork'
import EcoliLab from './components/EcoliLab'
import CyanobacteriaLab from './components/CyanobacteriaLab'
import { HowFBAWorks, EngineeringInsights, ImpactAndLimitations } from './components/ResearchContext'

const tour = [
  {id:'method',label:'Meet the model',text:'Select each stage to see how a metabolic network becomes a prediction.'},
  {id:'cyanobacteria',label:'Follow the carbon',text:'Switch pathway concepts, then explore how glycogen allocation affects theoretical TAG capacity.'},
  {id:'ecoli',label:'Design a nutrient scenario',text:'Try 1.2× glucose and oxygen, then compare fixed and adaptive growth. The requirement changes the result.'},
  {id:'insights',label:'From a result to a hypothesis',text:'Select a candidate reaction to inspect its metabolic role and associated model genes.'},
  {id:'impact',label:'Know what the model can tell us',text:'Explore the possibilities, understand the limits, and download the source outputs.'},
]
export default function App() {
  const [menu, setMenu] = useState(false)
  const [tourStep, setTourStep] = useState<number|null>(null)
  const tourTrigger = useRef<HTMLButtonElement>(null)
  const tourDock = useRef<HTMLElement>(null)
  useEffect(() => {
    if (tourStep === null) return
    tourDock.current?.focus({preventScroll:true})
    const handleKey = (event:KeyboardEvent) => {
      if(event.key === 'Escape') { setTourStep(null); tourTrigger.current?.focus({preventScroll:true}) }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [tourStep])
  const go = (n:number) => { setTourStep(n); document.getElementById(tour[n].id)?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'}) }
  const closeTour = () => { setTourStep(null); tourTrigger.current?.focus({preventScroll:true}) }
  return <MotionConfig reducedMotion="user"><a className="skip-link" href="#main">Skip to content</a><header className="site-header"><a className="wordmark" href="#overview" aria-label="Meta Forge home"><img src="/favicon.svg" width="32" height="32" alt=""/><span>META<span className="wordmark-light">FORGE</span></span></a><nav className={menu?'main-nav open':'main-nav'} aria-label="Main navigation">{[['overview','Overview'],['method','The science'],['cyanobacteria','Virtual labs'],['insights','Insights']].map(([id,label])=><a key={id} href={`#${id}`} onClick={()=>setMenu(false)}>{label}</a>)}</nav><div className="header-actions"><button ref={tourTrigger} className="tour-button" onClick={()=>go(0)}><Play size={13} fill="currentColor"/> Guided tour <ArrowUpRight size={13}/></button><button className="mobile-menu icon-button" aria-expanded={menu} aria-label={menu?'Close navigation':'Open navigation'} onClick={()=>setMenu(!menu)}>{menu?<X/>:<Menu/>}</button></div></header>
    <main id="main">
      <section id="overview" className="hero section-shell"><div className="hero-content"><motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.65}}><p className="eyebrow hero-eyebrow"><span className="status-dot"/> A NEW PERSPECTIVE ON CELLULAR POTENTIAL</p><h1>META <span>FORGE</span><span className="title-period">.</span></h1><h2>Engineering Metabolism<br/>for Real-World Impact</h2><p className="hero-description">Small cells. Extraordinary possibilities.<br/>Explore how computational biology can reimagine the way we make fuels and therapeutic proteins.</p><div className="hero-actions"><a className="primary-button" href="#ecoli">Explore the Simulations <ArrowUpRight size={17}/></a><a className="quiet-link" href="#method">Discover the science <ArrowRight size={16}/></a></div></motion.div><div className="hero-theme"><span>SUSTAINABLE TECHNOLOGIES</span><i/><span>EMERGING INNOVATIONS</span><i/><span>GROUND-ZERO IMPACT SOLUTIONS</span></div></div><motion.div className="hero-art-wrap" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1,delay:.15}}><MetabolicNetwork/></motion.div></section>
      <div className="research-modules section-shell"><a href="#cyanobacteria" className="module-link cyano-module"><CellIllustration/><div><span className="module-kicker">01 / THE CARBON LAB</span><h3>Cyanobacteria <ArrowRight size={20}/> Biodiesel</h3><p>Redirecting carbon. Exploring sustainable fuel precursors.</p><span className="module-species">Synechocystis sp. PCC 6803 <b>iRH783</b></span></div><span className="module-open"><ArrowUpRight size={21}/></span></a><a href="#ecoli" className="module-link ecoli-module"><CellIllustration variant="ecoli"/><div><span className="module-kicker">02 / THE PROTEIN LAB</span><h3>E. coli <ArrowRight size={20}/> Proinsulin</h3><p>Balancing growth. Exploring therapeutic protein synthesis.</p><span className="module-species">Escherichia coli BL21(DE3) <b>iHK1487</b></span></div><span className="module-open"><ArrowUpRight size={21}/></span></a></div>
      <div className="intro-ribbon section-shell"><span><FlaskConical size={15}/> REAL MODELS. EXPLORABLE POSSIBILITIES.</span><p>Flux Balance Analysis maps how cellular resources can support growth and product synthesis.</p><a href="#method" aria-label="Learn how Flux Balance Analysis works"><ArrowDown size={18}/></a></div>
      <HowFBAWorks/>
      <CyanobacteriaLab/>
      <EcoliLab/>
      <EngineeringInsights/>
      <ImpactAndLimitations/>
    </main>
    {tourStep !== null && <aside ref={tourDock} tabIndex={-1} className="tour-dock" aria-label="Guided tour" onKeyDown={e=>{if(e.key==='Escape')closeTour()}}><div className="tour-progress">{tour.map((step,i)=><button key={step.id} className={i===tourStep?'active':i<tourStep?'complete':''} aria-label={`Tour step ${i+1}: ${step.label}`} onClick={()=>go(i)}>{i<tourStep?<Check size={12}/>:i+1}</button>)}</div><div className="tour-copy" aria-live="polite"><span>GUIDED TOUR · {tourStep+1} OF {tour.length}</span><strong>{tour[tourStep].label}</strong><p>{tour[tourStep].text}</p></div><div className="tour-controls"><button className="icon-button" disabled={tourStep===0} aria-label="Previous tour step" onClick={()=>go(tourStep-1)}><ChevronLeft size={19}/></button><button className="primary-button" onClick={()=>tourStep<tour.length-1?go(tourStep+1):closeTour()}>{tourStep<tour.length-1?'Next':'Finish'}<ChevronRight size={16}/></button><button className="icon-button" aria-label="Close guided tour" onClick={closeTour}><X size={19}/></button></div></aside>}
  </MotionConfig>
}
