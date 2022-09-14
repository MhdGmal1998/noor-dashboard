import React, { useContext, useState } from "react"
import Swal from "sweetalert2"
import { AuthContext } from "../lib/context/AuthContext"
import randomString, { randomNumber } from "../util/randomString"
import Loading from "./Loading"
import Modal from "./Modal"
import { Affiliate } from "./settings/AffiliateCard"

interface CreateAffiliateModalProps {
  isOpenFromProps: boolean
  setIsOpenFromProps: React.Dispatch<React.SetStateAction<boolean>>
}

const initialValue: Affiliate = {
  name: "",
  code: "",
  providers: [],
}

const CreateAffiliateModal: React.FC<CreateAffiliateModalProps> = ({
  isOpenFromProps,
  setIsOpenFromProps,
}) => {
  const [affiliate, setAffiliate] = useState<Affiliate>(initialValue)
  const [loading, setLoading] = useState<boolean>(false)

  const { post } = useContext(AuthContext)

  const randomizeCode = () =>
    setAffiliate({
      ...affiliate,
      code: randomNumber(4),
    })

  const _handleSubmit = async () => {
    setLoading(true)
    try {
      if (!affiliate.name || !affiliate.code) {
        setLoading(false)
        return Swal.fire({
          icon: "error",
          title: "خطأ",
          text: "يرجى تعبئة جميع الحقول.",
        })
      }
      // submit
      await post("admin/affiliate/new", {name: affiliate.name, code: affiliate.code})
      setLoading(false)
      Swal.fire({
        title: "تم",
        text: "تمّت إضافة المسوق بنجاح !",
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
        title={"إضافة مسوق جديد"}
      >
        <>
          <div className="grid grid-cols-12">
            <div className="col-span-12  flex flex-col items-start">
              <h1 className="text-xl">معلومات المسوق</h1>
              <label htmlFor="businessName" className="py-1">
                الإسم
              </label>
              <div className="text-base rounded-sm items-start flex flex-col">
                <input
                  type="text"
                  name="nameAr"
                  value={affiliate.name}
                  onChange={(e) =>
                    setAffiliate({ ...affiliate, name: e.target.value })
                  }
                  className="mb-2 border-2 py-1 px-5 outline-none"
                />
              </div>
              <label htmlFor="country" className="py-1">
                الرمز
              </label>
              <div className="text-base rounded-sm items-start flex flex-row">
                <input
                  type="number"
                  max={4}
                  name="code"
                  value={affiliate.code}
                  onChange={(e) =>
                    e.target.value.length <= 4
                      ? setAffiliate({ ...affiliate, code: e.target.value })
                      : null
                  }
                  className="mb-2 border-2 py-1 px-5 outline-none"
                />
                <button
                  className="mx-2 px-2 hover:opacity-80 py-1 bg-blue-400 text-white rounded-md"
                  onClick={randomizeCode}
                >
                  عشوائي
                </button>
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

export default CreateAffiliateModal
