import Link from "next/link"
import { Dispatch, SetStateAction, useState } from "react"
import pointTypeToString from "../util/pointTypeToString"
import StepOne from "./transferForm/StepOne"
import StepTwo from "./transferForm/StepTwo"
import StepZero from "./transferForm/StepZero"

interface TransferFormProps {
  step: number
  setStep: Dispatch<SetStateAction<0 | 1 | 2 | 3>>
}

const TransferForm: React.FC<TransferFormProps> = ({ step, setStep }) => {
  const [walletId, setWalletId] = useState<number>(0)
  const [recepientInfo, setRecepientInfo] = useState<any>()
  const [accountNumber, setAccoutNumber] = useState<number>()
  const [receipt, setReceipt] = useState<any>()

  switch (step) {
    default:
    case 0:
      return <StepZero setStep={setStep} setWalletId={setWalletId} />
    case 1:
      return (
        <StepOne
          setRecepientInfo={setRecepientInfo}
          setStep={setStep}
          accountNumber={accountNumber}
          setAccoutNumber={setAccoutNumber}
        />
      )
    case 2:
      return (
        <StepTwo
          setStep={setStep}
          walletId={walletId ?? 0}
          recepientInfo={recepientInfo}
          accountNumber={accountNumber}
          setReceipt={setReceipt}
        />
      )
    case 3:
      return (
        <>
          <h1 className="text-xl text-bold text-center">إيصال التحويلة</h1>
          <div className="flex flex-col items-center my-3">
            <div className="flex flex-col items-center">
              <span className="opacity-50">رقم العمليّة</span>
              <span className="text-bold">{receipt.trxNumber}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="opacity-50">حالة العمليّة</span>
              <span className="text-bold text-green-500">مؤكّد</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="opacity-50">تاريخ العمليّة</span>
              <span className="text-bold ">
                {new Date(receipt.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="opacity-50">المرسل</span>
              <span className="text-bold ">SYSTEM</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="opacity-50">المستلم</span>
              <span className="text-bold ">{`${
                recepientInfo?.firstName ?? "مجهول"
              } ${recepientInfo?.lastName ?? "مجهول"}`}</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="opacity-50">الكميّة</span>
              <span className="text-bold ">{`${
                receipt.amount
              } (${pointTypeToString(receipt.pointType)})`}</span>
            </div>

            <hr className="my-3 w-2/3" />
            <button className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 my-3 px-4 rounded-md">
              <Link href="/">عودة</Link>
            </button>
          </div>
        </>
      )
  }
}

export default TransferForm
