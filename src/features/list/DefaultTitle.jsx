import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { DefaultTitleCol } from './';

import { rbfIntl } from '../intl';

export const DefaultTitle = props => (
  <div style={props.style} className={classnames('default-list-title row text-secondary bg-secondary-light default-list-title-col', props.className)}>
    {props.cols.map((oneCol, i) => {
      return <DefaultTitleCol key={'oneCol-' + i} {...props} col={oneCol} idx={i} />;
    })}
  </div>
);

DefaultTitle.propTypes = {
  cols: PropTypes.element.isRequired,
  sort: PropTypes.element.isRequired,
  onSort: PropTypes.func.isRequired,
  sortDownIcon: PropTypes.element.isRequired,
  sortUpIcon: PropTypes.element.isRequired,
  sortNoneIcon: PropTypes.element.isRequired,
  t: PropTypes.func,
  align: PropTypes.string,
};

DefaultTitle.defaultProps = {
  t: rbfIntl,
  align: '',
};
