import { useRouter } from "next/router"
import { useContext, useEffect } from "react"
import { AuthContext } from "../lib/context/AuthContext"

const Logout: React.FC = () => {
  const router = useRouter()
  const { logout } = useContext(AuthContext)

  useEffect(() => {
    logout()
    router.push("/login")
  }, [])

  return <></>
}

export default Logout
