import React, { useState,useRef, useEffect } from "react";
import ClientComp from "./ClientComp";
import Editor from "./Editor";
import { initSocket } from "../socket";
import Action from "./action";
import { useLocation,useNavigate,Navigate ,useParams} from "react-router-dom";
import toast from "react-hot-toast";
function EditorPage(){
     const reactNavigator=useNavigate();
    const socketRef=useRef(null);
    const location=useLocation();
    const {roomId}=useParams();
    const [client,setClient]=useState([]);
    const codeRef=useRef(null);

    useEffect(()=>{
        const init=async()=>{
          socketRef.current=await initSocket();
          socketRef.current.on('connect_error',(err)=>handleError(err));
          socketRef.current.on('connect_failed',(err)=>handleError(err));


          function handleError(e){
            console.log(e);
            toast.error('socket connection failed');
            reactNavigator('/');
          }
       
         socketRef.current.emit(Action.JOIN,{
            roomId,
            username:location.state?.userName,
         });


        socketRef.current.on(Action.JOINED,({clients,username,socketId})=>{
            if(username!==location.state.userName){
                toast.success(`${username} joined the room`);
                 
            }
            setClient(clients);

            
            socketRef.current.emit(Action.SYNC_CODE,{
                code:codeRef.current,
                socketId
            })
        });




        socketRef.current.on(Action.DISCONNECTED, ({ socketId, username }) => {
            toast.success(`${username} left the room!`);
            setClient((prev) => prev.filter((client) => client.socketId !== socketId));
        });


        }
        init();

        return () => {
            socketRef.current.disconnect();
            socketRef.current.off(Action.JOINED);
            socketRef.current.off(Action.DISCONNECTED);

        };
    },[]);
   
  
   async function copyRoomID(){
        try{
         await navigator.clipboard.writeText(roomId);
         toast.success('Room Id has been copied to your clipboard');
        }catch(err){
        toast.error("error in copying RoomId")
        }
    }

    function leaveRoom(){
        reactNavigator('/');
    }

     if(!location.state){
        return <Navigate to='/'/>
     }
   
    return (
       <div className="mainWrap">


        <div className="aside">
             <div className="asideInner">
                <div className="logo">
                    <img src="../public/logo.png"></img>
                </div>

               <h3>Connected</h3>
                <div className="clientList">
                  {
                    client.map(el=><ClientComp username={el.username} key={el.sockedId}></ClientComp>)
                  }
                </div>
             </div>


            <button className="btn copyBtn" onClick={copyRoomID}>COPY ROOM ID</button>
            <button className="btn leaveBtn" onClick={leaveRoom}>LEAVE</button>

        </div>




        <div className="editorwrap">
            <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code)=>{
              codeRef.current=code;
            }}></Editor>
        </div>
       </div>
    );
}
export default EditorPage;