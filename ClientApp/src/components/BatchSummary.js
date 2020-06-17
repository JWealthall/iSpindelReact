import React from 'react'
import { Link } from 'react-router-dom';

const BatchSummary = props => {
    const { batchSummary } = props
    const id = batchSummary.batchId
    const fmtDat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'medium' })
    const fmtGrv = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 3, minimumFractionDigits: 3})
    const fmtTmp = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 1, minimumFractionDigits: 1})
    const fmtAbv = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 2, minimumFractionDigits: 2})
    const fmtDur = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 3, minimumFractionDigits: 3})

    let chartButton = batchSummary.startGravity !== null
        ?
        <Link className="btn btn-primary mx-1" to={'/batch/chart/' + id}>Chart</Link >
        : null

    let durationDetails = batchSummary.startGravity !== null
        ?
        <dl className="row">
            <dt className="col-4">Duration</dt>
            <dd className="col-8">{fmtDur.format(batchSummary.duration)}</dd>
        </dl>
        : null

    let logDetails = batchSummary.startGravity !== null
        ?
        <dl className="row">
            <dt className="col-4 card-body-header"></dt>
            <dt className="col-4 card-body-header text-right">Gravity</dt>
            <dt className="col-4 card-body-header text-right">Temp</dt>
            <dt className="col-4">Latest</dt>
            <dd className="col-4 text-right">{fmtGrv.format(batchSummary.endGravity)}</dd>
            <dd className="col-4 text-right">{fmtTmp.format(batchSummary.endTemperature)}&deg;{batchSummary.tempUnits}</dd>
            <dt className="col-4">First</dt>
            <dd className="col-4 text-right">{fmtGrv.format(batchSummary.startGravity)}</dd>
            <dd className="col-4 text-right">{fmtTmp.format(batchSummary.startTemperature)}&deg;{batchSummary.tempUnits}</dd>
            <dt className="col-4">Abv &amp; Avg</dt>
            <dd className="col-4 text-right">{fmtAbv.format(batchSummary.abv)}%</dd>
            <dd className="col-4 text-right">{fmtTmp.format(batchSummary.avgTemperature)}&deg;{batchSummary.tempUnits}</dd>
            <dt className="col-4">Low</dt>
            <dd className="col-4 text-right">{fmtGrv.format(batchSummary.minGravity)}</dd>
            <dd className="col-4 text-right">{fmtTmp.format(batchSummary.minTemperature)}&deg;{batchSummary.tempUnits}</dd>
            <dt className="col-4">High</dt>
            <dd className="col-4 text-right">{fmtGrv.format(batchSummary.maxGravity)}</dd>
            <dd className="col-4 text-right">{fmtTmp.format(batchSummary.maxTemperature)}&deg;{batchSummary.tempUnits}</dd>
            <dt className="col-4">Abv H/L</dt>
            <dd className="col-4 text-right">{fmtAbv.format(batchSummary.abvMaxMin)}%</dd>
            <dd className="col-4"></dd>
        </dl>
        : null

    const endDate = (batchSummary?.endDate) ? fmtDat.format(new Date(batchSummary.endDate)) : "";

    return (
        <div className="col-12 col-md-6 col-lg-6 col-xl-4 mb-1 d-flex">
            <div className="card flex-fill">
                <div className="card-header">
                    <h5>{batchSummary.description}</h5>
                </div>
                <div className="card-body">
                    <dl className="row">
                        <dt className="col-4">Start Date</dt>
                        <dd className="col-8">{fmtDat.format(new Date(batchSummary.startDate))}</dd>
                        <dt className="col-4">End Date</dt>
                        <dd className="col-8">{endDate}</dd>
                    </dl>
                    {durationDetails}
                    {logDetails}
                </div>
                <div className="card-footer text-right">
                    <Link className="btn btn-primary mx-1" to={'/batch/edit/' + id}>Edit</Link >
                    {chartButton}
                    <Link className="btn btn-primary mx-1" to={'/batch/' + id}>Details</Link >
                </div >
            </div >
        </div >
    )
}

export default BatchSummary