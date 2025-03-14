// 这个脚本创建两个大型球形光晕，放置在床位位置下方
// 将此代码添加到您的crowd.js文件底部或单独的文件中

// 跟踪床位光晕元素
let leftBedGlow = null;
let rightBedGlow = null;

// 初始创建床位光晕
function createBedGlows() {
  // 等待游戏画布加载
  setTimeout(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      setTimeout(createBedGlows, 500);
      return;
    }

    const canvasRect = canvas.getBoundingClientRect();
    const gameStart = canvasRect.left;
    const gameLength = canvasRect.right - gameStart;
    const pixelSize = gameLength / 40;
    const gameY = canvasRect.top;
    
    // 计算光晕大小 (16个像素的半径)
    const glowRadius = pixelSize * 16;

    // 移除已存在的光晕（如果有）
    if (leftBedGlow) leftBedGlow.remove();
    if (rightBedGlow) rightBedGlow.remove();

    // 创建左侧床位光晕（位置0）
    leftBedGlow = document.createElement('div');
    leftBedGlow.className = 'bed-glow left-bed';
    leftBedGlow.style.left = `${gameStart + (pixelSize/2) - glowRadius}px`;
    leftBedGlow.style.top = `${gameY + (pixelSize/2) - glowRadius}px`;
    leftBedGlow.style.width = `${glowRadius * 2}px`;
    leftBedGlow.style.height = `${glowRadius * 2}px`;
    document.body.appendChild(leftBedGlow);

    // 创建右侧床位光晕（位置49）
    rightBedGlow = document.createElement('div');
    rightBedGlow.className = 'bed-glow right-bed';
    rightBedGlow.style.left = `${gameStart + 39 * pixelSize + (pixelSize/2) - glowRadius}px`;
    rightBedGlow.style.top = `${gameY + (pixelSize/2) - glowRadius}px`;
    rightBedGlow.style.width = `${glowRadius * 2}px`;
    rightBedGlow.style.height = `${glowRadius * 2}px`;
    document.body.appendChild(rightBedGlow);

    // 开始监控床位状态
    startBedGlowMonitoring();
  }, 500);
}

// NEW 3.12: 监控床位状态并更新光晕可见性
// 修改为同时检查游戏状态，在结算画面中不显示光晕
function startBedGlowMonitoring() {
  setInterval(() => {
    try {
      if (typeof playerOne !== 'undefined' && 
          typeof playerTwo !== 'undefined' && 
          typeof controller !== 'undefined') {
        
        // NEW 3.12: 检查游戏是否处于结算状态
        const isScoreState = controller.gameState === "SCORE";
        
        // 更新左侧床位光晕可见性
        // NEW 3.12: 只有在非结算状态且床位存在时才显示
        if (leftBedGlow) {
          leftBedGlow.style.display = (playerOne.bed && !isScoreState) ? 'block' : 'none';
        }
        
        // 更新右侧床位光晕可见性
        // NEW 3.12: 只有在非结算状态且床位存在时才显示
        if (rightBedGlow) {
          rightBedGlow.style.display = (playerTwo.bed && !isScoreState) ? 'block' : 'none';
        }
      }
    } catch (error) {
      console.log("Error updating bed glows:", error);
    }
  }, 100);
}

// 初始化床位光晕
document.addEventListener("DOMContentLoaded", function() {
  // 添加CSS样式
  const style = document.createElement('style');
  style.textContent = `
    .bed-glow {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      z-index: -1; /* 位于游戏边框下方 */
      filter: blur(15px); /* 增加模糊效果 */
      animation: bedGlowPulse 2s infinite;
    }
    
    .left-bed {
      background: radial-gradient(circle, 
        rgba(255,50,50,1) 0%, 
        rgba(255,0,0,0.95) 5%, 
        rgba(255,0,0,0.8) 10%, 
        rgba(255,0,0,0.6) 20%, 
        rgba(255,0,0,0.3) 40%, 
        rgba(255,0,0,0.1) 70%, 
        rgba(255,0,0,0.02) 90%, 
        rgba(255,0,0,0) 100%);
    }
    
    .right-bed {
      background: radial-gradient(circle, 
        rgba(50,50,255,1) 0%, 
        rgba(0,0,255,0.95) 5%,
        rgba(0,0,255,0.8) 10%,
        rgba(0,0,255,0.6) 20%,
        rgba(0,0,255,0.3) 40%,
        rgba(0,0,255,0.1) 70%,
        rgba(0,0,255,0.02) 90%,
        rgba(0,0,255,0) 100%);
    }
    
    @keyframes bedGlowPulse {
      0% { transform: scale(0.9); opacity: 0.8; filter: blur(12px); }
      50% { transform: scale(1.1); opacity: 1; filter: blur(18px); }
      100% { transform: scale(0.9); opacity: 0.8; filter: blur(12px); }
    }
  `;
  document.head.appendChild(style);
  
  // 创建床位光晕
  createBedGlows();
});

// 处理窗口大小变化
window.addEventListener('resize', createBedGlows);