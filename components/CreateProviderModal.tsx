import { useRouter } from "next/router"
import React, { useContext, useState } from "react"
import Swal from "sweetalert2"
import { AuthContext } from "../lib/context/AuthContext"
import Loading from "./Loading"
import Modal from "./Modal"

interface CreateProviderModalProps {
  isOpenFromProps: boolean
  setIsOpenFromProps: React.Dispatch<React.SetStateAction<boolean>>
}

export type ProviderAccount = {
  username: string
  password: string
  countryCode: string
  businessName: string
  businessAddress: string
  // businessEmail: string
  businessPhoneNumber: string
  ownerName: string
  ownerAddress: string
  ownerNationality: string
  ownerGender: "f" | "m"
  ownerBirthdate: Date
  ownerDocumentType: string
  ownerDocumentNumber: string
  ownerPhoneNumber: string
}

const initialValue: ProviderAccount = {
  username: "",
  password: "",
  countryCode: "sd",
  businessName: "",
  businessAddress: "",
  // businessEmail: "",
  businessPhoneNumber: "",
  ownerName: "",
  ownerAddress: "",
  ownerNationality: "",
  ownerGender: "m",
  ownerBirthdate: new Date(),
  ownerDocumentType: "passport",
  ownerDocumentNumber: "",
  ownerPhoneNumber: "",
}

