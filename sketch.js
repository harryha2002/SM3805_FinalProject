
function create2DArray(cols, rows) {
  let arr = new Array(cols);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
  }
  return arr;
}

let grid;
let cols;
let rows;
let resolution = 10;
let intrumentCount = 56;
let gridX = resolution*intrumentCount, gridY = resolution*intrumentCount;
let soundAsset = [];
let finalBool = false;
let timer = 250;
let beat = timer;
let current = -1;
let countDown = 10000;
let sliderVolume;
let sliderSpeed;
let reloadButton;

function setup() {
  soundAsset = [
    loadSound("drumKit/bass_sample.mp3"),
    loadSound("drumKit/clap_sample.mp3"),
    loadSound("drumKit/hh_sample.mp3"),
    loadSound("drumKit/untitled - Track 2.wav"),
    loadSound("drumKit/untitled - Track 3.wav"),
    loadSound("drumKit/untitled - Track 4.wav"),
    loadSound("drumKit/untitled - Track 5.wav"),
    loadSound("drumKit/untitled - Track 6.wav"),
    loadSound("drumKit/untitled - Track 7.wav"),
    loadSound("drumKit/untitled - Track 8.wav"),
    loadSound("drumKit/untitled - Track 9.wav"),
    loadSound("drumKit/untitled - Track 10.wav"),
    loadSound("drumKit/untitled - Track 11.wav"),
    loadSound("drumKit/untitled - Track 12.wav"),
    loadSound("kalimba/K01.mp3"),
    loadSound("kalimba/K02.mp3"),
    loadSound("kalimba/K03.mp3"),
    loadSound("kalimba/K04.mp3"),
    loadSound("kalimba/K05.mp3"),
    loadSound("kalimba/K06.mp3"),
    loadSound("kalimba/K07.mp3"),
    loadSound("kalimba/K08.mp3"),
    loadSound("kalimba/K09.mp3"),
    loadSound("kalimba/K10.mp3"),
    loadSound("kalimba/K11.mp3"),
    loadSound("kalimba/K12.mp3"),
    loadSound("kalimba/K13.mp3"),
    loadSound("kalimba/K14.mp3"),
    loadSound("kalimba/K15.mp3"),
    loadSound("kalimba/K16.mp3"),
    loadSound("kalimba/K17.mp3")
  ]

  createCanvas(gridX, gridY);
  noStroke();
  textAlign(CENTER);
  textSize(20);
  cols = width / resolution;
  rows = height / resolution;

  sliderVolume = createSlider(0, 1, 0.15, 0.01);
  sliderSpeed = createSlider(0, 1, 0.2, 0.01);
  sliderVolume.elt.parentNode.insertBefore(document.createTextNode("VOLUME"), 
  sliderVolume.elt.nextSibling);
  sliderSpeed.elt.parentNode.insertBefore(document.createTextNode("SPEED"), 
  sliderSpeed.elt.nextSibling);

  grid = create2DArray(cols, rows);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = floor(random(2));
    }
  }

  reloadButton = createButton("RELOAD");
  reloadButton.mousePressed(reboot);
}

function draw() {
  background(0);

for (let sound of soundAsset)
{  
  sound.setVolume(sliderVolume.value());
}

//------------------------------------------//
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x = i * resolution;
      let y = j * resolution;
      if (grid[i][j] == 1) {
        fill(255);
        rect(x, y, resolution, resolution);
      } else if (i == current) {
      }
    }
    if (i === current){
        push();
        strokeWeight(3);
        stroke(5, 175, 242)
        noFill();
        rect(i * resolution, 0, resolution, height);
        pop();
    }
  }
  let nextGen = create2DArray(cols, rows);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let sum;
      let neighbours = count(grid, i, j);
      //console.log(sum);
      let state = grid[i][j];

      if (state == 0 && neighbours == 3) {
        nextGen[i][j] = 1;
      } else if (state == 1 && (neighbours < 2 || neighbours > 3)) {
        nextGen[i][j] = 0;
      } else {
        nextGen[i][j] = grid[i][j];
      }
    }
  }

  if (countDown <= 0) {
    finalBool = true;
  } else {
    push();
    fill(255, (1+sin(frameCount/10))*127.5);
    text("LOADING", width/2, height/2);
    pop();
  }

  if (!finalBool) {
    if (nextGen.every((innerArray, index) => innerArray.every((value, innerIndex) => value === grid[index][innerIndex]))) {
      finalBool = true;
    }
    grid = nextGen;
    countDown -= deltaTime;
  } else if (timer >= beat*(1-sliderSpeed.value())) {
    if (current > intrumentCount) {
      current = 0
    } else {
      current++
    }

    let scanner = grid[current]
    for (i in scanner) {
      if (scanner[i] === 1) {
        soundAsset[loopingArray(i)].play();
      }
    } timer = 0;
  } else {
    timer += deltaTime;
  }
  //------------------------------------------//
}

