import React from 'react'
import { useState } from 'react';




const ErrorLabel = ({connState}) => {

    const onlineStyle = {
        color: 'black',
    };
    const offlineStyle = {
        color: 'yellow',
    };

  return (
    <p id='error-label' style={connState == 'online' ? onlineStyle : offlineStyle}>{connState}</p>
  )
}

export default ErrorLabel