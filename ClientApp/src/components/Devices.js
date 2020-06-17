import React, { Component } from 'react';
import DeviceSummaries from './DeviceSummaries'

export class Devices extends Component {
    static displayName = Devices.name;

    constructor(props) {
        super(props);
        this.state = { summary: {}, loading: true };
        this.id = props.match.params.id
    }

    componentDidMount() {
        this.populateSummary();
    }

    static renderSummary(summary) {
        return (
            <div className="row justify-content-center">
                <DeviceSummaries devices={summary.devices} />
            </div>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : Devices.renderSummary(this.state.summary);

        return (
            <div>
                <div className="text-center">
                    <h1 className="display-5">iSpindel Device List</h1>
                </div>
                {contents}
            </div>
        );
    }

    async populateSummary() {
        const response = await fetch('data/devicesSummary');
        const data = await response.json();
        this.setState({ summary: data, loading: false });
    }

}
