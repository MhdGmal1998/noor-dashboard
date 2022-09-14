import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import Swal from "sweetalert2"
import Layout from "../../components/Layout"
import Loading from "../../components/Loading"
import { AuthContext, Transaction } from "../../lib/context/AuthContext"
import formatNumber from "../../util/formatNumber"
import trxTypeToString from "../../util/trxTypeToString"
import { Customer } from "../customers"
import { Wallet } from "../providers"

const ProviderProfile: React.FC = () => {
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer>()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [edit, setEdit] = useState(true)
  const [selectedWallet, setSelectedWallet] = useState<Wallet>()
  const [loading, setLoading] = useState(false)

  const { cid } = router.query
  const { user, get, post } = useContext(AuthContext)

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
            accountId: customer?.accountId,
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

  useEffect(() => {
    const getTrxThisMonth = async () => {
      const res = await post("trx/history", {
        accountId: customer?.accountId,
        fromDate: new Date(
          new Date().setMonth(new Date().getMonth() - 1)
        ).toDateString(),
        take: 30,
        toDate: Date.now(),
      })
      setTransactions([...transactions, ...res])
    }
    if (!cid || !user) router.push("/")
    if (!customer && cid)
      get("admin/customers/" + cid).then((res) => {
        setCustomer(res.customer as Customer)
        setSelectedWallet(
          res.customer.account.wallets.length
            ? res.customer.account.wallets[0]
            : undefined
        )
      })
    else getTrxThisMonth()
  }, [cid, user, customer, get, post, router])

  const trxThisMonth = async () => {
    const res = await post("trx/history", {
      accountId: customer?.accountId,
      fromDate: new Date(
        new Date().setMonth(new Date().getMonth() - 1)
      ).toDateString(),
      take: 30,
      toDate: Date.now(),
    })
    setTransactions(res)
  }

  const trxThisWeek = async () => {
    const res = await post("trx/history", {
      accountId: customer?.accountId,
      fromDate: new Date(
        new Date().setDate(new Date().getDate() - 7)
      ).toDateString(),
      take: 30,
      toDate: Date.now(),
    })
    setTransactions(res)
  }

  const trxToday = async () => {
    const res = await post("trx/history", {
      accountId: customer?.accountId,
      fromDate: new Date().setHours(0),
      take: 30,
      toDate: Date.now(),
    })
    setTransactions(res)
  }

  const trxBetweenDates = async () => {
    Swal.fire({
      title: "يرجى اختيار التاريخ",
      html:
        '<label>من</label><br/><input type="date" id="swal-input1" class="swal2-input"><br/>' +
        '<label>إلى</label><br/><input type="date" id="swal-input2" class="swal2-input">',
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: "بحث",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          const res = await post("trx/history", {
            accountId: customer?.accountId,
            // @ts-ignore
            fromDate: document.getElementById("swal-input1").value,
            // @ts-ignore
            toDate: document.getElementById("swal-input2").value,
            take: 30,
          })
          if (res) setTransactions(res)
          return res as Transaction
        } catch (error: any) {
          if (error.response.status === 404)
            Swal.showValidationMessage(`حدث خطأ ما...`)
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (!result.isConfirmed || !result.value) return
    })
  }

  const handleDelete = async () => {
    if (!customer) return
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
          accountId: customer.accountId,
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
        await post("admin/customer/" + cid, customer)
        Swal.fire({
          title: "تم تعديل العميل",
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
            accountId: customer?.accountId,
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
        accountId: customer?.accountId,
        take: 5,
        skip: transactions.length,
      })
      if (!res.length) throw new Error("لا يوجد تحويلات أخرى")
      setTransactions([...transactions, ...res])
      setLoading(false)
    } catch (err: any) {
      setLoading(false)
      Swal.fire({
        title: "خطأ",
        text: err.message,
        icon: "error",
      })
    }
  }

  return (
    <Layout>
      {customer ? (
        <>
          {loading && <Loading />}
          <h1 className="text-xl my-3 text-bold text-center bg-[#eeeeee]">
            {`${customer.firstName} ${customer.lastName}`}
          </h1>

          <div className="mx-5 my-3 grid grid-cols-12">
            <div className="rounded-md shadow-md col-span-6 bg-white mx-3 p-2">
              <div className="mx-3">
                <h1 className="text-xl text-bold my-2">البيانات الشخصيّة: </h1>
                <hr className="my-1" />
                <div className="flex flex-col">
                  <h1 className="my-1 flex flex-row justify-between">
                    <strong>الاسم الأول </strong>
                    <input
                      className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                      value={customer.firstName}
                      disabled={edit}
                      onChange={(e) =>
                        setCustomer({
                          ...customer,
                          firstName: e.target.value,
                        })
                      }
                    />
                  </h1>

                  <h1 className="my-1 flex flex-row justify-between">
                    <strong>اسم العائلة</strong>
                    <input
                      className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                      value={customer.lastName}
                      disabled={edit}
                      onChange={(e) =>
                        setCustomer({
                          ...customer,
                          lastName: e.target.value,
                        })
                      }
                    />
                  </h1>
                  <h1 className="my-1 flex flex-row justify-between">
                    <strong>رقم الحساب: </strong>
                    <input
                      className="bg-[#eeeeee] rounded-sm px-2 border-0 text-gray-700"
                      value={customer.account.accountNumber}
                      disabled
                    />
                  </h1>
                  <h1 className="my-1 flex flex-row justify-between">
                    <strong>اسم المستخدم </strong>
                    <input
                      className="bg-[#eeeeee] rounded-sm px-2 border-0 text-gray-700"
                      value={customer.account.username}
                      disabled
                    />
                  </h1>
                  <h1 className="my-1 flex flex-row justify-between">
                    <strong>البلد: </strong>
                    <input
                      className="bg-[#eeeeee] rounded-sm px-2 border-0 text-gray-700"
                      value={customer.countryCode}
                      disabled
                    />
                  </h1>
                  <h1 className="my-1 flex flex-row justify-between">
                    <strong>تاريخ الاشتراك: </strong>
                    <input
                      className="bg-[#eeeeee] rounded-sm px-2 border-0 text-gray-700"
                      value={new Date(customer.createdAt).toLocaleDateString()}
                      disabled
                    />
                  </h1>

                  <h1 className="my-1 flex flex-row justify-between">
                    <strong>رقم الهاتف: </strong>
                    <input
                      className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                      // className="bg-[#eeeeee] rounded-sm px-2 border-0 text-gray-700"
                      value={customer.phoneNumber}
                      onChange={(e) =>
                        setCustomer({
                          ...customer,
                          phoneNumber: e.target.value,
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
                      value={customer.email ?? "لا يوجد"}
                      onChange={(e) =>
                        setCustomer({
                          ...customer,
                          email: e.target.value,
                        })
                      }
                      disabled={edit}
                    />
                  </h1>
                  <h1 className="my-1 flex flex-row  justify-between">
                    <strong>الحالة: </strong>
                    <select
                      className="px-5 disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                      value={customer.status}
                      disabled={edit}
                      onChange={(e) =>
                        setCustomer({ ...customer, status: e.target.value })
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
                <h1 className="text-xl text-bold my-2">معلومات المحافظ: </h1>
                <hr className="my-1" />
                <div className="flex flex-col">
                  <h1 className="my-1 flex flex-row justify-between">
                    <strong>عدد المحافظ: </strong>
                    <input
                      // className="bg-[#eeeeee] rounded-sm px-2 border-0 text-gray-700"
                      className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                      value={customer.account.wallets.length}
                      disabled
                    />
                  </h1>
                  <h1 className="my-1 flex justify-between">
                    <strong>إجمالي الرصيد: </strong>
                    <input
                      className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                      // className="bg-[#eeeeee] rounded-sm px-2 border-0 text-gray-700"
                      value={formatNumber(
                        Number(
                          customer.account.wallets
                            .reduce((total, curr) => total + curr.balance, 0)
                            .toFixed(2)
                        )
                      )}
                      disabled
                    />
                  </h1>
                  <h1 className="my-1 flex justify-between">
                    <strong>إجمالي الاستهلاك: </strong>
                    <input
                      className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                      // className="bg-[#eeeeee] rounded-sm px-2 border-0 text-gray-700"
                      value={formatNumber(
                        Number(
                          customer.account.wallets
                            .reduce(
                              (total, curr) => total + curr.totalConsume,
                              0
                            )
                            .toFixed(2)
                        )
                      )}
                      disabled
                    />
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-5 my-3 grid grid-cols-12 bg-[f1f1f1]">
            <div className="rounded-md shadow-md col-span-12 my-1 bg-white mx-3 p-2">
              <div className="mx-3">
                <h1 className="text-xl text-bold my-2">معلومات المحافظ: </h1>
                <div className="w-full flex flex-row">
                  {customer.account.wallets.length ? (
                    <select
                      className="w-full px-2 py-1 mr-2 text-gray-700 bg-white border border-gray-400 rounded-md"
                      onChange={(e) =>
                        setSelectedWallet(
                          customer.account.wallets.find(
                            (w) => w.id === Number(e.target.value)
                          )
                        )
                      }
                    >
                      {customer.account.wallets.map((wallet, index) => (
                        <option key={index} value={wallet.id}>
                          {wallet.provider?.businessName}
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
                    <h1 className="my-1">
                      <strong>مزود الخدمة: </strong>
                      {selectedWallet?.provider?.businessName}
                    </h1>
                    <h1 className="my-1">
                      <strong>الرصيد: </strong>
                      {selectedWallet?.balance}
                    </h1>
                    <h1 className="my-1">
                      <strong>نوع النقاط: </strong>
                      {selectedWallet?.pointType}
                    </h1>
                    <h1 className="my-1">
                      <strong>إجمالي الاستهلاك: </strong>
                      {selectedWallet?.totalConsume}
                    </h1>
                    <h1 className="my-1">
                      <strong>آخر معاملة: </strong>
                      {new Date(selectedWallet!.updatedAt).toLocaleDateString()}
                    </h1>
                  </div>
                )}
              </div>
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
                onClick={trxToday}
                className="bg-blue-400 text-white mx-2 my-1 px-5 py-1 hover:opacity-75 shadow-md rounded-md"
              >
                العمليّات اليوم
              </button>
              <button
                onClick={trxThisWeek}
                className="bg-blue-400 text-white mx-2 my-1 px-5 py-1 hover:opacity-75 shadow-md rounded-md"
              >
                هذا الأسبوع
              </button>
              <button
                onClick={trxThisMonth}
                className="bg-blue-400 text-white mx-2 my-1 px-5 py-1 hover:opacity-75 shadow-md rounded-md"
              >
                هذا الشهر
              </button>
              <button
                onClick={trxBetweenDates}
                className="bg-blue-400 text-white mx-2 my-1 px-5 py-1 hover:opacity-75 shadow-md rounded-md"
              >
                البحث بنطاق معيّن
              </button>
              <button
                onClick={handleSearchTrx}
                className="bg-blue-400 text-white mx-2 my-1 px-5 py-1 hover:opacity-75 shadow-md rounded-md"
              >
                البحث
              </button>
            </div>
          </div>
        </>
      ) : (
        <Loading />
      )}
    </Layout>
  )
}

export default ProviderProfile
