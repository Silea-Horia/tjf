import React from 'react'
import { useState } from 'react';




const ErrorLabel = ({connState}) => {

    const onlineStyle = {
        color: 'black',
    };
    const offlineStyle = {
        color: 'yellow',
    };
    const serverDownStyle = {
        color: 'red',
    };

  return (
    <p id='error-label' style={connState == 'online' ? onlineStyle : (connState == 'offline' ? offlineStyle : serverDownStyle)}>{connState}</p>
  )
}

export default ErrorLabel