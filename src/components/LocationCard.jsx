import React from 'react'

const LocationCard = ({location, backgroundColor, handleLocationChange, selectedLocationIds}) => {
  return (
    <tr
    style={{ backgroundColor: {backgroundColor} }}
    >
        <td>
            <input
                type="checkbox"
                onChange={() => handleLocationChange(location)}
                checked={selectedLocationIds.includes(location.id)}
            />
        </td>
        <td>{location.name}</td>
        <td>{location.dateVisited}</td>
        <td>{location.rating}</td>
    </tr>
  )
}

export default LocationCard