import { useContext, useEffect, useState } from "react"
import Swal from "sweetalert2"
import { AuthContext } from "../../lib/context/AuthContext"
import CreateAffiliateModal from "../CreateAffiliateModal"
import Loading from "../Loading"

export type SystemConfig = {
  [key: string]: string
}

interface SystemConfigCardProps {
  systemConfigFromProps: SystemConfig
  setSystemConfigFromProps: (config: SystemConfig) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

const SystemConfigCard: React.FC<SystemConfigCardProps> = ({
  systemConfigFromProps: syetemConfigFromProps,
  setSystemConfigFromProps,
  loading,
  setLoading,
}) => {
  const [editConfig, setEditConfig] = useState<Boolean>(false)

  const { post } = useContext(AuthContext)

  const handleEditConfig = async () => {
    if (editConfig) {
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
        const conf = await post("config", { config: syetemConfigFromProps })
        Swal.fire({
          title: "تم تعديل الإعدادات بنجاح",
          icon: "success",
          timer: 2000,
        })
        // fall through
        setSystemConfigFromProps(conf)
      } catch (err: any) {
        setLoading(false)
        const mes = err.response.data ?? err.message
        return Swal.fire({
          title: "خطأ",
          text: mes,
          icon: "error",
        })
      }
    }
    setLoading(false)
    setEditConfig(!editConfig)
  }

  return (
    <>
      {loading && <Loading />}
      <div className="grid grid-cols-12 mx-5 shadow-md bg-white my-3 rounded-sm">
        <h1 className="text-xl mx-5 my-3 col-span-12">إعدادات النظام</h1>
        <hr className="mx-5 my-3 col-span-12" />
        <div className="grid grid-cols-12 mx-5 col-span-12">
          <div className="col-span-6 my-2">
            <div className="mx-5">
              <strong>رسوم الإهداء %</strong>
            </div>
            <div className="mx-5 my-2">
              <input
                disabled={!editConfig}
                className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                value={syetemConfigFromProps.GIFTING_FEES}
                type="number"
                onChange={(e) =>
                  setSystemConfigFromProps({
                    ...syetemConfigFromProps,
                    GIFTING_FEES: e.target.value.toString(),
                  })
                }
              />
            </div>
            <div className="mx-5">
              <strong>الحد الأقصى من الاهدائات اليوميّة</strong>
            </div>
            <div className="mx-5 my-2">
              <input
                disabled={!editConfig}
                className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                value={syetemConfigFromProps.MAXIMUM_DAILY_TRANSACTIONS}
                type="number"
                onChange={(e) =>
                  setSystemConfigFromProps({
                    ...syetemConfigFromProps,
                    MAXIMUM_DAILY_TRANSACTIONS: e.target.value.toString(),
                  })
                }
              />
            </div>
            <div className="mx-5">
              <strong>الحد الأقصى لعدد النقاط المهداة يومياً</strong>
            </div>
            <div className="mx-5 my-2">
              <input
                disabled={!editConfig}
                className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                value={syetemConfigFromProps.MAXIMUM_DAILY_OUTGOING_POINTS}
                type="number"
                onChange={(e) =>
                  setSystemConfigFromProps({
                    ...syetemConfigFromProps,
                    MAXIMUM_DAILY_OUTGOING_POINTS: e.target.value.toString(),
                  })
                }
              />
            </div>
          </div>
        </div>
        <hr className="col-span-12 mx-5" />
        <div className="flex flex-row my-3 mx-5">
          <button
            onClick={handleEditConfig}
            className="bg-gray-500 mx-2 hover:opacity-80 text-white rounded-sm px-2 py-1"
          >
            {editConfig ? "حفظ" : "تعديل"}
          </button>
        </div>
      </div>
    </>
  )
}

export default SystemConfigCard
