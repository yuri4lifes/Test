import { Button } from "antd"
import { useContext } from "react"
import { todoContext } from "../../App"


const Remove = () => {
  const {handleRemove}=useContext(todoContext)
  return (
    <Button type="primary" size="large" style={{background:"#5ba3c9"}} onClick={()=>handleRemove()}>Remove All</Button>
  )
}

export default Remove