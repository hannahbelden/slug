var slug;
var kill1, kill2, kill3, kill4, kill5;
var lives;
var score;
var avoidTheseList = [];
var food = [];
var startButton;
var mushrooms;
var slugLeft1, slugLeft2, slugRight1, slugRight2;
var livesLeft;
var livesLeftSizeX = 40;
var livesLeftSizeY = 40;
var gameoverSound, startSound;
var gameStarted;
var imgList = [0, 1, 2];
var index = 0;

function preload() {

	kill1 = loadImage('img/kill1.png');
	kill2 = loadImage('img/kill2.png');
	kill3 = loadImage('img/kill3.png');
	kill4 = loadImage('img/kill4.png');
	kill5 = loadImage('img/kill5.png');

	//load in slug

	slugLeft1 = loadImage('img/slugobjectLeft.png');
	slugLeft2 = loadImage('img/slugLeft2.png');
	slugRight1 = loadImage('img/slugobject.png');
	slugRight2 = loadImage('img/slugRight2.png');


	//load in lives left

	livesLeft = loadImage('img/livesLeft.png');

	//load in mushrooms

	mushrooms = loadImage('img/mushrooms.png');


}

function setup() {
	//set up canvas size
	createCanvas(900, 500);
	gameoverSound = loadSound('sounds/gameOversound.mp3');
	startSound = loadSound('sounds/gameStartsound.mp3');
	// create Slug object

	slug = new Slug();

	//default lives value

	lives = 3;
	score = 0;

	//create clear button

	startButton = createButton('BEGIN');
	startButton.position(225, 50);
    startButton.size(400,400);
	startButton.mousePressed(startGame);

	//set gameStarted to false

	gameStarted = false;

}

function draw() {
    
  background(252, 116, 133);    
    
  //nextImg = loadImage(imgList[index], imageLoaded);
//  text(score,20,60); // index counter
 // text(imgList[index],80,60); // image list number
//  textSize(40);
//  fill(255);
    //image(kill2, 0, 0, 100, 100);

	

	if (gameStarted === true) {
		startButton.hide();



		//show score

		fill(226, 252, 0);
		noStroke();
		textSize(26);
		text("SCORE:  " + score, 30, 50);

		switch (lives) {
			case 3:
				image(livesLeft, 650, 30, livesLeftSizeX, livesLeftSizeY);
				image(livesLeft, 690, 30, livesLeftSizeX, livesLeftSizeY);
				image(livesLeft, 730, 30, livesLeftSizeX, livesLeftSizeY);
				break;
			case 2:
				image(livesLeft, 690, 30, livesLeftSizeX, livesLeftSizeY);
				image(livesLeft, 730, 30, livesLeftSizeX, livesLeftSizeY);
				break;
			case 1:
				image(livesLeft, 730, 30, livesLeftSizeX, livesLeftSizeY);
				break;
		}

		slug.display();

		var avoidTheseHatch = Math.ceil(random(30));
		if (avoidTheseHatch == 1) {
			avoidTheseList.push(new AvoidThese());
		}

		//random food hatching

		var foodHatch = Math.ceil(random(30));
		if (foodHatch == 1) {
			food.push(new Food());
		}

		//loop through each avoidthese

		for (var i = 0; i < avoidTheseList.length; i++) {
			//display avoid these
			avoidTheseList[i].display();

			//check if they reach bottom of screen
			if (avoidTheseList[i].ypos > 600) {
				//remove avoid these
				avoidTheseList.splice(i, 1);

			} else {
				//check to see if slug is touching avoid these
				var d1 = dist(avoidTheseList[i].xpos, avoidTheseList[i].ypos, slug.xpos, slug.ypos);
				if (d1 < 50) {
					//remove avoid these
					avoidTheseList.splice(i, 1);

					//remove a life
					lives--;

				}
			}
		}

		//loop through each group of mushrooms aka food
		for (var j = 0; j < food.length; j++) {
			//display food

			food[j].display();

			//check if food reaches bottom of screen
			if (food[j].ypos > 600) {
				//remove food
				food.splice(j, 1);
			} else {

				//check if slug is touching food
				var d2 = dist(food[j].xpos, food[j].ypos, slug.xpos, slug.ypos);
				if (d2 < 25) {
					//remove food
					food.splice(j, 1);

					//increase score by one
					score++;


				}
			}
		}

		//check for game over

		if (lives <= 0) {
			//reset lives and the score
			lives = 3;
			score = 0;

			//reset slug position
			slug.xpos = 500;
			slug.direction = "stopped";

			//remove avoid these and food
			avoidTheseList = [];
			food = [];

			//play game over sound
			gameoverSound.play();

			//set gameStarted to false
			gameStarted = false;
		}


	} else {
		//show the starting button
		startButton.show();
	}
}

