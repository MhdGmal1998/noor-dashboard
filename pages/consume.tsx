import type { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"
import { useContext, useEffect, useState } from "react"
import Layout from "../components/Layout"
import { AuthContext } from "../lib/context/AuthContext"
import { Provider, Wallet } from "./providers"

const AdminConsume: NextPage = () => {
  const router = useRouter()
  const [providers, setProviders] = useState<any[]>([])
  const [systemWallets, setSystemWallets] = useState<Wallet[]>([])
  const [hidden, setHidden] = useState<number[]>([])

  const { user, get } = useContext(AuthContext)

  useEffect(() => {
    if (!user) router.push("/login")
    if (!providers.length)
      get(`admin/providers`).then((data) => {
        setProviders(
          data.providers.map((p: Provider) => {
            let available = false
            if (p.account.wallets.length > 0) {
              if (
                data.systemWallets.find((w: Wallet) => w.providerId === p.id)
                  ?.balance > 0
              )
                available = true
            }
            return { ...p, available }
          })
        )
        setSystemWallets(data.systemWallets)
      })
  })

  const handleSearch = (val: string) => {
    let arr: number[] = []
    providers.map((p) => {
      let hit = false
      // check business name
      if (p.businessName.toUpperCase().includes(val.toUpperCase())) hit = true
      // check location
      if (
        p.businessAddress.toUpperCase().includes(val.toUpperCase()) ||
        p.account.accountNumber.toString().includes(val)
      )
        hit = true

      if (!hit) arr.push(p.id)
    })
    setHidden(arr)
  }

  return user ? (
    <>
      <Head>
        <title>نور</title>
      </Head>
      <Layout>
        <h1 className="text-xl my-3 text-bold text-center bg-[#eeeeee]">
          يرجى اختيار مزوّد خدمة لاستهلاك النقاط لديه
        </h1>
        <div className="h-full bg-[#eeeeee]">
          <div className="bg-gray">
            <div className="bg-white mx-5 px-2 my-3">
              <input
                className="my-3 w-full focus:outline-0 rounded-sm"
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="البحث..."
                title="ابحث"
              />
            </div>
            <table className="w-full table-auto border-separate	">
              <thead className="justify-between">
                <tr className="bg-white">
                  <th className="px-2 py-2">
                    <span className="">#</span>
                  </th>
                  <th className="px-2 py-2">
                    <span className="">رقم الحساب</span>
                  </th>
                  <th className="px-2 py-2">
                    <span className="">اسم العمل</span>
                  </th>
                  <th className="px-2 py-2">
                    <span className="">العنوان</span>
                  </th>
                  <th className="px-2 py-2">
                    <span className="">الرصيد</span>
                  </th>
                  <th className="px-2 py-2">
                    <span className="">رقم الهاتف</span>
                  </th>
                  <th className="px-2 py-2">
                    <span className="">الرصيد المتوفر للنظام</span>
                  </th>
                  <th className="px-2 py-2">
                    <span className="">استهلاك</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {providers &&
                  providers.map((provider, index) =>
                    hidden.includes(provider.id) ? null : (
                      <tr
                        key={index}
                        className="hover:bg-[#CADFFB] duration-200 bg-white"
                      >
                        <td className="px-2 py-2 text-center">
                          <span className="">
                            {index+1}
                          </span>
                        </td>
                        <td className="px-2 py-2 text-center">
                          <span className="">
                            {provider.account.accountNumber}
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          <strong className="text-blue-400 hover:text-blue-500">
                            <Link href={`/providers/${provider.id}`}>
                              {provider.businessName}
                            </Link>
                          </strong>
                        </td>
                        <td className="px-2 py-2">
                          <span className="">{provider.businessAddress}</span>
                        </td>
                        <td className="px-2 py-2">
                          <span className="hover:text-blue-500">
                            <div className="px-2 py-2">
                              {provider.account.wallets.length
                                ? provider.account.wallets
                                  .reduce(
                                    (tot: number, curr: Wallet) =>
                                      tot + curr.balance,
                                    0
                                  )
                                  .toFixed(2) + " نقطة"
                                : "غير متوفر"}
                            </div>
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          <span className="hover:text-blue-500">
                            <div className="px-2 py-2">
                              {provider.businessPhoneNumber}
                            </div>
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          <span className="hover:text-blue-500">
                            <div className="px-2 py-2">
                              {systemWallets.find(
                                (w) => w.providerId === provider.id
                              )?.balance ?? "غير متوفر"}
                            </div>
                          </span>
                        </td>
                        <td className="px-2 py-2 text-center">
                          <button
                            className="text-blue-500 hover:opacity-70 disabled:text-gray-500"
                            onClick={() =>
                              router.push(`/providers/consume/${provider.id}`)
                            }
                            disabled={!provider.available}
                          >
                            {provider.available ? "استهلاك" : "غير متوفر"}
                          </button>
                        </td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    </>
  ) : null
}

export default AdminConsume
