import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import type { NextPage } from "next"
import axios from "axios"
import { useContext, useEffect, useState } from "react"
import constants from "../lib/constants"
import { useRouter } from "next/router"
import { AuthContext } from "../lib/context/AuthContext"

const Login: NextPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { user, login } = useContext(AuthContext)

  const toggleShowPassword = () => setShowPassword(!showPassword)
  const handleForgotPassword = () => {}

  useEffect(() => {
    if (user)
      // redirect
      router.push("/")
  }, [user])

  const handleSubmit = async () => {
    try {
      setLoading(true)
      if (!username || !password) {
        setError("يرجى تعبئة الحقول المطلوبة")
        setLoading(false)
        return
      }
      // submit
      setError("")
      await login(username, password)
      setLoading(false)
    } catch (err: any) {
      if (err.response.data.error) setError(err.response.data.error)
      else setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="bg-[#f3f3f3] grid grid-cols-12 grid-rows-3 gap-10">
      <div className="col-span-12 sm:col-span-12">
        <div className="flex flex-col items-center justify-center">
          <div className="text-center w-1/5">
            <h1 className="text-5xl font-blacka my-5">نور</h1>
            <h1 className="">لوحة الإدارة</h1>
          </div>
        </div>
      </div>
      <div className="col-span-12 flex flex-col items-center">
        <h1 className="text-xl mb-2">دخول الإدارة</h1>
        <div className="text-center w-full flex w-1/5 flex-col gap-2 select-none">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 rounded-sm bg-[#e9e9e9] focus:bg-white outline-[#e1e1e1]"
            name="username"
            placeholder="اسم المستخدم"
          />
          <div className="relative flex w-100">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 rounded-sm w-full bg-[#e9e9e9] focus:bg-white outline-[#e1e1e1]"
              name="password"
              placeholder="كلمة المرور"
              type={showPassword ? "text" : "password"}
            />
            <FontAwesomeIcon
              className="absolute left-5 top-1/2 opacity-50 cursor-pointer hover:opacity-100 -translate-y-1/2"
              onClick={toggleShowPassword}
              icon={showPassword ? faEye : faEyeSlash}
            />
          </div>
          {error && <h1 className="text-red-500">{error}</h1>}
          <button
            className="bg-blue-500 text-white rounded-sm p-2 hover:opacity-80 cursor-pointer drop-shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={loading}
          >
            تسجيل الدخول
          </button>
          <a
            className="text-center opacity-40 cursor-pointer mt-4"
            onClick={handleForgotPassword}
          >
            هل نسيت كلمة المرور؟
          </a>
          <h1 className="mt-9">
            ليس لديك حساب؟{" "}
            <span>
              <a
                href="https://google.com"
                className="text-blue-400 cursor-pointer"
              >
                تواصل معنا
              </a>
            </span>
          </h1>
        </div>
      </div>
    </div>
  )
}

export default Login
