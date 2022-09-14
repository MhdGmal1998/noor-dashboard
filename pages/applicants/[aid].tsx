import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import Swal from "sweetalert2"
import Layout from "../../components/Layout"
import Loading from "../../components/Loading"
import { AuthContext } from "../../lib/context/AuthContext"
import { Provider } from "../providers"

const ProviderProfile: React.FC = () => {
  const router = useRouter()
  const [provider, setProvider] = useState<Provider>()
  const [edit, setEdit] = useState(true)

  const { aid } = router.query
  const { user, get, post } = useContext(AuthContext)

  useEffect(() => {
    if (!aid || !user) router.push("/")
    if (!provider && aid)
      get("admin/providers/" + aid).then((res) => {
        setProvider(res.provider as Provider)
      })
  }, [aid, get, user])

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
        const res = await post("admin/providers/" + aid, provider)
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
                      <option value="PENDING">بانتظار التفعيل</option>
                      <option value="INACTIVE">غير نشط</option>
                      <option value="BANNED">محظور</option>
                    </select>
                  </h1>
                </div>
                <hr className="my-1" />
              </div>
              <div>
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
        </>
      ) : (
        <Loading />
      )}
    </Layout>
  )
}

export default ProviderProfile
