import { Paginize } from "@kokorotobita/paginize"

export const paginationLib = () => {
  new Paginize(".paginize", {
    perPage: 3,
    breakpoint: {
      minWidth: 768,
      perPage: 5,
    },
  })
}
