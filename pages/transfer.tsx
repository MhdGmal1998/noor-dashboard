import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import Layout from "../components/Layout"
import Loading from "../components/Loading"
import TransferForm from "../components/TransferForm"
import { AuthContext } from "../lib/context/AuthContext"

const StepOne: React.FC = () => {
  return <h1></h1>
}

const TransferPoints: React.FC = () => {
  const { user} = useContext(AuthContext)
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0)
  const router = useRouter()

  useEffect(() => {
    if (!user) router.push("/")
  })

  return (
    <Layout>
      {user ? (
        <>
          <h1 className="text-xl my-3 text-bold text-center bg-[#eeeeee]">
            تحويل النقاط من محفظة النظام
          </h1>
          <div 
          
          // className="bg-white  rounded "
          >
            <TransferForm step={step} setStep={setStep} />
          </div>
        </>
      ) : (
        <Loading />
      )}
    </Layout>
  )
}

export default TransferPoints
