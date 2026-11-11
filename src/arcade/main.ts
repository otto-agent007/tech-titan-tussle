import { preferPlaybackAudioSession } from '../game/audioSession'
import '../../dev/arcade-shell.css'
import './player.css'

// iPhone: the fight sounds are Web Audio, which the Ring/Silent switch mutes unless this
// page asks to be treated as media playback.
preferPlaybackAudioSession()

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
    const menu = document.querySelector<HTMLDialogElement>('#arcade-menu')!
    const menuButton = document.querySelector<HTMLButtonElement>('#open-arcade-menu')!
    const closeMenu = () => {
      menu.close()
      menuButton.focus({ preventScroll: true })
    }
    menuButton.addEventListener('click', () => {
      session.setPaused(true)
      menu.showModal()
    })
    // Escape closes the menu but keeps the fight paused; Resume is explicit.
    menu.addEventListener('cancel', event => { event.preventDefault(); closeMenu() })
    window.addEventListener('keydown', event => { if (event.key === 'Escape' && menu.open) { event.preventDefault(); closeMenu() } })
    menu.querySelector('[data-menu-close]')!.addEventListener('click', closeMenu)
    document.querySelector('#resume-arcade')!.addEventListener('click', () => {
      menu.close()
      session.setPaused(false)
      document.querySelector<HTMLCanvasElement>('#stage')?.focus({ preventScroll: true })
    })
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
      window.scrollTo(0, 0)
      session.startRound()
      document.querySelector<HTMLCanvasElement>('#stage')?.focus({ preventScroll: true })
    })
    document.querySelector('#change-selection')!.addEventListener('click', () => {
      session.setActive(false)
      menu.close()
      setup.insertBefore(choices, startButton)
      updateSelection()
      match.hidden = true
      setup.hidden = false
      window.scrollTo(0, 0)
      selectionTitle.focus({ preventScroll: true })
    })
    for (const details of document.querySelectorAll<HTMLDetailsElement>('.match-menu details')) {
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

// A long press raises a context menu on Android (iOS gets the CSS callout rule instead).
// The arcade has nothing to copy, and a menu mid-fight steals the held input.
window.addEventListener('contextmenu', event => event.preventDefault())
void start()
