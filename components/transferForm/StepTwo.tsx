import { Dispatch, SetStateAction, useContext, useState } from "react"
import Swal from "sweetalert2"
import { AuthContext } from "../../lib/context/AuthContext"
import countryCodeToString from "../../util/countryCodeToString"
import Loading from "../Loading"

interface StepTwoProps {
  setStep: Dispatch<SetStateAction<0 | 1 | 2 | 3>>
  setReceipt: Dispatch<SetStateAction<any>>
  recepientInfo: any
  accountNumber?: number
  walletId: number
}

const StepTwo: React.FC<StepTwoProps> = ({
  setStep,
  recepientInfo,
  accountNumber,
  setReceipt,
  walletId,
}) => {
  const [amount, setAmount] = useState<number>()
  const [loading, setLoading] = useState<boolean>(false)

  const { post } = useContext(AuthContext)

  const handleNext = async () => {
    setLoading(true)
    // check data
    if (!amount) {
      setLoading(false)
      return Swal.fire({
        title: "خطأ",
        text: "يجب إدخال جميع البيانات",
        icon: "error",
      })
    }
    // send request
    try {
      const response = await post("trx/transfer", {
        walletId,
        amount,
        recepientAccountNumber: accountNumber,
      })
      setLoading(false)
      setReceipt(response)
      Swal.fire({
        icon: "success",
        timer: 2000,
        text: "تمت العملية بنجاح",
      })
      setStep(3)
    } catch (err: any) {
      setLoading(false)
      return Swal.fire({
        title: "خطأ",
        text: err.response.data,
        icon: "error",
      })
    }
  }

  return (
    <>
      {loading && <Loading />}
      <h1 className="text-xl text-bold text-center">معلومات المستلم</h1>
      <div className="flex flex-col items-center">
        <label htmlFor="customerName">الإسم</label>
        <input
          type="text"
          disabled
          value={`${recepientInfo.customer.firstName} ${recepientInfo.customer.lastName}`}
          name="customerName"
          className="bg-[#e1e1e1] rounded-md p-2 my-2 opacity-50"
        />
        <label htmlFor="country">البلد</label>
        <input
          type="text"
          disabled
          value={countryCodeToString(recepientInfo.customer.countryCode)}
          name="country"
          className="bg-[#e1e1e1] rounded-md p-2 my-2 opacity-50"
        />
        <label htmlFor="phoneNumber">رقم الهاتف</label>
        <input
          type="text"
          disabled
          value={recepientInfo.customer.phoneNumber}
          name="phoneNumber"
          className="bg-[#e1e1e1] rounded-md p-2 my-2 opacity-50"
        />
        <hr className="my-3 w-2/3" />
        <label htmlFor="amount">يرجى إدخال الكمية المراد تحويلها</label>
        <input
          type="number"
          name="amount"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="outline outline-2 rounded-md p-2 my-2 opacity-50 w-1/2 block rounded-sm  bg-white"
        />

        <hr className="my-3 w-2/3" />
        <div className="flex gap-3 flex-row">
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 my-3 px-4 rounded-md"
            onClick={() => setStep(1)}
          >
            السابق
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 my-3 px-4 rounded-md"
            onClick={handleNext}
          >
            التالي
          </button>
        </div>
      </div>
    </>
  )
}

export default StepTwo
