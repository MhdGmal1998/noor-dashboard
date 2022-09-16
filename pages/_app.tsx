import "../styles/globals.css"
import type { AppProps } from "next/app"
import { AuthProvider } from "../lib/AppContext"
import { Provider } from 'react-redux'
import store, { AppDispatch } from '../redux/index';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import FetchRequestCountApi from "../redux/AsyncThunkApi/FetchRequestCountApi";
import { useAppDispatch } from '../redux/hook/hooks';
function MyApp({ Component, pageProps }: AppProps) {
  
  return (
    <Provider store={store}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </Provider>
  )
}

export default MyApp
