import { expect, type Page } from '@playwright/test'

/** Open the game page and wait until fighter selection is ready. */
export async function openArcade(page: Page, navigate = true) {
  if (navigate) await page.goto('/')
  await expect(page.getByRole('button', { name: 'Start fight', exact: true })).toBeEnabled()
  return page
}

export async function startArcadeFight(page: Page, openOptions = true) {
  const start = page.getByRole('button', { name: 'Start fight', exact: true })
  await expect(start).toBeEnabled()
  await start.click()
  await expect(page.locator('#stage')).toBeVisible()
  if (openOptions) {
    await page.getByText('Match options', { exact: true }).click()
    await page.getByText('Controls', { exact: true }).click()
  }
}
