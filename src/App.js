import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useWeb3React } from "@web3-react/core";
import { Injected } from "./components/wallet/Connectors";
import { abi } from "./data";
import { ethers } from "ethers";

export default function Home() {
  const[addTask, setAddTask ] = useState('');
  const[taskNumber, setTaskNumber ] = useState('');
  const[checkTask, setCheckTask ] = useState('');
  const[gotCheckTask, setGotCheckTask ] = useState({});
  const[currentTask, setCurrentTask] = useState('');
  const[UpdateTaskCompletion, setUpdateTaskCompletion ] = useState('');
  const [Error, setError] = useState('')

  const { active, account, library, connector, activate, deactivate } = useWeb3React()
  const [contract , setContract] = useState({});

  async function connect() {
    try {

      await activate(Injected)
      const address = '0x54322c4A6b545De86eFB06a680235ECC95a2dcE0';
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const Contract = new ethers.Contract(address, abi, signer);
      setContract(Contract);

    } catch (ex) {
      console.log(ex)
    }
  }

    const handleChangeTask = (evt) => {
      const taskk = evt.target.value;
      setAddTask(taskk)
    }
    async function addTaskBtn() {
      await contract.setter(addTask)
    }

 

    
   
    const handleChangeCheckTask = (evt) => {
      const checknum = evt.target.value;
      setCheckTask(checknum)
    }
    async function CheckTaskBtn() {
      const tt = await contract.tasks(checkTask)
      setGotCheckTask(tt);
      const num = (ethers.BigNumber.from(tt.taskNumber)).toString();
      setCurrentTask(num);
      console.log(tt);
      await contract.taskNum().then((r)=>{
        const bg = (ethers.BigNumber.from(r)).toString();
        console.log("this is bignumber :",bg);
        setTaskNumber(bg)
      });
    }

    const handleChangeUpdateTask = (evt) => {
      const updatenum = evt.target.value;
      setUpdateTaskCompletion(updatenum)
    }

    async function upd() {
      if(UpdateTaskCompletion > taskNumber){
        setError('No task Available')
      } else {
        await contract.update(UpdateTaskCompletion)
      }
    }



  return (
    <div className="container-fluid" >
    <div className="row bg-warning" style={{display: 'flex' , justifyContent: 'center' , alignItems : 'center'}}>
      <h1 className="col-6">Todo</h1>
      {active ? 
      <div className="col-6 text-end">Connected to MetaMask</div>
      :
      <div className="col-6 text-end"> Not Connected to MetaMask <button onClick={()=>{connect()}} className="btn btn-dark">Connect</button> </div>  
    }
      
    </div>
    {active ? <div className="row mt-4 text-center">
    <div className="col-6">
      <h3>Form</h3>
      <br /><br />
      <form onSubmit={e => e.preventDefault()}>

        <div>
        <input  type="text" value={addTask}  name="task" onChange={handleChangeTask}/>
        <button onClick={() => addTaskBtn()} type="submit">Add Task</button>

        </div>
       

     <br /><br />
      <div>
        <input type="text" name="" id="" onChange={handleChangeCheckTask}/> 
        <button onClick={CheckTaskBtn}>Check Task</button>
      </div>

      <br /><br />

      <div>
        <input type="text" name="" id="" onChange={handleChangeUpdateTask}/> 
        <button onClick={upd}>Update Task</button>
        <div className="text-danger">{Error}</div>

      </div>

        
      </form>
    </div>
    <div className="col-6">

      <div> Total Task : {taskNumber} </div>
      <div>Task Number: {currentTask} </div>
      <div>Name: {gotCheckTask.Name} </div>
      <div>Completed: {gotCheckTask.completed === true ? 'true' : gotCheckTask.completed === false ? 'false' : '' } </div>



    </div>
    </div> :
    <div className="text-center"> NOt Connected </div>
    
}
  </div>
  )
}