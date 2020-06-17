import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { Device } from './components/Device'
import { DeviceEdit } from './components/DeviceEdit'
import { Devices } from './components/Devices'
import { Batch } from './components/Batch'
import { BatchEdit } from './components/BatchEdit'
import { BatchEnd } from './components/BatchEnd'
import { BatchNew } from './components/BatchNew'
import { Batches } from './components/Batches'
import { Chart } from './components/Chart'
import { LogDelete } from './components/LogDelete'

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <Route exact path='/' component={Home} />
        <Route exact path="/device" component={Devices} />
        <Route exact path="/device/:id" component={Device} />
        <Route exact path="/device/edit/:id" component={DeviceEdit} />
        <Route exact path="/batch" component={Batches} />
        <Route exact path="/batch/:id" component={Batch} />
        <Route exact path="/batch/edit/:id" component={BatchEdit} />
        <Route exact path="/batch/end/:id" component={BatchEnd} />
        <Route exact path="/batch/chart/:id" component={Chart} />
        <Route exact path="/batch/new/:id" component={BatchNew} />
        <Route exact path="/log/delete/:id" component={LogDelete} />
      </Layout>
    );
  }
}
