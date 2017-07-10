import * as React from "react";
// import { EventEmitter } from 'events';
import { PeerId, Communicator } from "../communicator";
// import { Tuner } from "../tuner";

interface TunerCProps {
  readonly communicator: Communicator;
}

export class TunerC extends React.Component<TunerCProps, undefined> {
  // tuner;
  render() {
    return <div>
      <p id="hz">hz = </p>
      <p id="note">note = </p>
      <canvas id="wave">
      </canvas>
      </div>
  }
}

