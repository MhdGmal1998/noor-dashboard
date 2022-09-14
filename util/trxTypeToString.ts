export default (type: string) => {
  switch (type) {
    case "FEES":
      return "رسوم تحويل"
    case "TRANSFER":
      return "توليد نقاط"
    case "PURCHASE":
      return "إستهلاك"
    default:
    case "GIFT":
      return "إهداء"
  }
}
