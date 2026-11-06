import '../../dev/arcade-shell.css'
import './player.css'

async function start(): Promise<void> {
  try {
    const [{ mountMarsArcade }, { ARCADE_ANCHOR_SOURCES }] = await Promise.all([
      import('../dev/arcadeHarness'),
      import('../dev/arcadeHarnessSprites'),
    ])
    document.querySelector<HTMLElement>('#arcade-error')!.hidden = true
    document.querySelector<HTMLElement>('#arcade-game')!.hidden = false
    const session = await mountMarsArcade(true)
    const setup = document.querySelector<HTMLElement>('#arcade-setup')!
    const selectionTitle = document.querySelector<HTMLHeadingElement>('#selection-title')!
    const match = document.querySelector<HTMLElement>('#arcade-match')!
    const choices = document.querySelector<HTMLElement>('#arcade-choices')!
    const fighter = document.querySelector<HTMLSelectElement>('[data-fighter="0"]')!
    const options = document.querySelector<HTMLDetailsElement>('#match-options')!
    const startButton = document.querySelector<HTMLButtonElement>('#start-fight')!
    const cards = document.querySelector<HTMLElement>('#player-cards')!
    for (const option of fighter.options) {
      const button = document.createElement('button')
      button.type = 'button'
      button.dataset.player = option.value
      button.setAttribute('aria-label', option.textContent!)
      const image = document.createElement('img')
      image.src = ARCADE_ANCHOR_SOURCES[option.value as keyof typeof ARCADE_ANCHOR_SOURCES]
      image.alt = ''
      const name = document.createElement('span')
      name.textContent = option.textContent
      button.append(image, name)
      button.addEventListener('click', () => {
        fighter.value = option.value
        fighter.dispatchEvent(new Event('change'))
      })
      cards.append(button)
    }
    const updateSelection = () => {
      for (const button of cards.querySelectorAll('button')) button.setAttribute('aria-pressed', String(button.dataset.player === fighter.value))
    }
    fighter.addEventListener('change', updateSelection)
    updateSelection()
    startButton.addEventListener('click', () => {
      // Request from the user gesture; a denied request still leaves a full viewport arena.
      if (!document.fullscreenElement) void document.documentElement.requestFullscreen?.().catch(() => {})
      options.append(choices)
      options.open = false
      setup.hidden = true
      match.hidden = false
      session.startRound()
      document.querySelector<HTMLCanvasElement>('#stage')?.focus({ preventScroll: true })
    })
    document.querySelector('#change-selection')!.addEventListener('click', () => {
      session.setActive(false)
      setup.insertBefore(choices, startButton)
      updateSelection()
      match.hidden = true
      setup.hidden = false
      window.scrollTo(0, 0)
      selectionTitle.focus({ preventScroll: true })
    })
    for (const details of document.querySelectorAll<HTMLDetailsElement>('.match-tools details')) {
      details.addEventListener('toggle', () => {
        if (!details.open && details.contains(document.activeElement)) details.querySelector('summary')?.focus()
      })
    }
    startButton.disabled = false
    selectionTitle.focus({ preventScroll: true })
  } catch {
    document.querySelector<HTMLElement>('#arcade-game')!.hidden = true
    document.querySelector<HTMLElement>('#arcade-error')!.hidden = false
  }
}

void start()
