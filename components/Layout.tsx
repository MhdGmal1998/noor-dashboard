import Link from "next/link"
import { useRouter } from "next/router"
import { ReactNode, useState, useEffect } from "react"
import { layoutState } from '../redux/Slices/LayoutSlice';
import { useAppSelector } from "../redux/hook/hooks"
import { useMemo } from 'react'
interface Props {
  children?: ReactNode
}


const Layout: React.FC<Props> = ({ children }) => {
  const menuItems = [
    {
      href: "/",
      title: "لوحة المعلومات",
    },
    {
      href: "/providers",
      title: "قائمة مزودي الخدمة",
    },
    {
      href: "/customers",
      title: "قائمة العملاء",
    },
    {
      href: "/afiliates",
      title: "قائمة المسوقين",
    },
    {
      href: "/applicants",
      title: "طلبات التقديم",
    },
    {
      href: "/rejectedProvider",
      title: "سلة المهملات",
    },
    {
      href: "/reports",
      title: "التقارير",
    },
    {
      href: "/statisticals",
      title: "الإحصائيات",
    },
    {
      href: "/settings",
      title: "الإعدادات",
    },

    {
      href: "/logout",
      title: "تسجيل الخروج",
    },
  ]

  const router = useRouter()
  const [requestCount, setRequestCount] = useState<number>(0)
  // useEffect(() => {
  //   axios.get(`${constants.url}/admin/${constants.routes.fetchAllPendingRequest}`)
  //     .then((data) => {

  //       setRequestCount(data.data.result)
  //     })
  // }, [])

  // const state = useSelector<AppState, any>(state => state.layout.requestCount)
  const state = useAppSelector(layoutState)
  // const state = useMemo(() => {
  //   // console.log("hello in Layout")
  //   return useAppSelector(layoutState)
  // }, [])

  return (
    <>
      <div className="min-h-screen h-full flex flex-col">
        <div className="flex flex-col md:flex-row bg-[#eeeeee] flex-1">
          <aside className="h-100 bg-[#333333] w-full md:w-60"
          // style={{
          //   height: "90%",
          //   overflow: "scroll"
          // }}
          >
            <h1 className="text-center text-white text-5xl font-blacka my-5">
              نور
            </h1>
            <hr className="my-5 mx-3" />
            {menuItems.map(({ href, title }) => (
              <li className={`decoration-none list-none m-2 `} key={title}

              >
                <Link href={href}>
                  <a
                    className={`flex p-2 bg-[#666666] text-white rounded cursor-pointer ${router.asPath === href
                      ? "cursor-not-allowed opacity-50 hover:opacity-50"
                      : "hover:bg-[#999999] "
                      }`}

                    style={{
                      position: 'relative'
                    }}
                  >

                    {title}
                    {
                      href === "/applicants" && <span style={{
                        left: 5,
                        top: 7,
                        position: 'absolute',
                        backgroundColor: 'red',
                        paddingLeft: "7px",
                        paddingRight: "7px",
                        paddingTop: "4px",
                        paddingBottom: "4px",
                        borderRadius: "50px",
                        fontSize: "11px"
                        // width:"40px",
                        // height:"40px"
                      }}>
                        {state.requestCount}
                      </span>
                    }
                  </a>

                </Link>

              </li>
            ))}
          </aside>
          <main className="flex-1" style={{
            height: "800px",
            overflow: "scroll"
          }}>{children}</main>
        </div>

      </div>

    </>
  )
}

export default Layout
