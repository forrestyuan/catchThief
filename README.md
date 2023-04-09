# catchThief 警察抓小偷游戏，喊得越大声，抓的越快

speak louderly to push the police move fast to catch the thief as quickly as possible

之前一直用原生canvas写小游戏，很多逻辑都需要自己一点点封装，最近看了下p5.js，哇哦，好的很嘞！就用它开发了一款名为“**警察抓小偷**”的游戏。这是一款非常有趣的游戏，玩家扮演警察追捕小偷，通过大声喊话来控制警察的速度，抓住小偷。游戏中，小偷会在棋盘上移动，而警察则会向小偷靠近。如果警察追上小偷，就算警察胜利；如果小偷逃脱到棋盘的最下方，那么小偷胜利。老少皆宜哦😀。

## 用到的JS库

`p5.js` 库基于 Processing，是一个 JavaScript 库，可以轻松地创建交互式图形和动态图像。它的核心是使用 HTML5 Canvas 元素来创建图形。p5.js 提供了简单易用的 API，让编写和理解代码变得更加容易。

`p5.sound.min.js` 是 p5.js 库的音频处理插件，它基于 Web Audio API，可以加载、播放和操纵音频文件。Web Audio API 是 HTML5 中的一项标准，提供了低延迟、高品质的音频处理能力，可以通过 JavaScript 对音频进行混合、变形、过滤等操作。

## 游戏运行效果

![效果图1](https://raw.githubusercontent.com/forrestyuan/catchThief/main/demoGif/grapRuningDemo.gif)

![效果图2](https://raw.githubusercontent.com/forrestyuan/catchThief/main/demoGif/policeWinDemo.gif)

![效果图3](https://raw.githubusercontent.com/forrestyuan/catchThief/main/demoGif/thiefWinDemo.gif)

## 游戏开发思路

1. 设计游戏规则和界面
2. 使用p5.js绘制游戏界面和元素
3. 实现小偷和警察的移动逻辑
4. 实现通过音量控制警察的速度
5. 实现胜利逻辑和动画效果
6. 添加开始游戏和重新开始的按钮
7. 预加载音乐和图片资源
