import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react"
import Swal from "sweetalert2"
import { AuthContext } from "../../lib/context/AuthContext"
import { RecordWalletMap } from "../../pages/providers/consume/[pid]"
import Loading from "../Loading"

interface StepProps {
  setStep: Dispatch<SetStateAction<0 | 1 | 2 | 3>>
  setRecepientInfo: Dispatch<SetStateAction<any>>
  accountNumber?: number
  setAccoutNumber: Dispatch<SetStateAction<number | undefined>>
}

const StepOne: React.FC<StepProps> = ({
  setStep,
  setRecepientInfo,
  accountNumber,
  setAccoutNumber,
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [recordWalletMap, setRecordWalletMap] = useState<RecordWalletMap[]>([])

  const { get, post } = useContext(AuthContext)

  const handleNext = async () => {
    setLoading(true)
    // check data
    if (!accountNumber) {
      setLoading(false)
      return Swal.fire({
        title: "خطأ",
        text: "يجب إدخال جميع البيانات",
        icon: "error",
      })
    }
    // send request
    try {
      const response = await get("trx/" + accountNumber)
      // we got the data
      if (response.provider) throw new Error("هذا ليس حساب عميل")
      setLoading(false)
      setStep(2)
      setRecepientInfo(response)
    } catch (err: any) {
      setLoading(false)
      if (err.response.status === 404)
        return Swal.fire({
          title: "خطأ",
          text: "رقم الحساب غير صحيح",
          icon: "error",
        })
      Swal.fire({
        title: "خطأ",
        text: err.response.data,
        icon: "error",
      })
    }
  }

  // useEffect(() => {
    // if (!recordWalletMap.length)
      // post(`admin/maprecords`, {providerId: pid}).then((data) => {
        // setRecordWalletMap(data)
      // })
  // })


  return (
    <>
      {loading && <Loading />}
      <h1 className="text-xl text-bold text-center">معلومات التحويل</h1>
      <div className="flex flex-col items-center">
        <label htmlFor="accountNumber">رقم الحساب</label>
        <input
          type="number"
          value={accountNumber}
          name="accountNumber"
          onChange={(e) => setAccoutNumber(Number(e.target.value))}
          className="bg-[#e1e1e1] rounded-md p-2 my-2 opacity-50"
        />
        <hr className="my-3 w-2/3" />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 my-3 px-4 rounded-md"
          onClick={handleNext}
        >
          التالي
        </button>
      </div>
    </>
  )
}

export default StepOne
