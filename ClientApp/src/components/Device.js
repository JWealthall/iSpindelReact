import React, { Component } from 'react';
import DeviceSummaries from './DeviceSummaries'
import BatchSummaries from './BatchSummaries'

export class Device extends Component {
    static displayName = Device.name;

    constructor(props) {
        super(props);
        this.state = { summary: {}, loading: true };
        this.id = props.match.params.id
    }

    componentDidMount() {
        this.populateSummary();
    }

    static renderSummary(summary) {
        let devices = (
            <div className="row justify-content-center">
                <DeviceSummaries devices={summary.devices} />
            </div>
        );
        let batches = (
            <div className="row justify-content-center">
                <BatchSummaries batches={summary.batches} />
            </div>
        );
        return (
            <div>
                {devices}
                <div className="row justify-content-center">
                    <h4 className="">Batches</h4>
                </div>
                {batches}
            </div>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : Device.renderSummary(this.state.summary);

        return (
            <div>
                <div className="text-center">
                    <h1 className="display-5">{this.state.summary?.deviceName} Summary</h1>
                </div>
                {contents}
            </div>
        );
    }

    async populateSummary() {
        const response = await fetch('data/deviceSummary/' + this.id );
        const data = await response.json();
        this.setState({ summary: data, loading: false });
    }

}
