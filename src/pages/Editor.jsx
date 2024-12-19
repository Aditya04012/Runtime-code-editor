import React, { useEffect, useRef } from "react";
import * as CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css"; 
import "codemirror/theme/dracula.css"; 
import "codemirror/mode/javascript/javascript";   
import "codemirror/addon/edit/closebrackets"; 
import "codemirror/addon/edit/closetag"
import Action from "./action";


function Editor({socketRef,roomId,onCodeChange}){
    const editorRef=useRef(null);
    useEffect(()=>{
        async function init(){
       editorRef.current= CodeMirror.fromTextArea(document.getElementById("realtimeEditor"), {
            mode: "javascript", 
            theme: "dracula", 
            lineNumbers: true,
            autoCloseBrackets: true, 
            autoCloseTags: true, 
        });

         editorRef.current.on('change',(instance,change)=>{
                const {origin}=change;
                const code=instance.getValue();
                onCodeChange(code);
                if(origin!=='setValue'){
                    socketRef.current.emit(Action.CODE_CHANGE,{
                        roomId,
                        code
                    })
                }
         });



        }
        init();
    },[]);

    useEffect(()=>{
        if(socketRef.current){
         socketRef.current.on(Action.CODE_CHANGE,({code})=>{
             if(code!==null){
                editorRef.current.setValue(code);
             }
         })
        }

        return ()=>{
            socketRef.current.off(Action.CODE_CHANGE);
        }
     
     
         },[socketRef.current]);


    return (
        <textarea id="realtimeEditor"></textarea>
    );
}
export default Editor;