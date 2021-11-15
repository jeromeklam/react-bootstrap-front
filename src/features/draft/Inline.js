import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

export default class Inline extends Component {
  static propTypes = {
    expanded: PropTypes.bool,
    onExpandEvent: PropTypes.func,
    onChange: PropTypes.func,
    currentState: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      myRef: React.createRef()
    }
  }
  render() {
    const { config, currentState, onChange, translations } = this.props;
    return (
      <div className={classnames('rdw-inline-wrapper btn-group', config.className)} aria-label="rdw-inline-control">
        {
          config.options
            .map((style, index) =>
              (<button
                key={index}
                onClick={() => onChange(style)}
                className={classnames("btn btn-light", config[style].className, (currentState[style] === true ||
                    (style === 'MONOSPACE' && currentState.CODE)) && "active")}
                title={config[style].title || translations[`components.controls.inline.${style}`]}
              >
                <img
                  alt=""
                  src={config[style].icon}
                />
              </button>),
            )
        }
      </div>
    );
  }
}
