import axios from "axios"
import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import Swal from "sweetalert2"
import Layout from "../../components/Layout"
import constants from "../../lib/constants"
import { AuthContext } from "../../lib/context/AuthContext"
import { Provider } from "../providers"

interface GeneratePointsInterface {
  provider: Provider
}
const GeneratePoints: NextPage<GeneratePointsInterface> = ({ }) => {
  const router = useRouter()
  const [provider, setProvider] = useState<Provider>()
  const [isLoading, setIsLoading] = useState(false)
  const [amount, setAmount] = useState(0)
  const [bonus, setBonus] = useState(0)
  const [fees, setFees] = useState(0)
  const [selectedWalletId, setSelectedWalletId] = useState<number>()

  const selectedWallet = provider?.account.wallets.find(
    (w) => w.id === selectedWalletId
  )

  const { get, user, post } = useContext(AuthContext)


  const createNewWallet = async () => {
    if (!provider || !user) return
    const answer = await Swal.fire({
      title: "تأكيد",
      text: `سيتم إنشاء محفظة جديدة بحافز ${bonus} ومبلغ ${amount} لمزود الخدمة ${provider.businessName}`,
      showCancelButton: true,
      cancelButtonText: "إلغاء",
      confirmButtonText: "تأكيد"
    })
    if (answer.isConfirmed) {
      const response = await axios.post(
        `${constants.url}/admin/generateCredit`,
        {
          providerId: provider.id,
          pointAmount: amount,
          bonus,
          pointType: "نقاط بيضاء",
          fees,
        },
        {
          headers: { Authorization: `Bearer ${user!.token}` },
        }
      )
      if (response.status === 200) {
        Swal.fire({
          title: "نجاح",
          text: "تم إنشاء النقاط بنجاح",
          icon: "success",
        })
        // setIsLoading(true)
        setAmount(0)
        axios
          .get(`${constants.url}/admin/providers/${provider.id}`, {
            headers: {
              Authorization: `Bearer ${user!.token}`,
            },
          })
          .then((response) => {
            setProvider(response.data.provider)
            if (response.data.provider.account.wallets) {
              setBonus(response.data.provider.account.wallets[0].bonus)
              setFees(response.data.provider.account.wallets[0].fees)
            }
          })
        return setIsLoading(false)
      }
    }
  }


  const SetMountChange = (event) => {
    const value = event.target.value
    setAmount(value)
  }
  const SetFeeChange = (event) => {
    const value = event.target.value
    if (value > 100) {
      Swal.fire({
        title: 'قيمة كبيرة',
        text: 'لا يمكنك اضافة نسبة اكبر من 100 ',
        icon: 'error'
      })
      return
    }
    else
      setFees(value)
  }
  const SetBounsChange = (event) => {
    const value = event.target.value
    if (value > 100) {
      Swal.fire({
        title: 'قيمة كبيرة',
        text: 'لا يمكنك اضافة نسبة اكبر من 100 ',
        icon: 'error'
      })
      return
    }
    else
      setBonus(value)
    // else if (isNumber(event.target.value)) {
    //   setBonus(value)
    // }
    // else {
    //   Swal.fire({
    //     title: 'مدخل خاطى',
    //     text: 'يرجى ادخال قيمة صحيحية',
    //     icon: 'error'
    //   })
    //   return
    // }

  }


  const handleSubmit = async () => {
    if (!user) return

    try {
      if (!provider) throw new Error("Provider not found")
      if (!amount || amount < 0) {
        Swal.fire({
          title: "خطأ",
          text: "يرجى إدخال قيمة للكميّة",
          icon: "error",
        })
        throw new Error("no amount")
      }
      // if (!bonus || bonus < 0) {
      //   Swal.fire({
      //     title: "خطأ",
      //     text: "يرجى إدخال قيمة للخصم",
      //     icon: "error",
      //   })
      //   throw new Error("no bonus")
      // }
      const wallet = provider.account.wallets.find((w) => w.bonus === bonus)
      if (wallet) {
        Swal.fire({
          title: 'محفظة موجودة من قبل ',
          text: 'هذه المحفظة موجودة مسبقا',
          icon: 'error'
        })
        return;
      }


      if (!wallet || (wallet.status === "ACTIVE")) {
        return await createNewWallet()
      }
      // there is a wallet!
      const response = await Swal.fire({
        title: "تأكيد",
        text: `هذه المحفظة معطّلة, هل تريد انشاء محفظة جديدة أم تفعيلها؟`,
        showCancelButton: true,
        showDenyButton: true,
        denyButtonText: "تنشيط المحفظة",
        cancelButtonText: "إلغاء",
        confirmButtonText: "إنشاء محفظة جديدة",
      })
      if (response.isConfirmed) {
        createNewWallet()
      }
      else if (response.isDenied) {
        // activate wallet
        await post("admin/activatewallet", { walletId: wallet.id })
        Swal.fire({
          title: "تم تفعيل المحفظة بنجاح",
          icon: "success",
          timer: 2000,
          position: "bottom-start",
        })
        setIsLoading(true)
        return router.push("/")
      }
    } catch (err: any) {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const id = router.query.id
    if (!user || !id) {
      router.push("/login")
    }
    if (id)
      get(`admin/providers/${id}`).then((res) => {
        setProvider(res.provider)
        if (res.provider.account.wallets.length)
          setBonus(res.provider.account.wallets[0].bonus)
      })
  }, [])

  return (
    <>
      <Layout>
        {provider ? (
          <>
            <h1 className="text-xl my-3 text-bold text-center bg-[#eeeeee]">
              توليد نقاط لمزود الخدمة {provider.businessName}
            </h1>
            <div className="bg-white shadow-md flex flex-col items-center mx-5 justify-center">
              <div className="grid grid-cols-12 w-full mx-5">
                <div className="col-span-6 mx-2">
                  <h1 className="text-xl mx-5 my-3 text-bold">
                    معلومات مزود الخدمة
                  </h1>
                  <hr />
                  <div className="mx-5 my-2 ">
                    <strong>اسم العمل: </strong>
                    {provider.businessName}
                  </div>
                  <div className="mx-5 my-2">
                    <strong>اسم المالك: </strong>
                    {provider.ownerName}
                  </div>
                  <div className="mx-5 my-2">
                    <strong>رقم الحساب: </strong>
                    {provider.account.accountNumber}
                  </div>
                  <div className="mx-5 my-2">
                    <strong>رقم الهاتف: </strong>
                    {provider.businessPhoneNumber}
                  </div>
                  <div className="mx-5 my-2">
                    <strong>يرجى اختيار المحفظة: </strong>
                    {provider.account.wallets.length ? (
                      <select
                        className="w-full px-2 py-1 mr-2 text-gray-700 bg-white border border-gray-400 rounded-md"
                        onChange={(e) => {
                          setSelectedWalletId(
                            provider.account.wallets.find(
                              (w) => w.id === Number(e.target.value)
                            )?.id ?? 0
                          )
                        }}
                      >
                        {provider.account.wallets.map((wallet, index) => (
                          <option key={index} value={wallet.id}>
                            {wallet.bonus}% حافز {wallet.status === "INACTIVE" && "(معطّلة)"}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <h1>لا يوجد</h1>
                    )}
                  </div>

                  {selectedWallet && (
                    <>
                      <div className="mx-5 my-2">
                        <strong>الرصيد: </strong>
                        {selectedWallet.balance} نقطة
                      </div>
                      <div className="mx-5 my-2">
                        <strong>نسبة النظام: </strong>
                        {selectedWallet.fees} %
                      </div>
                      <div className="mx-5 my-2">
                        <strong>نسبة الحافز: </strong>
                        {selectedWallet.bonus} %
                      </div>
                      <div className="mx-5 my-2">
                        <strong>إجمالي النقاط المباعة: </strong>
                        {selectedWallet.totalConsume} نقطة
                      </div>
                    </>
                  )}
                </div>
                <div className="mx-2 col-span-6">
                  <h1 className="mx-5 my-3 text-xl text-bold">
                    إضافة نقاط إلى مزود الخدمة
                  </h1>
                  <hr />
                  <div className="mx-5 my-2">
                    <label htmlFor="amount">الكميّة: </label>
                    <input
                      type="text"
                      value={amount}
                      onChange={(e) => SetMountChange(e)}
                      className="focus:border-none w-1/2 block rounded-sm px-2 py-1 bg-[#eeeeee]"
                    />
                  </div>
                  <div className="mx-5 my-2">
                    <label htmlFor="amount">نسبة الحافز% : </label>
                    <input
                      type="text"
                      value={bonus}
                      onChange={(e) => SetBounsChange(e)}
                      className="focus:border-none block w-1/2 px-2 py-1 bg-[#eeeeee]"
                    />
                  </div>
                  <div className="mx-5 my-2">
                    <label htmlFor="fees">نسبة النظام% : </label>
                    <input
                      type="text"
                      value={fees}
                      onChange={(e) => SetFeeChange(e)}
                      className="focus:border-none block w-1/2 px-2 py-1 bg-[#eeeeee]"
                    />
                  </div>
                </div>
                <div className="mx-5 my-3 col-span-12">
                  <hr />
                  <button
                    disabled={isLoading}
                    onClick={handleSubmit}
                    className="disabled:opacity-40 disabled:cursor-not-allowed  hover:opacity-80 px-5 py-1 mt-3 rounded-sm bg-blue-400 text-white"
                  >
                    تأكيد العمليّة
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <h1>Loading...</h1>
        )}
      </Layout>
    </>
  )
}

export default GeneratePoints
