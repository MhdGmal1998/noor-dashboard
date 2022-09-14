export default (status: string) => {
  switch (status) {
    case "ACTIVE":
      return "نشط"
    case "INACTIVE":
      return "غير نشط"
    case "PENDING":
      return "قيد الانتظار"
    default:
      return "غير معروف"
  }
}
