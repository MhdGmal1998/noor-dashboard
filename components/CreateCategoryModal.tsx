import { useRouter } from "next/router"
import React, { useContext, useState } from "react"
import Swal from "sweetalert2"
import { AuthContext } from "../lib/context/AuthContext"
import Loading from "./Loading"
import Modal from "./Modal"
import { Category } from "./settings/CategoryCard"

interface CreateCategoryModalProps {
  isOpenFromProps: boolean
  setIsOpenFromProps: React.Dispatch<React.SetStateAction<boolean>>
}

const initialValue: Category = {
  nameAr: "",
  nameEn: "",
}

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({
  isOpenFromProps,
  setIsOpenFromProps,
}) => {
  const [category, setCategory] = useState<Category>(initialValue)
  const [loading, setLoading] = useState<boolean>(false)

  const { post } = useContext(AuthContext)

  const _handleSubmit = async () => {
    setLoading(true)
    try {
      if (!category.nameEn || !category.nameAr) {
        setLoading(false)
        return Swal.fire({
          title: "Error",
          text: "يرجى تعبئة جميع الحقول",
          icon: "error",
          confirmButtonText: "تأكيد",
        })
      }
      await post("config/category/new", category)
      setLoading(false)
      Swal.fire({
        title: "تم",
        text: "تمّت إضافة التصنيف بنجاح !",
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
        title={"إضافة تصنيف جديد"}
      >
        <>
          <div className="grid grid-cols-12">
            <div className="col-span-12  flex flex-col items-start">
              <h1 className="text-xl">معلومات التصنيف</h1>
              <hr className="my-3 w-full" />
              <label htmlFor="businessName" className="py-1">
                الإسم باللغة العربيّة
              </label>
              <div className="text-base rounded-sm items-start flex flex-col">
                <input
                  type="text"
                  name="nameAr"
                  value={category.nameAr}
                  onChange={(e) =>
                    setCategory({ ...category, nameAr: e.target.value })
                  }
                  className="mb-2 border-2 py-1 px-5 outline-none"
                />
              </div>
              <label htmlFor="address" className="py-1">
                الإسم باللغة الانجليزية:
              </label>
              <div className=" text-base rounded-sm items-start flex flex-col">
                <input
                  type="text"
                  name="nameEn"
                  value={category.nameEn}
                  onChange={(e) =>
                    setCategory({ ...category, nameEn: e.target.value })
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
              إضافة
            </button>
          </div>
        </>
      </Modal>
    </>
  )
}

export default CreateCategoryModal
