import * as React from "react";
import * as ReactDOM from "react-dom";

import { PeerJs } from "./components/PeerJs";
import { Communicator } from "./communicator";
import { Tuner } from "./tuner";
import { TunerC } from "./components/TunerC";

const APIKEY = 'c86fbf19-fbee-4b25-80ea-02b27155ec51';

async function wait(n){
  await new Promise(r=>setTimeout(r, n));
}
async function main(){
  const m = location.href.match(/#(\w+)/);
  const communicator = new Communicator(APIKEY);
  console.log(m);
  if (m){
    await communicator.prepare();
    ReactDOM.render(
      <PeerJs communicator={communicator} />,
      document.getElementById("main")
    );
  }
  else{
    ReactDOM.render(
      <TunerC communicator={communicator} />,
      document.getElementById("main")
    );
    const tuner = new Tuner();
    tuner.main();
    await communicator.prepare();
    communicator.on("accept", e=>{
      console.log("accept");
      tuner.onData = hz=>{
        communicator.send(hz);
      };
    });
  }
}

window.onload = ()=> main().then();
