import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const titlestyle = {
  fontSize: '1.2rem',
  fontWeight: 'bold',
  paddingLeft: '5px',
  paddingRight: '10px',
};

const titlestyle2 = {
  fontSize: '0.8rem',
  fontWeight: 'normal',
  paddingLeft: '5px',
  paddingRight: '10px',
};

const mystyle = {
  top: '0px',
  left: '0px',
  position: 'absolute',
  right: '0px',
  zIndex: '700',
  height: '50px',
  lineHeight: '50px',
  vertical1lign: 'middle',
  paddingRight: '5px',
};

const quickStyles = {
  marginTop: '5px',
};

const sortToText = (sort, cols) => {
  let text = 'Aucun tri';
  if (sort) {
    text = '';
    sort.forEach(elem => {
      const found = cols.find(elem2 => elem2.col === elem.col);
      if (found) {
        let way = '+';
        if (elem.way === 'down') {
          way = '-';
        }
        text = `${text} ${found.label}(${way})`;
      }
    });
  }
  return text;
};

export const DefaultHeader = props => (
  <div style={mystyle} className="default-list-header bg-secondary text-ligh">
    <div className="row">
      <div className="col-20">
        <span style={titlestyle} className="text-light">
          {`${props.title}`}
        </span>
      </div>
      <div className="col-10" style={quickStyles} />
      <div className="col-6 text-right">
        <ul className="nav justify-content-end">
          <li className="nav-item">
            <button type="button" className="btn btn-secondary text-light" onClick={props.onToggleFilter}>
              {props.filterIcon}
            </button>
          </li>
          {props.globalActions &&
            props.globalActions.map(action => (
              <li className="nav-item" key={action.name}>
                <button
                  type="button"
                  title={action.label || ''}
                  className={classnames('btn', action.theme && `btn-${action.theme}`)}
                  onClick={() => {
                    action.onClick();
                  }}
                >
                  {action.icon}
                </button>
              </li>
            ))}
        </ul>
      </div>
    </div>
  </div>
);

DefaultHeader.propTypes = {
  title: PropTypes.string.isRequired,
  quickSearch: PropTypes.element,
  onToggleFilter: PropTypes.func.isRequired,
  globalActions: PropTypes.element,
  filterIcon: PropTypes.element.isRequired,
  sort: PropTypes.element,
  cols: PropTypes.element.isRequired,
};

DefaultHeader.defaultProps = {
  globalActions: [],
  quickSearch: '',
  sort: {},
};
