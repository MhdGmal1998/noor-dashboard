import type { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"
import { useContext, useEffect, useState } from "react"
import CreateProviderModal from "../components/CreateProviderModal"
import Layout from "../components/Layout"
import { AuthContext } from "../lib/context/AuthContext"
import formatNumber from "../util/formatNumber"

export type Wallet = {
  id: number
  providerId: number
  provider?: Provider
  balance: number
  bonus: number
  pointType: string
  walletNumber: number
  totalConsume: number
  totalSold: number
  fees: number
  updatedAt: Date
  status: "ACTIVE" | "INACTIVE"
}

export type Cashier = {
  id: number
  name: string
  phoneNumber: string
  accountId: number
  providerId: number
  status: string
}

export type Provider = {
  cashiers: Cashier[]
  accountId: number
  createdAt: Date
  status: string
  ownerNationality: string
  ownerDocumentType: string
  ownerDocumentNumber: string
  countryCode: string
  businessEmail: string
  ownerBirthdate: Date
  ownerAddress: string
  id: number
  businessName: string
  businessPhoneNumber: string
  customerCount: number
  businessAddress: string
  account: {
    username: string
    wallets: Wallet[]
    accountNumber: number
  }
  ownerName: string
}

const Providers: NextPage = () => {
  const router = useRouter()
  const [providers, setProviders] = useState<Provider[]>([])
  const [hidden, setHidden] = useState<number[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [createProviderModalState, setCreateProviderModalState] =
    useState<boolean>(false)

  const { user, get } = useContext(AuthContext)

  useEffect(() => {
    if (!user) router.push("/login")
    if (!providers.length)
      get(`admin/providers`).then((data) => setProviders(data.providers))
  }, [])

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
          قائمة مزودي الخدمة
        </h1>
        <div className="h-full bg-[#eeeeee]">
          <div className="bg-gray">
            <div className="flex flex-row my-3 mx-5 gap-2 h-full">
              <button
                onClick={() =>
                  setCreateProviderModalState(!createProviderModalState)
                }
                className="bg-blue-500 hover:opacity-80 text-white rounded-sm p-2"
              >
                إضافة مزود خدمة جديد
              </button>
            </div>
            <div className="bg-white mx-5 px-2 my-3">
              <input
                className="my-3 w-full focus:outline-0 rounded-sm"
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="البحث..."
                title="ابحث"
              />
            </div>
            <div >
              <table className="w-full table-auto border-separate" style={{
                paddingLeft: "20px",
                paddingRight: "20px"
              }}>
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
                      <span className="">الخصم</span>
                    </th>
                    <th className="px-2 py-2">
                      <span className="">رقم الهاتف</span>
                    </th>
                    <th className="px-2 py-2">
                      <span className="">تاريخ الاشتراك</span>
                    </th>
                    <th className="px-2 py-2">
                      <span className="">توليد نقاط</span>
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
                            <span className="">{index + 1}</span>
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
                                {formatNumber(
                                  Number(
                                    provider.account.wallets
                                      .reduce((a, b) => a + b.balance, 0)
                                      .toFixed(2)
                                  )
                                )}
                              </div>
                            </span>
                          </td>
                          <td className="px-2 py-2">
                            <span className="hover:text-blue-500">
                              <div className="px-2 py-2">
                                {provider.account.wallets.length
                                  ? provider.account.wallets[0].bonus + "%"
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
                                {new Date(
                                  provider.createdAt
                                ).toLocaleDateString()}
                              </div>
                            </span>
                          </td>
                          <td className="px-2 py-2 text-center">
                            <button
                              className="text-blue-400 hover:opacity-70"
                              onClick={() =>
                                router.push({
                                  pathname: "/providers/generate",
                                  query: { id: provider.id },
                                })
                              }
                            >
                              توليد نقاط
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
        <CreateProviderModal
          isOpenFromProps={createProviderModalState}
          setIsOpenFromProps={setCreateProviderModalState}
        />
      </Layout>
    </>
  ) : null
}

export default Providers
