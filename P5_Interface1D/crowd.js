// NEW: Create crowd pixel effect for the 1D game background
// This script simulates an audience by creating blinking "pixels"
// Pixels change color based on player positions and bed status

// Global variables to track player positions and bed status
let playerOnePosition = 0;
let playerTwoPosition = 49;
let playerOneBed = true;  // Track if player one still has bed
let playerTwoBed = true;  // Track if player two still has bed
let colorUpdateInterval;

// Execute when DOM is fully loaded
document.addEventListener("DOMContentLoaded", function() {
  createCrowdPixels();
  
  // Start monitoring for player position changes
  startPlayerPositionMonitoring();
});

/**
 * NEW: Monitor player positions and bed status
 */
function startPlayerPositionMonitoring() {
  // Initial update - force an update immediately when page loads
  setTimeout(() => {
    try {
      if (typeof playerOne !== 'undefined' && typeof playerTwo !== 'undefined') {
        playerOnePosition = playerOne.position || 0;
        playerTwoPosition = playerTwo.position || 49;
        playerOneBed = playerOne.bed !== false; // Default to true if not explicitly false
        playerTwoBed = playerTwo.bed !== false; // Default to true if not explicitly false
        
        // Force an initial color update
        updateCrowdColors();
      }
    } catch (error) {
      console.log("Error during initial color update:", error);
    }
  }, 500); // Wait a bit to ensure game is initialized
  
  // Regular check for position and bed status changes
  colorUpdateInterval = setInterval(() => {
    // Try to find player data from the global variables in the game
    try {
      // Check if the global playerOne and playerTwo objects exist
      if (typeof playerOne !== 'undefined' && typeof playerTwo !== 'undefined') {
        // Check if any data has changed
        if (playerOnePosition !== playerOne.position || 
            playerTwoPosition !== playerTwo.position ||
            playerOneBed !== playerOne.bed ||
            playerTwoBed !== playerTwo.bed) {
          
          // Update our tracking variables
          playerOnePosition = playerOne.position;
          playerTwoPosition = playerTwo.position;
          playerOneBed = playerOne.bed;
          playerTwoBed = playerTwo.bed;
          
          // Update crowd colors based on new data
          updateCrowdColors();
        }
      }
    } catch (error) {
      console.log("Error accessing player data:", error);
    }
  }, 100);
}

/**
 * NEW: Apply color to a pixel based on player positions and bed status
 */
function applyPixelColor(pixel, pixelX, baseOpacity, playerOneX, playerTwoX, playerOnePos, playerTwoPos, p1HasBed, p2HasBed) {
  // Default color is black (for no influence)
  let red = 0;
  let green = 0;
  let blue = 0;
  
  // Determine which side of the field this pixel is on
  const canvas = document.querySelector('canvas');
  if (!canvas) return;
  
  const canvasRect = canvas.getBoundingClientRect();
  const gameMiddleX = canvasRect.left + (canvasRect.right - canvasRect.left) / 2;
  
  // Calculate distances from starting positions
  const playerOneDistFromStart = playerOnePos / 49; // 0 to 1
  const playerTwoDistFromStart = (49 - playerTwoPos) / 49; // 0 to 1
  
  // Player One (red) influence - only applies if they still have their bed
  if (p1HasBed && pixelX <= playerOneX) {
    // More red as player moves right
    red = 255;
    green = Math.max(175 - (playerOneDistFromStart * 120), 55);
    blue = Math.max(175 - (playerOneDistFromStart * 120), 55);
  }
  
  // Player Two (blue) influence - only applies if they still have their bed
  if (p2HasBed && pixelX >= playerTwoX) {
    // More blue as player moves left
    red = Math.max(175 - (playerTwoDistFromStart * 120), 55);
    green = Math.max(175 - (playerTwoDistFromStart * 120), 55);
    blue = 255;
  }
  
  // Handle the case where both players influence the same pixel (purple blend)
  // Only applies if both players have their beds
  if (p1HasBed && p2HasBed && pixelX <= playerOneX && pixelX >= playerTwoX) {
    red = 255;
    green = Math.max(175 - ((playerOneDistFromStart + playerTwoDistFromStart) * 120), 55);
    blue = 255;
  }
  
  // Update pixel color while preserving its opacity
  pixel.style.backgroundColor = `rgba(${red}, ${green}, ${blue}, ${baseOpacity})`;
}

/**
 * NEW: Update crowd pixel colors based on player positions and bed status
 */
