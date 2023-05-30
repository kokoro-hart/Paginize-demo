export class Pagination {
  readonly targetNodes!: NodeListOf<Element>

  readonly pageCounterWrap!: HTMLElement

  readonly buttonPrev!: HTMLElement

  readonly buttonNext!: HTMLElement

  readonly perPageMd!: number

  readonly perPageUnderMd!: number

  currentPagerEl: HTMLElement | null

  totalPage: number

  totalContent: number

  perPage!: number

  currentPager!: number

  indexStart!: number

  indexEnd!: number

  maxPager!: number

  constructor(
    props: Pick<
      Pagination,
      "targetNodes" | "pageCounterWrap" | "buttonPrev" | "buttonNext" | "perPageMd" | "perPageUnderMd"
    >
  ) {
    Object.assign(this, props)

    const { targetNodes } = props

    this.currentPagerEl = null

    this.init()

    this.totalContent = targetNodes.length

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
    this.pageCounterWrap.innerHTML = ""

    this.currentPager = 0

    this.indexStart = 0

    this.indexEnd = 0

    this.totalPage = Math.ceil(this.targetNodes.length / this.perPage)
  }

  protected initQueryParams() {
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
    this.buttonNext.addEventListener("click", () => {
      this.updatePageState((this.currentPager += 1))
    })

    this.buttonPrev.addEventListener("click", () => {
      this.updatePageState((this.currentPager -= 1))
    })
  }

  protected activateButtonPrev() {
    this.buttonPrev.dataset.disable = "false"
  }

  protected activateButtonNext() {
    this.buttonNext.dataset.disable = "false"
  }

  protected disabledButtonPrev() {
    this.buttonPrev.dataset.disable = "true"
  }

  protected disabledButtonNext = () => {
    this.buttonNext.dataset.disable = "true"
  }

  protected updateCurrentButton(count = 1) {
    this.currentPagerEl = document.querySelector(`.pageNumber[data-counter-id="${count}"]`)
    this.currentPagerEl?.setAttribute("data-current", "true")
  }

  protected updateContentsView(current: number, counts: number) {
    this.indexStart = current * counts - counts
    this.indexEnd = current * counts - 1
    const indexArray: Array<number> = []
    for (let i = this.indexStart; i < this.indexEnd + 1; i += 1) {
      indexArray.push(i)
    }

    this.targetNodes.forEach((element) => {
      element.classList.remove("is-show")
    })

    this.targetNodes.forEach((element, index) => {
      if (indexArray.indexOf(index) !== -1) {
        element.classList.add("is-show")
      }
    })
  }

  protected updatePageState(currentCount?: number) {
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

    const params = new URLSearchParams({ paged: String(this.currentPager) })
    const currentURL = new URL(window.location.href)
    currentURL.search = params.toString()
    window.history.replaceState({}, "", currentURL.toString())
    this.updateCurrentButton(currentCount)

    document.querySelectorAll(".pageNumber").forEach((element) => {
      element.addEventListener("click", (e) => {
        this.currentPager = Number(element.getAttribute("data-counter-id"))
        this.updatePageState(this.currentPager)
      })
    })
  }

  protected createPageCounter(current: number, totalPage: number) {
    const createPagerEls = (i: number) => {
      const countList = document.createElement("button")
      countList.setAttribute("data-counter-id", String(i))
      countList.classList.add("pageNumber")
      countList.textContent = String(i)
      this.pageCounterWrap.appendChild(countList)
    }

    const createEllipsis = () => {
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
  const targetRoot = document.querySelector(".pagify")

  if (!targetRoot) return

  const targetNodes = targetRoot.querySelectorAll(".pagify-item")

  const pageCounterWrap = targetRoot.querySelector<HTMLElement>(".pagify-counter")

  const buttonPrev = targetRoot.querySelector<HTMLElement>(".pagify-prev")

  const buttonNext = targetRoot.querySelector<HTMLElement>(".pagify-next")

  if (!targetNodes || !pageCounterWrap || !buttonPrev || !buttonNext) return

  const pdInstance = new Pagination({
    targetNodes,
    pageCounterWrap,
    buttonPrev,
    buttonNext,
    perPageMd: 15,
    perPageUnderMd: 12,
  })
}