const CreateProviderModal: React.FC<CreateProviderModalProps> = ({
  isOpenFromProps,
  setIsOpenFromProps,
}) => {
  const [account, setAccount] = useState<ProviderAccount>(initialValue)
  const [confirmPassword, setConfirmPassowrd] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter()

  const { post } = useContext(AuthContext)

  const _handleSubmit = async () => {
    setLoading(true)
    try {
      var key: keyof ProviderAccount
      for (key in account) {
        if (account[key] === "") {
          setLoading(false)
          return Swal.fire({
            title: "خطأ",
            text: `الحقل ${key} مطلوب`,
            icon: "error",
          })
        }
      }
      // all fields are filled
      if (account.password !== confirmPassword) {
        setLoading(false)
        return Swal.fire({
          title: "خطأ",
          text: "كلمة المرور غير متطابقة",
          icon: "error",
        })
      }
      if (
        account.businessPhoneNumber.length !== 10 ||
        account.ownerPhoneNumber.length !== 10
      ) {
        setLoading(false)
        return Swal.fire({
          title: "خطأ",
          text: "رقم الهاتف غير صحيح",
          icon: "error",
        })
      }
      // all clear
      const response = await post("providers/new", account)
      setLoading(false)
      setAccount(initialValue)
      setIsOpenFromProps(false)
      Swal.fire({
        title: "تم",
        text: "تمّت إضافة مزود الخدمة بنجاح !",
        icon: "success",
        timer: 2000,
      })
      router.push("/applicants")
    } catch (err: any) {
      setLoading(false)
      Swal.fire({
        title: "Error",
        text: err.response.data,
        icon: "error",
      })
    }
  }

  return (
    <>
      {loading && <Loading />}
      <Modal
        isOpenFromProps={isOpenFromProps}
        setIsOpenFromProps={setIsOpenFromProps}
        title={"إنشاء مزود خدمة جديد"}
      >
        <>
          <div className="grid grid-cols-12">
            <div className="col-span-6  flex flex-col items-start">
              <h1 className="text-xl">معلومات المزود</h1>
              <hr className="my-3 w-full" />
              <label htmlFor="businessName" className="py-1">
                اسم العمل
              </label>
              <div className=" text-base rounded-sm items-start flex flex-col">
                <input
                  type="text"
                  name="businessName"
                  value={account.businessName}
                  onChange={(e) =>
                    setAccount({ ...account, businessName: e.target.value })
                  }
                  className="mb-2 border-2 py-1 px-5 outline-none"
                />
              </div>
              <label htmlFor="address" className="py-1">
                العنوان
              </label>
              <div className=" text-base rounded-sm items-start flex flex-col">
                <input
                  type="text"
                  name="address"
                  value={account.businessAddress}
                  onChange={(e) =>
                    setAccount({ ...account, businessAddress: e.target.value })
                  }
                  className="mb-2 border-2 py-1 px-5 outline-none"
                />
              </div>
              <label htmlFor="country" className="py-1">
                البلد
              </label>
              <div className=" text-base rounded-sm items-start flex flex-col">
                <input
                  type="text"
                  disabled
                  name="country"
                  value={account.countryCode}
                  onChange={(e) =>
                    setAccount({ ...account, countryCode: e.target.value })
                  }
                  className="mb-2 border-2 py-1 px-5 outline-none"
                />
              </div>
              <label htmlFor="businessPhoneNumber" className="py-1">
                رقم الهاتف
              </label>
              <div className=" text-base rounded-sm items-start flex flex-col">
                <input
                  max={10}
                  type="text"
                  name="businessPhoneNumber"
                  value={account.businessPhoneNumber}
                  onChange={(e) =>
                    setAccount({
                      ...account,
                      businessPhoneNumber: e.target.value,
                    })
                  }
                  className="mb-2 border-2 py-1 px-5 outline-none"
                />
              </div>
              <label htmlFor="username" className="py-1">
                اسم المستخدم
              </label>
              <div className=" text-base rounded-sm items-start flex flex-col">
                <input
                  type="text"
                  name="username"
                  value={account.username}
                  onChange={(e) =>
                    setAccount({
                      ...account,
                      username: e.target.value,
                    })
                  }
                  className="mb-2 border-2 py-1 px-5 outline-none"
                />
              </div>
              <label htmlFor="password" className="py-1">
                كلمة المرور
              </label>
              <div className=" text-base rounded-sm items-start flex flex-col">
                <input
                  type="password"
                  name="password"
                  value={account.password}
                  onChange={(e) =>
                    setAccount({
                      ...account,
                      password: e.target.value,
                    })
                  }
                  className="mb-2 border-2 py-1 px-5 outline-none"
                />
              </div>
              <label htmlFor="confirmPassword" className="py-1">
                تأكيد كلمة المرور
              </label>
              <div className=" text-base rounded-sm items-start flex flex-col">
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassowrd(e.target.value)}
                  className="mb-2 border-2 py-1 px-5 outline-none"
                />
              </div>
            </div>

            <div className="col-span-6  flex flex-col items-start">
              <h1 className="text-xl">معلومات المالك</h1>
              <hr className="my-3 w-full" />
              <label htmlFor="businessPhoneNumber" className="py-1">
                الاسم الرباعي
              </label>
              <div className=" text-base rounded-sm items-start flex flex-col">
                <input
                  type="text"
                  name="ownerName"
                  value={account.ownerName}
                  onChange={(e) =>
                    setAccount({
                      ...account,
                      ownerName: e.target.value,
                    })
                  }
                  className="mb-2 border-2 py-1 px-5 outline-none"
                />
              </div>
              <label htmlFor="ownerPhoneNumber" className="py-1">
                رقم الهاتف
              </label>
              <div className=" text-base rounded-sm items-start flex flex-col">
                <input
                  type="text"
                  name="ownerPhoneNumber"
                  value={account.ownerPhoneNumber}
                  onChange={(e) =>
                    setAccount({
                      ...account,
                      ownerPhoneNumber: e.target.value,
                    })
                  }
                  className="mb-2 border-2 py-1 px-5 outline-none"
                />
              </div>
              <label htmlFor="businessPhoneNumber" className="py-1">
                عنوان السكن
              </label>
              <div className=" text-base rounded-sm items-start flex flex-col">
                <input
                  type="text"
                  name="ownerName"
                  value={account.ownerAddress}
                  onChange={(e) =>
                    setAccount({
                      ...account,
                      ownerAddress: e.target.value,
                    })
                  }
                  className="mb-2 border-2 py-1 px-5 outline-none"
                />
              </div>
              <label htmlFor="ownerBirthdate" className="py-1">
                تاريخ الميلاد
              </label>
              <div className=" text-base rounded-sm items-start flex flex-col">
                <input
                  type="date"
                  name="ownerName"
                  onChange={(e) =>
                    setAccount({
                      ...account,
                      ownerBirthdate: new Date(e.target.value),
                    })
                  }
                  className="mb-2 border-2 py-1 px-11 outline-none w-full "
                />
              </div>
              <label htmlFor="ownerNationality" className="py-1">
                الجنسيّة
              </label>
              <div className=" text-base rounded-sm items-start flex flex-col">
                <input
                  type="text"
                  name="ownerNationality"
                  value={account.ownerNationality}
                  onChange={(e) =>
                    setAccount({
                      ...account,
                      ownerNationality: e.target.value,
                    })
                  }
                  className="mb-2 border-2 py-1 px-5 outline-none"
                />
              </div>
              <label htmlFor="ownerGender" className="py-1">
                الجنس
              </label>
              <div className=" text-base rounded-sm items-start flex flex-col">
                <select
                  value={account.ownerGender}
                  onChange={(e) =>
                    setAccount({
                      ...account,
                      ownerGender: e.target.value as "m" | "f",
                    })
                  }
                  className="mb-2 border-2 py-1 px-10 bg-white outline-none"
                  name="ownerGender"
                >
                  <option value="m">ذكر</option>
                  <option value="f">أنثى</option>
                </select>
              </div>
              <label htmlFor="ownerDocumentNumber" className="py-1">
                رقم الهويّة
              </label>
              <div className=" text-base rounded-sm items-start flex flex-col">
                <input
                  type="text"
                  name="ownerDocumentNumber"
                  value={account.ownerDocumentNumber}
                  onChange={(e) =>
                    setAccount({
                      ...account,
                      ownerDocumentNumber: e.target.value,
                    })
                  }
                  className="mb-2 border-2 py-1 px-5 outline-none"
                />
              </div>
            </div>
          </div>
          <hr className="my-3 w-full" />
          <div className="flex flex-row items-start">
            <button
              onClick={() => setIsOpenFromProps(false)}
              className="mx-2 px-3 hover:opacity-80 py-3 bg-red-500 text-white rounded-md"
            >
              إلغاء
            </button>
            <button
              onClick={_handleSubmit}
              className="mx-2 px-3 hover:opacity-80  py-3 bg-blue-500 text-white rounded-md"
            >
              تسجيل
            </button>
          </div>
        </>
      </Modal>
    </>
  )
}

export default CreateProviderModal
