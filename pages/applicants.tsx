import { faCheck, faClose, faFighterJet, faNoteSticky, faEye } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import type { NextPage } from "next"
import Head from "next/head"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import Swal from "sweetalert2"
import Layout from "../components/Layout"
import constants from "../lib/constants"
import { AuthContext } from "../lib/context/AuthContext"

export type Applicant = {
  businessName: string
  ownerName: string
  createdAt: Date
  id: number
  businessPhoneNumber: string
}

const Home: NextPage = () => {
  const router = useRouter()
  const [applicants, setApplicants] = useState<Applicant[]>([])

  const { user } = useContext(AuthContext)

  const _handleApproveApplication = async (id: number, name: string) => {
    if (!id) return
    const result = await Swal.fire({
      title: "تأكيد",
      text: "تفعيل مزود الخدمة " + name,
      icon: "info",
      confirmButtonText: "تأكيد",
      showCancelButton: true,
      cancelButtonText: "إلغاء",
    })
    if (result.isConfirmed) {
      try {
        const response = await axios.post(
          `${constants.url}/admin/approve`,
          { providerId: id },
          { headers: { Authorization: `Bearer ${user?.token}` } }
        )
        Swal.fire({
          icon: "success",
          timer: 2000,
          position: "bottom-start",
        })
        router.push("/")
      } catch (err: any) { }
    }
  }

  const _rejectHandle = async (id: number, name: string) => {
    // const result = await Swal.fire({
    //   title: "تأكيد",
    //   text: "رفض مزود الخدمة " + name,
    //   icon: "info",
    //   confirmButtonText: "تأكيد",
    //   showCancelButton: true,
    //   cancelButtonText: "إلغاء",
    // })
    // if (result.isConfirmed) {
    //   try {
    //     const response = await axios.post(
    //       `${constants.url}/admin/reject`,
    //       { providerId: id },
    //       { headers: { Authorization: `Bearer ${user?.token}` } }
    //     )
    //     Swal.fire({
    //       icon: "success",
    //       timer: 2000,
    //       position: "bottom-start",
    //     })
    //     router.push("/")
    //   } catch (err: any) {

    //     console.log(err)
    //   }
    // }
  }

  const _addCommitHandle = () => {

  }
  const _veiwHandle = (applicant: any) => {
    Swal.fire({
      title: applicant.businessName
    })
  }
  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else {
      axios
        .get(`${constants.url}/admin/${constants.routes.pending}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((response) => {
          setApplicants(response.data)
        })
    }
  }, [])

  return user ? (
    <>
      <Head>
        <title>نور</title>
      </Head>
      <Layout>
        <h1 className="text-xl my-3 text-bold text-center bg-[#eeeeee]">
          طلبات التقديم كمزود خدمة
        </h1>
        <div className="h-full bg-[#eeeeee]">
          <div className="bg-gray">
            <div className="bg-white mx-5 px-2 my-3">
              <input
                className="my-3 w-full focus:outline-0 rounded-sm"
                // onChange={(e) => handleSearch(e.target.value)}
                placeholder="البحث عن طلبات مزودين الخدمة"
                title="ابحث"
              />
            </div>
            <table className="w-full table-auto border-separate	" style={{
              paddingLeft: "20px",
              paddingRight: "20px"
            }}>
              <thead className="justify-between">
                <tr className="bg-white">
                  <th className="px-2 py-2">
                    <span className="">#</span>
                  </th>
                  <th className="px-2 py-2">
                    <span className="">اسم العمل</span>
                  </th>
                  <th className="px-2 py-2">
                    <span className="">اسم المالك</span>
                  </th>
                  <th className="px-2 py-2">
                    <span className="">تاريخ التقديم</span>
                  </th>
                  <th className="px-2 py-2">
                    <span className="">رقم الهاتف</span>
                  </th>
                  <th className="px-2 py-2">
                    <span className="">السجل</span>
                  </th>
                  <th className="px-2 py-2">
                    <span className="">موافقة</span>
                  </th>
                  <th className="px-2 py-2">
                    <span className="">تعليق</span>
                  </th>
                  <th className="px-2 py-2">
                    <span className="">رفض</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {applicants &&
                  applicants.map((applicant, index) => (
                    <tr
                      key={index}
                      className="hover:bg-[#CADFFB] duration-200 bg-white"
                    >
                      <td className="px-2 py-2 text-center">
                        <span className="">{index + 1}</span>
                      </td>
                      <td className="px-2 py-2">
                        <Link href={`/applicants/${applicant.id}`}>
                          <strong className="text-blue-400 hover:text-blue-500 cursor-pointer">
                            {applicant.businessName}
                          </strong>
                        </Link>
                        <div className="block">ID: {applicant.id}</div>
                      </td>
                      <td className="px-2 py-2">
                        <span className="">{applicant.ownerName}</span>
                      </td>
                      <td className="px-2 py-2">
                        <span className="hover:text-blue-500">
                          <div className="px-2 py-2">
                            {new Date(applicant.createdAt).toISOString()}
                          </div>
                        </span>
                      </td>
                      <td className="px-2 py-2">
                        <span className="hover:text-blue-500">
                          <div className="px-2 py-2">
                            {applicant.businessPhoneNumber}
                          </div>
                        </span>
                      </td>

                      <td className="px-2 py-2 m-0 h-full">
                        <div className="flex justify-center items-center ">
                          <button
                            onClick={() =>

                              _veiwHandle(applicant)
                            }
                          >
                            <FontAwesomeIcon
                              icon={faEye}
                            />
                          </button>
                        </div>
                      </td>
                      <td className="px-2 py-2 m-0 h-full">
                        <div className="flex justify-center items-center ">
                          <button
                            onClick={() =>
                              _handleApproveApplication(
                                applicant.id,
                                applicant.businessName
                              )
                            }
                          // className="bg-[#305E68] p-1.5 rounded-sm hover:opacity-75"
                          >
                            <FontAwesomeIcon
                              // className="text-green-300"
                              color="#305E68"
                              icon={faCheck}
                            />
                          </button>
                        </div>
                      </td>


                      <td className="px-2 py-2 m-0 h-full">
                        <div className="flex justify-center items-center ">
                          <button
                            onClick={() =>

                              _addCommitHandle()
                            }
                          >
                            <FontAwesomeIcon
                              color="blue"
                              // className="text-green-300"
                              icon={faNoteSticky}
                            />
                          </button>
                        </div>
                      </td>


                      <td className="px-2 py-2 m-0 h-full">
                        <div className="flex justify-center items-center ">
                          <button
                            onClick={() =>
                              
                              _rejectHandle(applicant.id,
                                applicant.businessName)
                            }
                          >
                            <FontAwesomeIcon
                              color="red"

                              // className="text-green-300"
                              icon={faClose}
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    </>
  ) : null
}

export default Home
