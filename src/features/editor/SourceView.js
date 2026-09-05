import React from 'react';
import PropTypes from 'prop-types';

/**
 * Édition du HTML brut.
 *
 * Le champ remonte directement la saisie au formulaire : enregistrer depuis la
 * vue source doit fonctionner, sans exiger un retour préalable au mode riche.
 */
export default function SourceView(props) {
  const { value, onChange, warning, onRestore, onDismiss, style, t } = props;
  return (
    <div className="rbf-editor-source">
      {warning && (
        <div className="alert alert-warning alert-sm rbf-editor-source-warning" role="alert">
          <span>
            {warning === 'unbalanced'
              ? t({
                  id: 'ui.editor.source.unbalanced',
                  defaultMessage: 'The HTML was not balanced and has been corrected automatically.',
                })
              : t({
                  id: 'ui.editor.source.unsupported',
                  defaultMessage: 'Some tags are not supported by the editor and have been removed.',
                })}
          </span>
          <button type="button" className="btn btn-sm btn-link" onClick={onRestore}>
            {t({ id: 'ui.editor.source.back', defaultMessage: 'Back to the source' })}
          </button>
          <button type="button" className="btn btn-sm btn-link" onClick={onDismiss}>
            {t({ id: 'ui.editor.source.dismiss', defaultMessage: 'Keep the correction' })}
          </button>
        </div>
      )}
      <textarea
        className="form-control border-0 text-monospace rbf-editor-source-text"
        style={style}
        value={value}
        spellCheck="false"
        onChange={onChange}
      />
    </div>
  );
}

SourceView.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  warning: PropTypes.string,
  onRestore: PropTypes.func,
  onDismiss: PropTypes.func,
  style: PropTypes.object,
  t: PropTypes.func.isRequired,
};

SourceView.defaultProps = {
  warning: null,
  onRestore: () => {},
  onDismiss: () => {},
  style: null,
};
