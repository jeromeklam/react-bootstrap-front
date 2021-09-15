import React from 'react';
import PropTypes from 'prop-types';
import { DefaultTitleCol } from '../list';

export const DefaultHeader = props => (
  <div className="inline-list-default-header bg-secondary-light">
    <div className="row row-title row-line no-gutters text-secondary" key="inline-list-default-header">
      {props.cols.map((oneCol, i) => {
        return <DefaultTitleCol {...props} col={oneCol} idx={i} />;
      })}
      {props.onAddOne && (
        <div className="actions-buttons">
          <div className="btn-group btn-group-xs" role="group" aria-label="...">
            <button type="button" className="btn btn-inline btn-primary" onClick={props.onAddOne}>
              {props.addIcon}
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
);

DefaultHeader.propTypes = {
  addIcon: PropTypes.element,
  onAddOne: PropTypes.func,
};

DefaultHeader.defaultProps = {
  addIcon: null,
  onAddOne: null,
};
