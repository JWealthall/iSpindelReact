import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

export class BatchNew extends Component {
    static displayName = BatchNew.name;

    constructor(props) {
        super(props);
        this.id = props.match.params.id;
        this.state = {
            batch: { deviceId: this.id, batchId: uuidv4(), startDate: new Date(), description: "" },
            valid: { description: false },
            error: { description: "Cannot be blank" },
            message: "",
            redirect: null
        };
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
        const x = this.state.batch;
        console.log(x.description + ":" + x.token);
        //this.props.handleSubmit(this.state)
        //this.setState(this.initialState)
        this.postData();
    }

    renderEdit(batch) {
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

        return (
            <form>
                <div className="form-row">
                    <div className="form-group col-md-6 col-lg-4">
                        <label className="col-form-label">Device Id</label>
                        <input className="form-control" name="deviceId" id="deviceId" defaultValue={batch.deviceId} readOnly="readonly" />
                    </div>
                    <div className="w-100"></div>
                    <div className="form-group col-md-12 col-lg-8 col-xl-6">
                        <label className="col-form-label">Description</label>
                        <input className={"form-control " + descIsInv} type="text" name="description" id="description" value={batch.description} onChange={this.handleChange} />
                        {descErr}
                    </div>
                    <div className="w-100"></div>
                    <div className="form-group col">
                        <input type="button" value="Save" className="btn btn-primary" onClick={this.submitForm} />
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

        let contents = this.renderEdit(batch);

        return (
            <div>
                <h2>Create Batch</h2>
                {contents}
                <div>
                    <Link to={'/device/' + this.id}>Back to Device</Link>
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
        const response = await fetch('data/batchCreate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state.batch)
        });
        if (!response.ok || response.status !== 200) {
            this.setState({ ...this.state, message: "Failed to create batch. " + response.status + ":" + response.statusText });
            return;
        }
        this.setState({ redirect: "/batch/" + this.state.batch.batchId });
    }
}