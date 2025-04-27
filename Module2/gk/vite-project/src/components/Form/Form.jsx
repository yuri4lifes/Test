import { useContext, useState } from "react";
import "./Form.css"
import{Button,Input} from "antd";
import { todoContext } from "../../App";
// import{AiOutLinePlus} from "react-icons/ai";

const Form = () => {
  const {handleAdd}=useContext(todoContext)
  const [value,setValue]=useState("")
  const [id,setID]=useState(1)

  const onclick=()=>{
    const newTodo={
      id:id,
      name:value,
      status:false,
    }

    handleAdd(newTodo)
    setValue("")
    setID(id+1)
  }

  return (
    <div className="form">
      <Input size="large" onChange={(e)=>setValue(e.target.value)}/>
      <Button type="primary" size="large" style={{background:"#5ba3c9"}} onClick={onclick}>Add</Button>
    </div>
  )
}

export default Form