import * as React from "react";
import * as ReactDOM from "react-dom";

import { PeerJs } from "./components/PeerJs";
import { Communicator } from "./communicator";
// import { Tuner } from "./tuner";
import { JsTunerUI, Recorder } from "jstuner-ui";

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
    const tuner = new Recorder();
    const tunerUI = new JsTunerUI(document.getElementById("main"));
    tuner.main();
    tuner.onData = (wave, hz, note)=>{
      tunerUI.draw(wave, hz, note);
    }
    await communicator.prepare();
    communicator.on("accept", e=>{
      console.log("accept");
      tuner.onData = (wave, hz, note)=>{
        communicator.send(hz);
        tunerUI.draw(wave, hz, note);
      };
    });
  }
}

window.onload = ()=> main().then();
