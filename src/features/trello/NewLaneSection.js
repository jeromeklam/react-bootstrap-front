import React from 'react';

export default ({ t, onClick }) => (
  <div className="trello-new-lane-section">
    <button className="btn btn-primary btn-large" t={t} onClick={onClick}>
      {t({ id: 'rbf.trello.lane.add', defaultMessage: 'Add another lane' })}
    </button>
  </div>
);
