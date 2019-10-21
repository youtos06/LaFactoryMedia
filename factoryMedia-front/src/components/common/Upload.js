import React from 'react'
import file from '../Style/file.css';

const Upload = ({name, label , error, multiple, ...rest}) =>{
    let num=""
    if(multiple === true){
        num = "multiple"
    }
    return ( 
        <div className="form-group files color" style={{file}}>
            <label  htmlFor={name}>{label}</label>
            <input {...rest} type="file"  name={name}   id={name} className="form-control"  multiple={num}/>
            {error && <div className="alert alert-danger" style={{marginTop:20}} >{error}</div>}
        </div>
    )
}
export default Upload;