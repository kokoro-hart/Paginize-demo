type DefaultOption = {
  root: string
  nodes: string
  counterWrap: string
  prev: string
  next: string
  perPageMd: number
  perPageUnderMd: number

  isNextPrev: boolean

  isHistory: boolean

  pageNumberEl: string
  pageNumberHref: string
}

type PartialOption = Partial<DefaultOption>

export class Pagination {
  readonly targetRoot!: HTMLElement | null

  readonly targetNodes!: NodeListOf<Element> | null

  readonly pageCounterWrap!: HTMLElement | null

  readonly buttonPrev!: HTMLElement | null

  readonly buttonNext!: HTMLElement | null

  readonly perPageMd!: number

  readonly perPageUnderMd!: number

  currentPagerEl!: HTMLElement | null

  totalPage!: number

  totalContent!: number

  perPage!: number

  currentPager!: number

  indexStart!: number

  indexEnd!: number

  maxPager!: number

  isHistory!: boolean

  pageNumberEl!: string

  pageNumberHref!: string

  constructor({
    root = ".pagify",
    nodes = ".pagify-item",
    counterWrap = ".pagify-counter",
    prev = ".pagify-prev",
    next = ".pagify-next",
    perPageMd = 5,
    perPageUnderMd = 3,
    isNextPrev = true,
    isHistory = true,
    pageNumberEl = "button",
    pageNumberHref = "",
  }: PartialOption) {
    this.targetRoot = document.querySelector(root)

    if (!this.targetRoot) return

    this.targetNodes = this.targetRoot.querySelectorAll(nodes)

    this.pageCounterWrap = this.targetRoot.querySelector(counterWrap)

    if (isNextPrev) {
      this.buttonPrev = this.targetRoot.querySelector(prev)

      this.buttonNext = this.targetRoot.querySelector(next)
    }

    this.currentPagerEl = null

    Object.assign(this, {
      perPageMd,
      perPageUnderMd,
      isNextPrev,
      isHistory,
      pageNumberEl,
      pageNumberHref,
    })

    this.init()

    if (!this.targetNodes) return

    this.totalContent = this.targetNodes.length

    this.totalPage = Math.ceil(this.totalContent / this.perPage)

    this.registerEvents()
    if (this.totalContent === 0) window.location.reload()
  }

  protected init() {
    const listener = (event: MediaQueryList | MediaQueryListEvent) => {
      if (event.matches) {
        this.perPage = this.perPageMd
        this.maxPager = 7
        this.initConstructor()
        this.initQueryParams()
      } else {
        this.perPage = this.perPageUnderMd
        this.maxPager = 5
        this.initConstructor()
        this.initQueryParams()
      }
    }

    const mediaQueryList = window.matchMedia("(min-width: 768px)")
    mediaQueryList.onchange = listener
    listener(mediaQueryList)
  }

  protected initConstructor() {
    if (!this.pageCounterWrap || !this.targetNodes) return
    this.pageCounterWrap.innerHTML = ""

    this.currentPager = 0

    this.indexStart = 0

    this.indexEnd = 0

    this.totalPage = Math.ceil(this.targetNodes.length / this.perPage)
  }

  protected initQueryParams() {
    if (!this.isHistory) {
      this.updatePageState()
      this.updateCurrentButton()
      return
    }

    const urlParams = new URLSearchParams(window.location.search)
    const pagedParam = urlParams.get("paged")

    if (pagedParam === null || pagedParam === "0") {
      this.updatePageState()
      this.updateCurrentButton()
    } else {
      this.updatePageState(Number(pagedParam))
    }
  }

  protected registerEvents() {
    if (!this.buttonNext || !this.buttonPrev) return
    this.buttonNext.addEventListener("click", () => {
      this.updatePageState((this.currentPager += 1))
    })

    this.buttonPrev.addEventListener("click", () => {
      this.updatePageState((this.currentPager -= 1))
    })
  }

  protected activateButtonPrev() {
    if (!this.buttonPrev) return
    this.buttonPrev.dataset.disable = "false"
    this.buttonPrev.style.pointerEvents = "auto"
  }

  protected activateButtonNext() {
    if (!this.buttonNext) return
    this.buttonNext.dataset.disable = "false"
    this.buttonNext.style.pointerEvents = "auto"
  }

  protected disabledButtonPrev() {
    if (!this.buttonPrev) return
    this.buttonPrev.dataset.disable = "true"
    this.buttonPrev.style.pointerEvents = "none"
  }

  protected disabledButtonNext = () => {
    if (!this.buttonNext) return
    this.buttonNext.dataset.disable = "true"
    this.buttonNext.style.pointerEvents = "none"
  }

  protected updateCurrentButton(count = 1) {
    this.currentPagerEl = document.querySelector(`.pageNumber[data-counter-id="${count}"]`)
    this.currentPagerEl?.setAttribute("data-current", "true")
  }

