import React, { Component } from 'react';
import DeviceSummaries from './DeviceSummaries'
import BatchSummaries from './BatchSummaries'
import { Link } from 'react-router-dom';

export class Batch extends Component {
    static displayName = Batch.name;

    constructor(props) {
        super(props);
        this.state = { summary: {}, loading: true };
        this.id = props.match.params.id
    }

    componentDidMount() {
        this.populateSummary();
    }

    static renderLogs(summary) {
        const fmtDat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'medium' })
        const fmtGrv = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 3, minimumFractionDigits: 3 })
        const fmtTmp = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 1, minimumFractionDigits: 1 })
        const fmtAng = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
        const fmtBat = new Intl.NumberFormat('en-GB', { maximumFractionDigits: 2, minimumFractionDigits: 2 })

        const rows = summary?.batch?.logs.map((log, index) => {
            return (
                <tr>
                    <td className="text-center">{fmtDat.format(new Date(log.date))}</td>
                    <td className="text-right">{fmtGrv.format(log.gravity)}</td>
                    <td className="text-right">{fmtTmp.format(log.temperature)}&deg;{log.tempUnits}</td>
                    <td className="text-right">{fmtAng.format(log.angle)}&deg;</td>
                    <td className="text-right">{fmtBat.format(log.battery)}</td>
                    <td className="text-right">{log.rssi}</td>
                    <td className="text-center">
                        <Link className="" to={"/log/delete/" + log.logId}>Delete</Link>
                    </td>
                </tr>
            )
        })
        return (
            <table class="table table-sm table-striped table-borderless table-hover">
                <thead class="thead-dark">
                    <tr>
                        <th class="text-center">Date</th>
                        <th class="text-right">Gravity</th>
                        <th class="text-right">Temperature</th>
                        <th class="text-right">Angle</th>
                        <th class="text-right">Battery</th>
                        <th class="text-right">RSSI</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {rows}
                </tbody>
            </table>
        )
    }

    static renderSummary(summary) {
        return (
            <div className="row justify-content-center">
                <DeviceSummaries devices={summary.devices} />
                <BatchSummaries batches={summary.batches} />
            </div>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : Batch.renderSummary(this.state.summary);

        let logs = this.state.loading
            ? null
            : Batch.renderLogs(this.state.summary);

        return (
            <div>
                <div className="text-center">
                    <h1 className="display-5">{this.state.summary?.batchName} Summary</h1>
                </div>
                {contents}
                {logs}
            </div>
        );
    }

    async populateSummary() {
        const response = await fetch('data/batchSummary/' + this.id);
        const data = await response.json();
        this.setState({ summary: data, loading: false });
    }

}