function updateCrowdColors() {
  const pixels = document.querySelectorAll('.crowd-pixel');
  
  // Get the game canvas to calculate screen positions
  const canvas = document.querySelector('canvas');
  if (!canvas) return;
  
  const canvasRect = canvas.getBoundingClientRect();
  const gameStart = canvasRect.left;
  const gameLength = canvasRect.right - gameStart;
  const pixelSize = gameLength / 50;
  
  // Calculate player positions in screen coordinates
  const playerOneX = gameStart + (playerOnePosition * pixelSize);
  const playerTwoX = gameStart + (playerTwoPosition * pixelSize);
  
  // Calculate color influence
  pixels.forEach(pixel => {
    const pixelX = parseInt(pixel.style.left);
    const currentOpacity = pixel.style.getPropertyValue('--base-opacity') || 0.8;
    
    // Apply color using shared function - pass bed status
    applyPixelColor(
      pixel, 
      pixelX, 
      currentOpacity, 
      playerOneX, 
      playerTwoX,
      playerOnePosition,
      playerTwoPosition,
      playerOneBed,  // Player one bed status
      playerTwoBed   // Player two bed status
    );
  });
}

/**
 * NEW: Creates all crowd pixels that simulate the audience
 */
function createCrowdPixels() {
  // Wait a small amount of time to ensure the canvas is created
  setTimeout(() => {
    const body = document.body;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // Make sure the canvas exists before creating pixels
    const canvas = document.querySelector('canvas');
    if (!canvas) {
      console.log("Canvas not found, retrying in 500ms");
      setTimeout(createCrowdPixels, 500);
      return;
    }
    
    // Calculate appropriate number of pixels
    const pixelCount = Math.floor((windowWidth * windowHeight) / 6800);
    
    // Create all crowd pixels
    for (let i = 0; i < pixelCount; i++) {
      createPixel(body, windowWidth, windowHeight);
    }
  }, 100);
}

/**
 * NEW: Creates a single crowd pixel and adds it to the DOM
 * 
 * @param {Element} parent - The parent element to append pixels to
 * @param {number} maxWidth - Maximum width of the viewport
 * @param {number} maxHeight - Maximum height of the viewport
 */
