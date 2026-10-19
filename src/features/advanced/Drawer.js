import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Portal from './Portal';
import { rbfIntl } from '../intl';
import { readStoredFlag, writeStoredFlag } from '../helpers/storedFlag';

/**
 * Tiroir latéral : un panneau fixe sur toute la hauteur sous l'en-tête de
 * l'application, par-dessus un fond assombri. Échap, la croix et un clic sur le
 * fond le ferment ; le focus passe au panneau à l'ouverture et revient à l'élément
 * d'origine à la fermeture.
 *
 * Extensible : un bouton de l'en-tête le fait passer de `width` à
 * `expandedWidth`, choix mémorisé sous `storageKey`. Pleine largeur sous 768 px
 * (Drawer.scss). Le fond du panneau est blanc, son ombre celle des fenêtres
 * (.modal-shadow) : classes existantes, le SCSS propre ne fait que placer.
 */
const STORAGE = 'rbf.drawer.';

export default class Drawer extends Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    side: PropTypes.oneOf(['right', 'left']),
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    expandedWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    expandable: PropTypes.bool,
    expanded: PropTypes.bool,
    defaultExpanded: PropTypes.bool,
    storageKey: PropTypes.string,
    onExpandToggle: PropTypes.func,
    top: PropTypes.number,
    backdrop: PropTypes.bool,
    closeOnBackdrop: PropTypes.bool,
    closeOnEscape: PropTypes.bool,
    title: PropTypes.node,
    closeIcon: PropTypes.element,
    expandIcon: PropTypes.element,
    collapseIcon: PropTypes.element,
    footer: PropTypes.node,
    children: PropTypes.node,
    className: PropTypes.string,
    t: PropTypes.func,
  };

  static defaultProps = {
    side: 'right',
    width: 560,
    expandedWidth: '85vw',
    expandable: true,
    expanded: null,
    defaultExpanded: false,
    storageKey: null,
    onExpandToggle: null,
    top: 0,
    backdrop: true,
    closeOnBackdrop: true,
    closeOnEscape: true,
    title: null,
    closeIcon: null,
    expandIcon: null,
    collapseIcon: null,
    footer: null,
    children: null,
    className: '',
    t: rbfIntl,
  };

  constructor(props) {
    super(props);
    this.state = {
      expanded: readStoredFlag(props.storageKey ? STORAGE + props.storageKey + '.expanded' : null, props.defaultExpanded),
      shown: false,
    };
    this.panelRef = React.createRef();
    this.previousFocus = null;
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onBackdrop = this.onBackdrop.bind(this);
    this.toggleExpanded = this.toggleExpanded.bind(this);
  }

  componentDidMount() {
    if (this.props.open) {
      this.opened();
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.open && this.props.open) {
      this.opened();
    }
    if (prevProps.open && !this.props.open) {
      this.closed();
    }
  }

  componentWillUnmount() {
    this.closed();
  }

  opened() {
    document.addEventListener('keydown', this.onKeyDown, true);
    this.previousFocus = document.activeElement;
    /* Le panneau se glisse depuis le bord : la classe arrive au rendu suivant. */
    this.frame = window.requestAnimationFrame
      ? window.requestAnimationFrame(() => this.setState({ shown: true }))
      : setTimeout(() => this.setState({ shown: true }), 0);
    setTimeout(() => {
      if (this.panelRef.current && this.props.open) {
        this.panelRef.current.focus();
      }
    }, 0);
  }

  closed() {
    document.removeEventListener('keydown', this.onKeyDown, true);
    if (this.frame && window.cancelAnimationFrame) {
      window.cancelAnimationFrame(this.frame);
    }
    this.frame = null;
    if (this.state.shown) {
      this.setState({ shown: false });
    }
    if (this.previousFocus && typeof this.previousFocus.focus === 'function') {
      this.previousFocus.focus();
    }
    this.previousFocus = null;
  }

  isExpanded() {
    return this.props.expanded !== null ? this.props.expanded : this.state.expanded;
  }

  toggleExpanded() {
    const expanded = !this.isExpanded();
    if (this.props.expanded === null) {
      writeStoredFlag(this.props.storageKey ? STORAGE + this.props.storageKey + '.expanded' : null, expanded);
      this.setState({ expanded });
    }
    if (this.props.onExpandToggle) {
      this.props.onExpandToggle(expanded);
    }
  }

  onKeyDown(event) {
    if (event.key === 'Escape' && this.props.closeOnEscape) {
      event.preventDefault();
      event.stopPropagation();
      this.props.onClose();
    }
  }

  onBackdrop(event) {
    if (event.target === event.currentTarget && this.props.closeOnBackdrop) {
      this.props.onClose();
    }
  }

  render() {
    const { open, side, width, expandedWidth, expandable, top, backdrop, title, closeIcon, expandIcon, collapseIcon, footer, children, className, t } = this.props;
    if (!open) {
      return null;
    }
    const expanded = this.isExpanded();
    const size = expanded ? expandedWidth : width;
    const panelStyle = {
      top: `${top}px`,
      width: typeof size === 'number' ? `${size}px` : size,
    };
    const expandTitle = expanded
      ? t({ id: 'rbf.drawer.collapse', defaultMessage: 'Réduire' })
      : t({ id: 'rbf.drawer.expand', defaultMessage: 'Agrandir' });
    return (
      <Portal>
        <div
          className={classnames('rbf-drawer-backdrop', backdrop && 'rbf-drawer-backdrop-dim', this.state.shown && 'rbf-drawer-shown')}
          style={{ top: `${top}px` }}
          onClick={this.onBackdrop}
        >
          <aside
            ref={this.panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={typeof title === 'string' ? title : undefined}
            className={classnames('rbf-drawer bg-white modal-shadow d-flex flex-column', `rbf-drawer-${side}`, expanded && 'rbf-drawer-expanded', className)}
            style={panelStyle}
          >
            <div className="rbf-drawer-header d-flex align-items-center border-bottom border-secondary-light px-3 py-2">
              <div className="flex-grow-1 h5 text-secondary mb-0">{title}</div>
              {expandable && (
                <button type="button" className="btn btn-light text-secondary ml-2 rbf-drawer-expand" title={expandTitle} aria-label={expandTitle} aria-pressed={expanded} onClick={this.toggleExpanded}>
                  {(expanded ? collapseIcon : expandIcon) || (expanded ? '⇤' : '⇥')}
                </button>
              )}
              <button type="button" className="btn btn-light text-secondary ml-2 rbf-drawer-close" title={t({ id: 'rbf.drawer.close', defaultMessage: 'Fermer' })} aria-label={t({ id: 'rbf.drawer.close', defaultMessage: 'Fermer' })} onClick={this.props.onClose}>
                {closeIcon || '×'}
              </button>
            </div>
            <div className="rbf-drawer-body flex-grow-1 custom-scrollbar p-3">{children}</div>
            {footer && <div className="rbf-drawer-footer border-top border-secondary-light px-3 py-2">{footer}</div>}
          </aside>
        </div>
      </Portal>
    );
  }
}
