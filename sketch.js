// ==========================================
// 心情播放室 - 專輯卡片 + YouTube 直連版 (最新網址更新版)
// ==========================================

let gameState = 0; // 0: 封面, 1: 顏色關卡, 2: 事件關卡, 3: 黑膠播放室
let selectedColor = null;
let selectedCategory = '';

let rocketObj = { x: 0, y: 0, r: 35, hovering: false };
let stars = [];
let paletteColors = [];
let categoryButtons = [];
let vinylAngle = 0;

let currentTip = '';
let tipsList = [
  "做三次 4-7-8 深呼吸：吸氣 4 秒、憋氣 7 秒、吐氣 8 秒...",
  "看看身邊，試著在房間裡找出 3 項與你剛剛選擇相似顏色的物品。",
  "輕輕閉上眼睛，感受聲音微弱的震動，讓肩膀放鬆掉下來。",
  "將手放在腹部，感受每次呼吸時起伏的平穩與安全感。",
  "你現在做得很好，允許自己在這裡安靜地休息 5 分鐘。"
];
let tipTimer = 0;

// 流行歌曲資料庫：全數更新為您提供的 YouTube 官方影片網址
const popSongDatabase = {
  "火焰暖紅": {
    title: "告五人 - 披星戴月的想你",
    coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80",
    ytUrl: "https://youtu.be/zMDj2YvzeAQ?si=Ekqgs0GHlrQkSg1C"
  },
  "靜謐海洋藍": {
    title: "魏如萱 - 彼個所在",
    coverUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=300&q=80",
    ytUrl: "https://youtu.be/5hswJh6FQjU?si=BeLjMOLKMFWGBZLx"
  },
  "溫馨微光黃": {
    title: "盧廣仲 - 刻在我心底的名字",
    coverUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80",
    ytUrl: "https://youtu.be/2sX45Oyd1n0?si=r0l6Qp_pLanXUP2f"
  },
  "森林療癒綠": {
    title: "理想混蛋 - 行星",
    coverUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=300&q=80",
    ytUrl: "https://www.youtube.com/watch?v=MzcKSDN6KCo&list=RDMzcKSDN6KCo&start_radio=1"
  },
  "夢幻晨曦紫": {
    title: "楊乃文 - 推開世界的門",
    coverUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80",
    ytUrl: "https://youtu.be/dy0ZLb6JsJU?si=oULx_ugakX71ZSJX"
  },
  "大地沉穩棕": {
    title: "告五人 - 帶我去找夜生活",
    coverUrl: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=300&q=80",
    ytUrl: "https://youtu.be/TnUwZde8i60?si=bI2IXS-ZGSXsTNjG"
  }
};

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);

  initSceneElements();
  currentTip = tipsList[0];
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  initSceneElements();
}

function initSceneElements() {
  stars = [];
  for (let i = 0; i < 140; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3.5),
      alpha: random(100, 255),
      speed: random(0.015, 0.04)
    });
  }

  paletteColors = [];
  let colorsData = [
    { name: "火焰暖紅", rgb: [235, 94, 85], desc: "熱烈、焦慮不安" },
    { name: "靜謐海洋藍", rgb: [74, 144, 226], desc: "沉靜、有些低落" },
    { name: "溫馨微光黃", rgb: [247, 202, 201], desc: "柔軟、微小期待" },
    { name: "森林療癒綠", rgb: [107, 191, 89], desc: "平靜、尋求呼吸" },
    { name: "夢幻晨曦紫", rgb: [155, 126, 189], desc: "迷茫、心思細膩" },
    { name: "大地沉穩棕", rgb: [181, 131, 90], desc: "疲憊、想被包裹" }
  ];

  let pRadius = min(width, height) * 0.18;
  for (let i = 0; i < colorsData.length; i++) {
    let angle = map(i, 0, colorsData.length, 0, TWO_PI);
    let cx = width / 2 + cos(angle) * pRadius;
    let cy = height * 0.48 + sin(angle) * pRadius;
    paletteColors.push({
      x: cx,
      y: cy,
      r: min(width, height) * 0.035,
      data: colorsData[i]
    });
  }

  categoryButtons = [];
  let categories = ["關於學業", "關於人際", "關於家庭", "關於愛情", "關於未來方向", "純粹累了"];
  let btnW = min(width * 0.35, 180);
  let btnH = min(height * 0.07, 48);
  for (let i = 0; i < categories.length; i++) {
    let row = floor(i / 2);
    let col = i % 2;
    let bx = width / 2 + (col === 0 ? -btnW * 0.6 : btnW * 0.6);
    let by = height * 0.42 + row * (btnH * 1.3);
    categoryButtons.push({
      x: bx,
      y: by,
      w: btnW,
      h: btnH,
      text: categories[i]
    });
  }

  rocketObj.x = width - min(width * 0.08, 80);
  rocketObj.y = height - min(height * 0.1, 80);
  rocketObj.r = min(width, height) * 0.04;
}

