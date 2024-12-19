import React from "react";
import Avatar from "react-avatar"
function clientComp({username}){
return (
    <div className="client">
    <Avatar name={username} size={50} round="14px"></Avatar>
        <span className="userName">{username}</span>
    </div>
);
}
export default clientComp;