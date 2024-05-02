const fps = 60;

//Game window
let board;
let boardWidth = 360;
let boardHeight = 576;
let context;
let isPlaying = false;

//Player
let playerWidth = 46;
let playerHeight = 46;
let playerX = boardWidth/2 - playerWidth/2;
let playerY = boardHeight*7/8 - playerHeight;
let playerRightImg;
let playerLeftImg;

let player = {
    img : null,
    x : playerX,
    y : playerY,
    width : playerWidth,
    height : playerHeight
}

//physics
let velocityX = 0;
const startVelocityX = 6;
let velocityY = 0; // player jump speed
const initialVelocityY = -12; // starting velocity Y
let gravity = 0.4;
let jumpHeight = 0;

//platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

//score
let score = 0;

//gameover
let gameOver = false;

window.onload = function() {
    if (!isPlaying){
        return;
    }
}


function update() {
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //player
    player.x += velocityX;
    if (player.x > boardWidth) {
        player.x = 0;
    }
    else if (player.x + playerWidth < 0) {
        player.x = boardWidth;
    }

    velocityY += gravity;
  
    if (player.y > board.height) {
        gameOver = true;
    }
    context.drawImage(player.img, player.x, player.y, player.width, player.height);

    //platforms
    if (player.y <= boardHeight/2 && velocityY <= 0){
        platformArray.forEach(function(platform) {
            platform.y += -velocityY;
        });
    } else {
        player.y += velocityY;
    }
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if (detectCollision(player, platform) && velocityY >= 0) {
            velocityY = initialVelocityY; //jump
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    clearPlatforms();

    //score
    context.fillStyle = "black";
    context.font = "16px open"
    context.fillText(score, 5, 20);

    //gameover
    if (gameOver) {
        context.fillText("Game Over", boardWidth/2, boardHeight/2);
    }
}

function movePlayer(e) {
    if (e.code == "ArrowRight" || e.code == "KeyD") { // move right
        velocityX = startVelocityX;
        player.img = playerRightImg;
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") { //move left
        velocityX = -startVelocityX;
        player.img = playerLeftImg;
    }
    //reset game
    else if (e.code == "Space" && gameOver) {
         resetGame();
    }
    
}

function stopPlayer(e) {
    if (e.code == "ArrowRight" || e.code == "KeyD") { // stop right
        velocityX = 0;
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") { // stop left
        velocityX = 0;
    }
}

function placePlatforms() {
    platformArray = [];

    //starting platforms
    let platform = {
        img : platformImg,
        x : boardWidth/2,
        y : boardHeight - 50,
        width : platformWidth,
        height : platformHeight
    }

    platformArray.push(platform);

    for (let i = 0; i < 6; i++) {
        let randomX = Math.floor(Math.random() * boardWidth*3/4);
        let platform = {
            img : platformImg,
            x : randomX,
            y : boardHeight - 75*i - 150,
            width : platformWidth,
            height : platformHeight
        }
    
        platformArray.push(platform);
    }
}

function clearPlatforms(){
    //clear platforms & add new ones
    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        platformArray.shift(); // remove platform
        newPlatform();
        score+=1;
    }
}

function newPlatform() {
    let randomX = Math.floor(Math.random() * boardWidth*3/4);
    let platform = {
        img : platformImg,
        x : randomX,
        y : -platformHeight,
        width : platformWidth,
        height : platformHeight
    }

    platformArray.push(platform);
}

function detectCollision(player, platform) {
    if (player.y + player.height >= platform.y &&
        player.y + player.height <= platform.y + platform.height &&
        (player.x + player.width) >= platform.x &&
        player.x <= (platform.x + platform.width)
    ) {
        return true;
    } else {
        return false;
    }
}

function resetGame(){
    player = {
        img : playerRightImg,
        x : playerX,
        y : playerY,
        width : playerWidth,
        height : playerHeight
    }
    velocityX = 0;
    velocityY = initialVelocityY;
    score = 0;
    gameOver = false;
    placePlatforms();
}

function startGame(){
    isPlaying = true;
    hideMenu();
    console.log(isPlaying);
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d")

    //Load assets

    //player assets
    playerRightImg = new Image();
    playerRightImg.src = "./assets/player-right.png";
    player.img = playerRightImg;
    playerRightImg.onload = function() {
        context.drawImage(player.img, player.x, player.y, player.width, player.height);
    }
    playerLeftImg = new Image();
    playerLeftImg.src = "./assets/player-left.png";

    //platform assets
    platformImg = new Image();
    platformImg.src = "./assets/platform.png"

    velocityY = initialVelocityY;
    placePlatforms();
    // requestAnimationFrame(update);
    setInterval(update, 1000/fps);
    document.addEventListener("keydown", movePlayer);
    document.addEventListener("keyup", stopPlayer);
}
function scorePage(){
    let scorePage = document.getElementById("score-page");
    let scoreText = document.getElementById("score-text");
    let hardcodedScore = 100;
    scoreText.innerHTML = "Your score is " + hardcodedScore;
    scorePage.style.display = "block";
    hideMenu();
}
function hideMenu(){
    document.getElementById("menu-container").style.display = "none";
}
function showMenu(){
    document.getElementById("menu-container").style.display = "block";
    hideScorePage();
}
function hideScorePage(){
    document.getElementById("score-page").style.display = "none";
}