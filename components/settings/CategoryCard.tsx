import { useContext, useEffect, useState } from "react"
import Swal from "sweetalert2"
import { AuthContext } from "../../lib/context/AuthContext"
import CreateCategoryModal from "../CreateCategoryModal"
import Loading from "../Loading"

export type Category = {
  id?: number
  nameAr: string
  nameEn: string
}

interface CategoryCardProps {
  categoriesFromProps: Category[]
  setCategoriesFromProps: (countries: Category[]) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  categoriesFromProps,
  setCategoriesFromProps,
  loading,
  setLoading,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>()
  const [editCategory, setEditCategory] = useState<Boolean>(false)
  const [addCategoryModalState, setAddCategoryModalState] = useState(false)

  const { get, post } = useContext(AuthContext)

  const handleEditCategory = async () => {
    if (editCategory) {
      // save data
      const response = await Swal.fire({
        title: "تأكيد التعديل؟",
        text: "سيتم حفظ التعديلات",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "إلغاء",
        confirmButtonText: "تأكيد",
      })
      if (!response.isConfirmed) return
      setLoading(true)
      try {
        await post("config/category", selectedCategory)
        Swal.fire({
          title: "تم تعديل معلومات التصنيف بنجاح.",
          icon: "success",
          timer: 2000,
        })
        // fall through
        const data = await get("config")
        setCategoriesFromProps(data.categories)
      } catch (err: any) {
        const mes = err.response.data ?? err.message
        return Swal.fire({
          title: "خطأ",
          text: mes,
          icon: "error",
        })
      }
    }
    setLoading(false)
    setEditCategory(!editCategory)
  }

  useEffect(
    () => setSelectedCategory(categoriesFromProps[0]),
    [categoriesFromProps]
  )

  return (
    <>
      {loading && <Loading />}
      <div className="grid grid-cols-12 mx-5 shadow-md bg-white my-3 rounded-sm">
        <h1 className="text-xl mx-5 my-3 col-span-12">إعدادات التصنيفات</h1>
        <hr className="mx-5 my-3 col-span-12" />
        <div className="grid grid-cols-12 mx-5 col-span-12">
          <div className="col-span-6 my-2">
            <div className="mx-5">
              <strong>قائمة التصنيفات</strong>
            </div>
            <div className="mx-5 my-2">
              <select
                className="bg-transparent py-1 w-1/2 border-2 border-solid border-gray-300 rounded-sm"
                value={selectedCategory?.id}
                onChange={(e) =>
                  setSelectedCategory(
                    categoriesFromProps.find(
                      (c) => c.id === Number(e.target.value)
                    )
                  )
                }
              >
                {categoriesFromProps.map((c: Category, i: number) => (
                  <option key={i} value={c.id}>
                    {c.nameAr}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-span-6">
            {selectedCategory && (
              <>
                <div className="flex my-2 justify-between flex-row w-full">
                  <div>
                    <strong>الاسم باللغة العربيّة:</strong>
                  </div>
                  <input
                    className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                    type="text"
                    onChange={(e) =>
                      setSelectedCategory({
                        ...selectedCategory,
                        nameAr: e.target.value,
                      })
                    }
                    disabled={!editCategory}
                    value={selectedCategory.nameAr}
                  />
                </div>
                <div className="flex my-2 justify-between flex-row w-full">
                  <div>
                    <strong>الاسم باللغة الإنجليزية:</strong>
                  </div>
                  <input
                    className="disabled:bg-[#eeeeee] disabled:border-0 border-gray-200 border-solid border-2 bg-white rounded-sm px-2 text-gray-700"
                    type="text"
                    onChange={(e) =>
                      setSelectedCategory({
                        ...selectedCategory,
                        nameEn: e.target.value,
                      })
                    }
                    disabled={!editCategory}
                    value={selectedCategory.nameEn}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <hr className="col-span-12 mx-5" />
        <div className="flex flex-row my-3 mx-5">
          {selectedCategory && (
            <button
              onClick={handleEditCategory}
              className="bg-gray-500 mx-2 hover:opacity-80 text-white rounded-sm px-2 py-1"
            >
              {editCategory ? "حفظ" : "تعديل"}
            </button>
          )}
          <button
            onClick={() => setAddCategoryModalState(true)}
            className="bg-blue-500 mx-2 hover:opacity-80 text-white rounded-sm px-2 py-1 "
          >
            إضافة
          </button>
        </div>
      </div>
      <CreateCategoryModal
        isOpenFromProps={addCategoryModalState}
        setIsOpenFromProps={setAddCategoryModalState}
      />
    </>
  )
}

export default CategoryCard
