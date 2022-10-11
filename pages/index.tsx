import axios from "axios"
import type { NextPage } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import Layout from "../components/Layout"
import constants from "../lib/constants"
import { AuthContext, Wallet } from "../lib/context/AuthContext"
import formatNumber from "../util/formatNumber"
import trxTypeToString from "../util/trxTypeToString"

const Home: NextPage = () => {
  // #TODO any
  const [data, setData] = useState<any>()
  const router = useRouter()
  const { user, logout } = useContext(AuthContext)

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else {
      // get admin info
      axios
        .get(`${constants.url}/admin`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((res) => {
          setData(res.data)
          console.log(res.data)
        })
        .catch((err) => {
          logout()
          router.push("/login")
        })
    }
  }, [])

  return data ? (
    <>
      <Layout>
        <h1 className="text-xl my-3 text-bold text-center bg-[#eeeeee]">
          لوحة المعلومات
        </h1>
        <div className="grid grid-cols-12 mx-5 shadow-md bg-white my-3 rounded-sm">
          <div className="col-span-12 mx-2">
            <h1 className="text-xl mx-5 my-3">معلومات</h1>
            <hr />
            <div className="grid grid-cols-12 mx-5 my-3">
              <div className="col-span-6">
                {" "}
                <div className="mx-5 my-2 ">
                  <strong>إجمالي رصيد محافظ النظام </strong>
                  {formatNumber(
                    data.wallets
                      .reduce((t: number, c: Wallet) => t + c.balance, 0)
                      .toFixed(2)
                  ) + " نقطة"}
                </div>
                <div className="mx-5 my-2">
                  <strong>عدد العمليّات خلال 24 ساعة: </strong>
                  {data.trxCountToday}
                </div>
                <div className="mx-5 my-2">
                  <strong>عدد العمليّات الإجمالي: </strong>
                  {formatNumber(data.trxCount)}
                </div>
              </div>
              <div className="col-span-6">
                <div className="mx-5 my-2">
                  <strong>إجمالي المشتركين (مزود خدمة): </strong>
                  {data.providerCount}
                </div>
                <div className="mx-5 my-2">
                  <strong>إجمالي المشتركين (مستهلك): </strong>
                  {data.customerCount}
                </div>
                <div className="mx-5 my-2">
                  <strong>طلبات التقديم للنظام: </strong>
                  {data.applicantCount}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 shadow-sm bg-white mx-5">
          <div className="col-span-12">
            <h2 className="text-xl  my-3 text-bold mx-5">العمليّات الأخيرة</h2>
            <hr />
            <table className="bg-[#eeeeee] w-full table-auto border-separate	">
              <thead className="justify-between">
                <tr className="bg-white ">
                  <th className="px-2 py-2">
                    <span className="">#</span>
                  </th>
                  <th className="px-2 py-2">
                    <span className="">رقم العمليّة</span>
                  </th>
                  <th className="px-2 py-2">
                    <span className="">المرسل</span>
                  </th>
                  <th className="px-2 py-2">
                    <span className="">المستقبل</span>
                  </th>
                  <th className="px-2 py-2">
                    <span className="">النوع</span>
                  </th>
                  <th className="px-2 py-2">
                    <span className="">التاريخ</span>
                  </th>
                  <th className="px-2 py-2">
                    <span className="">المبلغ</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {data &&
                  data.trxs.map((trx: any, index: number) => (
                    <tr
                      key={index}
                      className="hover:bg-blue-100 bg-white text-center"
                    >
                      <td className="px-2 py-2">
                        <span className="">{index + 1}</span>
                      </td>
                      <td className="px-2 py-2">
                        <span className="">{trx.trxNumber}</span>
                      </td>
                      <td className="px-2 py-2">
                        <span className="">{trx.senderName}</span>
                      </td>
                      <td className="px-2 py-2">
                        <span className="">{trx.reciverName}</span>
                      </td>
                      <td className="px-2 py-2">
                        <span className="">
                          {trxTypeToString(trx.transactionType)}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <span className="">
                          {new Date(trx.trxDate).toLocaleString()}
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <span className="">
                          {formatNumber(trx.amount.toFixed(2))}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="flex mx-5 my-3">
            <button className="bg-blue-500 mx-2 hover:opacity-80 text-white rounded-sm p-2">
              <Link href="/transfer">تحويل</Link>
            </button>
            <button className="bg-blue-500 hover:opacity-80 text-white rounded-sm p-2">
              <Link href="/consume">إستهلاك</Link>
            </button>
          </div>
        </div>
      </Layout>
    </>
  ) : null
}

export default Home
