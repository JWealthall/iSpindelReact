import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

export class LogDelete extends Component {
    static displayName = LogDelete.name;

    constructor(props) {
        super(props);
        this.state = { log: {}, valid: { description: true }, error: { description: "" }, loading: true, message: "", redirect: null };
        this.id = props.match.params.id;
    }

    componentDidMount() {
        this.populateSummary();
    }

    submitForm = () => {
        this.postData();
    }

    renderEdit(log) {
        const fmtDat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'medium' });
        const fmtGrv = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 3, minimumFractionDigits: 3 });
        const fmtTmp = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 1, minimumFractionDigits: 1 });
        const fmtAng = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
        const fmtBat = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 2, minimumFractionDigits: 2 });

        const msg = (this.state.message !== undefined && this.state.message !== null && this.state.message !== "") ?
            <div className="form-group col-12" >
                <label className="col-form-label text-danger">{this.state.message}</label>
            </div >
            : null;

        return (
            <form>
                <div className="form-row">
                </div>
                <div className="form-row">
                    <div className="form-group col-md-6 col-lg-4">
                        <label className="col-form-label">Log Id</label>
                        <input className="form-control" name="logId" id="logId" defaultValue={log.logId} readOnly="readonly" />
                    </div>
                    <div className="form-group col-md-6 col-lg-4">
                        <label className="col-form-label">Date</label>
                        <input className="form-control" name="date" id="date" defaultValue={fmtDat.format(new Date(log.date))} readOnly="readonly" />
                    </div>
                    <div className="form-group col-md-6 col-lg-4">
                        <label className="col-form-label">Angle</label>
                        <input className="form-control" name="angle" id="angle" defaultValue={fmtAng.format(log.angle)} readOnly="readonly" />
                    </div>
                    <div className="form-group col-md-6 col-lg-4">
                        <label className="col-form-label">Temperature</label>
                        <input className="form-control" name="temperature" id="temperature" defaultValue={fmtTmp.format(log.temperature)} readOnly="readonly" />
                    </div>
                    <div className="form-group col-md-6 col-lg-4">
                        <label className="col-form-label">Temp Units</label>
                        <input className="form-control" name="tempUnits" id="tempUnits" defaultValue={log.tempUnits} readOnly="readonly" />
                    </div>
                    <div className="form-group col-md-6 col-lg-4">
                        <label className="col-form-label">Battery</label>
                        <input className="form-control" name="battery" id="battery" defaultValue={fmtBat.format(log.battery)} readOnly="readonly" />
                    </div>
                    <div className="form-group col-md-6 col-lg-4">
                        <label className="col-form-label">Gravity</label>
                        <input className="form-control" name="gravity" id="gravity" defaultValue={fmtGrv.format(log.gravity)} readOnly="readonly" />
                    </div>
                    <div className="form-group col-md-6 col-lg-4">
                        <label className="col-form-label">Interval</label>
                        <input className="form-control" name="interval" id="interval" defaultValue={log.interval} readOnly="readonly" />
                    </div>
                    <div className="form-group col-md-6 col-lg-4">
                        <label className="col-form-label">RSSI</label>
                        <input className="form-control" name="rssi" id="rssi" defaultValue={log.rssi} readOnly="readonly" />
                    </div>
                    <div className="form-group col-md-6 col-lg-4">
                        <label className="col-form-label">Device Id</label>
                        <input className="form-control" name="deviceId" id="deviceId" defaultValue={log.deviceId} readOnly="readonly" />
                    </div>
                    <div className="form-group col-md-6 col-lg-4">
                        <label className="col-form-label">Batch Id</label>
                        <input className="form-control" name="batchId" id="batchId" defaultValue={log.batchId} readOnly="readonly" />
                    </div>
                    <div className="w-100"></div>
                    <div className="form-group col">
                        <input type="button" value="Delete Log" className="btn btn-primary" onClick={this.submitForm} />
                    </div>
                    <div className="w-100"></div>
                    {msg}
                </div >
            </form >
        );
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />;
        }

        const log = this.state.log;

        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderEdit(log);

        let warning = !this.state.loading
            ? <div>
                <h3 className="text-danger">Are you sure you want to delete this?  Cannot be undone</h3>
                <hr />
            </div>
            : null;

        return (
            <div>
                <h2>Delete Log</h2>
                {warning}
                {contents}
                <div>
                    <Link to={'/batch/' + this.state?.log?.batchId}>Back to Log</Link>
                </div>
            </div>
        );
    }

    async populateSummary() {
        const response = await fetch('data/log/' + this.id);
        const data = await response.json();
        this.setState({ log: data, valid: { description: true }, error: { description: "" }, loading: false, message: "", redirect: null });
    }

    async postData() {
        const response = await fetch('data/logDelete/' + this.id, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state.log)
        });
        if (!response.ok || response.status !== 200) {
            this.setState({ ...this.state, message: "Failed to delete log. " + response.status + ":" + response.statusText });
            return;
        }
        this.setState({ redirect: "/batch/" + this.state.log.batchId });
    }
}