function imageLoaded() {
  background(0);
  image(nextImg,xPos,yPos,w,h);
  imageMode(CENTER);
}

function startGame() {
	//change gameStarted variable
	gameStarted =  true;

	//play start sound
	startSound.play();
}

function keyPressed() {
	//if right arrow is pressed
	if (keyCode == RIGHT_ARROW) {
		//change the slug's direction property
		slug.direction = 'right';
	}

	//if left arrow is pressed
	if (keyCode == LEFT_ARROW) {
		//change slug direction property
		slug.direction = 'left';
	}
}

/////////////////////////// SLUG CLASS //////////////////////////////

function Slug() {
	//setting default properties
	this.xpos = 500;
	this.ypos = 450;
    this.slugSizeX = 100;
    this.slugSizeY = 100;
	this.speed = 4;
	this.direction = "stopped";

	//moveCounter will determine which slug sprite to display, 1 or 2

	this.moveCounter = 1;
}

Slug.prototype.display = function() {
	//check for every fifth frame
	//is the current frameCount divisible by 5?
	if (frameCount % 5 === 0) {
		//if the moveCounter is equal to 2, reset it by setting it equal to 1
		//otherwise increment moveCounter
		if (this.moveCounter == 2) {
			this.moveCounter = 1;
		} else {
			this.moveCounter++;
		}
	}

	imageMode(CENTER);

	//if slug is facing right
	if (this.direction == 'right') {
		//display the correct sprite image based on the moveCounter 
		switch (this.moveCounter) {
			case 1:
				image(slugRight1, this.xpos, this.ypos, this.slugSizeX, this.slugSizeY);
				break;
			case 2:
				image(slugRight2, this.xpos, this.ypos, this.slugSizeX, this.slugSizeY);
				break;
		}
		//move slug to right
		this.xpos = this.xpos + this.speed;
	}

	//if slug is facing left
	if (this.direction == 'left') {
		//display the correct sprite image based on the moveCounter 
		switch (this.moveCounter) {
			case 1:
				image(slugLeft1, this.xpos, this.ypos, this.slugSizeX, this.slugSizeY);
				break;
			case 2:
				image(slugLeft2, this.xpos, this.ypos, this.slugSizeX, this.slugSizeY);
				break;
		}
		//move slug to left
		this.xpos = this.xpos - this.speed;
	}

	//if slug is at start and has not moved yet
	if (this.direction == 'stopped') {
		image(slugLeft1, this.xpos, this.ypos, this.slugSizeX, this.slugSizeY);
	}
	//wrap slug if slug reaches edge of screen
	if (this.xpos > 900) {
		this.xpos = 0;
	}
	if (this.xpos < 0) {
		this.xpos = width;
	}
};

//////// avoid these class //////////

function AvoidThese() {
	// set default properties
	this.xpos = random(0, width);
	this.ypos = 0;
	this.speed = random(1, 4);
	this.type = Math.ceil(random(4));
}

AvoidThese.prototype.display = function() {
	imageMode(CENTER);

	// show different avoid these, aka enemy, based on its random 'type' value
	switch (this.type) {
		case 1:
			image(kill1, this.xpos, this.ypos, 42, 44);
			break;
		case 2:
			image(kill2, this.xpos, this.ypos, 42, 44);
			break;
		case 3:
			image(kill3, this.xpos, this.ypos, 42, 44);
			break;
		case 4:
			image(kill4, this.xpos, this.ypos, 42, 44);
			break;
		case 5:
			image(kill5, this.xpos, this.ypos, 42, 44);
			break;
	}
	this.ypos = this.ypos + this.speed;
};

////// food class ///////

function Food() {
	//set default properties
	this.xpos = random(0, 600);
	this.ypos = 0;
	this.speed = random(1, 4);

}

Food.prototype.display = function() {
	image(mushrooms, this.xpos, this.ypos, 25, 25);
	this.ypos = this.ypos + this.speed;
};