import Note from './note';
import Pitcher from './pitcher';
import { TunerView } from './tunerView';

export class Tuner{
  audioContext;
  onData;
  view;

  constructor(){
    this.audioContext = null;
    this.onData = null;
    this.view= new TunerView();
  }

  connectRecorder(stream) {
    this.audioContext = new AudioContext();
    const bufferSize = 2048;
    const recorder = this.audioContext.createScriptProcessor(bufferSize, 2, 2);
    let counter = 0;
    recorder.onaudioprocess = (e)=> {
      const span = document.hasFocus() ? 2 : 20;
      if (counter++ % span != 0) {
        return;
      }
      const left = e.inputBuffer.getChannelData(0);
      const hz = Pitcher.pitch(left, this.audioContext.sampleRate);
      if (this.onData){
        this.onData(hz);
      }

      this.view.draw(left, hz);
    };

    const input = this.audioContext.createMediaStreamSource(stream);
    input.connect(recorder);
    return recorder.connect(this.audioContext.destination);
  }

  main(){
    const nav: any = navigator;
    const win: any = window;

    if (!nav.getUserMedia) {
      nav.getUserMedia = nav.getUserMedia || nav.webkitGetUserMedia || nav.mozGetUserMedia || nav.msGetUserMedia;
    }
    if (!win.AudioContext) {
      win.AudioContext = win.webkitAudioContext;
    }
    if (!nav.getUserMedia || !win.AudioContext) {
      alert("not supported in this browser.");
      return;
    }

    nav.getUserMedia(
      { audio: true },
      this.connectRecorder.bind(this), ()=> {alert("error capturing audio.");}
    );
  }
}

