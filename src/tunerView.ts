import Note from './note';

export class TunerView{
  canvas;
  canvasContext;
  hzElement;
  noteElement;

  constructor(){
    // this.canvas = null;
    // this.canvasContext = null;
    this.canvas = document.getElementById("wave");
    this.canvasContext = this.canvas.getContext("2d");
    this.hzElement = document.getElementById("hz");
    this.noteElement = document.getElementById("note");
  }

  setPixel(imageData, x: number, y: number, color) {
    const width = imageData.width;
    const data = imageData.data;
    const index = ((width * y) + x) * 4;
    if (!isNaN(color.r)) {
      data[index] = color.r;
    }
    if (!isNaN(color.g)) {
      data[index + 1] = color.g;
    }
    if (!isNaN(color.b)) {
      data[index + 2] = color.b;
    }
    if (!isNaN(color.a)) {
      return data[index + 3] = color.a;
    }
  }

  drawWave(buffer, note: Note) {
    let x, y;
    this.canvasContext.save();
    this.canvasContext.fillStyle = "rgb(30, 30, 30)";
    this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.canvasContext.restore();
    const imageData = this.canvasContext.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const color = {
      r: 200,
      g: 200,
      b: 200,
      a: 255
    };
    const red = {
      r: 200,
      g: 0,
      b: 0,
      a: 255
    };

    const width = imageData.width;
    const height = imageData.height;
    for (let x = 0; x < width; x++){
      y = Math.floor(height/2+buffer[x*2]*height)
      this.setPixel(imageData, x, y, color);
    }

    x = Math.round(width/2 + width * note.diff())
    for (let y = 0; y < height; y++){
      this.setPixel(imageData, x, y, color);
      this.setPixel(imageData, width/2, y, red);
    }
    this.canvasContext.putImageData(imageData, 0, 0);
  };

  setText(hz, note:Note){
    this.hzElement.innerHTML = 'hz = ' + hz;
    this.noteElement.innerHTML = 'note = ' + note.name();
  }

  draw(wave, hz){
    const note = new Note(hz);
    this.drawWave(wave, note);
    if (hz < 30){
      return;
    }
    this.setText(hz, note);
  }
}


