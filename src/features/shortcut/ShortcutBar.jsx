import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Shortcut } from './';

export default function ShortcutBar(props) {
  return (
    <div role="group" className={classnames('shortcut-bar', 'btn-group', props.className)}>
      {props.shortcuts &&
        Array.isArray(props.shortcuts) &&
        props.shortcuts.map(shortcut => {
          if (shortcut.hide) {
            return null;
          }
          return (
            <div className="input-check-list" key={`checklist-${shortcut.name}`}>
              <Shortcut
                hide={shortcut.display === 'none' ? true : false}
                size={shortcut.size}
                icon={shortcut.icon}
                onClick={() => {
                  props.onToggle(shortcut.name);
                }}
              />
            </div>
          );
        })}
    </div>
  );
}

ShortcutBar.propTypes = {
  onToggle: PropTypes.func.isRequired,
  shortcuts: PropTypes.array,
};
ShortcutBar.defaultTypes = {
  shortcuts: [],
};
