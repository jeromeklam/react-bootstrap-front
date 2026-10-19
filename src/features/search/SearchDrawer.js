import React from 'react';
import PropTypes from 'prop-types';
import { Drawer } from '../advanced';
import { rbfIntl } from '../intl';
import { tr } from './i18n';
import SearchCriteriaPanel from './SearchCriteriaPanel';

/**
 * Le panneau « Critères avancés » dans un tiroir superposé (Drawer, extensible).
 * Le tiroir démonte son contenu quand il est fermé : les lignes sont donc relues
 * du filtre à chaque ouverture.
 */
export const SearchDrawer = props => {
  const { open, onClose, title, width, expandedWidth, storageKey, top, icons, t, ...panel } = props;
  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={title || tr(t, 'rbf.search.drawer.title', 'Critères avancés')}
      width={width}
      expandedWidth={expandedWidth}
      storageKey={storageKey}
      top={top}
      closeIcon={icons.close}
      expandIcon={icons.expand}
      collapseIcon={icons.collapse}
      className="rbf-search-drawer"
      t={t}
    >
      <SearchCriteriaPanel {...panel} icons={icons} t={t} />
    </Drawer>
  );
};

SearchDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  filter: PropTypes.object.isRequired,
  catalog: PropTypes.array.isRequired,
  onApply: PropTypes.func.isRequired,
  onClearAll: PropTypes.func,
  title: PropTypes.string,
  subject: PropTypes.string,
  sentenceSubject: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  expandedWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  storageKey: PropTypes.string,
  top: PropTypes.number,
  showSummary: PropTypes.bool,
  modeToggle: PropTypes.bool,
  maxRows: PropTypes.number,
  icons: PropTypes.object,
  size: PropTypes.string,
  t: PropTypes.func,
};

SearchDrawer.defaultProps = {
  onClearAll: null,
  title: null,
  subject: null,
  sentenceSubject: null,
  width: 560,
  expandedWidth: '85vw',
  storageKey: null,
  top: 0,
  showSummary: true,
  modeToggle: true,
  maxRows: null,
  icons: {},
  size: 'sm',
  t: rbfIntl,
};

export default SearchDrawer;
