import { PATH } from "./variables"

describe('foo', () => {
  // Navigate in each test
  beforeEach(async () => {
    await page.goto(PATH, { waitUntil: 'load' })
  })
  
  // Navigate once and run all tests
  // beforeAll(async () => {
  //   await page.goto(PATH, { waitUntil: 'load' })
  // })
  
  // Tests goes here
  test('Check for local hostname', async () => {
    const hostname: any = await page.evaluate(() => {
      return window.location.hostname
    })
    expect(hostname).toBe('localhost')
  })
})
