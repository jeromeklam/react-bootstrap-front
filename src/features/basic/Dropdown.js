import React, { Component } from 'react';
import classnames from 'classnames';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Portal } from '../advanced';
import { computePlacement, DROPDOWN_MARGIN } from './computePlacement';

const getCoords = props => {
  if (props.myRef && props.myRef.current) {
    try {
      return props.myRef.current.getBoundingClientRect();
    } catch (ex) {
      return null;
    }
  }
  return null;
};

const getViewport = () => ({
  width: typeof window !== 'undefined' ? window.innerWidth : 0,
  height: typeof window !== 'undefined' ? window.innerHeight : 0,
});

export default class Dropdown extends Component {
  static propTypes = {
    align: PropTypes.string,
    children: PropTypes.element.isRequired,
    className: PropTypes.string,
    maxHeight: PropTypes.string,
    myRef: PropTypes.object.isRequired,
    onClose: PropTypes.func,
  };

  static defaultProps = {
    align: 'bottom-left',
    className: '',
    maxHeight: 'auto',
    onClose: null,
  };

  constructor(props) {
    super(props);
    this.nodeRef = React.createRef();
    /* Première position calculée sur la seule ancre : la taille du menu n'est
       pas encore connue. Elle est affinée dès le montage, ce qui évite
       d'afficher le menu au mauvais endroit le temps d'une image. */
    this.state = {
      placement: this.getPlacement(null),
    };
    this.handleClickOutside = this.handleClickOutside.bind(this);
    this.reposition = this.reposition.bind(this);
  }

  componentDidMount() {
    document.addEventListener('click', this.handleClickOutside, true);
    /* En capture : le menu doit suivre un défilement de n'importe quel
       conteneur, pas seulement de la page. */
    document.addEventListener('scroll', this.reposition, true);
    window.addEventListener('resize', this.reposition);
    this.reposition();
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.handleClickOutside, true);
    document.removeEventListener('scroll', this.reposition, true);
    window.removeEventListener('resize', this.reposition);
  }

  /**
   * Taille réelle du menu, une fois rendu. Nulle au premier calcul.
   */
  getMenuSize() {
    const node = this.nodeRef.current;
    if (!node) {
      return null;
    }
    return { width: node.offsetWidth, height: node.offsetHeight };
  }

  getPlacement(menuSize) {
    const anchor = getCoords(this.props);
    if (!anchor) {
      return null;
    }
    return computePlacement(anchor, menuSize, this.props.align, getViewport());
  }

  reposition() {
    const placement = this.getPlacement(this.getMenuSize());
    if (!placement) {
      return;
    }
    const current = this.state.placement;
    if (
      current &&
      current.top === placement.top &&
      current.left === placement.left &&
      current.right === placement.right &&
      current.maxHeight === placement.maxHeight
    ) {
      return;
    }
    this.setState({ placement: placement });
  }

  handleClickOutside(event) {
    const domNode = ReactDOM.findDOMNode(this);
    if (!domNode || !domNode.contains(event.target)) {
      if (this.props.myRef && this.props.myRef.current && this.props.myRef.current.contains(event.target)) {
        event.preventDefault();
        event.stopPropagation();
      }
      this.props.onClose && this.props.onClose();
    }
  }

  /**
   * Hauteur retenue : la plus contraignante entre celle demandée et la place
   * réellement disponible dans la fenêtre.
   */
  getMaxHeight() {
    const { placement } = this.state;
    const available = placement ? Math.max(0, placement.maxHeight) : null;
    const asked = this.props.maxHeight;
    if (asked && asked !== 'auto') {
      const value = parseFloat(asked);
      if (!isNaN(value) && available !== null && available < value) {
        return available + 'px';
      }
      return asked;
    }
    return available !== null ? available + 'px' : 'auto';
  }

  render() {
    const { placement } = this.state;
    const maxHeight = this.getMaxHeight();
    /* `fixed` et non `absolute` : les coordonnées de l'ancre viennent de
       getBoundingClientRect, donc relatives à la fenêtre. En `absolute` dans
       un portail accroché au body, le menu dérivait de toute la hauteur
       défilée — c'était le défaut visible. */
    const divStyle = {
      position: 'fixed',
      maxHeight: maxHeight,
      overflow: 'hidden',
    };
    if (placement) {
      divStyle.top = placement.top;
      if (placement.left !== undefined) {
        divStyle.left = placement.left;
      }
      if (placement.right !== undefined) {
        divStyle.right = placement.right;
      }
    }
    return (
      <Portal>
        <div ref={this.nodeRef} className={classnames('rbf-dropdown', this.props.className)} style={divStyle}>
          <div
            className="custom-scrollbar"
            style={{ maxHeight: maxHeight, overflowX: 'hidden', overflowY: 'auto' }}
          >
            {this.props.children}
          </div>
        </div>
      </Portal>
    );
  }
}

export { DROPDOWN_MARGIN };