function reboot(){
  current = -1;
  countDown = 10000;
  finalBool = false;
  grid = create2DArray(cols, rows);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = floor(random(2));
    }
  }
}

function count(grid, i, j) {
  sum = 0;
  if (i > 0 && i < cols - 1 && j > 0 && j < rows - 1) {  //norm
    sum += grid[i - 1][j - 1]; //n7
    sum += grid[i][j - 1]; //n8
    sum += grid[i + 1][j - 1]; //n9

    sum += grid[i - 1][j]; // n4
    //self
    sum += grid[i + 1][j]; // n6

    sum += grid[i - 1][j + 1]; //n1
    sum += grid[i][j + 1]; //n2
    sum += grid[i + 1][j + 1]; //n3
  }

  if (i == 0 && j > 0 && j < rows - 1) {  //left
    sum += 0; //n7
    sum += grid[i][j - 1]; //n8
    sum += grid[i + 1][j - 1]; //n9

    sum += 0; // n4
    //self
    sum += grid[i + 1][j]; // n6

    sum += 0; //n1
    sum += grid[i][j + 1]; //n2
    sum += grid[i + 1][j + 1]; //n3
  }

  if (i == cols - 1 && j > 0 && j < rows - 1) {  //right
    sum += grid[i - 1][j - 1]; //n7
    sum += grid[i][j - 1]; //n8
    sum += 0; //n9

    sum += grid[i - 1][j]; // n4
    //self
    sum += 0; // n6

    sum += grid[i - 1][j + 1]; //n1
    sum += grid[i][j + 1]; //n2
    sum += 0; //n3
  }

  if (j == 0 && i > 0 && i < cols - 1) {  //top
    sum += 0; //n7
    sum += 0; //n8
    sum += 0; //n9

    sum += grid[i - 1][j]; // n4
    //self
    sum += grid[i + 1][j]; // n6

    sum += grid[i - 1][j + 1]; //n1
    sum += grid[i][j + 1]; //n2
    sum += grid[i + 1][j + 1]; //n3
  }

  if (j == rows - 1 && i > 0 && i < cols - 1) {  //bottom
    sum += grid[i - 1][j - 1]; //n7
    sum += grid[i][j - 1]; //n8
    sum += grid[i + 1][j - 1]; //n9

    sum += grid[i - 1][j]; // n4
    //self
    sum += grid[i + 1][j]; // n6

    sum += 0; //n1
    sum += 0; //n2
    sum += 0; //n3
  }

  if (i == 0 && j == 0) {  //top.left
    sum += 0; //n7
    sum += 0; //n8
    sum += 0; //n9

    sum += 0; // n4
    //self
    sum += grid[i + 1][j]; // n6

    sum += 0; //n1
    sum += grid[i][j + 1]; //n2
    sum += grid[i + 1][j + 1]; //n3
  }

  if (i == cols - 1 && j == 0) {  //top.right
    sum += 0; //n7
    sum += 0; //n8
    sum += 0; //n9

    sum += grid[i - 1][j]; // n4
    //self
    sum += 0; // n6

    sum += grid[i - 1][j + 1]; //n1
    sum += grid[i][j + 1]; //n2
    sum += 0; //n3
  }

  if (i == 0 && j == rows - 1) {  //bottom.left
    sum += 0; //n7
    sum += grid[i][j - 1]; //n8
    sum += grid[i + 1][j - 1]; //n9

    sum += 0; // n4
    //self
    sum += grid[i + 1][j]; // n6

    sum += 0; //n1
    sum += 0; //n2
    sum += 0; //n3
  }

  if (i == cols && j == rows - 1) {  //bottom.right
    sum += grid[i - 1][j - 1]; //n7
    sum += grid[i][j - 1]; //n8
    sum += 0; //n9

    sum += grid[i - 1][j]; // n4
    //self
    sum += 0; // n6

    sum += 0; //n1
    sum += 0; //n2
    sum += 0; //n3
  }

  return sum;
}

function loopingArray(index){
  return index % (soundAsset.length);
}