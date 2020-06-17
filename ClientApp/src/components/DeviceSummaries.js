import React from 'react'
import DeviceSummary from './DeviceSummary'

const DeviceSummaries = props => {
    const { devices } = props

    if (devices === null || devices === undefined)
        return <div><h4>No Devices</h4></div>

    const summaries = devices.map((summary, index) => {
        return (
            <DeviceSummary key={summary.deviceId} deviceSummary={summary} />
        )
    })
    return summaries
}

export default DeviceSummaries