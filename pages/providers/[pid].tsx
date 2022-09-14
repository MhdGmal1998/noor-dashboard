import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import Swal from "sweetalert2"
import CreateCashierModal from "../../components/CreateCashierModal"
import Layout from "../../components/Layout"
import Loading from "../../components/Loading"
import { AuthContext, Transaction } from "../../lib/context/AuthContext"
import formatNumber from "../../util/formatNumber"
import trxTypeToString from "../../util/trxTypeToString"
import { Provider, Wallet } from "../providers"

const ProviderProfile: React.FC = () => {
  const router = useRouter()
  const [provider, setProvider] = useState<Provider>()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [edit, setEdit] = useState(true)
  const [editWallet, setEditWallet] = useState(true)
  const [selectedWalletId, setSelectedWalletId] = useState<number>()
  const [selectedWallet, setSelectedWallet] = useState<Wallet>()
  const [selectedCashierId, setSelecteCashierId] = useState<number>()
  const [totalPoints, setTotalPoints] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [editedBonus, setEditedBonus] = useState<number>()
  const [editedFees, setEditedFees] = useState<number>()

  const [addCashierModalState, setAddCashierModalState] = useState(false)

  const selectedCashier = provider?.cashiers.find(
    (c) => c.id === selectedCashierId
  )

  const { pid } = router.query
  const { user, get, post } = useContext(AuthContext)

  useEffect(() => {
    if (!pid || !user) router.push("/")
    if (!provider && pid)
      get("admin/providers/" + pid).then(async (res) => {
        setProvider(res.provider as Provider)
        setTotalPoints(res.totalPoints)
        setSelectedWallet(res.provider.account.wallets[0])
      })
  })

  const handleDeactivateWallet = async () => {
    if (selectedWallet?.status === "ACTIVE") {
      const result = await Swal.fire({
        title: "تأكيد",
        text: "هل انت متأكد من رغبتك في تعطيل هذه المحفظة؟",
        icon: "warning",
        confirmButtonText: "تأكيد",
        showCancelButton: true,
        cancelButtonText: "إلغاء",
      })
      if (result.isConfirmed) {
        try {
          await post("admin/deactivatewallet", { walletId: selectedWalletId })
          Swal.fire({
            title: "تم تعطيل المحفظة بنجاح",
            icon: "success",
            timer: 2000,
            position: "bottom-start",
          })
          router.push("/")
        } catch (err: any) {
          Swal.fire({
            title: "خطأ",
            icon: "error",
            text: "فشل تعطيل المحفظة!",
          })
        }
      }
    } else {
      const result = await Swal.fire({
        title: "تأكيد",
        text: "هل انت متأكد من رغبتك في تفعيل هذه المحفظة؟",
        icon: "warning",
        confirmButtonText: "تأكيد",
        showCancelButton: true,
        cancelButtonText: "إلغاء",
      })
      if (result.isConfirmed) {
        try {
          await post("admin/activatewallet", { walletId: selectedWalletId })
          Swal.fire({
            title: "تم تفعيل المحفظة بنجاح",
            icon: "success",
            timer: 2000,
            position: "bottom-start",
          })
          router.push("/")
        } catch (err: any) {
          Swal.fire({
            title: "خطأ",
            icon: "error",
            text: "فشل تفعيل المحفظة!",
          })
        }
      }
    }
  }

  const handleSearchTrx = async () => {
    Swal.fire({
      title: "يرجى إدخال رقم التحويلة",
      input: "number",
      showCancelButton: true,
      confirmButtonText: "بحث",
      showLoaderOnConfirm: true,
      preConfirm: async (trxNum) => {
        try {
          const res = await post("trx/find", {
            trxNumber: trxNum,
            accountId: provider?.accountId,
          })
          // if (res) setTransactions(res)
          return res as Transaction
        } catch (error: any) {
          if (error.response.status === 404)
            Swal.showValidationMessage(
              `لم يتم العثور على تحويلة برقم ${trxNum}`
            )
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (!result.isConfirmed || !result.value) return
      Swal.fire({
        title: "التحويلات",
        html: `
  <table>
    <thead>
      <tr className="bg-white">
        <th className="px-2 py-2">
          <span className="">Trx.ID</span>
        </th>
        <th className="px-2 py-2">
          <span className="">طبيعة الحوالة</span>
        </th>
        <th className="px-2 py-2">
          <span className="">نوع الحوالة</span>
        </th>
        <th className="px-2 py-2">
          <span className="">الكميّة</span>
        </th>
        <th className="px-2 py-2">
          <span className="">الوقت</span>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr className="hover:bg-[#CADFFB] duration-200 bg-white text-center">
        <td className="px-2 py-2 text-center">
          <span className="">${result.value?.trxNumber}</span>
        </td>
        <td className="px-2 py-2">
          <span className="">
            ${result.value?.trxType === "incoming" ? "وارد" : "صادر"}
          </span>
        </td>
        <td className="px-2 py-2">
          <span className="">
            ${trxTypeToString(result.value?.transactionType ?? "FEES")}
          </span>
        </td>
        <td className="px-2 py-2">
          <span className="">${result.value?.amount}</span>
        </td>
        <td className="px-2 py-2">
          <span className="hover:text-blue-500">
            <div className="px-2 py-2">
              ${new Date(result.value?.trxDate ?? new Date()).toLocaleString()}
            </div>
          </span>
        </td>
      </tr>
    </tbody>
  </table>
`,
      })
    })
  }

  const handleLoadMoreTrx = async () => {
    setLoading(true)
    try {
      const res = await post("trx/history/latest", {
        accountId: provider?.accountId,
        take: 5,
        skip: transactions.length,
      })
      setTransactions([...transactions, ...res])
      console.log(res)
      setLoading(false)
    } catch (err: any) {
      setLoading(false)
      Swal.fire({
        title: "Error",
        text: err.message,
        icon: "error",
      })
    }
  }

  const handleResetPassword = () => {
    Swal.fire({
      title: "يرجى ادخال كلمة المرور الجديدة",
      input: "password",
      showCancelButton: true,
      cancelButtonText: "إلغاء",
      confirmButtonText: "تغيير",
      showLoaderOnConfirm: true,
      preConfirm: async (input) => {
        try {
          const res = await post("admin/resetpassword", {
            accountId: provider?.accountId,
            password: input,
          })
          Swal.fire({
            title: "تم تغيير كلمة المرور بنجاح",
            icon: "success",
            timer: 2000,
          })
        } catch (error: any) {
          if (error.response.status === 404)
            Swal.showValidationMessage(`حدث خطأ ما`)
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {})
  }

  const handleDelete = async () => {
    if (!provider) return
    const response = await Swal.fire({
      title: "تأكيد الحذف؟",
      text: "سيتم حذف الحساب بشكل نهائي أو تعطيله",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "إلغاء",
      confirmButtonText: "تأكيد",
    })
    if (response.isConfirmed) {
      try {
        await post("admin/deleteaccount", {
          accountId: provider.accountId,
        })
        router.push("/")
      } catch (err: any) {
        Swal.fire({
          title: "حدث خطأ ما",
          text: "يرجى المحاولة مرة أخرى",
          icon: "error",
        })
      }
    }
  }

  const handleEditWallet = async () => {
    if (!editWallet) {
      const response = await Swal.fire({
        title: "تأكيد التعديل؟",
        text: "سيتم حفظ التعديلات",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "إلغاء",
        confirmButtonText: "تأكيد",
      })
      if (!response.isConfirmed) return

      try {
        const res = await post("admin/editwallet", {
          walletId: selectedWallet?.id,
          bonus: selectedWallet?.bonus,
          fees: selectedWallet?.fees,
        })
        Swal.fire({
          title: "تم تعديل المحفظة بنجاح",
          icon: "success",
          timer: 2000,
        })
        // fall through
      } catch (err: any) {
        return Swal.fire({
          title: "خطأ",
          text: err.message,
          icon: "error",
        })
      }
    }

    setEditWallet(!editWallet)
  }

  const handleEdit = async () => {
    if (!edit) {
      // save data
      const response = await Swal.fire({
        title: "تأكيد التعديل؟",
        text: "سيتم حفظ التعديلات",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "إلغاء",
        confirmButtonText: "تأكيد",
      })
      if (!response.isConfirmed) return
      try {
        const res = await post("admin/providers/" + pid, provider)
        Swal.fire({
          title: "تم تعديل مزود الخدمة",
          icon: "success",
          timer: 2000,
        })
        // fall through
      } catch (err: any) {
        return Swal.fire({
          title: "خطأ",
          text: err.message,
          icon: "error",
        })
      }
    }
    setEdit(!edit)
  }

  return (
    <Layout>
      {provider ? (
        <>
          {loading && <Loading />}
          <h1 className="text-xl my-3 text-bold text-center bg-[#eeeeee]">
            {provider.businessName}
          </h1>

          <div className="mx-5 my-3 grid grid-cols-12">
            <div className="rounded-md shadow-md col-span-6 bg-white mx-3 p-2">
              <div className="mx-3">
                <h1 className="text-xl text-bold my-2">معلومات العمل: </h1>
                <hr className="my-1" />
                <div className="flex flex-col">
                  <h1 className="my-1 flex flex-row justify-between">
                    <strong>اسم العمل: </strong>
                    <input
                      className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                      value={provider.businessName}
                      disabled={edit}
                      onChange={(e) =>
                        setProvider({
                          ...provider,
                          businessName: e.target.value,
                        })
                      }
                    />
                  </h1>
                  <h1 className="my-1 flex flex-row justify-between">
                    <strong>رقم الحساب: </strong>
                    <input
                      className="bg-[#eeeeee] rounded-sm px-2 border-0 text-gray-700"
                      value={provider.account.accountNumber}
                      disabled
                    />
                  </h1>
                  <h1 className="my-1 flex flex-row justify-between">
                    <strong>اسم المستخدم: </strong>
                    <input
                      className="bg-[#eeeeee] rounded-sm px-2 border-0 text-gray-700"
                      value={provider.account.username}
                      disabled
                    />
                  </h1>
                  <h1 className="my-1 flex flex-row justify-between">
                    <strong>البلد: </strong>
                    <input
                      className="bg-[#eeeeee] rounded-sm px-2 border-0 text-gray-700"
                      value={provider.countryCode}
                      disabled
                    />
                  </h1>
                  <h1 className="my-1 flex flex-row justify-between">
                    <strong>تاريخ التسجيل: </strong>
                    <input
                      className="bg-[#eeeeee] rounded-sm px-2 border-0 text-gray-700"
                      value={new Date(provider.createdAt).toLocaleDateString()}
                      disabled
                    />
                  </h1>

                  <h1 className="my-1 flex flex-row justify-between">
                    <strong>العنوان: </strong>
                    <input
                      className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                      value={provider.businessAddress}
                      onChange={(e) =>
                        setProvider({
                          ...provider,
                          businessAddress: e.target.value,
                        })
                      }
                      disabled={edit}
                    />
                  </h1>

                  <h1 className="my-1 flex flex-row justify-between">
                    <strong>رقم الهاتف: </strong>
                    <input
                      className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                      // className="bg-[#eeeeee] rounded-sm px-2 border-0 text-gray-700"
                      value={provider.businessPhoneNumber}
                      onChange={(e) =>
                        setProvider({
                          ...provider,
                          businessPhoneNumber: e.target.value,
                        })
                      }
                      disabled={edit}
                    />
                  </h1>
                  <h1 className="my-1 flex flex-row justify-between">
                    <strong>البريد الإلكتروني </strong>
                    <input
                      className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                      // className="bg-[#eeeeee] rounded-sm px-2 border-0 text-gray-700"
                      value={provider.businessEmail ?? "لا يوجد"}
                      onChange={(e) =>
                        setProvider({
                          ...provider,
                          businessEmail: e.target.value,
                        })
                      }
                      disabled={edit}
                    />
                  </h1>
                  <h1 className="my-1 flex flex-row justify-between">
                    <strong>عدد الفروع: </strong>
                    <input
                      className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                      // className="bg-[#eeeeee] rounded-sm px-2 border-0 text-gray-700"
                      value={"غير متوفر"}
                      disabled
                    />
                  </h1>

                  <h1 className="my-1 flex flex-row justify-between">
                    <strong>الحالة: </strong>
                    <select
                      className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                      value={provider.status}
                      disabled={edit}
                      onChange={(e) =>
                        setProvider({ ...provider, status: e.target.value })
                      }
                    >
                      <option value="ACTIVE">نشط</option>
                      <option value="INACTIVE">غير نشط</option>
                      <option value="BANNED">محظور</option>
                    </select>
                  </h1>
                </div>
                <hr className="my-1" />
              </div>
              <div>
                <button
                  onClick={handleDelete}
                  className="bg-red-500 text-white mx-2 my-1 px-5 py-1 hover:opacity-75 shadow-md rounded-md"
                >
                  حذف الحساب
                </button>
                <button
                  onClick={handleResetPassword}
                  className="bg-red-500 text-white mx-2 my-1 px-5 py-1 hover:opacity-75 shadow-md rounded-md"
                >
                  تغيير كلمة المرور
                </button>
                <button
                  onClick={handleEdit}
                  className="bg-blue-400 text-white mx-2 my-1 px-5 py-1 hover:opacity-75 shadow-md rounded-md"
                >
                  {!edit ? "حفظ" : "تعديل"}
                </button>
              </div>
            </div>
            <div className="rounded-md shadow-md col-span-6 bg-white mx-3 p-2">
              <div className="mx-3">
                <h1 className="text-xl text-bold my-2">معلومات المالك: </h1>
                <hr className="my-1" />
                <div className="flex flex-col">
                  <h1 className="my-1 flex flex-row justify-between">
                    <strong>الإسم: </strong>
                    <input
                      // className="bg-[#eeeeee] rounded-sm px-2 border-0 text-gray-700"
                      className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                      value={provider.ownerName}
                      disabled={edit}
                      onChange={(e) =>
                        setProvider({
                          ...provider,
                          ownerName: e.target.value,
                        })
                      }
                    />
                  </h1>
                  <h1 className="my-1 flex justify-between">
                    <strong>تاريخ الميلاد: </strong>
                    <input
                      className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                      // className="bg-[#eeeeee] rounded-sm px-2 border-0 text-gray-700"
                      value={new Date(
                        provider.ownerBirthdate
                      ).toLocaleDateString()}
                      disabled
                    />
                  </h1>
                  <h1 className="my-1 flex justify-between">
                    <strong>الجنسيّة: </strong>
                    <input
                      className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                      // className="bg-[#eeeeee] rounded-sm px-2 border-0 text-gray-700"
                      value={provider.ownerNationality}
                      onChange={(e) =>
                        setProvider({
                          ...provider,
                          ownerNationality: e.target.value,
                        })
                      }
                      disabled={edit}
                    />
                  </h1>
                  <h1 className="my-1 flex justify-between ">
                    <strong>العنوان: </strong>
                    <input
                      className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                      // className="bg-[#eeeeee] rounded-sm px-2 border-0 text-gray-700"
                      value={provider.ownerAddress}
                      onChange={(e) =>
                        setProvider({
                          ...provider,
                          ownerAddress: e.target.value,
                        })
                      }
                      disabled={edit}
                    />
                  </h1>
                  <h1 className="my-1 flex justify-between">
                    <strong>إثبات الهويّة: </strong>
                    <input
                      className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                      // className="bg-[#eeeeee] rounded-sm px-2 border-0 text-gray-700"
                      value={provider.ownerDocumentNumber}
                      onChange={(e) =>
                        setProvider({
                          ...provider,
                          ownerDocumentNumber: e.target.value,
                        })
                      }
                      disabled={edit}
                    />
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-5 my-3 grid grid-cols-12 bg-[f1f1f1]">
            <div className="rounded-md shadow-md col-span-12 my-1 bg-white mx-3 p-2">
              <div className="mx-3">
                <h1 className="text-xl text-bold my-2">الكاشيرز: </h1>
                <hr className="my-1" />
                <div className="flex flex-col">
                  <h1 className="my-1 flex flex-row justify-between">
                    <strong>عدد الكاشيزر: </strong>
                    <input
                      // className="bg-[#eeeeee] rounded-sm px-2 border-0 text-gray-700"
                      className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                      value={provider.cashiers.length}
                      disabled
                    />
                  </h1>
                </div>
                <hr className="my-3" />
                <div className="my-3 grid grid-cols-12 bg-[f1f1f1]">
                  <div className="rounded-md col-span-12 my-1 bg-white ">
                    <div className="">
                      <h1 className="text-xl text-bold my-2">
                        معلومات الكاشير:{" "}
                      </h1>
                      <div className="w-full flex flex-row">
                        {provider.cashiers.length ? (
                          <select
                            className="w-full px-2 py-1 mr-2 text-gray-700 bg-white border border-gray-400 rounded-md"
                            defaultValue={provider.cashiers[0].name}
                            onChange={(e) => {
                              setSelecteCashierId(
                                provider.cashiers.find(
                                  (c) => c.id === Number(e.target.value)
                                )?.id ?? 0
                              )
                            }}
                          >
                            {provider.cashiers.map((cashier, index) => (
                              <option key={index} value={cashier.id}>
                                {cashier.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <h1>لا يوجد</h1>
                        )}
                      </div>
                      <hr className="my-1" />
                      {selectedCashier && (
                        <div className="flex flex-col">
                          <h1 className="my-1">
                            <strong>الاسم: </strong>
                            {selectedCashier.name}
                          </h1>
                          <h1 className="my-1">
                            <strong>رقم الهاتف: </strong>
                            {selectedCashier.phoneNumber}
                          </h1>
                          <h1 className="my-1">
                            <strong>الحالة: </strong>
                            {selectedCashier.status}
                          </h1>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <hr className="my-1" />
              <button
                onClick={() => setAddCashierModalState(true)}
                className="bg-blue-400 text-white mx-2 my-1 px-5 py-1 hover:opacity-75 shadow-md rounded-md"
              >
                إضافة كاشير
              </button>
            </div>
          </div>

          <div className="mx-5 my-3 grid grid-cols-12 bg-[f1f1f1]">
            <div className="rounded-md shadow-md col-span-12 my-1 bg-white mx-3 p-2">
              <div className="mx-3">
                <h1 className="text-xl text-bold my-2">معلومات المحافظ: </h1>
                <hr className="my-1" />
                <div className="flex flex-col">
                  <h1 className="my-1 flex flex-row justify-between">
                    <strong>عدد المحافظ: </strong>
                    <input
                      // className="bg-[#eeeeee] rounded-sm px-2 border-0 text-gray-700"
                      className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                      value={provider.account.wallets.length}
                      disabled
                    />
                  </h1>
                  <h1 className="my-1 flex justify-between">
                    <strong>إجمالي الرصيد: </strong>
                    <input
                      className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                      // className="bg-[#eeeeee] rounded-sm px-2 border-0 text-gray-700"
                      value={formatNumber(
                        provider.account.wallets
                          .reduce((total, curr) => total + curr.balance, 0)
                          .toFixed(2)
                      )}
                      disabled
                    />
                  </h1>
                  <h1 className="my-1 flex justify-between">
                    <strong>إجمالي المبيعات: </strong>
                    <input
                      className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                      // className="bg-[#eeeeee] rounded-sm px-2 border-0 text-gray-700"
                      value={formatNumber(
                        provider.account.wallets
                          .reduce((total, curr) => total + curr.totalSold, 0)
                          .toFixed(2)
                      )}
                      disabled
                    />
                  </h1>
                  <h1 className="my-1 flex justify-between">
                    <strong>إجمالي النقاط المتاحة في النظام </strong>
                    <input
                      className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                      // className="bg-[#eeeeee] rounded-sm px-2 border-0 text-gray-700"
                      value={formatNumber(totalPoints.toFixed(2))}
                      disabled
                    />
                  </h1>
                </div>
                <hr className="my-3" />
                <div className="my-3 grid grid-cols-12 bg-[f1f1f1]">
                  <div className="rounded-md col-span-12 my-1 bg-white ">
                    <div className="">
                      <h1 className="text-xl text-bold my-2">
                        معلومات المحافظ:{" "}
                      </h1>
                      <div className="w-full flex flex-row">
                        {provider.account.wallets.length ? (
                          <select
                            className="w-full px-2 py-1 mr-2 text-gray-700 bg-white border border-gray-400 rounded-md"
                            defaultValue={provider.account.wallets[0].id}
                            onChange={(e) => {
                              setSelectedWallet(
                                provider.account.wallets.find(
                                  (w) => w.id === Number(e.target.value)
                                )
                              )
                            }}
                          >
                            {provider.account.wallets.map((wallet, index) => (
                              <option key={index} value={wallet.id}>
                                {wallet.bonus}% حافز{" "}
                                {wallet.status === "INACTIVE" ? "(معطّلة)" : ""}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <h1>لا يوجد</h1>
                        )}
                      </div>
                      <hr className="my-1" />
                      {selectedWallet && (
                        <div className="flex flex-col">
                          <h1 className="my-1 flex justify-between">
                            <strong>الرصيد: </strong>
                            <input
                              className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                              value={formatNumber(
                                selectedWallet.balance.toFixed(2)
                              )}
                              onChange={(e) =>
                                (selectedWallet.balance = Number(
                                  e.target.value
                                ))
                              }
                              disabled
                            />
                          </h1>
                          <h1 className="my-1 flex justify-between">
                            <strong>الحافز%: </strong>
                            <input
                              className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                              value={selectedWallet.bonus}
                              type="number"
                              onChange={(e) =>
                                setSelectedWallet({
                                  ...selectedWallet,
                                  bonus: Number(e.target.value),
                                })
                              }
                              disabled={editWallet}
                            />
                          </h1>
                          <h1 className="my-1 flex justify-between">
                            <strong>نسبة النظام: </strong>

                            <input
                              className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                              value={selectedWallet.fees}
                              // defaultValue={formatNumber(
                              // selectedWallet.fees.toFixed(2)
                              // )}
                              type="number"
                              onChange={(e) =>
                                setSelectedWallet({
                                  ...selectedWallet,
                                  fees: Number(e.target.value),
                                })
                              }
                              disabled={editWallet}
                            />
                          </h1>
                          <h1 className="my-1">
                            <strong>إجمالي المبيعات: </strong>
                            {formatNumber(selectedWallet.totalSold.toFixed(2))}
                          </h1>
                          <h1 className="my-1">
                            <strong>آخر معاملة: </strong>
                            {new Date(
                              selectedWallet!.updatedAt
                            ).toLocaleDateString()}
                          </h1>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <hr className="my-1" />
              <button
                className="bg-red-500 text-white mx-2 my-1 px-5 py-1 hover:opacity-75 shadow-md rounded-md"
                onClick={handleDeactivateWallet}
              >
                {selectedWallet?.status === "ACTIVE"
                  ? "تعطيل المحفظة"
                  : "تفعيل المحفظة"}
              </button>
              <button
                onClick={() =>
                  router.push({
                    pathname: "/providers/generate",
                    query: { id: provider.id },
                  })
                }
                className="bg-blue-400 text-white mx-2 my-1 px-5 py-1 hover:opacity-75 shadow-md rounded-md"
              >
                توليد نقاط
              </button>
              <button
                onClick={handleEditWallet}
                className="bg-blue-400 text-white mx-2 my-1 px-5 py-1 hover:opacity-75 shadow-md rounded-md"
              >
                {editWallet ? "تعديل" : "حفظ"}
              </button>
            </div>
            <div className="rounded-md shadow-md col-span-12 my-1 bg-white mx-3 p-2">
              <div className="mx-3">
                <h1 className="text-xl text-bold my-2">آخر المعاملات: </h1>
                <hr className="my-1" />
                <table className="w-full table-auto border-separate	">
                  <thead className="justify-between">
                    <tr className="bg-white">
                      <th className="px-2 py-2">
                        <span className="">#</span>
                      </th>
                      <th className="px-2 py-2">
                        <span className="">Trx.ID</span>
                      </th>
                      <th className="px-2 py-2">
                        <span className="">إلى</span>
                      </th>
                      <th className="px-2 py-2">
                        <span className="">طبيعة الحوالة</span>
                      </th>
                      <th className="px-2 py-2">
                        <span className="">نوع الحوالة</span>
                      </th>
                      <th className="px-2 py-2">
                        <span className="">الكميّة</span>
                      </th>
                      <th className="px-2 py-2">
                        <span className="">الوقت</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions &&
                      transactions.map((trx, index) => (
                        <tr
                          key={index}
                          className="hover:bg-[#CADFFB] duration-200 bg-white text-center"
                        >
                          <td className="px-2 py-2 text-center">
                            <span className="">{index + 1}</span>
                          </td>
                          <td className="px-2 py-2 text-center">
                            <span className="">{trx.trxNumber}</span>
                          </td>
                          <td className="px-2 py-2">
                            {/*@ts-ignore*/}
                            <span className="">{trx.name}</span>
                          </td>
                          <td className="px-2 py-2">
                            <span className="">
                              {/*@ts-ignore*/}
                              {trx.trxType === "incoming" ? "وارد" : "صادر"}
                            </span>
                          </td>
                          <td className="px-2 py-2">
                            <span className="">
                              {trxTypeToString(trx.transactionType)}
                            </span>
                          </td>
                          <td className="px-2 py-2">
                            <span className="">{formatNumber(trx.amount)}</span>
                          </td>
                          <td className="px-2 py-2">
                            <span className="hover:text-blue-500">
                              <div className="px-2 py-2">
                                {new Date(
                                  trx.trxDate ?? trx.createdAt
                                ).toLocaleString()}
                              </div>
                            </span>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <hr className="my-3" />
              <button
                onClick={handleLoadMoreTrx}
                className="bg-blue-400 text-white mx-2 my-1 px-5 py-1 hover:opacity-75 shadow-md rounded-md"
              >
                تحميل المزيد
              </button>
              <button
                onClick={handleSearchTrx}
                className="bg-blue-400 text-white mx-2 my-1 px-5 py-1 hover:opacity-75 shadow-md rounded-md"
              >
                البحث
              </button>
            </div>
          </div>
          <CreateCashierModal
            isOpenFromProps={addCashierModalState}
            setIsOpenFromProps={setAddCashierModalState}
            providerId={provider.id}
          />
        </>
      ) : (
        <Loading />
      )}
    </Layout>
  )
}

export default ProviderProfile
