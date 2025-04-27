import { Button, Checkbox } from "antd"
import Typography from "antd/es/typography/Typography"
import { useContext } from "react"
import { todoContext } from "../../App"


const Item = ({item}) => {
  const {id,name,status}=item
  const{handleCheck}=useContext(todoContext)
  const{handleEdit}=useContext(todoContext)
  const{handleDel}=useContext(todoContext)

  let style="ifalse"

  if(status==true){
    style="itrue"
  }
  return (
    <div className="item">
       <div className="item-left">
       <Checkbox onClick={()=>handleCheck(id-1)} checked={status}/>
        <Typography className={style}>{id}.{name}</Typography>
       </div>
       <div className="item-right">
        <Button onClick={()=>handleDel(id-1)}>del</Button>
        <Button onClick={()=>handleEdit(id-1)}>edit</Button>
       </div>
    </div>
  )
}

export default Item