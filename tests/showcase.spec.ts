import { test, expect } from '@playwright/test'
import { nutrientScenarios, MOLECULAR_WEIGHT, REFERENCE_GROWTH, engineeringTargets } from '../src/data/research'

test('all nutrient combinations and growth policies update correct numerical outputs', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', e=>errors.push(e.message))
  await page.goto('/#ecoli')
  const lab = page.locator('#ecoli')
  for (const scenario of nutrientScenarios) {
    await lab.locator('[aria-label="Glucose uptake multiplier"]').getByRole('button',{name:`${scenario.glucose.toFixed(1)}×`,exact:true}).click()
    await lab.locator('[aria-label="Oxygen uptake multiplier"]').getByRole('button',{name:`${scenario.oxygen.toFixed(1)}×`,exact:true}).click()
    for (const policy of ['fixed','adaptive'] as const) {
      await lab.getByRole('button',{name:policy==='fixed'?'Fixed minimum growth Hold the reference requirement':'Adaptive minimum growth 80% of condition-specific maximum'}).click()
      await expect(lab.getByTestId('proinsulin-flux')).toHaveText(scenario[policy].toFixed(6))
      await expect(lab.getByTestId('required-growth')).toContainText((policy==='fixed'?REFERENCE_GROWTH:scenario.adaptiveRequiredGrowth).toFixed(6))
      await expect(lab.getByTestId('mass-flux')).toContainText((scenario[policy]*MOLECULAR_WEIGHT/1000).toFixed(6))
    }
  }
  await expect(lab.getByTestId('flux-improvement')).toContainText('+21.04%')
  await lab.getByRole('button',{name:'Fixed minimum growth Hold the reference requirement'}).click()
  await expect(lab.getByTestId('flux-improvement')).toContainText('+102.42%')
  await lab.getByRole('button',{name:'Reset nutrient scenario'}).click()
  await expect(lab.getByTestId('proinsulin-flux')).toHaveText('0.024753')
  for (const label of ['Nutrient effects','Growth trade-off','Energy sensitivity','Growth frontier','Your scenario']) {
    await lab.getByRole('button',{name:label,exact:true}).click()
    await expect(lab.locator('.ecoli-chart svg.recharts-surface[role="application"]')).toBeVisible()
  }
  expect(errors).toEqual([])
})

test('heatmaps select conditions and CSV/source downloads contain research data', async ({page}) => {
  await page.goto('/#ecoli')
  await page.getByRole('button',{name:/Explore the nutrient landscape/}).click()
  await page.getByRole('button',{name:'adaptive, glucose 1.0, oxygen 1.2, flux 0.021215',exact:true}).click()
  await expect(page.getByTestId('proinsulin-flux')).toHaveText('0.021215')
  await expect(page.getByTestId('flux-improvement')).toContainText('-14.29%')
  const downloading=page.waitForEvent('download')
  await page.getByRole('button',{name:'Export data'}).click()
  const download=await downloading
  expect(download.suggestedFilename()).toBe('fluxnova-proinsulin-scenarios.csv')
  const stream=await download.createReadStream()
  const chunks=[]
  for await(const chunk of stream!)chunks.push(chunk)
  const csv=Buffer.concat(chunks).toString()
  expect(csv.trim().split('\n')).toHaveLength(19)
  expect(csv).toContain('1.2,1.2,fixed,0.050104900417283646')
  const source=await page.request.get('/research/ecoli-output.txt')
  expect(source.ok()).toBeTruthy()
  expect(await source.text()).toContain('PROINSULIN LENGTH: 86')
})

