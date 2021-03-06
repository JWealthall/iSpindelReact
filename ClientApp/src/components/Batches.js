﻿import React, { Component } from 'react';
import BatchSummaries from './BatchSummaries'

export class Batches extends Component {
    static displayName = Batches.name;

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
                <BatchSummaries batches={summary.batches} />
            </div>
        );
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : Batches.renderSummary(this.state.summary);

        return (
            <div>
                <div className="text-center">
                    <h1 className="display-5">iSpindel Batch List</h1>
                </div>
                {contents}
            </div>
        );
    }

    async populateSummary() {
        const response = await fetch('data/batchesSummary');
        const data = await response.json();
        this.setState({ summary: data, loading: false });
    }

}
