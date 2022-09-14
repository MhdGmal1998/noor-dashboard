import { AxiosResponse } from "axios"
import React from "react"

export enum TransactionStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}

export enum TransactionTypes {
  TRANSFER = "TRANSFER",
  PURCHASE = "PURCHASE",
  FEES = "FEES",
}

export interface Transaction {
  trxType?: string

  trxNumber: number

  fromWalletId: number

  toWalletId: number

  amount: number

  transactionType: TransactionTypes

  status: TransactionStatus

  createdAt: Date

  trxDate: Date
}

export interface Wallet {
  walletNumber: number

  bonus: number

  accountId: number

  balance: number

  totalTrx: number

  totalConsume: number

  totalSold: number

  outgoingTransactions: Transaction[]

  incomingTransactions: Transaction[]
}

export interface User {
  id: number
  token: string
  wallets: Wallet[]
}
export interface AppContext {
  user: User | null
  login: (u: string, p: string) => Promise<void>
  logout: () => void
  post: (u: string, d?: any) => Promise<any>
  get: (u: string) => Promise<any>
}

export const AuthContext = React.createContext<AppContext>(null as any)