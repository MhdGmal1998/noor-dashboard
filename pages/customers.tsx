import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import CreateCustomerModal from "../components/CreateCustomerModal"
import Layout from "../components/Layout"
import { AuthContext } from "../lib/context/AuthContext"
import formatNumber from "../util/formatNumber"
import { Wallet } from "./providers"

export type Customer = {
  accountId: number
  id: number
  firstName: string
  lastName: string
  account: {
    id: number
    username: string
    accountNumber: number
    wallets: Wallet[]
    status: string
  }
  phoneNumber: string
  email?: string
  countryCode: string
  status: string
  createdAt: Date
}

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [hidden, setHidden] = useState<number[]>([])
  const [createCustomerModalState, setCreateCustomerModalState] =
    useState<boolean>(false)

  const { user, get } = useContext(AuthContext)
  const router = useRouter()

  const handleSearch = (val: string) => {
    let arr: number[] = []
    customers.map((p) => {
      let hit = false
      // check business name
      if (
        p.firstName.toUpperCase().includes(val.toUpperCase()) ||
        p.lastName.toUpperCase().includes(val.toUpperCase()) ||
        p.phoneNumber?.toUpperCase().includes(val.toUpperCase()) ||
        p.account.accountNumber.toString().includes(val)
      )
        hit = true
      // check location
      if (p.account.accountNumber.toString().includes(val)) hit = true

      if (!hit) arr.push(p.id)
    })
    setHidden(arr)
  }

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
    if (!customers || !customers.length) {
      // get customers data
      get("admin/customers").then((response) => {
        setCustomers(response)
      })
    }
  }, [user])

  return user ? (
    <>
      <Layout>
        <h1 className="text-xl my-3 text-bold text-center bg-[#eeeeee]">
          قائمة العملاء
        </h1>
        <div className="h-full bg-[#eeeeee]">
          <div className="bg-gray">
            <div className="flex flex-row my-3 mx-5 gap-2 h-full">
              <button
                onClick={() => setCreateCustomerModalState(true)}
                className="bg-blue-500 hover:opacity-80 text-white rounded-sm p-2"
              >
                إضافة عميل جديد
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
            <table className="w-full table-auto border-separate	"
            style={{
              paddingLeft:"20px",
              paddingRight:"20px"
            }}
            >
              <thead className="justify-between">
                <tr className="bg-white">
                  <th className="px-2 py-2">
                    <span className="">#</span>
                  </th>
                  <th className="px-2 py-2">
                    <span className="">رقم الحساب</span>
                  </th>
                  <th className="px-2 py-2">
                    <span className="">اسم العميل</span>
                  </th>
                  <th className="px-2 py-2">
                    <span className="">رقم الهاتف</span>
                  </th>
                  <th className="px-2 py-2">
                    <span className="">الرصيد الحالي</span>
                  </th>
                  <th className="px-2 py-2">
                    <span className="">عدد المحافظ</span>
                  </th>
                  <th className="px-2 py-2">
                    <span className="">إجمالي الاستهلاك</span>
                  </th>
                  <th className="px-2 py-2">
                    <span className="">تاريخ الاشتراك</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {customers &&
                  customers.map((c, index) =>
                    hidden.includes(c.id) ? null : (
                      <tr
                        key={index}
                        className="hover:bg-[#CADFFB] duration-200 bg-white"
                      >
                        <td className="px-2 py-2 text-center">
                          <span className="">{index + 1}</span>
                        </td>
                        <td className="px-2 py-2 text-center">
                          <span className="">{c.account.accountNumber}</span>
                        </td>
                        <td className="px-2 py-2">
                          <strong className="text-blue-400 hover:text-blue-500">
                            <Link href={`/customers/${c.id}`}>
                              {`${c.firstName} ${c.lastName} ${
                                c.status === "BANNED" ? "(محظور)" : ""
                              }`}
                            </Link>
                          </strong>
                        </td>
                        <td className="px-2 py-2">
                          <span className="">{c.phoneNumber}</span>
                        </td>
                        <td className="px-2 py-2">
                          <span className="">
                            {formatNumber(
                              Number(
                                c.account.wallets.reduce(
                                  (tot, cur) => tot + cur.balance,
                                  0
                                )
                              ).toFixed(2)
                            )}
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          <span className="">{c.account.wallets.length}</span>
                        </td>
                        <td className="px-2 py-2">
                          <span className="hover:text-blue-500">
                            <div className="px-2 py-2">
                              {formatNumber(
                                Number(
                                  c.account.wallets.reduce(
                                    (total, curr) => total + curr.totalConsume,
                                    0
                                  )
                                ).toFixed(2)
                              ) + " نقطة"}
                            </div>
                          </span>
                        </td>
                        <td className="px-2 py-2">
                          <span className="hover:text-blue-500">
                            <div className="px-2 py-2">
                              {new Date(c.createdAt).toLocaleDateString()}
                            </div>
                          </span>
                        </td>
                      </tr>
                    )
                  )}
              </tbody>
            </table>
          </div>
        </div>
        <CreateCustomerModal
          isOpenFromProps={createCustomerModalState}
          setIsOpenFromProps={setCreateCustomerModalState}
        />
      </Layout>
    </>
  ) : null
}

export default CustomersPage
