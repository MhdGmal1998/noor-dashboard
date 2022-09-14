import React, { useContext, useState } from "react"
import Swal from "sweetalert2"
import { AuthContext } from "../lib/context/AuthContext"
import Loading from "./Loading"
import Modal from "./Modal"
import { Country } from "./settings/CountryCard"

interface CreateCountryModalProps {
  isOpenFromProps: boolean
  setIsOpenFromProps: React.Dispatch<React.SetStateAction<boolean>>
}

const initialValue: Country = {
  nameAr: "",
  nameEn: "",
  code: "",
  lang: "ar",
}

const CreateCountryModal: React.FC<CreateCountryModalProps> = ({
  isOpenFromProps,
  setIsOpenFromProps,
}) => {
  const [country, setCountry] = useState<Country>(initialValue)
  const [loading, setLoading] = useState<boolean>(false)

  const { post } = useContext(AuthContext)

  const _handleSubmit = async () => {
    setLoading(true)
    try {
      if (!country.nameEn || !country.nameAr || !country.code) {
        setLoading(false)
        return Swal.fire({
          icon: "error",
          title: "خطأ",
          text: "يرجى تعبئة جميع الحقول.",
        })
      }
      // submit
      await post("config/country/new", country)
      setLoading(false)
      Swal.fire({
        title: "تم",
        text: "تمّت إضافة البلد بنجاح !",
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
        title={"إضافة بلد جديد"}
      >
        <>
          <div className="grid grid-cols-12">
            <div className="col-span-12  flex flex-col items-start">
              <h1 className="text-xl">معلومات البلد</h1>
              <hr className="my-3 w-full" />
              <label htmlFor="businessName" className="py-1">
                الإسم باللغة العربيّة
              </label>
              <div className="text-base rounded-sm items-start flex flex-col">
                <input
                  type="text"
                  name="nameAr"
                  value={country.nameAr}
                  onChange={(e) =>
                    setCountry({ ...country, nameAr: e.target.value })
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
                  value={country.nameEn}
                  onChange={(e) =>
                    setCountry({ ...country, nameEn: e.target.value })
                  }
                  className="mb-2 border-2 py-1 px-5 outline-none"
                />
              </div>
              <label htmlFor="country" className="py-1">
                الرمز
              </label>
              <div className=" text-base rounded-sm items-start flex flex-col">
                <input
                  type="text"
                  max="3"
                  name="code"
                  value={country.code}
                  onChange={(e) =>
                    e.target.value.length <= 2
                      ? setCountry({ ...country, code: e.target.value })
                      : null
                  }
                  className="mb-2 border-2 py-1 px-5 outline-none"
                />
              </div>
              <label htmlFor="businessPhoneNumber" className="py-1">
                اللغة الافتراضية
              </label>
              <div className=" text-base rounded-sm items-start flex flex-col">
                <select
                  value={country.lang}
                  onChange={(e) =>
                    setCountry({
                      ...country,
                      lang: e.target.value as "en" | "ar",
                    })
                  }
                  className="mb-2 border-2 py-1 px-10 bg-white outline-none"
                  name="ownerGender"
                >
                  <option value="ar">اللغة العربيّة</option>
                  <option value="en">اللغة الإنجليزيّة</option>
                </select>
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

export default CreateCountryModal