function draw() {
  background(13, 27, 42);

  drawStars();

  if (gameState === 0) {
    drawCover();
    hidePlayer();
  } else if (gameState === 1) {
    drawColorStage();
    hidePlayer();
  } else if (gameState === 2) {
    drawCategoryStage();
    hidePlayer();
  } else if (gameState === 3) {
    drawVinylStage();
  }

  if (gameState < 3) {
    drawRocketButton();
  }
}

function drawStars() {
  noStroke();
  for (let s of stars) {
    s.alpha += sin(frameCount * s.speed) * 2.5;
    fill(255, 255, 220, constrain(s.alpha, 40, 255));
    ellipse(s.x, s.y, s.size);
  }
}

function drawCover() {
  let titleSize = min(width * 0.05, 38);
  let subSize = min(width * 0.022, 17);

  fill(255, 248, 220);
  textSize(titleSize);
  textStyle(BOLD);
  text("心情播放室", width / 2, height * 0.12);

  textSize(subSize);
  fill(210, 225, 245);
  textStyle(NORMAL);
  text("「嗨～歡迎來到心情播放室，今天想點播什麼樣的心情呢？」", width / 2, height * 0.20);

  textSize(subSize * 0.9);
  fill(170, 205, 235);
  text("如果你準備好了，請按一下右下角火箭，開始你的探索旅程。", width / 2, height * 0.26);

  push();
  let moonY = height * 0.72;
  let moonR = min(width, height) * 0.42;
  translate(width / 2, moonY);

  fill(235, 225, 200);
  stroke(200, 190, 165);
  strokeWeight(3);
  ellipse(0, 0, moonR, moonR);

  fill(215, 205, 180, 180);
  noStroke();
  ellipse(-moonR * 0.3, -moonR * 0.2, moonR * 0.12, moonR * 0.07);
  ellipse(moonR * 0.32, -moonR * 0.18, moonR * 0.1, moonR * 0.06);

  let benchScale = moonR / 380;
  scale(benchScale);

  stroke(90, 60, 40);
  strokeWeight(4);
  line(-100, -130, 100, -130);
  line(-100, -110, 100, -110);
  line(-80, -110, -80, -70);
  line(80, -110, 80, -70);

  // 男孩
  push();
  translate(-45, -145);
  noStroke();
  fill(100, 140, 180);
  rect(-14, 10, 28, 30, 8);
  fill(255, 220, 190);
  ellipse(0, -10, 26, 26);
  fill(60, 45, 35);
  arc(0, -12, 28, 22, PI, TWO_PI);
  stroke(220);
  strokeWeight(3);
  noFill();
  arc(0, -12, 30, 28, PI + 0.2, TWO_PI - 0.2);
  fill(220, 80, 80);
  noStroke();
  ellipse(-14, -10, 8, 12);
  ellipse(14, -10, 8, 12);
  pop();

  // 女孩
  push();
  translate(45, -145);
  noStroke();
  fill(235, 140, 160);
  rect(-14, 10, 28, 30, 8);
  fill(255, 220, 190);
  ellipse(0, -10, 26, 26);
  fill(120, 70, 40);
  ellipse(-10, -2, 10, 24);
  ellipse(10, -2, 10, 24);
  arc(0, -12, 28, 22, PI, TWO_PI);
  stroke(220);
  strokeWeight(3);
  noFill();
  arc(0, -12, 30, 28, PI + 0.2, TWO_PI - 0.2);
  fill(240, 200, 80);
  noStroke();
  ellipse(-14, -10, 8, 12);
  ellipse(14, -10, 8, 12);
  pop();

  fill(255, 240, 180, 200);
  textSize(16);
  text("♪", -20, -190 + sin(frameCount * 0.05) * 5);
  text("♫", 20, -200 + cos(frameCount * 0.05) * 5);

  pop();
}

