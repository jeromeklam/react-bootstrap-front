import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Row, Col } from '../grid';

// import PropTypes from 'prop-types';

export default class MobileMenu extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    userForm: PropTypes.element.isRequired,
  };
  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      options: this.props.options,
    };
    this.onOpenMenu = this.onOpenMenu.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.menuGeneral !== this.props.menuGeneral && this.props.menuGeneral) {
      this.setState({ options: this.props.options });
    }
  }

  onOpenMenu(menu) {
    if (menu.role === 'MENU') {
      let options = [];
      menu.options.forEach(option => {
        let subMenu = option;
        subMenu.icon = option.icon ? option.icon : menu.icon;
        options.push(subMenu);
      });
      this.props.onChangeMenu();
      this.setState({ options: options });
    } else {
      this.props.onCloseMenu();
      this.props.onNavigate(menu.url);
    }
  }

  render() {
    return (
      <div className="page-mobile-menu">
        <Row className="no-gutters">
          {this.state.options.map(option => {
            let label = option.label;
            let color = 'text-secondary';
            if (option.color && option.color !== '') {
              color = 'text-' + option.color;
            }
            if (
              option.role === 'HOME' ||
              option.role === 'ABOUT' ||
              (option.role === 'MENU'  && (this.props.authenticated || (!this.props.authenticated && option.public))) ||
              (option.role === 'NAV' && (this.props.authenticated || (!this.props.authenticated && option.public)))
            ) {
              return (
                <Col
                  className="text-left"
                  size={{ xxs: 18, xs: 18, sm: 12 }}
                  key={`option-${label}-${option.position}`}
                >
                  <button
                    className="page-mobile-menu-option btn bg-white border border-rounded border-outline-secondary text-secondary"
                    onClick={() => this.onOpenMenu(option)}
                  >
                    <div className={color}>{option.icon}</div>
                    {option.role === 'MENU' && <div className="menu-menu">{this.props.menuMobile}</div>}
                    <br />
                    <span>{label}</span>
                  </button>
                </Col>
              );
            }
            return null;
          })}
        </Row>
      </div>
    );
  }
}
