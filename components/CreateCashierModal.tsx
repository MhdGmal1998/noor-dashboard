import React, { useContext, useState } from "react"
import Swal from "sweetalert2"
import { AuthContext } from "../lib/context/AuthContext"
import Loading from "./Loading"
import Modal from "./Modal"

interface CreateCashierModalProps {
  isOpenFromProps: boolean
  setIsOpenFromProps: React.Dispatch<React.SetStateAction<boolean>>
	providerId: number
}

const initialValue = {
	name: "",
	phoneNumber: "",
	username: "",
	password: ""
}

const CreateCashierModal: React.FC<CreateCashierModalProps> = ({
  isOpenFromProps,
  setIsOpenFromProps,
	providerId
}) => {
  const [cashier, setCashier] = useState<typeof initialValue>(initialValue)
  const [loading, setLoading] = useState<boolean>(false)

  const { post } = useContext(AuthContext)

  const _handleSubmit = async () => {
    setLoading(true)
    try {
      if (!cashier.name || !cashier.password || !cashier.username || !cashier.phoneNumber) {
        setLoading(false)
        return Swal.fire({
          icon: "error",
          title: "خطأ",
          text: "يرجى تعبئة جميع الحقول.",
        })
      }
      // submit
      await post(`admin/providers/cashier/${providerId}`, cashier)
      setLoading(false)
      Swal.fire({
        title: "تم",
        text: "تمّت إضافة الكاشير بنجاح !",
        icon: "success",
        timer: 2000,
      })
      setIsOpenFromProps(false)
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
        title={"إضافة كاشير جديد"}
      >
        <>
          <div className="grid grid-cols-12">
            <div className="col-span-12  flex flex-col items-start">
              <h1 className="text-xl">معلومات الكاشير</h1>
              <label htmlFor="businessName" className="py-1">
                الإسم
              </label>
              <div className="text-base rounded-sm items-start flex flex-col">
                <input
                  type="text"
                  name="name"
                  value={cashier.name}
                  onChange={(e) =>
                    setCashier({ ...cashier, name: e.target.value })
                  }
                  className="mb-2 border-2 py-1 px-5 outline-none"
                />
              </div>
              <label htmlFor="phoneNumber" className="py-1">
                رقم الهاتف
              </label>
              <div className="text-base rounded-sm items-start flex flex-row">
                <input
                  type="text"
                  name="phoneNumber"
                  value={cashier.phoneNumber}
                  onChange={(e) =>
                       setCashier({ ...cashier, phoneNumber: e.target.value })
                  }
                  className="mb-2 border-2 py-1 px-5 outline-none"
                />
              </div>
              <label htmlFor="username" className="py-1">
								اسم المستخدم
              </label>
              <div className="text-base rounded-sm items-start flex flex-row">
                <input
                  type="text"
                  name="username"
                  value={cashier.username}
                  onChange={(e) =>
                       setCashier({ ...cashier, username: e.target.value })
                  }
                  className="mb-2 border-2 py-1 px-5 outline-none"
                />
              </div>
              <label htmlFor="username" className="py-1">
				كلمة المرور
              </label>
              <div className="text-base rounded-sm items-start flex flex-row">
                <input
                  type="password"
                  name="password"
                  value={cashier.password}
                  onChange={(e) =>
                       setCashier({ ...cashier, password: e.target.value })
                  }
                  className="mb-2 border-2 py-1 px-5 outline-none"
                />
              </div>
            </div>
            <hr className="col-span-12 my-3 w-full" />
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
                إضافة
              </button>
            </div>
          </div>
        </>
      </Modal>
    </>
  )
}

export default CreateCashierModal
