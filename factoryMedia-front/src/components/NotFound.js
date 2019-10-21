import React,{useEffect} from 'react'
import Notfound from "./../404.jpg"
import { toast } from 'react-toastify';
export default function NotFound(props) {
    
    useEffect (()=>{
        const Redirect = () => {
            toast.info("redirect Home in 2s")
            setTimeout(()=>{props.history.push('/')},3000);   
        }
        Redirect();
    },[props])
    
    return (
        <div>
            <img style={{ width:"100%",height:"100%"}} className="img-fluid" src={Notfound} alt=""/>
            
        </div>
    )
}
