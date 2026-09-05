import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * Insertion d'une image.
 *
 * Deux voies :
 *  - une adresse, toujours disponible et de loin la plus sûre pour un
 *    courriel : les images doivent être hébergées, pas embarquées ;
 *  - un fichier, seulement si l'application fournit `onUpload`. Sans endpoint
 *    d'upload, l'onglet propose un repli en data-URL plafonné, avec
 *    l'avertissement qui va avec.
 */
export default class ImageDialog extends Component {
  static propTypes = {
    onApply: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    /** (File) => Promise<url>. Absente, l'onglet fichier passe en data-URL. */
    onUpload: PropTypes.func,
    /** Autorise le repli data-URL quand onUpload est absente. */
    allowDataUrl: PropTypes.bool,
    maxImageSize: PropTypes.number,
    t: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onUpload: null,
    allowDataUrl: true,
    maxImageSize: 524288,
  };

  constructor(props) {
    super(props);
    this.state = {
      tab: 'url',
      src: '',
      alt: '',
      width: '',
      pending: false,
      error: null,
    };
    this.srcRef = React.createRef();
    this.onApply = this.onApply.bind(this);
    this.onFile = this.onFile.bind(this);
  }

  componentDidMount() {
    if (this.srcRef.current) {
      this.srcRef.current.focus();
    }
  }

  onApply() {
    const src = this.state.src.trim();
    if (src === '') {
      this.setState({ error: this.props.t({ id: 'ui.editor.image.url', defaultMessage: 'Enter an address' }) });
      return;
    }
    this.props.onApply({ src, alt: this.state.alt, width: this.state.width || null });
  }

  onFile(ev) {
    const file = ev.target.files && ev.target.files[0];
    if (!file) {
      return;
    }
    const { t, onUpload, maxImageSize, allowDataUrl } = this.props;
    this.setState({ pending: true, error: null });

    if (onUpload) {
      onUpload(file).then(
        url => this.setState({ pending: false, src: url, tab: 'url' }),
        () => this.setState({ pending: false, error: t({ id: 'ui.editor.image.uploadError', defaultMessage: 'Upload failed' }) }),
      );
      return;
    }

    if (!allowDataUrl) {
      this.setState({ pending: false, error: t({ id: 'ui.editor.image.uploadError', defaultMessage: 'Upload failed' }) });
      return;
    }
    if (file.size > maxImageSize) {
      this.setState({
        pending: false,
        error: t({
          id: 'ui.editor.image.tooLarge',
          defaultMessage: 'Image too large to be embedded, host it and paste its address',
        }),
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => this.setState({ pending: false, src: reader.result, tab: 'url' });
    reader.onerror = () =>
      this.setState({ pending: false, error: t({ id: 'ui.editor.image.uploadError', defaultMessage: 'Upload failed' }) });
    reader.readAsDataURL(file);
  }

  renderTabs() {
    const { t } = this.props;
    return (
      <ul className="nav nav-tabs nav-tabs-sm mb-2">
        <li className="nav-item">
          <button
            type="button"
            className={classnames('nav-link btn btn-link', this.state.tab === 'url' && 'active')}
            onClick={() => this.setState({ tab: 'url' })}
          >
            {t({ id: 'ui.editor.image.url', defaultMessage: 'Address' })}
          </button>
        </li>
        <li className="nav-item">
          <button
            type="button"
            className={classnames('nav-link btn btn-link', this.state.tab === 'file' && 'active')}
            onClick={() => this.setState({ tab: 'file' })}
          >
            {t({ id: 'ui.editor.image.upload', defaultMessage: 'File' })}
          </button>
        </li>
      </ul>
    );
  }

  render() {
    const { t, onUpload, allowDataUrl } = this.props;
    const showFileTab = !!onUpload || allowDataUrl;
    return (
      <div className="rbf-editor-dialog">
        {showFileTab && this.renderTabs()}
        {this.state.tab === 'file' ? (
          <div>
            <input type="file" accept="image/*" className="form-control-file" onChange={this.onFile} />
            {!onUpload && (
              <small className="form-text text-muted">
                {t({
                  id: 'ui.editor.image.dataUrlWarning',
                  defaultMessage: 'The image will be embedded in the content and may be blocked by mail clients.',
                })}
              </small>
            )}
            {this.state.pending && (
              <small className="form-text text-muted">
                {t({ id: 'ui.editor.image.uploading', defaultMessage: 'Sending…' })}
              </small>
            )}
          </div>
        ) : (
          <div className="form-row align-items-end">
            <div className="col">
              <label className="rbf-editor-dialog-label">{t({ id: 'ui.editor.image.url', defaultMessage: 'Address' })}</label>
              <input
                ref={this.srcRef}
                type="text"
                className="form-control form-control-sm"
                value={this.state.src}
                placeholder="https://"
                onChange={ev => this.setState({ src: ev.target.value, error: null })}
              />
            </div>
            <div className="col">
              <label className="rbf-editor-dialog-label">{t({ id: 'ui.editor.image.alt', defaultMessage: 'Alt text' })}</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={this.state.alt}
                onChange={ev => this.setState({ alt: ev.target.value })}
              />
            </div>
            <div className="col-auto" style={{ maxWidth: '8rem' }}>
              <label className="rbf-editor-dialog-label">{t({ id: 'ui.editor.image.width', defaultMessage: 'Width' })}</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={this.state.width}
                placeholder="600"
                onChange={ev => this.setState({ width: ev.target.value })}
              />
            </div>
            <div className="col-auto">
              <button type="button" className="btn btn-sm btn-primary" onClick={this.onApply}>
                {t({ id: 'ui.editor.image.apply', defaultMessage: 'Insert' })}
              </button>
              <button type="button" className="btn btn-sm btn-link" onClick={this.props.onCancel}>
                {t({ id: 'ui.editor.dialog.cancel', defaultMessage: 'Cancel' })}
              </button>
            </div>
          </div>
        )}
        {this.state.error && <div className="text-danger small mt-1">{this.state.error}</div>}
      </div>
    );
  }
}
