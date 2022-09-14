import type { NextPage } from "next"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import Layout from "../components/Layout"
import Loading from "../components/Loading"
import AffiliateCard, { Affiliate } from "../components/settings/AffiliateCard"
import CategoryCard, { Category } from "../components/settings/CategoryCard"
import CountryCard, { Country } from "../components/settings/CountryCard"
import SystemConfigCard, {
  SystemConfig,
} from "../components/settings/SystemConfigCard"
import { AuthContext } from "../lib/context/AuthContext"

const Settings: NextPage = () => {
  const [countries, setCountries] = useState<Country[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [config, setConfig] = useState<SystemConfig>({})
  const [loading, setLoading] = useState(false)

  const { get, user } = useContext(AuthContext)

  const router = useRouter()

  useEffect(() => {
    if (user) {
      try {
        get(`config`).then((data) => {
          setCountries(data.countries)
          setCategories(data.categories)
          setConfig(data.config)
        })
        get("admin/affiliate").then((data) => {
          setAffiliates(data)
        })
      } catch (err) {}
    } else router.push("/")
  }, [user])

  return (
    <>
      {loading && <Loading />}
      <Layout>
        <>
          <h1 className="text-xl my-3 text-bold text-center bg-[#eeeeee]">
            إعدادات النظام
          </h1>

          <SystemConfigCard
            systemConfigFromProps={config}
            setSystemConfigFromProps={setConfig}
            loading={loading}
            setLoading={setLoading}
          />

          <AffiliateCard
            affiliatesFromProps={affiliates}
            setAffiliatesFromProps={setAffiliates}
            loading={loading}
            setLoading={setLoading}
          />

          <CountryCard
            setCountriesFromProps={setCountries}
            countriesFromProps={countries}
            loading={loading}
            setLoading={setLoading}
          />

          <CategoryCard
            categoriesFromProps={categories}
            setCategoriesFromProps={setCategories}
            loading={loading}
            setLoading={setLoading}
          />
        </>
      </Layout>
    </>
  )
}

export default Settings
