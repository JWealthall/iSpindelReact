import React from 'react'
import BatchSummary from './BatchSummary'

const BatchSummaries = props => {
    const { batches } = props

    if (batches === null || batches === undefined)
        return <div><h4>No Batches</h4></div>

    const summaries = batches.map((summary, index) => {
        return (
            <BatchSummary key={summary.batchId} batchSummary={summary} />
        )
    })
    return summaries
}

export default BatchSummaries