test('cyanobacteria, methodology and candidate controls explain the selected research', async({page})=>{
  await page.goto('/')
  await page.getByRole('button',{name:'Engineered concept'}).click()
  await expect(page.locator('.cyano-scenario-copy')).toContainText('TES160, FADD160 and ATFA160')
  await page.getByRole('tab',{name:'Light response'}).click()
  await expect(page.getByRole('tabpanel')).toContainText('More light has a limit')
  await page.getByRole('button',{name:'View data',exact:true}).click()
  await expect(page.locator('#cyano-source-table')).toContainText('400')
  await page.getByRole('tab',{name:'Light response'}).focus()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('tab',{name:'Glycogen burden'})).toHaveAttribute('aria-selected','true')
  await page.getByRole('button',{name:/Set the conditions Environmental constraints/}).click()
  await expect(page.locator('#fba-stage-detail')).toContainText('Define the resources a cell can use')
  for(const target of engineeringTargets){
    const tab = page.locator('.ctx-candidate-tab').filter({hasText:target.id})
    await tab.click()
    await expect(tab).toHaveAttribute('aria-pressed','true')
    await expect(page.locator('#candidate-details')).toContainText(target.name)
    for (const gene of target.genes) await expect(page.locator('#candidate-details')).toContainText(gene)
  }
})

test('guided tour navigates all stops, closes, and footer returns home',async({page})=>{
  await page.goto('/')
  await page.getByRole('button',{name:'Guided tour'}).click()
  await expect(page.getByRole('complementary',{name:'Guided tour'})).toBeVisible()
  for(let i=0;i<4;i++)await page.getByRole('button',{name:'Next',exact:true}).click()
  await expect(page.locator('.tour-copy')).toContainText('5 OF 5')
  await page.getByRole('button',{name:'Finish',exact:true}).click()
  await expect(page.locator('.tour-dock')).toHaveCount(0)
  await page.getByRole('link',{name:'FLUXNOVA, back to top'}).click()
  await expect(page).toHaveURL(/#overview$/)
  await page.getByRole('button',{name:'Guided tour'}).click()
  await expect(page.locator('.tour-dock')).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.locator('.tour-dock')).toHaveCount(0)
})

test('mobile layout remains within viewport with working menu and controls',async({page})=>{
  await page.setViewportSize({width:390,height:844})
  await page.goto('/')
  await page.getByRole('button',{name:'Open navigation'}).click()
  await page.getByRole('navigation').getByRole('link',{name:'Virtual labs'}).click()
  await expect(page.getByRole('button',{name:'Open navigation'})).toBeVisible()
  await expect(page.locator('.cyano-mobile-pathway')).toBeVisible()
  await page.getByRole('button',{name:/Explore the nutrient landscape/}).click()
  await page.getByRole('button',{name:'fixed, glucose 1.2, oxygen 1.2, flux 0.050105',exact:true}).click()
  await expect(page.getByTestId('proinsulin-flux')).toHaveText('0.050105')
  const widths=await page.evaluate(()=>({body:document.documentElement.scrollWidth,viewport:window.innerWidth}))
  expect(widths.body).toBeLessThanOrEqual(widths.viewport)
  await page.screenshot({path:'test-results/mobile-full.png',fullPage:true})
})

test('desktop visual and internal links remain valid',async({page})=>{
  await page.goto('/')
  await expect(page.getByRole('heading',{level:1})).toContainText('FLUXNOVA')
  const missing=await page.locator('a[href^="#"]').evaluateAll(links=>links.filter(a=>!document.getElementById(a.getAttribute('href')!.slice(1))).map(a=>a.getAttribute('href')))
  expect(missing).toEqual([])
  await page.screenshot({path:'test-results/desktop-hero.png'})
  await page.locator('#ecoli').scrollIntoViewIfNeeded()
  await page.screenshot({path:'test-results/desktop-lab.png'})
})

for (const width of [320,768,1024]) {
  test(`layout fits ${width}px without horizontal overflow`, async({page})=>{
    await page.setViewportSize({width,height:900})
    await page.goto('/')
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth)
    expect(overflow).toBe(false)
    await page.screenshot({path:`test-results/viewport-${width}.png`})
  })
}
