import { useContext, useEffect, useState } from "react"
import Swal from "sweetalert2"
import { AuthContext } from "../../lib/context/AuthContext"
import { Provider } from "../../pages/providers"
import CreateAffiliateModal from "../CreateAffiliateModal"
import Loading from "../Loading"

export type Affiliate = {
  id?: number
  name: string
  code: string
  providers: Provider[]
}

interface AffiliateCardProps {
  affiliatesFromProps: Affiliate[]
  setAffiliatesFromProps: (countries: Affiliate[]) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

const AffiliateCard: React.FC<AffiliateCardProps> = ({
  affiliatesFromProps,
  setAffiliatesFromProps,
  loading,
  setLoading,
}) => {
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate>()
  const [editAffiliate, setEditAffiliate] = useState<Boolean>(false)
  const [addAffiliateModalState, setAddAffiliateModalState] = useState(false)

  const { get, post } = useContext(AuthContext)

  const handleEditAffiliate = async () => {
    if (editAffiliate) {
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
        await post("admin/affiliate", selectedAffiliate)
        Swal.fire({
          title: "تم تعديل معلومات المسوق بنجاح.",
          icon: "success",
          timer: 2000,
        })
        // fall through
        const data = await get("admin/affiliate")
        setAffiliatesFromProps(data)
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
    setEditAffiliate(!editAffiliate)
  }

  useEffect(
    () => setSelectedAffiliate(affiliatesFromProps[0]),
    [affiliatesFromProps]
  )

  return (
    <>
      {loading && <Loading />}
      <div className="grid grid-cols-12 mx-5 shadow-md bg-white my-3 rounded-sm">
        <h1 className="text-xl mx-5 my-3 col-span-12">إعدادات المسوقين</h1>
        <hr className="mx-5 my-3 col-span-12" />
        <div className="grid grid-cols-12 mx-5 col-span-12">
          <div className="col-span-6 my-2">
            <div className="mx-5">
              <strong>قائمة المسوقين</strong>
            </div>
            <div className="mx-5 my-2">
              <select
                className="bg-transparent py-1 w-1/2 border-2 border-solid border-gray-300 rounded-sm"
                value={selectedAffiliate?.id}
                onChange={(e) =>
                  setSelectedAffiliate(
                    affiliatesFromProps.find(
                      (c) => c.id === Number(e.target.value)
                    )
                  )
                }
              >
                {affiliatesFromProps.map((c: Affiliate, i: number) => (
                  <option key={i} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-span-6">
            {selectedAffiliate && (
              <>
                <div className="flex my-2 justify-between flex-row w-full">
                  <div>
                    <strong>الاسم: </strong>
                  </div>
                  <input
                    className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                    type="text"
                    onChange={(e) =>
                      setSelectedAffiliate({
                        ...selectedAffiliate,
                        name: e.target.value,
                      })
                    }
                    disabled={!editAffiliate}
                    value={selectedAffiliate.name}
                  />
                </div>
                <div className="flex my-2 justify-between flex-row w-full">
                  <div>
                    <strong>كود المسوق: </strong>
                  </div>
                  <input
                    className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                    type="text"
                    max={10}
                    onChange={(e) =>
                      setSelectedAffiliate({
                        ...selectedAffiliate,
                        code: e.target.value,
                      })
                    }
                    disabled={!editAffiliate}
                    value={selectedAffiliate.code}
                  />
                </div>
                <div className="flex my-2 justify-between flex-row w-full">
                  <div>
                    <strong>عدد المشتركين: </strong>
                  </div>
                  <input
                    className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                    type="text"
                    disabled
                    value={selectedAffiliate.providers.length}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <hr className="col-span-12 mx-5" />
        <div className="flex flex-row my-3 mx-5">
          {selectedAffiliate && (
            <button
              onClick={handleEditAffiliate}
              className="bg-gray-500 mx-2 hover:opacity-80 text-white rounded-sm px-2 py-1"
            >
              {editAffiliate ? "حفظ" : "تعديل"}
            </button>
          )}
          <button
            onClick={() => setAddAffiliateModalState(true)}
            className="bg-blue-500 mx-2 hover:opacity-80 text-white rounded-sm px-2 py-1 "
          >
            إضافة
          </button>
        </div>
      </div>
      <CreateAffiliateModal
        isOpenFromProps={addAffiliateModalState}
        setIsOpenFromProps={setAddAffiliateModalState}
      />
    </>
  )
}

export default AffiliateCard
