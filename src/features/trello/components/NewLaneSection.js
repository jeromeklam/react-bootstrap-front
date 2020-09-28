import React from 'react'
import {NewLaneSection} from 'rt/styles/Base'
import {AddLaneLink} from 'rt/styles/Elements'

export default ({t, onClick}) => (
  <NewLaneSection>
    <button className="btn btn-primary btn-large" t={t} onClick={onClick}>
      {t('Add another lane')}
    </button>
  </NewLaneSection>
)