  protected updateContentsView(current: number, counts: number) {
    if (!this.targetNodes) return

    this.indexStart = current * counts - counts
    this.indexEnd = current * counts - 1
    const indexArray: Array<number> = []
    for (let i = this.indexStart; i < this.indexEnd + 1; i += 1) {
      indexArray.push(i)
    }

    this.targetNodes.forEach((element) => {
      const el = element as HTMLElement
      el.style.display = "none"
    })

    this.targetNodes.forEach((element, index) => {
      if (indexArray.indexOf(index) !== -1) {
        const el = element as HTMLElement
        el.style.display = "block"
      }
    })
  }

  protected updatePageState(currentCount?: number) {
    if (!this.pageCounterWrap) return

    if (currentCount === 1 || currentCount === undefined || this.currentPager === 1) {
      this.currentPager = 1
      this.activateButtonNext()
      this.disabledButtonPrev()
    } else if (currentCount === this.totalPage) {
      this.currentPager = currentCount
      this.disabledButtonNext()
      this.activateButtonPrev()
    } else {
      this.currentPager = currentCount
      this.activateButtonNext()
      this.activateButtonPrev()
    }
    if (this.totalPage === 1) {
      this.disabledButtonNext()
      this.disabledButtonPrev()
    }

    this.updateContentsView(this.currentPager, this.perPage)

    this.pageCounterWrap.innerHTML = ""

    this.createPageCounter(this.currentPager, this.totalPage)

    if (this.isHistory) {
      const params = new URLSearchParams({ paged: String(this.currentPager) })
      const currentURL = new URL(window.location.href)
      currentURL.search = params.toString()
      window.history.replaceState({}, "", currentURL.toString())
    }

    this.updateCurrentButton(currentCount)

    document.querySelectorAll(".pageNumber").forEach((element) => {
      element.addEventListener("click", () => {
        this.currentPager = Number(element.getAttribute("data-counter-id"))
        this.updatePageState(this.currentPager)
      })
    })
  }

  protected createPageCounter(current: number, totalPage: number) {
    const createPagerEls = (i: number) => {
      if (!this.pageCounterWrap) return

      const countList = document.createElement(`${this.pageNumberHref ? "a" : this.pageNumberEl}`)

      this.pageNumberHref && countList.setAttribute("href", `${this.pageNumberHref}${i}`)
      this.pageNumberEl === "button" && countList.setAttribute("type", "button")
      countList.setAttribute("data-counter-id", String(i))
      countList.classList.add("pageNumber")
      countList.textContent = String(i)
      this.pageCounterWrap.appendChild(countList)
    }

    const createEllipsis = () => {
      if (!this.pageCounterWrap) return
      const ellipsis = document.createElement("span")
      ellipsis.classList.add("pageNumberEllipsis")
      ellipsis.textContent = ". . ."
      this.pageCounterWrap.appendChild(ellipsis)
    }

    const fluctuation = this.maxPager <= 5 ? 2 : 3

    if (totalPage > this.maxPager) {
      const startPage = 1

      if (totalPage === this.maxPager + 1) {
        for (let i = 1; i <= totalPage; i += 1) {
          createPagerEls(i)
        }
      } else if (current <= this.maxPager / 2 + 1) {
        for (let i = startPage; i <= current + 1; i += 1) {
          createPagerEls(i)
        }

        if (current < totalPage - 2) {
          createEllipsis()
        }

        const lastPageStart = this.maxPager <= 5 ? totalPage - 1 : totalPage - 2
        for (let i = lastPageStart; i <= totalPage; i += 1) {
          createPagerEls(i)
        }
      } else if (current >= totalPage - fluctuation) {
        for (let i = startPage; i <= 2; i += 1) {
          createPagerEls(i)
        }

        createEllipsis()

        const lastNumber = this.maxPager <= 5 ? 3 : 4
        const lastPageStart = totalPage - (this.maxPager - lastNumber) - 1
        for (let i = lastPageStart; i <= totalPage; i += 1) {
          createPagerEls(i)
        }
      } else {
        const maxStart = this.maxPager <= 5 ? 1 : 2
        for (let i = startPage; i <= maxStart; i += 1) {
          createPagerEls(i)
        }

        createEllipsis()

        for (let i = current - 1; i <= current + 1; i += 1) {
          createPagerEls(i)
        }

        createEllipsis()

        const lastPageStart = this.maxPager <= 5 ? totalPage : totalPage - 1
        for (let i = lastPageStart; i <= totalPage; i += 1) {
          createPagerEls(i)
        }
      }
    } else {
      for (let i = 1; i <= totalPage; i += 1) {
        createPagerEls(i)
      }
    }
  }
}

export const paginationDefault = () => {
  new Pagination({})
}
