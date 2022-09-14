import { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"

interface ModalProps {
  isOpenFromProps: boolean
  setIsOpenFromProps: React.Dispatch<React.SetStateAction<boolean>>
  children: React.ReactNode
  title?: string
  closeButton?: boolean
}
const Modal: React.FC<ModalProps> = ({
  children,
  isOpenFromProps,
  setIsOpenFromProps,
  title,
  closeButton,
}) => {
  function closeModal() {
    setIsOpenFromProps(false)
  }

  return (
    <>
      <Transition appear show={isOpenFromProps} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-dark_shadow" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-1/2 p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-xl">
                {title && (
                  <>
                    {" "}
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-medium text-center leading-6 text-gray-900"
                    >
                      {title}
                    </Dialog.Title>
                    <hr className="my-2" />
                  </>
                )}
                <div className="mt-2">{children}</div>

                {closeButton && (
                  <div className="mt-4 flex flex-row">
                    <button
                      type="button"
                      className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-400 border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      onClick={closeModal}
                    >
                      إغلاق
                    </button>
                  </div>
                )}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default Modal
