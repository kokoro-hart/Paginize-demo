import { Pagination } from "@kokorotobita/paginize/"

export const paginationLib = () => {
  new Pagination(".paginize", {
    perPage: 8,
    pageRangeDisplayed: 5,
    isChooseUp: true,
  })
}
