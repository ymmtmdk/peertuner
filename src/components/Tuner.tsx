import * as React from "react";
// import { EventEmitter } from 'events';
// import { PeerId, Communicator } from "../communicator";
import { Tuner } from "../tuner";

export class TunerC extends React.Component<undefined, undefined> {
  tuner;
  constructor(){
    super();
    this.tuner = new Tuner();
  }

  render() {
    this.tuner.main();
    return <div>
      <p id="hz">hz = </p>
      <p id="note">note = </p>
      <canvas id="wave">
      </canvas>
      </div>
  }
}

