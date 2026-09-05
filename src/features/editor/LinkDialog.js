import React, { Component } from 'react';
import PropTypes from 'prop-types';

const SAFE_SCHEME = /^(https?:|mailto:|tel:|#|\/)/i;

/**
 * Saisie d'un lien.
 *
 * Panneau en ligne plutôt que modale : l'éditeur reste visible, et surtout on
 * n'ouvre pas une modale à l'intérieur d'une modale — la plupart des
 * formulaires appelants sont déjà dans un `ResponsiveModalOrForm`.
 *
 * La cible se choisit ici, lien par lien, et n'est jamais forcée globalement :
 * un `target="_blank"` posé par défaut réécrirait tous les liens de la base au
 * premier enregistrement.
 */
export default class LinkDialog extends Component {
  static propTypes = {
    url: PropTypes.string,
    text: PropTypes.string,
    target: PropTypes.string,
    canRemove: PropTypes.bool,
    /** Vrai si du texte est sélectionné : le libellé n'est alors pas demandé. */
    hasSelection: PropTypes.bool,
    onApply: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    url: '',
    text: '',
    target: '',
    canRemove: false,
    hasSelection: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      url: props.url,
      text: props.text,
      blank: props.target === '_blank',
      error: null,
    };
    this.urlRef = React.createRef();
    this.onApply = this.onApply.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    if (this.urlRef.current) {
      this.urlRef.current.focus();
    }
  }

  onKeyDown(ev) {
    if (ev.key === 'Enter') {
      ev.preventDefault();
      this.onApply();
    } else if (ev.key === 'Escape') {
      ev.preventDefault();
      this.props.onCancel();
    }
  }

  onApply() {
    const url = this.state.url.trim();
    if (url === '') {
      this.setState({ error: this.props.t({ id: 'ui.editor.link.invalidUrl', defaultMessage: 'Enter an address' }) });
      return;
    }
    if (!SAFE_SCHEME.test(url)) {
      /* Une adresse sans schéma est presque toujours un oubli de https://,
         et accepter n'importe quel schéma ouvrirait la porte à javascript:. */
      if (url.indexOf(':') !== -1) {
        this.setState({
          error: this.props.t({ id: 'ui.editor.link.invalidUrl', defaultMessage: 'Unsupported address' }),
        });
        return;
      }
      this.props.onApply({ url: 'https://' + url, text: this.state.text, target: this.state.blank ? '_blank' : null });
      return;
    }
    this.props.onApply({ url, text: this.state.text, target: this.state.blank ? '_blank' : null });
  }

  render() {
    const { t, canRemove, hasSelection } = this.props;
    return (
      <div className="rbf-editor-dialog" onKeyDown={this.onKeyDown}>
        <div className="form-row align-items-end">
          <div className="col">
            <label className="rbf-editor-dialog-label">{t({ id: 'ui.editor.link.url', defaultMessage: 'Address' })}</label>
            <input
              ref={this.urlRef}
              type="text"
              className="form-control form-control-sm"
              value={this.state.url}
              placeholder="https://"
              onChange={ev => this.setState({ url: ev.target.value, error: null })}
            />
          </div>
          {!hasSelection && (
            <div className="col">
              <label className="rbf-editor-dialog-label">{t({ id: 'ui.editor.link.label', defaultMessage: 'Label' })}</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={this.state.text}
                onChange={ev => this.setState({ text: ev.target.value })}
              />
            </div>
          )}
          <div className="col-auto">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="rbf-editor-link-blank"
                checked={this.state.blank}
                onChange={ev => this.setState({ blank: ev.target.checked })}
              />
              <label className="custom-control-label" htmlFor="rbf-editor-link-blank">
                {t({ id: 'ui.editor.link.target', defaultMessage: 'New window' })}
              </label>
            </div>
          </div>
          <div className="col-auto">
            <button type="button" className="btn btn-sm btn-primary" onClick={this.onApply}>
              {t({ id: 'ui.editor.link.apply', defaultMessage: 'Apply' })}
            </button>
            {canRemove && (
              <button type="button" className="btn btn-sm btn-outline-danger ml-1" onClick={this.props.onRemove}>
                {t({ id: 'ui.editor.link.remove', defaultMessage: 'Remove' })}
              </button>
            )}
            <button type="button" className="btn btn-sm btn-link" onClick={this.props.onCancel}>
              {t({ id: 'ui.editor.dialog.cancel', defaultMessage: 'Cancel' })}
            </button>
          </div>
        </div>
        {this.state.error && <div className="text-danger small mt-1">{this.state.error}</div>}
      </div>
    );
  }
}