function createPixel(parent, maxWidth, maxHeight) {
  const pixel = document.createElement('div');
  pixel.className = 'crowd-pixel';
  
  // Get the game canvas dimensions and position
  const canvas = document.querySelector('canvas');
  if (!canvas) return; // Safety check
  
  const canvasRect = canvas.getBoundingClientRect();
  const gameStart = canvasRect.left;
  const gameEnd = canvasRect.right;
  const gameLength = gameEnd - gameStart;
  const gameY = canvasRect.top + canvasRect.height / 2;
  const gameHeight = canvasRect.height;
  
  // Calculate the positions that correspond to all 50 game positions
  const pixelSize = gameLength / 50; // 50 is the display size from your code
  
  // Calculate bed positions
  const bedPositionLeftX = gameStart; // Position 0
  const bedPositionLeftY = gameY;
  const bedPositionRightX = gameStart + 49 * pixelSize; // Position 49
  const bedPositionRightY = gameY;
  
  // Determine position distribution type
  let x, y;
  
  if (Math.random() < 0.85) {
    // 85% of pixels are distributed based on circular distance from beds
    
    // Choose which bed to base this pixel on
    const usesLeftBed = Math.random() < 0.5;
    const baseBedX = usesLeftBed ? bedPositionLeftX : bedPositionRightX;
    const baseBedY = bedPositionLeftY; // Both beds are at the same Y position
    
    // Generate a random angle (full 360 degrees)
    const angle = Math.random() * Math.PI * 2;
    
    // Generate a distance from the bed with concentration on near-mid range
    let distance;
    
    if (Math.random() < 0.4) {
      // 40% close to beds
      const maxRadiusClose = Math.max(maxWidth, maxHeight) * 0.15;
      distance = Math.pow(Math.random(), 1.3) * maxRadiusClose;
    } else if (Math.random() < 0.85) {
      // 45% in near-mid range
      const maxRadiusMid = Math.max(maxWidth, maxHeight) * 0.3;
      distance = maxRadiusMid * 0.15 + Math.random() * maxRadiusMid * 0.85;
    } else {
      // Only 15% in far range 
      const maxRadiusFar = Math.max(maxWidth, maxHeight) * 0.5;
      distance = maxRadiusFar * 0.3 + Math.random() * maxRadiusFar * 0.3;
    }
    
    // Calculate position based on polar coordinates
    x = baseBedX + Math.cos(angle) * distance;
    y = baseBedY + Math.sin(angle) * distance;
  } else {
    // Only 15% of pixels are randomly distributed across the screen
    if (Math.random() < 0.8) {
      // 80% in the near-mid section of the screen
      const midStart = gameStart + gameLength * 0.15;
      const midWidth = gameLength * 0.7;
      x = midStart + Math.random() * midWidth;
      y = gameY + (Math.random() - 0.5) * maxHeight * 0.6;
    } else {
      // Only 20% truly random across screen
      x = Math.random() * maxWidth;
      y = Math.random() * maxHeight;
    }
  }
  
  // Ensure within bounds
  if (x < 0) x = 0;
  if (x > maxWidth) x = maxWidth;
  if (y < 0) y = 0;
  if (y > maxHeight) y = maxHeight;
  
  // Set position
  pixel.style.left = `${x}px`;
  pixel.style.top = `${y}px`;
  
  // Calculate direct line distance to both beds
  const distanceToLeftBed = Math.sqrt(
    Math.pow(x - bedPositionLeftX, 2) + 
    Math.pow(y - bedPositionLeftY, 2)
  );
  
  const distanceToRightBed = Math.sqrt(
    Math.pow(x - bedPositionRightX, 2) + 
    Math.pow(y - bedPositionRightY, 2)
  );
  
  // Take the minimum distance (closest bed)
  const closestBedDistance = Math.min(distanceToLeftBed, distanceToRightBed);
  
  // Normalize the distance based on screen dimensions for consistent scaling
  const gameDiagonal = Math.sqrt(Math.pow(gameLength, 2) + Math.pow(canvasRect.height, 2));
  const normalizedDistance = Math.min(closestBedDistance / (gameDiagonal * 0.75), 1);
  
  // Modified opacity distribution to emphasize near-mid range
  let baseOpacity;
  
  if (normalizedDistance < 0.2) {
    // Very close to beds - moderate to high opacity
    baseOpacity = 0.85 - Math.random() * 0.15;
  } else if (normalizedDistance < 0.4) {
    // Near-mid distance - highest opacity to emphasize this region
    baseOpacity = 0.9 - Math.random() * 0.1;
  } else if (normalizedDistance < 0.6) {
    // Mid distance - still fairly bright
    baseOpacity = 0.75 - Math.random() * 0.2;
  } else {
    // Far distance - significantly reduced opacity
    baseOpacity = 0.5 - Math.random() * 0.25;
  }
  
  // Add slight randomness
  baseOpacity = baseOpacity * (0.95 + Math.random() * 0.05);
  
  // Store opacity as a custom property for later use in color updates
  pixel.style.setProperty('--base-opacity', baseOpacity);
  
  // Get initial player positions and bed status
  let initialPlayerOnePos = 0;
  let initialPlayerTwoPos = 49;
  let initialP1HasBed = true;
  let initialP2HasBed = true;
  
  try {
    // Try to get player data from game
    if (typeof playerOne !== 'undefined' && typeof playerTwo !== 'undefined') {
      initialPlayerOnePos = playerOne.position || 0;
      initialPlayerTwoPos = playerTwo.position || 49;
      initialP1HasBed = playerOne.bed !== false;
      initialP2HasBed = playerTwo.bed !== false;
    }
  } catch (e) {
    console.log("Using default player data");
  }
  
  // Calculate initial player screen coordinates
  const playerOneScreenX = gameStart + (initialPlayerOnePos * pixelSize);
  const playerTwoScreenX = gameStart + (initialPlayerTwoPos * pixelSize);
  
  // Apply initial color based on player positions and bed status
  applyPixelColor(
    pixel, 
    x, 
    baseOpacity, 
    playerOneScreenX, 
    playerTwoScreenX,
    initialPlayerOnePos,
    initialPlayerTwoPos,
    initialP1HasBed,
    initialP2HasBed
  );
  
  // Set animation for blinking
  const animations = ['blink1', 'blink2', 'blink3'];
  const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
  
  pixel.style.animation = `${randomAnimation} 1000ms infinite`;
  pixel.style.animationDelay = `${Math.random() * 1000}ms`;
  
  // Add to document
  parent.appendChild(pixel);
}

// Handle window resize
window.addEventListener('resize', function() {
  // Remove existing pixels
  const existingPixels = document.querySelectorAll('.crowd-pixel');
  existingPixels.forEach(pixel => pixel.remove());
  
  // Create new pixels
  createCrowdPixels();
});

// NEW 3.12: Victory celebration functions to add to crowd.js
// These will be called directly from Controller.js when a player wins

/**
 * NEW 3.12: Create victory celebration effect when a player wins
 * This function is called from Controller.js when the game enters SCORE state
 * @param {string} winnerColor - CSS color string representing the winner
 */
