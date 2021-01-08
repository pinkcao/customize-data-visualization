export const importToMap = files => {
  let map = {}
  files.keys().forEach(key => {
    const model = files(key)
    map = { ...map, ...(model.default || model) }
  })
  return map
}

export const importToArray = files => {
  let array = []
  files.keys().forEach(key => {
    const model = files(key)
    array = [...array, ...(model.default || model)]
  })
  return array
}
