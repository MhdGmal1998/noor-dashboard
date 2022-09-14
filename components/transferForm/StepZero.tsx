import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { Dispatch, SetStateAction } from "react"
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../lib/context/AuthContext"
import { Wallet } from "../../pages/providers"

interface StepZeroProps {
  setStep: Dispatch<SetStateAction<0 | 1 | 2 | 3>>
  setWalletId: Dispatch<SetStateAction<number>>
}

const StepZero: React.FC<StepZeroProps> = ({ setWalletId, setStep }) => {
  const router = useRouter()
  const [systemWallets, setSystemWallets] = useState<Wallet[]>([])
  const [hidden, setHidden] = useState<number[]>([])

  const { user, get } = useContext(AuthContext)

  useEffect(() => {
    if (!user) router.push("/login")
    if (!systemWallets.length)
      get(`admin/wallets`).then((data: any) => {
        setSystemWallets(
          data.filter((w: any) => w.provider.businessName !== "SYSTEM")
        )
      })
  }, [])

  const handleNext = (id: number) => {
    setWalletId(id)
    setStep(1)
  }

  const handleSearch = (val: string) => {
    let arr: number[] = []
    systemWallets.map((w) => {
      let hit = false
      // check business name
      if (w.provider?.businessName.toUpperCase().includes(val.toUpperCase()))
        hit = true
      hit = true
      if (!hit) arr.push(w.id)
    })
    setHidden(arr)
  }

  return user ? (
    <div style={{
      marginLeft: "20px",
      marginRight: "20px"
    }}>
      <h1 className="text-xl my-3 text-bold text-center bg-[#eeeeee]">
        يرجى اختيار محفظة لتحويل النقاط منها
      </h1>
      <div className=" bg-[#eeeeee]" >

        <div className="bg-gray">
          <div className="bg-white px-2 my-3">

            <input
              className="my-3 w-full focus:outline-0 rounded-sm"
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="البحث عن طريق رقم المزود"
              title="ابحث"
            />
          </div>
          <table className="w-full table-auto border-separate	">
            <thead className="justify-between">
              <tr className="bg-white">
                <th className="px-2 py-2">
                  <span className="">اسم المزود</span>
                </th>
                <th className="px-2 py-2">
                  <span className="">رقم الهاتف</span>
                </th>
                <th className="px-2 py-2">
                  <span className="">الرصيد المتوفر للنظام</span>
                </th>
                <th className="px-2 py-2">
                  <span className="">إهداء</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {systemWallets &&
                systemWallets.map((w, index) =>
                  hidden.includes(w.id) ? null : (
                    <tr
                      key={index}
                      className="hover:bg-[#CADFFB] duration-200 bg-white"
                    >
                      <td className="px-2 py-2 text-center">
                        <span className="">
                          <strong className="text-blue-400 hover:text-blue-500">
                            <Link href={`/providers/${w.provider?.id}`}>
                              {w.provider?.businessName}
                            </Link>
                          </strong>
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <span className="">
                          {w.provider?.businessPhoneNumber}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <span className="hover:text-blue-500">
                          <div className="px-2 py-2">
                            {w.balance ?? "غير متوفر"}
                          </div>
                        </span>
                      </td>
                      <td className="px-2 py-2 text-center">
                        <button
                          className="text-blue-500 hover:opacity-70 disabled:text-gray-500"
                          onClick={() => handleNext(w.id)}
                          disabled={w.balance < 1}
                        >
                          {w.balance ? "إهداء" : "غير متوفر"}
                        </button>
                      </td>
                    </tr>
                  )
                )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : null
}

export default StepZero
