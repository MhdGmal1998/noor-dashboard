import { useRouter } from "next/router"
import { useContext, useEffect } from "react"
import Layout from "../../components/Layout"
import { AuthContext } from "../../lib/context/AuthContext"

const ResetPassword: React.FC = () => {
  const router = useRouter()
  const { uuid } = router.query
  const { get } = useContext(AuthContext)

  useEffect(() => {
    if (uuid) {
      try {
        get(`admin/reset-password/${uuid}`).then((res) => {
          console.log(res) // account
        })
      } catch (err) {
        router.push("/")
      }
    }
  })

  // useEffect(() => {
  // if (!uuid) router.push("/")
  // if (!customer && cid)
  // get("admin/customers/" + cid).then((res) => {
  // setCustomer(res.customer as Customer)
  // setSelectedWallet(
  // res.customer.account.wallets.length
  // ? res.customer.account.wallets[0]
  // : undefined
  // )
  // })
  // }, [cid, get, user])

  return <Layout></Layout>
}

export default ResetPassword
