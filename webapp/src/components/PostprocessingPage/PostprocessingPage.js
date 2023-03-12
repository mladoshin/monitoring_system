import React from 'react'
import ResultGeneratorWidget from '../ResultGeneratorWidget/ResultGeneratorWidget'
import {
    generateResult,
} from '../../api'

function PostprocessingPage() {
  return (
    <div>
      <ResultGeneratorWidget generateResult={generateResult}/>
    </div>
  )
}

export default PostprocessingPage
