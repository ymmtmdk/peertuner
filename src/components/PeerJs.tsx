import * as React from "react";
import { EventEmitter } from 'events';
import { PeerId, Communicator } from "peer-communicator";
import { JsTunerUI } from 'jstuner-ui';

interface LogProps {
  readonly contents: Array<any>;
}

class Log extends React.Component<LogProps, undefined> {
  render() {
    return <div>
      log:
    {this.props.contents.map((e,i)=><div key={i}>{e}</div>)}
      </div>
  }
}

interface PeerProps {
  readonly emitter: EventEmitter;
  readonly peer: PeerId;
}

class Peer extends React.Component<PeerProps, undefined> {
  onClick(e){
    e.stopPropagation();
    this.props.emitter.emit("connecting", {source: this, data: this.props.peer});
  }

  render() {
    return <div>
      <a href="#" onClick={this.onClick.bind(this)}>
      {this.props.peer}
      </a>
      </div>
  }
}

interface PeersProps {
  readonly emitter: EventEmitter;
  readonly peers: Array<PeerId>;
}

class Peers extends React.Component<PeersProps, undefined> {
  render() {
    return <div>
      peers:
    <div>
    {this.props.peers.map((e)=><Peer emitter={this.props.emitter} key={e} peer={e}/>)}
    </div>
      </div>
  }
}

interface PeerJsProps {
  readonly communicator: Communicator;
}

export class PeerJs extends React.Component<PeerJsProps, undefined> {
  readonly emitter: EventEmitter;
  readonly state;
  tunerUI;

  private log(text){
    this.state.logs.push(text);
    this.setState({logs: this.state.logs});
  }

  constructor(props) {
    super(props);
    this.emitter = new EventEmitter();
    this.state = {peers: [], logs: ["init"]};

    props.communicator.allPeers().then(e=>{
      this.emitter.emit("peers", {source: this, data: e});
    });

    props.communicator.on("accept", e=>{
      this.tunerUI = new JsTunerUI(document.getElementById("main"));
      this.log("accept");
    });

    props.communicator.on("recieve", e=>{
      this.tunerUI.draw([], e.data);
    });

    this.emitter.on("peers", e=>{
      this.setState({peers: e.data});
    });

    this.emitter.on("connecting", e=>{
      props.communicator.connect(e.data);
    });
  }

  send(e): void {
    e.stopPropagation();
    this.props.communicator.send("h");
  }

  allPeers(e): void {
    e.stopPropagation();
    this.props.communicator.allPeers().then(e=>{
      this.emitter.emit("peers", {source: this, data: e});
    });
  }

  render() {
    return <div>
      <div>myId: {this.props.communicator.peerId}</div>
      <hr />

      <button onClick={this.send.bind(this)}>send</button>
      <button onClick={this.allPeers.bind(this)}>allPeers</button>
      <Peers emitter={this.emitter} peers={this.state.peers} />
      <Log contents={this.state.logs} />
      </div>;
  }
}

