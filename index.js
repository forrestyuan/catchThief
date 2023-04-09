
const gridW = 30; //棋盘格子宽
const gridH = 30;  //棋盘格子高
const row = 15; //棋盘行数
const col = 20; //棋盘列数

let sone = null;//胜利音乐
let whoWin = ''; //谁胜利可选值'police|thief'

let interval = null;//循环句柄
const moveTime = 16;//循环时间

let thiefImg = null;//小偷图片
let thiefXPos = 40;//小偷横坐标
let thiefYPos = 0;//小偷纵坐标
const stepLen = 3; //小偷移动步长（速度）

let policeImg = null;//警察图片 
let policeXPos = 0;//警察横坐标
let policeYPos = 0;//警察纵坐标
let policeStepLen = 2;//警察移动步长基数
let policeDir = 0; //警察动态移动步长（速度）

let voiceSize = 0;
//获取DOM节点
const thiefProgressNode = document.getElementById('progress');
const thiefVoiceValNode = document.getElementById('voiceVal');
const policeProgressNode = document.getElementById('policeProgress');
const policeValNode = document.getElementById('policeVal');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const thiefWinGifNode = document.getElementById('thiefGif'); //小偷胜利动图
const policeWinGifNode = document.getElementById('policeGif'); //警察胜利动图

//预加载图片
function preload() {
  song = loadSound('./resources/胜利配乐.mp3');
  thiefImg = loadImage('./resources/thief.png');
  policeImg = loadImage('./resources/police.png');
}
//初次调用
function setup() {
  createCanvas(col * gridW + 60, row * gridH).parent('gameCanvas')
  document.querySelector('.page').style.cssText = `width:${(col + 2) * gridW}px`
}

//循环体
function draw() {
  noStroke();
  background('#fff');
  // 绘制格子盘
  for (let i = 1; i < col + 1; i++) {
    for (let j = 0; j < row; j++) {
      fill('pink')
      rect(i * gridW, j * gridH, gridW, gridH - 1); // 将高度改为gridH-1
    }
  }
  // 绘制小偷和警察
  image(thiefImg, thiefXPos, thiefYPos - 5, gridW, gridH + 5);
  image(policeImg, policeXPos, policeYPos - 20, gridW, gridH + 25);

  if (whoWin === 'police') {
    fill(255, 0, 0);
    textSize(30)
    text("恭喜你抓住小偷啦，警察胜利喽！", col * gridW / 6, 60);
  }
  if (whoWin === 'thief') {
    fill(255, 0, 0);
    textSize(30)
    text("小样，还想抓住我，哈哈哈", col * gridW / 5, 60);
  }
  //绘制通道
  for (let i = 1; i < row; i++) {
    fill('pink');
    (i % 2 === 0) ? rect((col + 1) * gridW, gridH * i - 1, gridW, 3) : rect(0, gridH * i - 1, gridW, 3);

  }
  //绘制出口文字
  fill(0, 0, 0);
  textSize(12)
  text("出口", (col + 1) * gridW + 2, row * gridH - 10);

  // 显示当前玩家数据
  thiefVoiceValNode.innerText = thiefProgressNode.value = policeDir / policeStepLen;
  policeValNode.innerText = policeProgressNode.value = Math.abs(policeDir);
}



//获取音量大小
async function getVoiceSize() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true } });// echoCancellation: true以减少回音和噪声的影响
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const processor = audioContext.createScriptProcessor(1024, 1, 1);
    source.connect(processor);
    processor.connect(audioContext.destination);
    processor.onaudioprocess = function (event) {
      const buffer = event.inputBuffer.getChannelData(0);
      const sum = buffer.reduce((acc, val) => acc + val ** 2, 0);//计算音量大小
      voiceSize = Math.sqrt(sum / buffer.length);
    };
  } catch (err) {
    console.log('getUserMedia error: ', err);
  }
}

//胜利逻辑函数
function winLogicFunc(who) {
  if (who == 'thief' || who == 'police') {
    clearInterval(interval);
    song.play();
    whoWin = who
    noLoop();
    (who === 'thief' ? thiefWinGifNode : policeWinGifNode).style.visibility = 'visible';
  }
}
//开始游戏事件
startBtn.addEventListener('click', () => {
  getVoiceSize()
  startBtn.disabled = true;
  let dir = stepLen;
  // policeDir = Math.floor(voiceSize * 100) / 10 * policeStepLen;
  //小偷、警察运动循环体
  interval = setInterval(() => {
    policeDir = Math.floor(voiceSize * 100) / 10 * policeStepLen
    thiefXPos += dir;
    policeXPos += policeDir;
    //小偷的改变方向逻辑
    if (thiefXPos >= (col + 1) * gridW) {
      thiefXPos = (col + 1) * gridW - stepLen
      dir = -stepLen
      thiefYPos += gridH
    } else if (thiefXPos < 0) {
      thiefXPos = -stepLen
      dir = stepLen
      thiefYPos += gridH
    }
    //警察的改变方向逻辑
    if (policeXPos >= (col + 1) * gridW) {
      policeXPos = (col + 1) * gridW - stepLen
      policeStepLen = -policeStepLen
      policeYPos += gridH
    } else if (policeXPos < 0) {
      policeXPos = 1
      policeStepLen = -policeStepLen
      policeYPos += gridH
    }
    //贼胜利逻辑
    if (thiefYPos >= row * gridH) {
      winLogicFunc('thief')
    }
    //警察胜利逻辑
    if (policeYPos === thiefYPos && (policeStepLen > 0 && policeXPos >= thiefXPos || policeStepLen < 0 && Math.abs(policeXPos) <= thiefXPos)) {
      winLogicFunc('police')
    }
  }, moveTime);
});

//重新开始游戏
restartBtn.addEventListener('click', () => {
  thiefWinGifNode.style.visibility = 'hidden';
  policeWinGifNode.style.visibility = 'hidden';
  startBtn.disabled = false;
  // 重新开始游戏
  clearInterval(interval);
  thiefXPos = 40;
  thiefYPos = 0;
  policeXPos = 0;
  policeYPos = 0;
  whoWin = '';
  loop();
});