function drawColorStage() {
  fill(255, 248, 220);
  textSize(min(width * 0.035, 24));
  textStyle(BOLD);
  text("選出此時此刻最貼近你內心顏色的氣氛", width / 2, height * 0.12);

  push();
  translate(width / 2, height * 0.48);
  fill(255, 255, 255, 235);
  stroke(220, 220, 230);
  strokeWeight(3);
  ellipse(0, 0, min(width, height) * 0.48);
  pop();

  for (let p of paletteColors) {
    let d = dist(mouseX, mouseY, p.x, p.y);
    let isHover = d < p.r;

    stroke(255);
    strokeWeight(isHover || selectedColor === p.data ? 4 : 2);
    fill(p.data.rgb[0], p.data.rgb[1], p.data.rgb[2]);
    ellipse(p.x, p.y, p.r * 2 * (isHover ? 1.12 : 1.0));

    if (selectedColor === p.data) {
      noFill();
      stroke(255, 215, 0);
      strokeWeight(3);
      ellipse(p.x, p.y, p.r * 2.4);
    }
  }

  if (selectedColor) {
    fill(selectedColor.rgb[0], selectedColor.rgb[1], selectedColor.rgb[2]);
    textSize(min(width * 0.03, 20));
    text(`【${selectedColor.name}】 - ${selectedColor.desc}`, width / 2, height * 0.80);
    fill(200);
    textSize(min(width * 0.022, 14));
    text("選擇完成後，請點擊右下角火箭進入下一關 ➔", width / 2, height * 0.86);
  } else {
    fill(180);
    textSize(min(width * 0.024, 15));
    text("請點選上面調色盤中的一種顏色", width / 2, height * 0.80);
  }
}

function drawCategoryStage() {
  fill(255, 248, 220);
  textSize(min(width * 0.035, 24));
  textStyle(BOLD);
  text("這份心情，主要來自於今天發生的什麼事？", width / 2, height * 0.15);

  for (let btn of categoryButtons) {
    let isHover = mouseX > btn.x - btn.w/2 && mouseX < btn.x + btn.w/2 &&
                  mouseY > btn.y - btn.h/2 && mouseY < btn.y + btn.h/2;

    stroke(selectedCategory === btn.text ? color(255, 215, 0) : color(200, 215, 230));
    strokeWeight(selectedCategory === btn.text ? 3 : 1.5);
    fill(isHover ? color(255, 255, 255, 45) : color(255, 255, 255, 20));
    rectMode(CENTER);
    rect(btn.x, btn.y, btn.w, btn.h, 15);

    noStroke();
    fill(selectedCategory === btn.text ? color(255, 248, 220) : color(220));
    textSize(min(width * 0.025, 17));
    text(btn.text, btn.x, btn.y);
  }

  if (selectedCategory !== '') {
    fill(200);
    textSize(min(width * 0.022, 14));
    text(`已選擇：${selectedCategory}。請點擊右下角火箭生成屬於你的播放室 ➔`, width / 2, height * 0.84);
  }
}

