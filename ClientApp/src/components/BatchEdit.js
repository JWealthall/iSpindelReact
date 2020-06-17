import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

export class BatchEdit extends Component {
    static displayName = BatchEdit.name;

    constructor(props) {
        super(props);
        this.state = { batch: {}, valid: { description: true }, error: { description: "" }, loading: true, message: "", redirect: null };
        this.id = props.match.params.id;
    }

    componentDidMount() {
        this.populateSummary();
    }

    handleChange = event => {
        const { name, value } = event.target;
        let valid = this.state.valid;
        let error = this.state.error;
        if (name === "description") {
            if (value === undefined || value === null || value === '') {
                valid = { ...valid, description: false };
                error = { ...error, description: 'Cannot be blank' };
            } else if (value.length > 50) {
                valid = { ...valid, description: false };
                error = { ...error, description: 'Cannot be longer than 50' };
            } else {
                valid = { ...valid, description: true };
                error = { ...error, description: '' };
            }
        }
        const batch = { ...this.state.batch, [name]: value };
        this.setState({ ...this.state, batch: batch, valid: valid, error: error });
    }

    isValid = () => {
        return !Object.values(this.state.valid).includes(false);
    }

    submitForm = () => {
        if (!this.isValid()) return;
        this.postData();
    }

    renderEdit(batch) {
        const fmtDat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'medium' });

        const descIsInv = this.state.valid.description ? null : 'is-invalid';

        const descErr = !this.state.valid.description ?
            <div className="invalid-feedback">{this.state.error.description}</div>
            : null;

        const isValid = this.isValid();
        const valErr = !isValid ?
            <div className="form-group col-12" >
                <label className="col-form-label text-danger">Please fix validation errors</label>
            </div >
            : null;

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
        const linkToEnd = !(this.state.batch?.endDate) ?
            <Link className="btn btn-primary ml-2" to={'/batch/end/' + this.state.batch.batchId}>End</Link>
            : null;

        return (
            <form>
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
                        <input className={"form-control " + descIsInv} type="text" name="description" id="description" value={batch.description} onChange={this.handleChange} />
                        {descErr}
                    </div>
                    {endDate}
                    <div className="w-100"></div>
                    <div className="form-group col">
                        <input type="button" value="Save" className="btn btn-primary" onClick={this.submitForm} />
                        {linkToEnd}
                    </div>
                    <div className="w-100"></div>
                    {valErr}
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

        return (
            <div>
                <h2>Edit Batch</h2>
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
        const response = await fetch('data/batchUpdate/' + this.id, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state.batch)
        });
        if (!response.ok || response.status !== 200) {
            this.setState({ ...this.state, message: "Failed to update batch. " + response.status + ":" + response.statusText });
            return;
        }
        this.setState({ redirect: "/batch/" + this.state.batch.batchId });
    }
}