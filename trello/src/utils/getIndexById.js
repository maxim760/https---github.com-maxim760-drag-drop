export const getIndexById = (array, target) => {
  return array.findIndex(item => item.id === target)
}