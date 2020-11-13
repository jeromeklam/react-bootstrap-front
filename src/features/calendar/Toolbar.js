import PropTypes from 'prop-types'
import React from 'react'
import clsx from 'clsx'
import { navigate } from './utils/constants'

import { SvgPrevious, SvgNext } from '../advanced';

class Toolbar extends React.Component {
  render() {
    let {
      localizer: { messages },
      label,
    } = this.props

    return (
      <div className="rbc-toolbar">
        <span className="rbc-btn-group">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={this.navigate.bind(null, navigate.TODAY)}
          >
            {messages.today}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={this.navigate.bind(null, navigate.PREVIOUS)}
          >
            <div className="d-xs-none d-sm-block">{messages.previous}</div>
            <div className="d-sm-none"><SvgPrevious /></div>
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={this.navigate.bind(null, navigate.NEXT)}
          >
            <div className="d-xs-none d-sm-block">{messages.next}</div>
            <div className="d-sm-none"><SvgNext /></div>
          </button>
        </span>

        <span className="rbc-toolbar-label">{label}</span>

        <span className="rbc-btn-group">{this.viewNamesGroup(messages)}</span>
      </div>
    )
  }

  navigate = action => {
    this.props.onNavigate(action)
  }

  view = view => {
    this.props.onView(view)
  }

  viewNamesGroup(messages) {
    let viewNames = this.props.views
    const view = this.props.view

    if (viewNames.length > 1) {
      return viewNames.map(name => (
        <button
          type="button"
          key={name}
          className={clsx('btn btn-secondary', { 'rbc-active': view === name })}
          onClick={this.view.bind(null, name)}
        >
          {messages[name]}
        </button>
      ))
    }
  }
}

Toolbar.propTypes = {
  view: PropTypes.string.isRequired,
  views: PropTypes.arrayOf(PropTypes.string).isRequired,
  label: PropTypes.node.isRequired,
  localizer: PropTypes.object,
  onNavigate: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
}

export default Toolbar
