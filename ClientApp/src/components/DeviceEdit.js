import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

export class DeviceEdit extends Component {
    static displayName = DeviceEdit.name;

    constructor(props) {
        super(props);
        this.state = { device: {}, valid: { description: true, token: true }, error: { description: "", token: "" }, loading: true, message: "", redirect: null };
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
        if (name === "token") {
            if (value !== undefined && value !== null && value.length > 100) {
                valid = { ...valid, token: false };
                error = { ...error, token: 'Cannot be longer than 100' };
            } else {
                valid = { ...valid, token: true };
                error = { ...error, token: '' };
            }
        }
        const device = { ...this.state.device, [name]: value };
        this.setState({...this.state, device: device, valid: valid, error: error });
    }

    isValid = () => {
        return !Object.values(this.state.valid).includes(false);
    }

    submitForm = () => {
        if (!this.isValid()) return;
        this.postData();
    }

    renderEdit(device) {
        const descIsInv = this.state.valid.description ? null : 'is-invalid';
        const tokIsInv = this.state.valid.token ? null : 'is-invalid';

        const descErr = !this.state.valid.description ?
            <div className="invalid-feedback">{this.state.error.description}</div>
            : null;
        const tokErr = !this.state.valid.token ?
            <div className="invalid-feedback">{this.state.error.token}</div>
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
                        <input className="form-control" name="deviceId" id="deviceId" defaultValue={device.deviceId} readOnly="readonly" />
                    </div>
                    <div className="form-group col-md-6 col-lg-4">
                        <label className="col-form-label">Name</label>
                        <input className="form-control" name="name" id="name" defaultValue={device.name} readOnly="readonly" />
                    </div>
                    <div className="form-group col-md-6 col-lg-4">
                        <label className="col-form-label">Spindel Id</label>
                        <input className="form-control" name="spindelId" id="spindelId" defaultValue={device.spindelId} readOnly="readonly" />
                    </div>
                    <div className="w-100"></div>
                    <div className="form-group col-md-12 col-lg-8 col-xl-6">
                        <label className="col-form-label">Description</label>
                        <input className={"form-control " + descIsInv} type="text" name="description" id="description" value={device.description} onChange={this.handleChange} />
                        {descErr}
                    </div>
                    <div className="form-group col-md-12 col-lg-8 col-xl-6">
                        <label className="col-form-label">Token</label>
                        <input className={"form-control " + tokIsInv} type="text" name="token" id="token" value={device.token} onChange={this.handleChange} />
                        {tokErr}
                    </div >
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

        const device = this.state.device;

        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : this.renderEdit(device);

        return (
            <div>
                <h2>Edit Device</h2>
                {contents}
                <div>
                    <Link to={'/device/' + this.id}>Back to Device</Link>
                </div>
            </div>
        );
    }

    async populateSummary() {
        const response = await fetch('data/device/' + this.id);
        const data = await response.json();
        this.setState({ device: data, valid: { description: true, token: true }, error: { description: "", token: "" }, loading: false, message: "", redirect: null });
    }

    async postData() {
        const response = await fetch('data/deviceUpdate/' + this.id, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(this.state.device)
        });
        if (!response.ok || response.status !== 200) {
            this.setState({...this.state, message: "Failed to update device. " + response.status + ":" + response.statusText });
            return;
        }
        this.setState({ redirect: "/device/" + this.state.device.deviceId });
    }
}