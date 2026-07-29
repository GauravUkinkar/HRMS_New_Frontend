import MainPanel from "../../comp/MainPanel/MainPanel"
import Table_Comp from "../../comp/table/Table"
import "./EmployeeList.scss"

const EmployeeList = () => {
    const columns = [
        {
            key:"name",
            dataIndex :"name",
            title:"Name",
            search:true
        },
        {
            key:"age",
            dataIndex :"age",
            title:"age"
        },
         {
            key:"Action",
            dataIndex :"Action",
            title:"Action",
            render:()=>(
                 <button>delete</button>
            )
        },
    ]

    const data = [
        {
            name:"Ketan r d",
            age:18
        }
    ]
  return (
    <>
      <MainPanel title="Admin Dashboard" >
 <Table_Comp
 columns={columns}
 data={data}
 />
      </MainPanel>
    </>
  )
}

export default EmployeeList

