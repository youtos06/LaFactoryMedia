//import React,{ useEffect } from 'react'

export default function logout() {
    
    localStorage.removeItem('token');
    window.location = '/';
    return (
        null
    );
}