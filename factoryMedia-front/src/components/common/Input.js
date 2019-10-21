import React from 'react'

const Input = ({name, label , error , ...rest}) =>{
    return (        
            <div className="form-group">
                    <label htmlFor={name}>{label}</label>
                    <input  {...rest} name={name}   className="form-control" id={name} required/>

              {error && <div className="alert alert-danger" style={{marginTop:20}}>{error}</div>}
        </div>
    )
}
export default Input;