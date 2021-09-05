import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import Flag from 'react-world-flags';
import { Dropdown, DropdownMenu, DropdownMenuOption, Badge } from '../basic';
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
    headerBackgroundTheme: PropTypes.string,
    headerTextTheme: PropTypes.string,
    headerBorderBottomSrc: PropTypes.element,
    title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    options: PropTypes.element.isRequired,
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
    headerBorderBottomSrc: null,
    headerBackgroundTheme: 'secondary',
    headerTextTheme: 'light',
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
      <div
        className={classnames(
          'default-header bg-secondary pl-2 overflow-none h-100',
          'bg-' + this.props.headerBackgroundTheme
        )}
      >
        <div>
          {this.props.headerBackgroundSrc && (
            <img className="default-header-background" src={this.props.headerBackgroundSrc} alt="background header" />
          )}
          <nav
            style={navStyles}
            className={classnames('default-header-menu navbar navbar-expand-lg navbar-secondary border-bottom row')}
          >
            <div className="col-xxs-w16" style={{ height: `${this.props.desktopHeaderHeight}px` }}>
              &nbsp;&nbsp;
              <div className={classnames('navbar-brand p-0', 'text-' + this.props.headerTextTheme)}>
                {this.props.title || ''}
              </div>
            </div>
            <div className="col-xxs-w20 text-right pr-0" style={{ height: `${this.props.desktopHeaderHeight}px` }}>
              <ul className="navbar-nav justify-content-end">
                {this.props.badges &&
                  this.props.badges.map(oneBadge => (
                    <li key={'badge-' + oneBadge.name} className="nav-badge nav-item">
                      {oneBadge.component ? oneBadge.component : <Badge {...oneBadge} />}
                    </li>
                  ))}
                {this.props.badges && this.props.badges.length > 0 && <div className="pr-4" />}
                {this.props.locales && (
                  <li className="nav-item">
                    <Highlight
                      theme="NAV"
                      title={this.props.t({
                        id: 'rbf.page.header.langMenu.help',
                        defaultMessage: 'Change current lang',
                      })}
                    >
                      <button
                        type="button"
                        className={classnames('dropdown-toggle btn text-light btn-' + this.props.headerBackgroundTheme)}
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
                      <Dropdown
                        myRef={this.state.myRef}
                        onClose={this.onCloseFlag}
                        className={classnames('text-light bg-' + this.props.headerBackgroundTheme)}
                      >
                        <DropdownMenu>
                          {Array.isArray(this.props.locales) &&
                            this.props.locales.map(lang => {
                              if (lang.locale !== this.props.currentLocale) {
                                return (
                                  <DropdownMenuOption
                                    key={`header-button-${lang.code}`}
                                    onClick={() => {
                                      this.onCloseFlag();
                                      this.props.onLocale(lang.locale);
                                    }}
                                  >
                                    <Flag code={lang.code} height={24} />
                                  </DropdownMenuOption>
                                );
                              }
                              return null;
                            })}
                        </DropdownMenu>
                      </Dropdown>
                    )}
                  </li>
                )}
                {this.props.realms && Array.isArray(this.props.realms) && this.props.realms.length > 0 && (
                  <li className="nav-item">
                    <Highlight
                      theme="NAV"
                      title={this.props.t({
                        id: 'rbf.page.header.groupMenu.help',
                        defaultMessage: 'Change current group',
                      })}
                    >
                      <button
                        type="button"
                        className={classnames('btn text-light dropdown-toggle bg-' + this.props.headerBackgroundTheme)}
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
                        <DropdownMenu>
                          {Array.isArray(this.props.realms) &&
                            this.props.realms.map(realm => (
                              <DropdownMenuOption
                                key={`header-selrealm-${realm.value}`}
                                className="text-nowrap"
                                onClick={() => {
                                  this.onCloseRealm();
                                  this.props.onRealmSelect(realm.value);
                                }}
                              >
                                <span>{realm.label}</span>
                              </DropdownMenuOption>
                            ))}
                        </DropdownMenu>
                      </Dropdown>
                    )}
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
                              className={classnames(
                                'nav-link',
                                this.props.location.pathname === option.url && 'active'
                              )}
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
                {this.props.onToggleUser && this.props.accountClosed && (
                  <li className="nav-item">
                    <Highlight
                      theme="NAV"
                      title={this.props.t({ id: 'rbf.page.header.userMenu.help', defaultMessage: 'User menu' })}
                    >
                      <button className="btn text-white" onClick={this.props.onToggleUser}>
                        <span>{this.props.menuUserOpen ? this.props.accountOpened : this.props.accountClosed}</span>
                      </button>
                    </Highlight>
                  </li>
                )}
                {false && (
                  <li className="nav-item">
                    <HighlightButton theme="NAV">
                      <div title="Aide">
                        <button className="btn btn-secondary">?</button>
                      </div>
                    </HighlightButton>
                  </li>
                )}
              </ul>
            </div>
          </nav>
        </div>
        <div className="default-header-border-bottom">
          {this.props.headerBorderBottomSrc && (
            <img className="default-header-border-bottom-img" src={this.props.headerBorderBottomSrc} />
          )}
        </div>
      </div>
    );
  }
}
