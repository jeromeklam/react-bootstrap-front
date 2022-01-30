import React from 'react';
import PropTypes from 'prop-types';
import { DefaultHeader, DefaultLine, DefaultLineAction, DefaultLineBreak } from './';
import { rbfIntl } from '../intl';

export const DefaultList = props => {
  let counter  = 1;
  let previous = null;
  return (
    <div className="ui-inline-list-default-list">
      <div className="inline-list">
        {props.title && <DefaultHeader {...props} />}
        {props.lines && (
          <div className="ui-inline-list-default-list-content">
            {Array.isArray(props.items) &&
              props.items.map(item => {
                let myBreak = false;
                if (props.breakpoint) {
                  myBreak = props.breakpoint(previous, item);
                }
                previous = item;
                if (myBreak !== false) {
                  return (
                    <div key={item.id}>
                      <DefaultLineBreak label={myBreak} counter={props.oddEven ? counter++ : 0}/>
                      <DefaultLine
                        {...props}
                        id={item.id}
                        item={item}
                        counter={props.oddEven ? counter++ : 0}
                      />
                    </div>
                  );
                } else {
                  return (
                    <DefaultLine
                      {...props}
                      key={item.id}
                      id={item.id}
                      item={item}
                      counter={props.oddEven ? counter++ : 0}
                    />
                  )
                }
              })
            }
          </div>
        )}
        {props.lines &&
          !props.loading &&
          Array.isArray(props.items) &&
          props.onMore &&
          props.total > props.items.length &&
          props.items.length > 0 && (
            <DefaultLineAction
              className="btn text-secondary btn-secondary-light font-weight-bold w-100"
              label={props.t({ id: 'rbf.inline-list.list.more', defaultMessage: 'Plus de résultats' })}
              onClick={ev => {
                if (ev) {
                  ev.stopPropagation();
                }
                props.onMore();
              }}
            />
          )
        }
      </div>
    </div>
  );
};

DefaultList.propTypes = {
  breakpoint: PropTypes.func,
  title: PropTypes.bool,
  lines: PropTypes.bool,
  oddEven: PropTypes.bool,
  onMore: PropTypes.func,
  t: PropTypes.func,
};
DefaultList.defaultProps = {
  breakpoint: false,
  title: true,
  lines: true,
  oddEven: true,
  onMore: null,
  t: rbfIntl,
};
