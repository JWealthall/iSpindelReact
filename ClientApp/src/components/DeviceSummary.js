import React from 'react'
import { Link } from 'react-router-dom';

const DeviceSummary = props => {
    const { deviceSummary } = props
    const id = deviceSummary.deviceId
    const fmtDat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'medium' })
    const fmtGrv = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 3, minimumFractionDigits: 3})
    const fmtTmp = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 1, minimumFractionDigits: 1})
    const fmtBat = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 2, minimumFractionDigits: 2})

    let buttons = deviceSummary.isDetail
        ? <div className="card-footer text-right">
            <Link className="btn btn-primary mx-1" to={'/device/edit/' + id}>Edit Device</Link >
            <Link className="btn btn-primary mx-1" to={'/batch/new/' + id}>New Batch</Link >
        </div >
        : <div className="card-footer text-right">
            <Link className="btn btn-primary mx-1" to={'/device/' + id}>Batches</Link>
        </div >;

    let logDetails = deviceSummary.date !== null
        ? <dl className="row">
            <dt className="col-4">Date</dt>
            <dd className="col-8">{fmtDat.format(new Date(deviceSummary.date))}</dd>
            <dt className="col-4">Gravity</dt>
            <dd className="col-8">{fmtGrv.format(deviceSummary.gravity)}</dd>
            <dt className="col-4">Temp</dt>
            <dd className="col-8">{fmtTmp.format(deviceSummary.temperature)}&deg;{deviceSummary.tempUnits}</dd>
            <dt className="col-4">Battery</dt>
            <dd className="col-8">{fmtBat.format(deviceSummary.battery)}</dd>
            <dt className="col-4">RSSI</dt>
            <dd className="col-8">{deviceSummary.rssi}</dd>
        </dl>
        : null;

    return (
        <div className="col-12 col-md-6 col-lg-6 col-xl-4 mb-1 d-flex">
            <div className="card flex-fill">
                <div className="card-header">
                    <h5>{deviceSummary.name}</h5>
                    <h6>{deviceSummary.description}</h6>
                </div>
                <div className="card-body">
                    <dl className="row">
                        <dt className="col-4">Name</dt>
                        <dd className="col-8">{deviceSummary.name}</dd>
                        <dt className="col-4">Spindel Id</dt>
                        <dd className="col-8">{deviceSummary.spindelId}</dd>
                    </dl>
                    {logDetails}
                </div>
                {buttons}
            </div >
        </div >
    );
}

export default DeviceSummary