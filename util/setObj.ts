export default (obj: Object, key: string, val: string | number | Date) => {
  Object.assign({}, obj, { [key]: val })
  return obj
}
