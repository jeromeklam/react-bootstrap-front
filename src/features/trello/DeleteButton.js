import React from 'react'

const DeleteButton = props => {
  return (
    <div className="trello-delete-button" {...props}>
      <button className="btn btn-xs text-danger">&#10006;</button>
    </div>
  )
}

export default DeleteButton
