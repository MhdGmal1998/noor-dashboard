import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import Swal from "sweetalert2"
import Layout from "../../../components/Layout"
import Loading from "../../../components/Loading"
import { AuthContext } from "../../../lib/context/AuthContext"
import countryCodeToString from "../../../util/countryCodeToString"
import pointTypeToString from "../../../util/pointTypeToString"
import { Provider, Wallet } from "../../providers"

export interface RecordWalletMap {
	amount: number
	bonus: number
}

const TransferPoints: React.FC = () => {
  const { user, get, post } = useContext(AuthContext)
  const [isComplete, setIsComplete] = useState<boolean>(false)
  const [provider, setProvider] = useState<Provider>()
  const [loading, setLoading] = useState<boolean>(false)
  const [amount, setAmount] = useState<number>(0)
  const [receipt, setReceipt] = useState<any>()
	const [recordWalletMap, setRecordWalletMap] = useState<RecordWalletMap[]>([])

  const router = useRouter()

  const { pid } = router.query

  useEffect(() => {
    if (!user) router.push("/")
    if (!provider && pid)
      get("admin/providers/" + pid).then((res: any) => {
        setProvider(res.provider as Provider)
      })
  })

  useEffect(() => {
    if (!recordWalletMap.length)
      post(`admin/maprecords`, {providerId: pid}).then((data) => {
        setRecordWalletMap(data)
      })
  })


  const handleSubmit = async () => {
    setLoading(true)
    try {
      if (!provider) throw new Error("لم يتم اختيار مزود الخدمة !")
      if (!amount) throw new Error("يرجى إدخال الكميّة")
      if (amount < 1) throw new Error("يرجى إدخال كمية صحيحة")
      // passed all checks
      const res = await post("admin/consume", {
        providerId: provider.id,
        amount,
      })
      setReceipt(res)
      Swal.fire({
        title: "تم إنجاز العملية بنجاح",
        text: "تم استهلاك " + amount + " نقطة لدى " + provider.businessName,
        icon: "success",
      })
      setLoading(false)
	  setIsComplete(true)
    } catch (err: any) {
      setLoading(false)
      Swal.fire({
        title: "خطأ",
        text: err.response ? err.response.data : err.message,
        icon: "error",
      })
    }
  }

  return (
    <Layout>
      {provider ? (
        <>
          <h1 className="text-xl my-3 text-bold text-center bg-[#eeeeee]">
            استهلاك نقاط لدى المزود {provider.businessName}
          </h1>
		  <>
			<div className="bg-white shadow-md rounded p-4 my-5 mx-auto max-w-sm">
				<h1 className="text-xl text-bold text-center">رصيد النظام لدى {provider.businessName}</h1>
				{recordWalletMap.map((map, index) => (
					<div key={index}>
						<div  className="flex items-center flex-row justify-around my-2">
							<div>
								<h1 className="text-xl text-bold">الكميّة: </h1> {" "}
								<span>{map.amount} نقطة</span>
							</div>
							<div>
								<h1 className="text-xl text-bold">الخصم: </h1> {" "}
								<span>{map.bonus}%</span>
							</div>
						</div>
					<hr className="my-3 text-center m-auto w-2/3" />
					</div>
				))}
							<div className="text-center">
								<h1 className="text-xl text-bold">الإجمالي: </h1> {" "}
								<span>{recordWalletMap.reduce((tot, curr) => tot + curr.amount, 0)} نقطة</span>
							</div>

			</div>
		  </>
          {isComplete ? (
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
                  <span className="text-bold ">{provider.businessName}</span>
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
          ) : (
            <div className="bg-white shadow-md my-2 rounded p-4 mx-auto max-w-sm">
              {loading && <Loading />}
              <h1 className="text-xl text-bold text-center">معلومات المستلم</h1>
              <div className="flex flex-col items-center">
                <label htmlFor="customerName">الإسم</label>
                <input
                  type="text"
                  disabled
                  value={provider.businessName}
                  name="businessName"
                  className="bg-[#e1e1e1] rounded-md p-2 my-2 opacity-50"
                />
                <label htmlFor="country">البلد</label>
                <input
                  type="text"
                  disabled
                  value={countryCodeToString(provider.countryCode)}
                  name="country"
                  className="bg-[#e1e1e1] rounded-md p-2 my-2 opacity-50"
                />
                <label htmlFor="phoneNumber">رقم الهاتف</label>
                <input
                  type="text"
                  disabled
                  value={provider.businessPhoneNumber}
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
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 my-3 px-4 rounded-md"
                    onClick={handleSubmit}
                  >
                    تحويل
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <Loading />
      )}
    </Layout>
  )
}

export default TransferPoints
