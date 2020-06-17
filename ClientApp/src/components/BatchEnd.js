import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

export class BatchEnd extends Component {
    static displayName = BatchEnd.name;

    constructor(props) {
        super(props);
        this.state = { batch: {}, valid: { description: true }, error: { description: "" }, loading: true, message: "", redirect: null };
        this.id = props.match.params.id;
    }

    componentDidMount() {
        this.populateSummary();
    }

    submitForm = () => {
        this.postData();
    }

    renderEdit(batch) {
        const fmtDat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'medium' });

        const msg = (this.state.message !== undefined && this.state.message !== null && this.state.message !== "") ?
            <div className="form-group col-12" >
                <label className="col-form-label text-danger">{this.state.message}</label>
            </div >
            : null;

        const endDate = (this.state.batch?.endDate) ?
            <div className="form-group col-md-6 col-lg-4">
                <label className="col-form-label">End Date</label>
                <input className="form-control" name="endDate" id="endDate" defaultValue={fmtDat.format(new Date(batch.endDate))} readOnly="readonly" />
            </div>
            : null;

        return (
            <form>
                <div className="form-row">
                </div>
                <div className="form-row">
                    <div className="form-group col-md-6 col-lg-4">
                        <label className="col-form-label">Device Id</label>
                        <input className="form-control" name="deviceId" id="deviceId" defaultValue={batch.deviceId} readOnly="readonly" />
                    </div>
                    <div className="form-group col-md-6 col-lg-4">
                        <label className="col-form-label">Batch Id</label>
                        <input className="form-control" name="batchId" id="batchId" defaultValue={batch.batchId} readOnly="readonly" />
                    </div>
                    <div className="form-group col-md-6 col-lg-4">
                        <label className="col-form-label">Start Date</label>
                        <input className="form-control" name="startDate" id="startDate" defaultValue={fmtDat.format(new Date(batch.startDate))} readOnly="readonly" />
                    </div>
                    <div className="w-100"></div>
                    <div className="form-group col-md-12 col-lg-8 col-xl-6">
                        <label className="col-form-label">Description</label>
                        <input className="form-control " type="text" name="description" id="description" value={batch.description} readOnly="readonly" />
                    </div>
                    {endDate}
                    <div className="w-100"></div>
                    <div className="form-group col">
                        <input type="button" value="End Batch" className="btn btn-primary" onClick={this.submitForm} />
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

        const batch = this.state.batch;

        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderEdit(batch);

        let warning = !this.state.loading
            ? <div>
                <h3 className="text-danger">Are you sure you want to end this?  No other logs can be added</h3>
                <hr />
            </div>
            : null;

        return (
            <div>
                <h2>End Batch</h2>
                {warning}
                {contents}
                <div>
                    <Link to={'/batch/' + this.id}>Back to Batch</Link>
                </div>
            </div>
        );
    }

    async populateSummary() {
        const response = await fetch('data/batch/' + this.id);
        const data = await response.json();
        this.setState({ batch: data, valid: { description: true }, error: { description: "" }, loading: false, message: "", redirect: null });
    }

    async postData() {
        const response = await fetch('data/batchEnd/' + this.id, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state.batch)
        });
        if (!response.ok || response.status !== 200) {
            this.setState({ ...this.state, message: "Failed to end batch. " + response.status + ":" + response.statusText });
            return;
        }
        this.setState({ redirect: "/batch/" + this.state.batch.batchId });
    }
}