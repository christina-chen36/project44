/*/ 
gamestate 0 = game playing (main loop)
gamestate 1 = game win
gamestate 2 = game lose
gamestate 3 = title screen
gamestate 5 = create player
gameState 6 = restart
/*/


var player, skyImg, sky, leftPlayerImg, rightPlayerImg, playerImg;
var gameState = 3;
var platform, platformGroup, invisPlatform, invisPlatformGroup;
var skyLoop = 0;
var coins, coinGroup, coinImg;
var coinArray = [];
var score = 0;
var startingPlatform;
var hasJumped = false;
var titleScreenPlayer;
var startingPlatformStart = 0;
var leftEdge, rightEdge, topEdge;


function preload() {
    skyImg = loadImage("longSky.jpg")
    playerImg = loadImage("robot.png")
    leftPlayerImg = loadImage("left.png")
    rightPlayerImg = loadImage("right.png")
    coinImg = loadImage("coin.png")
}


function setup() {
    createCanvas(600, 800)
   createEdgeSprites()

   leftEdge = createSprite(0,400,10,800)
   leftEdge.visible = false;
    rightEdge = createSprite(600,400,10,800)
   rightEdge.visible = false;
   topEdge = createSprite(300,0,600,10)
   topEdge.visible = false;

    sky = createSprite(300,100,800,400)
    sky.addImage(skyImg)

    platformGroup = new Group()
    coinGroup = new Group()
    invisPlatformGroup = new Group()
    
}


function draw() {
    background("white")
    drawSprites()
    
    if (gameState == 3 ) {
        fill("black")
        textSize(40)
        text("Cloud Jumper", 100,200)
        "Cloud Jumper".blink()
        textSize(20)
        text("Press ENTER To Continue", 200,400)
        if (keyDown("ENTER")) {
            gameState = 5;
        }
    }


    if (gameState == 5) {
        player = createSprite(100,200,20,20)
        player.addImage(playerImg)
        player.scale = 0.1
        gameState = 0
        startingPlatform = createSprite(100,400, 100,20)
    }

    if (gameState == 6) {
        player.addImage(playerImg)
        player.x = 100
        player.y = 200
        player.velocityY= 0
        gameState = 0
        hasJumped = false;
        skyLoop = 0
        score = 0
        startingPlatform.x = 100
        startingPlatform.y = 400
        startingPlatform
        platformGroup.destroyEach()
        coinGroup.destroyEach()
        invisPlatformGroup.destroyEach()
    }

    if (gameState == 0) {
        sky.velocityY=3
        
        startingPlatform.velocityY = 1
        textSize(23)
        fill("black")
        text("Score: " + score, 500,50)

        if (player.isTouching(leftEdge) || player.isTouching(rightEdge) || player.isTouching(topEdge)) {
            textSize(20)
            fill("red")
            text("Be Careful!", 250,300)
            player.bounceOff(leftEdge)
            player.bounceOff(rightEdge)
            player.bounceOff(topEdge)
            console.log("running")
        }
        
        if (keyDown("RIGHT_ARROW")) {
            player.x = player.x + 10
            player.addImage(rightPlayerImg)
        }

        if (keyDown("LEFT_ARROW")) {
            player.x = player.x - 10
            player.addImage(leftPlayerImg)
        }
        
        if (keyDown("UP_ARROW") && hasJumped == false) {
            player.velocityY = -15
            player.addImage(playerImg)
            hasJumped = true;
            startingPlatformStart = 1;
        }
       
        player.velocityY = player.velocityY + 0.8

        if (sky.y > 550) {
            sky.y = 200
            skyLoop += 1
        }

       if (skyLoop == 7) {
            gameState = 1;
        }

        if (player.y > 900) {
            gameState = 2
        }

        if(platformGroup.isTouching(player)) {
            player.bounceOff(platformGroup)
            player.velocityY=0
            hasJumped = false;    
        }
        
        if(startingPlatform.isTouching(player)) {
            player.bounceOff(startingPlatform)
        }
        
        if(invisPlatformGroup.isTouching(player)) {
            player.velocityY=0.1
            player.bounceOff(invisPlatformGroup)
        }

        for (var i = 0; i < coinArray.length; i++)
        {
            if (coinArray[i].isTouching(player))
            {   
                score += 1;
                coinArray[i].destroy();
                coinArray.splice(i, 1);
            }
        }

        spawnPlatform()
        spawnCoins()

    }

    if (gameState == 2) {
        sky.velocityY=0
        coinGroup.setVelocityYEach(0)
        platformGroup.setVelocityYEach(0)
        startingPlatform.velocityY=0
        fill("red")
        textSize(30)
        text("You Lose. Your Score was " + score, 100,300)
        if (keyDown("ENTER")) {
            gameState = 6
        }
    }
    if (gameState == 1) {
        sky.velocityY=0
        coinGroup.setVelocityYEach(0)
        platformGroup.setVelocityYEach(0)
        player.velocityY=0
        player.velocityX=0
        fill("green")
        textSize(30)
        text("You Survived. Your Score was " + score, 100,300)
        if (keyDown("ENTER")) {
            gameState = 6
        }
    }
}

function spawnPlatform() {
    if (frameCount%70 == 0) {
        platform = createSprite(Math.round(random(50,250)), -50, 100,20)
        platform.velocityY=3
        platformGroup.add(platform)
        invisPlatform = createSprite(platform.x, -30, 100,20)
        invisPlatform.velocityY=3
        invisPlatform.visible = false;
        invisPlatformGroup.add(invisPlatform)
        platform = createSprite(Math.round(random(250,600)), -50, 100,20)
        platform.velocityY=3
        invisPlatform = createSprite(platform.x, -30, 100,20)
        invisPlatform.velocityY=3
        invisPlatform.visible = false;
        invisPlatformGroup.add(invisPlatform)
        
        platformGroup.add(platform)
    }
}

function spawnCoins() {
    if (frameCount% 50 == 0) {
        coins = createSprite(Math.round(random(50,600)), -50, 100, 20)
        coins.velocityY=3
        coins.addImage(coinImg)
        coins.scale = 0.1
        coinGroup.add(coins);
        coinArray.push(coins);
    }
}