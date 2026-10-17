import { expect, test, type Locator, type Page } from '@playwright/test'

const viewports = [1440, 1280, 1024, 768, 390, 320]
const mainCopy = [
  '.hero-description',
  '.section-intro',
].join(', ')
const panelCopy = [
  '.module-link p',
  '.ctx-method-copy p',
  '.cyano-scenario-copy > p:not(.cyano-caption)',
  '.cyano-chart-insight > p:not(.cyano-insight-label):not(.cyano-insight-note)',
  '.ctx-candidate-role',
  '.ctx-impact-application > p',
  '.ctx-limitations-list p',
].join(', ')
const supportingCopy = [
  '.cyano-caption',
  '.cyano-insight-note',
  '.chart-caption',
  '.control-detail',
  '.policy-option small',
  '.ctx-method-footnote',
  '.ctx-candidate-caveat',
  '.ctx-source-line',
  '.ctx-footer-brand > p',
  '.ctx-footer-sources > a',
  '.ctx-footer-references > a',
  '.ctx-footer-bottom > span',
].join(', ')

async function expectReadable(locator: Locator, minimumSize: number, minimumLineHeight = 1.5) {
  expect(await locator.count()).toBeGreaterThan(0)
  const problems = await locator.evaluateAll((elements, minimum) => elements.flatMap(element => {
    const style = getComputedStyle(element)
    const bounds = element.getBoundingClientRect()
    if (!bounds.width || !bounds.height) return []
    const size = parseFloat(style.fontSize)
    const lineHeight = parseFloat(style.lineHeight)
    const issues = []
    if (size < minimum.size) issues.push(`font ${size}px < ${minimum.size}px`)
    if (Number.isFinite(lineHeight) && lineHeight / size < minimum.lineHeight - 0.01) issues.push(`line height ${lineHeight / size}`)
    if (element.clientWidth && element.scrollWidth > element.clientWidth + 1) issues.push('text exceeds its column')
    return issues.length ? [{ text: element.textContent?.slice(0, 90), issues }] : []
  }), { size: minimumSize, lineHeight: minimumLineHeight })
  expect(problems).toEqual([])
}

async function expectPageFits(page: Page) {
  const dimensions = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: innerWidth }))
  expect(dimensions.width).toBeLessThanOrEqual(dimensions.viewport)
}

async function expectChartReadable(chart: Locator) {
  const ticks = chart.locator('.recharts-cartesian-axis-tick-value')
  await expect(ticks.first()).toBeVisible()
  const problems = await ticks.evaluateAll(elements => elements.flatMap(element => {
    const svg = element.closest('svg')!
    const bounds = element.getBoundingClientRect()
    const plot = svg.getBoundingClientRect()
    const size = parseFloat(getComputedStyle(element).fontSize)
    const issues = []
    if (size < 14) issues.push(`font ${size}px < 14px`)
    if (bounds.left < plot.left - 2 || bounds.right > plot.right + 2 || bounds.top < plot.top - 2 || bounds.bottom > plot.bottom + 2) issues.push('axis label extends beyond the chart')
    return issues.length ? [{ label: element.textContent, issues }] : []
  }))
  expect(problems).toEqual([])
  const legend = chart.locator('.recharts-legend-item-text')
  if (await legend.count()) await expectReadable(legend, 14, 1)
}

for (const width of viewports) {
  test.describe(`${width}px presentation`, () => {
    test.use({ viewport: { width, height: 1000 } })

    test('branding, reading text, and original main heading sizes are preserved', async ({ page }) => {
      await page.goto('/')
      await expect(page).toHaveTitle(/^FLUXNOVA\b/)
      await expect(page.getByRole('link', { name: 'FLUXNOVA home', exact: true })).toBeVisible()
      await expect(page.getByRole('heading', { level: 1 })).toHaveText('FLUXNOVA.')
      await expect(page.locator('.hero h2')).toHaveText(/Redirecting Metabolism\.\s*Redefining Possibilities\./)
      await expect(page.getByRole('link', { name: 'FLUXNOVA, back to top', exact: true })).toBeVisible()
      await expect(page.locator('.ctx-footer-bottom')).toContainText('FLUXNOVA')
      await expect(page.locator('body')).not.toContainText(/META\s*FORGE/i)

      await expectReadable(page.locator(mainCopy), width > 800 ? 17 : 16, 1.6)
      await expectReadable(page.locator(panelCopy), 16, 1.6)
      await expectReadable(page.locator(supportingCopy), 14)

      // These are the pre-existing responsive heading rules, before the readability update.
      const heroSize = width <= 600 ? Math.max(42, Math.min(71, width * 0.128)) : width <= 800 ? 76 : width <= 1100 ? 61 : Math.max(48, Math.min(78, width * 0.058))
      const taglineSize = width <= 600 ? 28 : width <= 800 ? 32 : Math.max(23, Math.min(34, width * 0.0265))
      const sectionSize = width <= 600 ? 31 : Math.max(30, Math.min(43, width * 0.034))
      for (const [selector, expectedSize] of [['.hero h1', heroSize], ['.hero h2', taglineSize], ['.section-title', sectionSize]] as const) {
        const sizes = await page.locator(selector).evaluateAll(elements => elements.map(element => parseFloat(getComputedStyle(element).fontSize)))
        for (const size of sizes) expect(size).toBeCloseTo(expectedSize, 1)
      }
      await expectPageFits(page)
    })

    test('every chart and expanded nutrient heatmap remains readable and contained', async ({ page }) => {
      await page.goto('/')
      const cyanobacteria = page.locator('#cyanobacteria')
      for (const name of ['Carbon allocation', 'Light response', 'Glycogen burden']) {
        await cyanobacteria.getByRole('tab', { name, exact: true }).click()
        await expectChartReadable(cyanobacteria.locator('.cyano-chart'))
        await expectPageFits(page)
      }
      await cyanobacteria.getByRole('button', { name: 'View data', exact: true }).click()
      await expect(cyanobacteria.locator('#cyano-source-table')).toBeVisible()
      await expectPageFits(page)

      const ecoli = page.locator('#ecoli')
      for (const name of ['Your scenario', 'Nutrient effects', 'Growth trade-off', 'Energy sensitivity', 'Growth frontier']) {
        await ecoli.getByRole('button', { name, exact: true }).click()
        await expectChartReadable(ecoli.locator('.ecoli-chart'))
        await expectPageFits(page)
      }
      await ecoli.getByRole('button', { name: /Explore the nutrient landscape/ }).click()
      await expect(ecoli.locator('#nutrient-heatmaps')).toBeVisible()
      await expectReadable(ecoli.locator('.heatmap-footnote, .heatmap-panel > p'), 14)
      const clippedValues = await ecoli.locator('.heatmap-row button').evaluateAll(cells => cells.flatMap(cell => {
        const range = document.createRange()
        range.selectNodeContents(cell)
        const text = range.getBoundingClientRect()
        const bounds = cell.getBoundingClientRect()
        const size = parseFloat(getComputedStyle(cell).fontSize)
        return size < 14 || text.left < bounds.left || text.right > bounds.right || text.top < bounds.top || text.bottom > bounds.bottom
          ? [cell.getAttribute('aria-label')] : []
      }))
      expect(clippedValues).toEqual([])
      await expectPageFits(page)
    })
  })
}
