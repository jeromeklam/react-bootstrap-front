import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

const cardStyles = {
  position: 'absolute',
  top: '0px',
  bottom: '0px',
  left: '0px',
  right: '0px',
};

const cardBodyStyles = {
  overflowX: 'hidden',
  overflowY: 'auto',
};

export const DefaultForm = props => (
  <form className="layout-form-responsive">
    <div className="card bg-light" style={cardStyles}>
      <div className="card-header bg-secondary clearfix">
        <div className="float-right">
          <span className="navbar-brand text-light">{props.title}</span>
        </div>
        {props.tabs && props.tabs.length > 0 && (
          <ul className="nav nav-tabs float-left">
            {props.tabs &&
              props.tabs.map(oneTab => (
                <li key={oneTab.key} data-id={oneTab.key} className="nav-item">
                  <a
                    className={classnames('nav-link', props.tab === oneTab.key && 'active')}
                    onClick={() => {
                      props.onNavTab(oneTab.key);
                    }}
                  >
                    {oneTab.label}
                  </a>
                </li>
              ))}
          </ul>
        )}
      </div>
      <div className="card-body" style={cardBodyStyles}>{props.children}</div>
      <div className="card-footer text-right bg-secondary">
        <button type="button" className="btn btn-success btn-submit" onClick={props.onSubmit}>
          <span>Enregistrer</span>
        </button>
        &nbsp;
        <button type="button" className="btn btn-secondary" onClick={props.onCancel}>
          <span>Annuler</span>
        </button>
      </div>
    </div>
  </form>
);

DefaultForm.propTypes = {
  title: PropTypes.string.isRequired,
  tabs: PropTypes.element,
  tab: PropTypes.string,
  children: PropTypes.element.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onNavTab: PropTypes.func,
};

DefaultForm.defaultProps = {
  tabs: [],
  tab: '',
  onNavTab: (() => {}),
};
