interface InputProps {
  name: string
  label?: string
  placeholder?: string
  type: string
}

const Input: React.FC<InputProps> = ({ name, label, placeholder, type }) => {
  return (
    <>
      <input name={name} type={type} placeholder={placeholder} />
    </>
  )
}

export default Input
