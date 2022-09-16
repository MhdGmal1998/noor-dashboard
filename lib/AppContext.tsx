import axios from "axios"
import React, { useEffect, useState } from "react"
import FetchRequestCountApi from "../redux/AsyncThunkApi/FetchRequestCountApi"
import { useAppDispatch } from "../redux/hook/hooks"
import constants from "./constants"
import { AuthContext, User } from "./context/AuthContext"

const initialState = null

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(initialState)

  const set = (user: User) => setUser(user)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user")
      if (user) {
        set(JSON.parse(user))
        // console.log("Hello Mohammed Gamal")
        dispatch(FetchRequestCountApi())
      }
    }


  }, [])

  const get = async (route: string) => {
    const response = await axios.get(`${constants.url}/${route}`, {
      headers: { Authorization: `Bearer ${user?.token}` },
    })
    return response.data
  }

  const post = async (route: string, data?: any) => {
    const response = await axios.post(`${constants.url}/${route}`, data, {
      headers: { Authorization: `Bearer ${user?.token}` },
    })
    return response.data
  }

  const login = async (username: string, password: string) => {
    const response = await axios.post(`${constants.url}/auth/login`, {
      username,
      password,
      loginType: "admin",
    })
    set(response.data as User)
    localStorage.setItem("user", JSON.stringify(response.data as User))
  }

  const logout = () => {
    setUser(initialState)
    localStorage.removeItem("user")
  }
  return (
    <AuthContext.Provider value={{ post, get, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