function createVictoryCelebration(winnerColor) {
  // Parse the winner color into RGB components
  let r, g, b;
  
  // Check if the color is player one (red) or player two (blue)
  if (winnerColor.levels && winnerColor.levels[0] > 150 && winnerColor.levels[2] < 100) {
    // Player one (red) wins
    r = 255;
    g = 50;
    b = 50;
  } else {
    // Player two (blue) wins
    r = 50;
    g = 50;
    b = 255;
  }
  
  // Get all existing crowd pixels
  const pixels = document.querySelectorAll('.crowd-pixel:not(.victory-pixel)');
  
  // Make them all visible and update color to winner's color
  pixels.forEach(pixel => {
    // Make pixel visible (in case it was hidden due to lost bed)
    pixel.style.display = 'block';
    
    // Keep current opacity, but change color to winner's color
    const baseOpacity = pixel.style.getPropertyValue('--base-opacity') || 0.8;
    pixel.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${baseOpacity})`;
    
    // IMPORTANT: Keep current animation - don't change how pixels blink
    // This preserves each pixel's unique blink pattern
  });
  
  // Create additional victory-specific pixels
  createVictoryPixels(r, g, b);
  
  // Set up one-time listener for game reset
  document.addEventListener('keydown', handleGameReset);
}

/**
 * NEW 3.12: Create additional pixels for a more dramatic victory effect
 * UPDATED: Reduced quantity and made animation more subtle
 * @param {number} r - Red component of winner color
 * @param {number} g - Green component of winner color
 * @param {number} b - Blue component of winner color
 */
function createVictoryPixels(r, g, b) {
  const body = document.body;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  // Remove any existing victory pixels first
  document.querySelectorAll('.victory-pixel').forEach(pixel => pixel.remove());
  
  // Create additional pixels for a more dramatic effect
  // UPDATED: Reduced quantity (divided by 3) for a less crowded effect
  const extraPixelCount = Math.floor((windowWidth * windowHeight) / 36000);
  
  // for (let i = 0; i < extraPixelCount; i++) {
  //   // Create a new pixel
  //   const pixel = document.createElement('div');
  //   pixel.className = 'crowd-pixel victory-pixel';
    
  //   // Random position across the entire screen
  //   const x = Math.random() * windowWidth;
  //   const y = Math.random() * windowHeight;
    
  //   // Position the pixel
  //   pixel.style.left = `${x}px`;
  //   pixel.style.top = `${y}px`;
    
  //   // Random opacity between 0.5 and 0.8 (reduced from 0.6-1.0)
  //   const baseOpacity = 0.5 + Math.random() * 0.3;
  //   pixel.style.setProperty('--base-opacity', baseOpacity);
    
  //   // Set to winner's color
  //   pixel.style.backgroundColor = `rgba(${r}, ${g}, ${b}, ${baseOpacity})`;
    
  //   // Apply softer victory animation with longer duration and random delay
  //   pixel.style.animation = 'victoryBlinkSoft 1200ms infinite'; // Increased from 500ms to 1200ms
  //   pixel.style.animationDelay = `${Math.random() * 1200}ms`;
    
  //   // Add to document
  //   body.appendChild(pixel);
  // }
}

/**
 * NEW 3.12: Handle game reset when R key is pressed
 * @param {KeyboardEvent} e - The keyboard event
 */
function handleGameReset(e) {
  if (e.key === 'R' || e.key === 'r') {
    // Remove victory pixels
    document.querySelectorAll('.victory-pixel').forEach(pixel => pixel.remove());
    
    // Update crowd colors based on new game state after a short delay
    setTimeout(() => {
      if (typeof playerOne !== 'undefined' && typeof playerTwo !== 'undefined') {
        // Update global tracking variables
        playerOnePosition = playerOne.position;
        playerTwoPosition = playerTwo.position;
        playerOneBed = playerOne.bed;
        playerTwoBed = playerTwo.bed;
        
        // Update all pixel colors
        updateCrowdColors();
      }
    }, 50); // Short delay to ensure controller has updated game state
    
    // Remove this event listener
    document.removeEventListener('keydown', handleGameReset);
  }
}

// NEW 3.12: Add victory animation styles
// UPDATED: Added softer animation keyframes
document.addEventListener("DOMContentLoaded", function() {
  // Add victory animation style if it doesn't exist yet
  if (!document.getElementById('victory-styles')) {
    const victoryStyle = document.createElement('style');
    victoryStyle.id = 'victory-styles';
    victoryStyle.textContent = `
      @keyframes victoryBlink {
        0%, 49% { opacity: calc(var(--base-opacity) * 0.3); transform: scale(0.9); }
        50%, 100% { opacity: var(--base-opacity); transform: scale(1.1); }
      }
      
      @keyframes victoryBlinkSoft {
        0% { opacity: calc(var(--base-opacity) * 0.6); transform: scale(0.95); }
        50% { opacity: var(--base-opacity); transform: scale(1.05); }
        100% { opacity: calc(var(--base-opacity) * 0.6); transform: scale(0.95); }
      }
      
      .victory-pixel {
        z-index: 2; /* Make victory pixels more prominent */
      }
    `;
    document.head.appendChild(victoryStyle);
  }
});