function drawVinylStage() {
  let mainColor = selectedColor ? selectedColor.rgb : [240, 240, 240];
  let vinylR = min(width, height) * 0.22;

  // 1. 旋轉黑膠唱片
  push();
  translate(width / 2, height * 0.22);
  rotate(vinylAngle);
  vinylAngle += 0.015;

  stroke(40);
  strokeWeight(2);
  fill(15);
  ellipse(0, 0, vinylR, vinylR);

  noFill();
  stroke(35);
  strokeWeight(1);
  ellipse(0, 0, vinylR * 0.88, vinylR * 0.88);
  ellipse(0, 0, vinylR * 0.72, vinylR * 0.72);

  fill(mainColor[0], mainColor[1], mainColor[2]);
  noStroke();
  ellipse(0, 0, vinylR * 0.35, vinylR * 0.35);

  fill(13, 27, 42);
  ellipse(0, 0, vinylR * 0.06, vinylR * 0.06);
  pop();

  // 顯示質感音樂卡片
  showPlayer();

  // 2. 定期輪播放鬆建議
  if (millis() - tipTimer > 6000) {
    let nextIndex = (tipsList.indexOf(currentTip) + 1) % tipsList.length;
    currentTip = tipsList[nextIndex];
    tipTimer = millis();
  }

  push();
  translate(width / 2, height * 0.80);
  fill(255, 255, 255, 25);
  stroke(mainColor[0], mainColor[1], mainColor[2], 180);
  strokeWeight(2);
  rectMode(CENTER);
  let boxW = min(width * 0.85, 520);
  let boxH = min(height * 0.11, 65);
  rect(0, 0, boxW, boxH, 18);

  noStroke();
  fill(255, 250, 235);
  textSize(min(width * 0.024, 15));
  textStyle(NORMAL);
  text(currentTip, 0, 0);
  pop();

  fill(180);
  textSize(min(width * 0.02, 13));
  text("點擊這裡重新開始探索 ↺", width / 2, height * 0.93);
}

function showPlayer() {
  let container = document.getElementById('player-container');
  if (container.style.display !== 'block') {
    let colorName = selectedColor ? selectedColor.name : "火焰暖紅";
    let songInfo = popSongDatabase[colorName] || popSongDatabase["火焰暖紅"];

    container.innerHTML = `
      <div class="card-content">
        <img class="album-cover" src="${songInfo.coverUrl}" alt="Album Cover">
        <div class="song-title">情緒解藥：《${songInfo.title}》</div>
        <a class="yt-play-btn" href="${songInfo.ytUrl}" target="_blank">
          <svg class="yt-icon" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          前往 YouTube 播放音樂
        </a>
      </div>
    `;
    container.style.display = 'block';
  }
}

function hidePlayer() {
  let container = document.getElementById('player-container');
  if (container) {
    container.style.display = 'none';
    container.innerHTML = '';
  }
}

function drawRocketButton() {
  let d = dist(mouseX, mouseY, rocketObj.x, rocketObj.y);
  rocketObj.hovering = d < rocketObj.r;

  push();
  translate(rocketObj.x, rocketObj.y);
  if (rocketObj.hovering) scale(1.18);

  noStroke();
  fill(255, 215, 0, rocketObj.hovering ? 120 : 40);
  ellipse(0, 0, rocketObj.r * 2.2, rocketObj.r * 2.2);

  rotate(-PI / 6);

  fill(255, 120, 50, 220);
  triangle(-6, 18, 6, 18, 0, 28 + sin(frameCount * 0.2) * 4);

  fill(240, 240, 245);
  stroke(180);
  strokeWeight(1.5);
  rectMode(CENTER);
  rect(0, 2, 16, 26, 4);

  fill(235, 80, 80);
  noStroke();
  triangle(-8, -11, 8, -11, 0, -22);

  triangle(-8, 5, -14, 16, -8, 16);
  triangle(8, 5, 14, 16, 8, 16);

  fill(100, 180, 240);
  stroke(255);
  strokeWeight(1.5);
  ellipse(0, -2, 8, 8);

  pop();
}

function mousePressed() {
  if (gameState === 3) {
    if (mouseY > height * 0.88) {
      gameState = 0;
      selectedColor = null;
      selectedCategory = '';
      hidePlayer();
    }
    return;
  }

  if (rocketObj.hovering) {
    if (gameState === 1 && !selectedColor) {
      alert("請先點選一個符合此刻心情的顏色喔！");
      return;
    }
    if (gameState === 2 && selectedCategory === '') {
      alert("請先選擇一個生活類別喔！");
      return;
    }
    gameState++;
    return;
  }

  if (gameState === 1) {
    for (let p of paletteColors) {
      if (dist(mouseX, mouseY, p.x, p.y) < p.r) {
        selectedColor = p.data;
        break;
      }
    }
  }

  if (gameState === 2) {
    for (let btn of categoryButtons) {
      if (mouseX > btn.x - btn.w/2 && mouseX < btn.x + btn.w/2 &&
          mouseY > btn.y - btn.h/2 && mouseY < btn.y + btn.h/2) {
        selectedCategory = btn.text;
        break;
      }
    }
  }
}