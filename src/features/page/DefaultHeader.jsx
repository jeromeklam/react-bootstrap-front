import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Flag from 'react-world-flags';
import { Dropdown } from '../basic';
import { Highlight, HighlightButton } from '../tour';

const navStyles = {
  position: 'absolute',
  top: '0px',
  left: '0px',
  right: '0px',
  bottom: '0px',
  margin: '0px',
  padding: '0px',
};

export class DefaultHeader extends Component {
  static propTypes = {
    headerBackgroundSrc: PropTypes.element,
    title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    options: PropTypes.element.isRequired,
    onToggleSide: PropTypes.func,
    onToggleUser: PropTypes.func,
    authenticated: PropTypes.bool.isRequired,
    location: PropTypes.element.isRequired,
    onNavigate: PropTypes.func.isRequired,
    menuIcon: PropTypes.element,
    onLocale: PropTypes.func,
    locales: PropTypes.element,
    currentRealm: PropTypes.string,
    realms: PropTypes.element,
    onRealmSelect: PropTypes.func,
    currentLocale: PropTypes.string,
    accountClosed: PropTypes.element,
    accountOpened: PropTypes.element,
    menuUserOpen: PropTypes.bool.isRequired,
    desktopHeaderHeight: PropTypes.number.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    headerBackgroundSrc: null,
    onToggleSide: null,
    onToggleUser: null,
    menuIcon: null,
    onLocale: null,
    locales: false,
    currentRealm: '',
    realms: false,
    onRealmSelect: null,
    currentLocale: 'fr',
    accountClosed: null,
    accountOpened: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      myRef: React.createRef(),
      myRef2: React.createRef(),
      flagsOpen: false,
      realmsOpen: false,
    };
    this.onToggleFlag = this.onToggleFlag.bind(this);
    this.onToggleRealm = this.onToggleRealm.bind(this);
    this.onCloseFlag = this.onCloseFlag.bind(this);
    this.onCloseRealm = this.onCloseRealm.bind(this);
  }

  onToggleFlag() {
    this.setState({ flagsOpen: !this.state.flagsOpen });
  }

  onCloseFlag() {
    this.setState({ flagsOpen: false });
  }

  onToggleRealm() {
    this.setState({ realmsOpen: !this.state.realmsOpen });
  }

  onCloseRealm() {
    this.setState({ realmsOpen: false });
  }

  render() {
    let current = false;
    if (this.props.locales) {
      current = this.props.locales.find(elem => elem.locale === this.props.currentLocale);
    }
    return (
      <div className="default-header bg-light pl-2 overflow-none">
        {this.props.headerBackgroundSrc && (
          <img className="default-header-background" src={this.props.headerBackgroundSrc} alt="background header" />
        )}
        <nav
          style={navStyles}
          className={classnames(
            'default-header-menu navbar navbar-expand-lg navbar-light border-bottom row',
            !this.props.headerBackgroundSrc && 'bg-light'
          )}
        >
          <div className="col-xs-w16" style={{ height: `${this.props.desktopHeaderHeight}px` }}>
            {this.props.authenticated && this.props.onToggleSide && (
              <button className="btn btn-primary" onClick={this.props.onToggleSide} id="menu-toggle">
                <Highlight theme="NAV" title={this.props.t({ id: 'rbf.page.header.menuIcon', defaultMessage: '' })}>
                  {this.props.menuIcon}
                </Highlight>
              </button>
            )}
            &nbsp;&nbsp;
            <div className="navbar-brand p-0">{this.props.title || ''}</div>
          </div>
          <div className="col-xs-w20 text-right" style={{ height: `${this.props.desktopHeaderHeight}px` }}>
            <ul className="navbar-nav justify-content-end">
              {this.props.badges &&
                this.props.badges.map(oneBadge => (
                  <li key={'badge-' + oneBadge.name} className="nav-badge nav-item">
                    <button className="btn btn-light" onClick={oneBadge.onClick || null}>
                      {oneBadge.icon}
                      <span
                        className={classnames(
                          'badge',
                          oneBadge.text && `text-${oneBadge.text}`,
                          oneBadge.color && `badge-${oneBadge.color}`
                        )}
                      >
                        {oneBadge.count}
                      </span>
                    </button>
                  </li>
                ))}
              {this.props.badges && this.props.badges.length > 0 && <div className="pr-4" />}
              {this.props.onToggleUser && this.props.accountClosed && (
                <li className="nav-item">
                  <Highlight
                    theme="NAV"
                    title={this.props.t({ id: 'rbf.page.header.userMenu.help', defaultMessage: 'User menu' })}
                  >
                    <button className="btn btn-light text-secondary" onClick={this.props.onToggleUser}>
                      <span>{this.props.menuUserOpen ? this.props.accountOpened : this.props.accountClosed}</span>
                    </button>
                  </Highlight>
                </li>
              )}
              {this.props.locales && (
                <li className="nav-item">
                  <div className="btn-group">
                    <Highlight
                      theme="NAV"
                      title={this.props.t({
                        id: 'rbf.page.header.langMenu.help',
                        defaultMessage: 'Change current lang',
                      })}
                    >
                      <button
                        type="button"
                        className="btn btn-light text-secondary dropdown-toggle"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        onClick={this.onToggleFlag}
                        ref={this.state.myRef}
                      >
                        <Flag code={current.code} height={24} />
                      </button>
                    </Highlight>
                    {this.state.flagsOpen && (
                      <Dropdown myRef={this.state.myRef} onClose={this.onCloseFlag} className="bg-light text-secondary">
                        {Array.isArray(this.props.locales) &&
                          this.props.locales.map(lang => {
                            if (lang.locale !== this.props.currentLocale) {
                              return (
                                <button
                                  key={`header-button-${lang.code}`}
                                  className="btn"
                                  onClick={() => {
                                    this.onCloseFlag();
                                    this.props.onLocale(lang.locale);
                                  }}
                                >
                                  <Flag code={lang.code} height={24} />
                                </button>
                              );
                            }
                            return null;
                          })}
                      </Dropdown>
                    )}
                  </div>
                </li>
              )}
              {this.props.realms && Array.isArray(this.props.realms) && this.props.realms.length > 0 && (
                <li className="nav-item">
                  <div className="btn-group">
                    <Highlight
                      theme="NAV"
                      title={this.props.t({
                        id: 'rbf.page.header.groupMenu.help',
                        defaultMessage: 'Change current group',
                      })}
                    >
                      <button
                        type="button"
                        className="btn btn-light text-secondary dropdown-toggle"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                        onClick={this.onToggleRealm}
                        ref={this.state.myRef2}
                      >
                        {this.props.realms.map(realm => {
                          if (parseInt(realm.value, 10) === parseInt(this.props.currentRealm, 10)) {
                            return <span key={`header-realm-${realm.value}`}>{realm.label}</span>;
                          }
                          return null;
                        })}
                      </button>
                    </Highlight>
                    {this.state.realmsOpen && (
                      <Dropdown
                        myRef={this.state.myRef2}
                        onClose={this.onCloseRealm}
                        className="bg-light text-secondary"
                      >
                        {Array.isArray(this.props.realms) &&
                          this.props.realms.map(realm => (
                            <button
                              key={`header-selrealm-${realm.value}`}
                              className="btn btn-light w-100 text-nowrap"
                              onClick={() => {
                                this.onCloseRealm();
                                this.props.onRealmSelect(realm.value);
                              }}
                            >
                              <span>{realm.label}</span>
                            </button>
                          ))}
                      </Dropdown>
                    )}
                  </div>
                </li>
              )}
              {Array.isArray(this.props.options) &&
                this.props.options.map((option, i) => {
                  let key = i;
                  if (option && option.url) {
                    key = option.url.replace(/\//g, '-');
                  }
                  if (
                    option.role === '-HOME-' ||
                    (option.role === 'SIGNIN' && !this.props.authenticated) ||
                    (option.role === 'SIGNOUT' && !this.props.authenticated)
                  ) {
                    return (
                      <li className="nav-item" key={`nav-item-${key}`}>
                        <Highlight theme="NAV" title={option.help || ''}>
                          <a
                            href={option.url}
                            className={classnames('nav-link', this.props.location.pathname === option.url && 'active')}
                            onClick={e => {
                              if (e) {
                                e.preventDefault();
                                e.stopPropagation();
                              }
                              this.props.onNavigate(option.url);
                            }}
                          >
                            {option.label !== '' ? <span>{option.label}</span> : option.icon}
                          </a>
                        </Highlight>
                      </li>
                    );
                  }
                  return null;
                })}
              {Array.isArray(this.props.icons) &&
                this.props.icons.map((icon, i) => {
                  return (
                    <li className="nav-item" key={`nav-item-icon-${i}`}>
                      <div title={icon.label || ''}>{icon.icon}</div>
                    </li>
                  );
                })}
              <li className="nav-item">
                <HighlightButton theme="NAV">
                  <div title="Aide">
                    <button className="btn btn-light">?</button>
                  </div>
                </HighlightButton>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
  }
}
