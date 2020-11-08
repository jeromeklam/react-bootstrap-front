import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import InlineInput from './InlineInput';
import LaneMenu from './LaneMenu';

import { Row, Col } from '../grid';

const LaneHeader = ({
  updateTitle,
  canAddLanes,
  onDelete,
  onDoubleClick,
  editLaneTitle,
  label,
  title,
  titleStyle,
  labelStyle,
  t,
  laneDraggable,
}) => {
  return (
    <header
      className={classnames('trello-lane-header', editLaneTitle && 'trello-lane-header-editable')}
      onDoubleClick={onDoubleClick}
      editLaneTitle={editLaneTitle}
    >
      <Row>
        <Col size="30">
          <span className="trello-lane-header-title" draggable={laneDraggable} style={titleStyle}>
            {editLaneTitle ? (
              <InlineInput
                value={title}
                border
                placeholder={t('placeholder.title')}
                resize="vertical"
                onSave={updateTitle}
              />
            ) : (
              title
            )}
          </span>
          {label && (
            <span className="trello-lane-header-right">
              <span classstyle={labelStyle}>{label}</span>
            </span>
          )}
        </Col>
        <Col size="6" textAlign="right">
          {canAddLanes && <LaneMenu t={t} onDelete={onDelete} />}
        </Col>
      </Row>
    </header>
  );
};

LaneHeader.propTypes = {
  updateTitle: PropTypes.func,
  editLaneTitle: PropTypes.bool,
  canAddLanes: PropTypes.bool,
  laneDraggable: PropTypes.bool,
  label: PropTypes.string,
  title: PropTypes.string,
  onDelete: PropTypes.func,
  onDoubleClick: PropTypes.func,
  t: PropTypes.func.isRequired,
};

LaneHeader.defaultProps = {
  updateTitle: () => {},
  editLaneTitle: false,
  canAddLanes: false,
};

export default LaneHeader;
