let win

function w(cb) {
  return cy.wrap(null).promisify().then(() => cb())
}

function sleep(time) {
  return new Promise(resolve => {
    setTimeout(() => resolve(), time)
  })
}

describe('Tawk To Integration', () => {
  before(async () => {
    cy.visit('/')
    win = await cy.window()
  })
  it('Check Chat', async () => {
    expect(win.Chat.loaded).to.be.true
  })
  it('Load', async () => {
    await win.Chat.toLoad()
    await sleep(1000)
    expect(win.Chat.loaded).to.be.true
  })
  it('Open', async () => {
    await win.Chat.open()
    expect(win.Chat.isOpen()).to.be.true
  })
  it('Close', async () => {
    await win.Chat.close()
    expect(win.Chat.isClosed()).to.be.true
  })
  it('Toggle', async () => {
    await win.Chat.toggle()
    expect(win.Chat.isOpen()).to.be.true
  })
  it('States', async () => {
    expect(['online', 'offline', 'away']).to.include(win.Chat.state())
    expect(win.Chat.isOpen() || win.Chat.isOpen() || win.Chat.isOpen()).to.be.true
    expect(win.Chat.isOpen() && win.Chat.isClosed() && win.Chat.isAway()).to.be.false
    assert.isBoolean(win.Chat.isHidden())
    assert.isBoolean(win.Chat.isChatting())
    assert.isBoolean(win.Chat.isEngaged())
  })
  it('Set Visitor Data', async () => {
    const ret = await win.Chat.setVisitorData({ name: 'John Doe', email: 'john.doe@email.com', likes: 'cats' })
    expect(ret).to.be.undefined
  })
  it('Set Event', async () => {
    const ret = await win.Chat.event('test', { value: 'Just testing with Cypress' })
    expect(ret).to.be.undefined
  })
  it('Add and Remove Tags', async () => {
    let ret = await win.Chat.addTags(['test', 'cypress'])
    expect(ret).to.be.undefined
    ret = await win.Chat.removeTags(['test', 'cypress'])
    expect(ret).to.be.undefined
  })
  it('Popup', async () => {
    let ret
    try {
      await win.Chat.popup()
    } catch (e) {
      ret = e
    }
    expect(ret).to.be.undefined
  })
  it('End', async () => {
    await sleep(3000)
    let ret
    try {
      await win.Chat.end()
    } catch (e) {
      ret = e
    }
    expect(ret).to.be.undefined
  })
})
