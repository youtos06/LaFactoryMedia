import React from 'react'

const Radio = ({name,label,values,error,...rest}) => {
    return (
        <div className="form-group">
            <label htmlFor={name}>{label}</label>
            
                    {values.map(radioValue => <React.Fragment key={radioValue.value}><p style={{fontSize:12}}><input {...rest} type="radio" name={name} value={radioValue.value} /> {radioValue.name}</p></React.Fragment>)}      

            {error && <div className="alert alert-danger">{error}</div>}
        </div>
    )
}
export default Radio;