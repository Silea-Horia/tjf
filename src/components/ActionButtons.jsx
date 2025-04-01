import React from 'react';

const ActionButtons = ({
  onAdd,
  onRemove,
  onUpdate,
  onToggleInsertions,
  isInserting,
  isDeleteDisabled,
  isUpdateDisabled,
}) => (
  <div className="button-container">
    <button className="button" onClick={onAdd}>Add</button>
    <button className="button" onClick={onRemove} disabled={isDeleteDisabled}>Remove</button>
    <button className="button" onClick={onUpdate} disabled={isUpdateDisabled}>Update</button>
    <button className="button" onClick={onToggleInsertions}>
      {isInserting ? 'Stop Insertions' : 'Start Insertions'}
    </button>
  </div>
);

export default ActionButtons;