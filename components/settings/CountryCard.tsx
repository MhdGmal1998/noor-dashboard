import { useContext, useEffect, useState } from "react"
import Swal from "sweetalert2"
import { AuthContext } from "../../lib/context/AuthContext"
import CreateCountryModal from "../CreateCountryModal"

export type Country = {
  id?: number
  nameAr: string
  nameEn: string
  code: string
  lang: "en" | "ar"
}

interface CountryCardProps {
  countriesFromProps: Country[]
  setCountriesFromProps: (countries: Country[]) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

const CountryCard: React.FC<CountryCardProps> = ({
  countriesFromProps,
  setCountriesFromProps,
  loading,
  setLoading,
}) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>()
  const [editCountry, setEditCountry] = useState<Boolean>(false)
  const [addCountryModalState, setAddCountryModalState] = useState(false)

  const { get, post } = useContext(AuthContext)

  const handleEditCountry = async () => {
    if (editCountry) {
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
      setLoading(true)
      try {
        await post("config/country", selectedCountry)
        Swal.fire({
          title: "تم تعديل معلومات البلد بنجاح.",
          icon: "success",
          timer: 2000,
        })
        // fall through
        const data = await get("config")
        setCountriesFromProps(data.countries)
      } catch (err: any) {
        const mes = err.response.data ?? err.message
        return Swal.fire({
          title: "خطأ",
          text: mes,
          icon: "error",
        })
      }
    }
    setLoading(false)
    setEditCountry(!editCountry)
  }

  useEffect(
    () => setSelectedCountry(countriesFromProps[0]),
    [countriesFromProps]
  )

  return (
    <>
      <div className="grid grid-cols-12 mx-5 shadow-md bg-white my-3 rounded-sm">
        <div className="col-span-12  my-3">
          <h1 className="text-xl mx-5 my-3">إعدادات البلدان</h1>
          <hr className="mx-5" />
          <div className="grid grid-cols-12 mx-5 my-3">
            <div className="col-span-6">
              <div className="mx-5 my-2 ">
                <strong>قائمة البلدان</strong>
              </div>
              <div className="mx-5 my-2">
                <select
                  className="bg-transparent py-1 w-1/2 border-2 border-solid border-gray-300 rounded-sm"
                  value={selectedCountry?.id}
                  onChange={(e) =>
                    setSelectedCountry(
                      countriesFromProps.find(
                        (c) => c.id === Number(e.target.value)
                      )
                    )
                  }
                >
                  {countriesFromProps.map((c: Country, i: number) => (
                    <option key={i} value={c.id}>
                      {c.nameAr}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-span-6">
              {selectedCountry && (
                <>
                  <div className="flex my-2 justify-between flex-row w-full">
                    <div>
                      <strong>رمز البلد: </strong>
                    </div>
                    <input
                      className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                      type="text"
                      onChange={(e) =>
                        setSelectedCountry({
                          ...selectedCountry,
                          code: e.target.value,
                        })
                      }
                      disabled={!editCountry}
                      value={selectedCountry.code}
                    />
                  </div>
                  <div className="flex my-2 justify-between flex-row w-full">
                    <div>
                      <strong>الاسم باللغة العربيّة:</strong>
                    </div>
                    <input
                      className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                      type="text"
                      onChange={(e) =>
                        setSelectedCountry({
                          ...selectedCountry,
                          nameAr: e.target.value,
                        })
                      }
                      disabled={!editCountry}
                      value={selectedCountry.nameAr}
                    />
                  </div>
                  <div className="flex my-2 justify-between flex-row w-full">
                    <div>
                      <strong>الاسم باللغة الإنجليزية:</strong>
                    </div>
                    <input
                      className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                      type="text"
                      onChange={(e) =>
                        setSelectedCountry({
                          ...selectedCountry,
                          nameEn: e.target.value,
                        })
                      }
                      disabled={!editCountry}
                      value={selectedCountry.nameEn}
                    />
                  </div>
                  <div className="flex my-2 justify-between flex-row w-full">
                    <div>
                      <strong>اللغة:</strong>
                    </div>
                    <input
                      className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                      type="text"
                      onChange={(e) =>
                        setSelectedCountry({
                          ...selectedCountry,
                          lang: e.target.value as "en" | "ar",
                        })
                      }
                      disabled={!editCountry}
                      value={selectedCountry.lang}
                    />
                  </div>
                </>
              )}
            </div>
            <hr className="col-span-12" />
            <div className="flex flex-row my-3">
              {selectedCountry && (
                <button
                  onClick={handleEditCountry}
                  className="bg-gray-500 mx-2 hover:opacity-80 text-white rounded-sm px-2 py-1"
                >
                  {editCountry ? "حفظ" : "تعديل"}
                </button>
              )}
              <button
                onClick={() => setAddCountryModalState(true)}
                className="bg-blue-500 mx-2 hover:opacity-80 text-white rounded-sm px-2 py-1 "
              >
                إضافة
              </button>
            </div>
          </div>
        </div>
      </div>
      <CreateCountryModal
        isOpenFromProps={addCountryModalState}
        setIsOpenFromProps={setAddCountryModalState}
      />
    </>
  )
}

export default CountryCard
