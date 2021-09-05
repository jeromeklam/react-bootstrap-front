import React from 'react';
import { MobileHeader } from './';
import { Badge } from '../basic';

export default function MobilePrivateHeader(props) {
  return (
    <MobileHeader>
      <div className="row mobile-private-header">
        <div className="col-xxs-w6">
          <span className="header-title header-title-private pl-2">{props.mobileTitle}</span>
        </div>
        <div className="col-xxs-w30 text-right">
          <ul className="navbar-nav justify-content-end">
            {props.badges &&
              props.badges.map(oneBadge => {
                if (oneBadge.mobile) {
                  return (
                    <li key={'badge-' + oneBadge.name} className="nav-badge nav-item">
                      {oneBadge.component ? oneBadge.component : <Badge {...oneBadge} />}
                    </li>
                  );
                }
                return null;
              })}
            {props.onToggleUser && props.accountClosed && (
              <li className="nav-item">
                <button className="btn btn-secondary" onClick={props.onToggleUser}>
                  <span>{props.menuUserOpen ? props.accountOpened : props.accountClosed}</span>
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </MobileHeader>
  );
}
