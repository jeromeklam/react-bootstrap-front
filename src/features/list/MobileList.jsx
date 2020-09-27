import React from 'react';
import PropTypes from 'prop-types';
import { MobileLine, MobileHeader, MobileFooter, LoadEmpty } from './';

const datastyle = {
  top: '40px',
  height: 'calc(100% - 40px)',
  position: 'absolute',
  overflowY: 'auto',
  overflowX: 'hidden',
  left: '0px',
  right: '0px',
};

export const MobileList = props => (
  <div style={datastyle}>
    <MobileHeader {...props} />
    {props.items.length > 0 ? (
      <div>
        {props.items.map((item) => {
          const title = item[props.mainCol];
          return (
            <MobileLine {...props} key={item.id} id={item.id} item={item} title={title} />
          );
        })}
      </div>
    ) : (
      <div>{!props.loadMorePending && <LoadEmpty />}</div>
    )}
    <MobileFooter {...props} />
  </div>
);

MobileList.propTypes = {
  mainCol: PropTypes.string,
  items: PropTypes.element.isRequired,
  loadMorePending: PropTypes.bool.isRequired,
  onSetFiltersAndSort: PropTypes.func.isRequired,
};

MobileList.defaultProps = {
  mainCol: '',
};
