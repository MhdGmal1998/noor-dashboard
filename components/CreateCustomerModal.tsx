import { useRouter } from "next/router"
import React, { useContext, useState } from "react"
import Swal from "sweetalert2"
import { AuthContext } from "../lib/context/AuthContext"
import Loading from "./Loading"
import Modal from "./Modal"

interface CreateCustomerModalProps {
  isOpenFromProps: boolean
  setIsOpenFromProps: React.Dispatch<React.SetStateAction<boolean>>
}

export type CustomerAccount = {
  username: string
  password: string
  countryCode: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
}

const initialValue: CustomerAccount = {
  username: "",
  password: "",
  countryCode: "sd",
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
}

const CreateCustomerModal: React.FC<CreateCustomerModalProps> = ({
  isOpenFromProps,
  setIsOpenFromProps,
}) => {
  const [account, setAccount] = useState<CustomerAccount>(initialValue)
  const [confirmPassword, setConfirmPassowrd] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)

  const router = useRouter()

  const { post } = useContext(AuthContext)

  const _handleSubmit = async () => {
    setLoading(true)
    try {
      var key: keyof CustomerAccount
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
      if (account.phoneNumber.length !== 10) {
        setLoading(false)
        return Swal.fire({
          title: "خطأ",
          text: "رقم الهاتف غير صحيح",
          icon: "error",
        })
      }
      // all clear
      const response = await post("customers/new", account)
      setLoading(false)
      setAccount(initialValue)
      setIsOpenFromProps(false)
      Swal.fire({
        title: "تم",
        text: "تمّت إضافة العميل بنجاح !",
        icon: "success",
        timer: 2000,
      })
      router.push("/")
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
        title={"إنشاء حساب عميل جديد"}
      >
        <>
          <div className="grid grid-cols-12">
            <div className="col-span-6  flex flex-col items-start">
              <h1 className="text-xl">معلومات العميل</h1>
              <hr className="my-3 w-full" />
              <label htmlFor="businessName" className="py-1">
                الاسم الأول
              </label>
              <div className=" text-base rounded-sm items-start flex flex-col">
                <input
                  type="text"
                  name="businessName"
                  value={account.firstName}
                  onChange={(e) =>
                    setAccount({ ...account, firstName: e.target.value })
                  }
                  className="mb-2 border-2 py-1 px-5 outline-none"
                />
              </div>
              <label htmlFor="address" className="py-1">
                اسم العائلة
              </label>
              <div className=" text-base rounded-sm items-start flex flex-col">
                <input
                  type="text"
                  name="address"
                  value={account.lastName}
                  onChange={(e) =>
                    setAccount({ ...account, lastName: e.target.value })
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
                  value={account.phoneNumber}
                  onChange={(e) =>
                    setAccount({
                      ...account,
                      phoneNumber: e.target.value,
                    })
                  }
                  className="mb-2 border-2 py-1 px-5 outline-none"
                />
              </div>
            </div>

            <div className="col-span-6  flex flex-col items-start">
              <h1 className="text-xl">معلومات الحساب</h1>
              <hr className="my-3 w-full" />
              <label htmlFor="username" className="py-1">
                البريد الإلكتروني
              </label>
              <div className=" text-base rounded-sm items-start flex flex-col">
                <input
                  type="text"
                  name="email"
                  value={account.email}
                  onChange={(e) =>
                    setAccount({
                      ...account,
                      email: e.target.value,
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

export default CreateCustomerModal
