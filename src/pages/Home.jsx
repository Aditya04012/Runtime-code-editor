import React, { useState } from "react";
import {v4 as uuidV4} from "uuid";
import toast from "react-hot-toast"
import {useNavigate} from "react-router-dom"
function Home(){
    const navigate=useNavigate();
   
const [roomId,setId]=useState("");
   
const [userName,setuserName]=useState("");

    function createNewRoom(e){
       e.preventDefault();
       const id=uuidV4();
        setId(id);
        toast.success('created a new room');

    }
    function joinRoom(){
        if(!roomId || !userName){
            toast.error('Room ID & username is required');
            return;
        }

        //redirect
        navigate(`/editor/${roomId}`,{
            state:{
                userName,
            },
        });
    }

    function handleEnter(e){
     if(e.code==='Enter'){
        joinRoom();
     }
    }

    return (
        <div className="homePageWrapper">
          <div className="formWrapper">
            <img src="../public/logo.png" alt="img"></img>   
            <h4 className="mainLabel">Paste Invitation ROOM ID</h4>
           <div className="inputGroup">
            <input type="text" className="inputBox" placeholder="ROOM ID " value={roomId} onChange={(e)=>setId(e.target.value)} onKeyUp={handleEnter}></input>
            <input type="text" className="inputBox" placeholder="USERNAME " value={userName} onChange={(e)=>setuserName(e.target.value)} onKeyUp={handleEnter}></input>
            <button className="btn joinBtn" onClick={joinRoom}>JOIN</button>
            <span className="createInfo">
                If you don't have invite than create &nbsp;
                <a onClick={createNewRoom}  href="" className="createNewBtn"> New Room</a>
            </span>
           </div>

          </div>
          <footer>
            <h4> Built with 💛 by <span> Aditya Bhatnagar</span></h4>
          </footer>
        </div>
    );
}
export default Home;