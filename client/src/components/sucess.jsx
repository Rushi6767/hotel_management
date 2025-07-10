import React from 'react';

function Sucess(message) {
    return (
        <div className='success-container alert alert-success'>
            <h1>Sucess</h1>
            <p>{message}</p>            
        </div>
    )
}

export default Sucess;