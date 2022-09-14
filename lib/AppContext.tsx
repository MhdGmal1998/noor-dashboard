import axios from "axios"
import React, { useEffect, useState } from "react"
import constants from "./constants"
import { AuthContext, User } from "./context/AuthContext"

const initialState = null

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(initialState)

  const set = (user: User) => setUser(user)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user")
      if (user) {
        set(JSON.parse(user))
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
