import React from "react";
import ReactDOM from 'react-dom/client'
import MainPageofTM from "./TailorManaGe/MainPageofTM";
import UserForm from "./api-Integration";
function Main(){
    return (<MainPageofTM/>)
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main/>);
