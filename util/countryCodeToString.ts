export default (code: string) => {
  code = code.toUpperCase()
  switch (code) {
    case "AF":
      return "Afghanistan"
    default:
    case "SD":
      return "السودان"
  }
}
