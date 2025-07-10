import React from 'react';

function Error(message) {
    return (
        <div className='error-container alert alert-danger'>
            <h1>Error</h1>
            <p>{message}</p>
        </div>
    )
}

export default Error;