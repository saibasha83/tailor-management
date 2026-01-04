import React from "react";
import ReactDOM from 'react-dom/client'
import MainPageofTM from "./frontend/MainPageofTM";

function Main(){
    return (<MainPageofTM/>)
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main/>);
