import { getRandomId } from "./getRandomId"

export const createItemFromTitle = (title) => {
  return {
    id: getRandomId(),
    title
  }
}