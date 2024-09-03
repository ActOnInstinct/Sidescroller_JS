/*

The Game Project

Final


*/

//START

var gameChar_x;
var gameChar_y;
var gameChar_leg;
var gameChar_legInc;
var floorPos_y;
var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var isDead;
var canyons;
var collectables;
var trees;
var cloud;
var mountain;
var cameraPosX;
var game_score;
var flagpole;
var lives;
var enemies;


function setup()
{
	//canvas size, floor and lives
	createCanvas(1024, 576);
	floorPos_y = height * 3/4;
	lives = 3;

	startGame();
}


function draw()
{

	///////////DRAWING CODE//////////

	background(100,155,255); //fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height - floorPos_y); //draw some green ground

	push();
	translate(-cameraPosX, 0);

	//Draw the mountain
	drawMountains();

	//Draw the trees
	drawTrees();

	//Draw the clouds
	drawClouds();

	//Draw the collectable item
	for(var i = 0; i < collectables.length; i++)
	{
		if(!collectables[i].isFound)
		{
			drawCollectable(collectables[i]);
			checkCollectable(collectables[i]);
		}
	}

	//Draw the canyon
	for(var i = 0; i < canyons.length; i++)
	{
		drawCanyon(canyons[i]);
		checkCanyon(canyons[i]);
	}

	//Draw the platforms
	for (var i = 0; i < platforms.length; i++)
	{
		platforms[i].draw();
	}

	//Draw the game character
	drawGameChar();

	//Draw the flagpole
	renderFlagpole();

	//Draw the enemies
	for(var i = 0; i < enemies.length; i++)
	{
		enemies[i].draw();

		var isContact = enemies[i].checkContact(gameChar_x, gameChar_y);

		if (isContact)
		{
			lives -= 1;

			if (lives > 0)
			{
				startGame();
				break;
			}
			else
			{
				isFalling = false;
				isDead = true;
			}
		}
	}

	pop();
	//This pop ends the scrolling objects

	//Draw the score
	fill(255);
	noStroke();
	textSize(20);
	text("Score: " + game_score, 20, 30);

	//Draw the remaining lives
	drawLifeTokens(lives);

	//Check if lives are 0 and display game over text
	if(lives < 1)
	{
		fill(0);
		textSize(30);
		text("Game over. Press space to continue.", width/2 - 230, height/2 - 5);
		return;
	}

	//Check if flagpole is reached and display level complete text
	if(flagpole.isReached)
	{
		fill(0);
		textSize(30);
		text("Level complete. Press space to continue.", width/2 - 250, height/2 - 5);
		return;
	}

	///////////INTERACTION CODE//////////

	//Scroll the scenery
	if (gameChar_x < width * 2 && gameChar_x > width % 2)
	{
		cameraPosX = gameChar_x - width/2;
	}

	//character movement
	if(isLeft)
	{
		gameChar_x -= 6;
	}

	if(isRight)
	{
		gameChar_x += 6;
	}

	//gravity
	if(gameChar_y < floorPos_y)
	{
		for (var i = 0; i < platforms.length; i++)
		{
			var isContact = false;
			if (platforms[i].checkContact(gameChar_x, gameChar_y) == true)
			{
				isContact = true;
				isFalling = false;
				break;
			}
		}

		if (!isContact)
		{
			gameChar_y += 4;
			isFalling = true;
		}
	}
	else
	{
		isFalling = false;
	}

	//plummeting into holes
	if(isPlummeting)
	{
		gameChar_y += 4;
		isLeft = false;
		isRight = false;
	}

	//check flagpole
	if(!flagpole.isReached)
	{
		checkFlagpole();
	}

	//check if player dies and restart the game
	checkPlayerDie();
}


function keyPressed()
{
	// if statements to control the animation of the character when
	// keys are pressed.

	//jump and prevent double jump (or jumping while falling into canyon)
	if(keyCode == 87 && !isFalling && !isPlummeting && !isDead)
	{
		gameChar_y -= 120;
	}

	if(keyCode == 65 && !isPlummeting && !isDead)
	{
		isLeft = true;
	}

	if(keyCode == 68 && !isPlummeting && !isDead)
	{
		isRight = true;
	}

	//press space to continue
	if((keyCode == 32 && flagpole.isReached) || (keyCode == 32 && lives < 1))
	{
		location.reload();
	}
}

function keyReleased()
{
	// if statements to control the animation of the character when
	// keys are released.
	//up == 87(w), left(a) == 65, right(d) == 68, down(s) == 83

	if(keyCode == 65)
	{
		isLeft = false;
	}

	if(keyCode == 68)
	{
		isRight = false;
	}
}

function drawClouds()
{
	for(var i = 0; i < cloud.x_pos.length; i++)
	{
		fill(255);
		arc(cloud.x_pos[i] + 30, 
			cloud.y_pos[i], 
			40 + (2 * cloud.size), 
			70 + (2 * cloud.size), 
			PI, PI + PI);
		arc(cloud.x_pos[i] + 60 + (2 * cloud.size), 
			cloud.y_pos[i], 
			40 + (2 * cloud.size), 
			60 + (2 * cloud.size), 
			PI, PI + PI);
		arc(cloud.x_pos[i] - (2 * cloud.size), 
			cloud.y_pos[i], 
			40 + (2 * cloud.size), 
			60 + (2 * cloud.size), 
			PI, PI + PI);
	}
}
function drawMountains()
{
	for(var i = 0; i < mountain.x_pos.length; i++)
	{
		stroke(100, 100, 100, 80);
		strokeWeight(2);
		fill(123,164,188);
		triangle(mountain.x_pos[i] - (150 * mountain.size/10), 
				mountain.y_pos, 
				mountain.x_pos[i] + (150 * mountain.size/10), 
				mountain.y_pos, 
				mountain.x_pos[i], 
				mountain.y_pos - (232 * mountain.size/10));
		triangle(mountain.x_pos[i] - (200 * mountain.size/10), 
				mountain.y_pos, 
				mountain.x_pos[i], 
				mountain.y_pos, 
				mountain.x_pos[i] - (100 * mountain.size/10), 
				mountain.y_pos - (162 * mountain.size/10));
		triangle(mountain.x_pos[i] - (25 * mountain.size/10), 
				mountain.y_pos, 
				mountain.x_pos[i] + (175 * mountain.size/10), 
				mountain.y_pos, 
				mountain.x_pos[i] + (75 * mountain.size/10), 
				mountain.y_pos - (192 * mountain.size/10));

		//snowy mountain top
		noStroke();
		fill(255);
		triangle(mountain.x_pos[i], 
				mountain.y_pos - (232 * mountain.size/10), 
				mountain.x_pos[i] - (45 * mountain.size/10), 
				mountain.y_pos - (162 * mountain.size/10), 
				mountain.x_pos[i] + (44 * mountain.size/10), 
				mountain.y_pos - (162 * mountain.size/10));
		triangle(mountain.x_pos[i] - (45 * mountain.size/10), 
				mountain.y_pos - (162 * mountain.size/10), 
				mountain.x_pos[i] - (30 * mountain.size/10), 
				mountain.y_pos - (162 * mountain.size/10), 
				mountain.x_pos[i] - (49 * mountain.size/10), 
				mountain.y_pos - (150 * mountain.size/10));
		triangle(mountain.x_pos[i] - (30 * mountain.size/10), 
				mountain.y_pos - (162 * mountain.size/10), 
				mountain.x_pos[i], 
				mountain.y_pos - (162 * mountain.size/10), 
				mountain.x_pos[i] - (15 * mountain.size/10), 
				mountain.y_pos - (146 * mountain.size/10));
		triangle(mountain.x_pos[i], 
				mountain.y_pos - (162 * mountain.size/10), 
				mountain.x_pos[i] + (20 * mountain.size/10), 
				mountain.y_pos - (162 * mountain.size/10), 
				mountain.x_pos[i] + (22 * mountain.size/10), 
				mountain.y_pos - (146 * mountain.size/10));
		triangle(mountain.x_pos[i] + (20 * mountain.size/10), 
				mountain.y_pos - (162 * mountain.size/10), 
				mountain.x_pos[i] + (42 * mountain.size/10), 
				mountain.y_pos - (162 * mountain.size/10), 
				mountain.x_pos[i] + (38 * mountain.size/10), 
				mountain.y_pos - (152 * mountain.size/10));
	}
}
function drawTrees()
{
	for(var i = 0; i < trees.x_pos.length; i++)
	{
		//(tree trunk)
		fill(165,42,42);
		rect(trees.x_pos[i] - 15, trees.y_pos + 22, 30, 70);
		//(tree branches)
		fill(34,139,34);
		ellipse(trees.x_pos[i] + 25, trees.y_pos, 50, 50);
		ellipse(trees.x_pos[i], trees.y_pos - 30, 50, 50);
		ellipse(trees.x_pos[i], trees.y_pos, 50, 50);
		ellipse(trees.x_pos[i] - 25, trees.y_pos, 50, 50);	
	}
}

function drawCollectable(t_collectable)
{
	fill(255);
	stroke(1);
	//upper part
	triangle(t_collectable.x_pos - (12* t_collectable.size/10), 
	    	 t_collectable.y_pos + (8*t_collectable.size/10), 
			 t_collectable.x_pos - (4* t_collectable.size/10), 
			 t_collectable.y_pos + (8* t_collectable.size/10), 
		 	 t_collectable.x_pos - (8* t_collectable.size/10), 
			 t_collectable.y_pos);
	triangle(t_collectable.x_pos - (8* t_collectable.size/10), 
			 t_collectable.y_pos, 
			 t_collectable.x_pos, 
		 	 t_collectable.y_pos,
			 t_collectable.x_pos - (4* t_collectable.size/10), 
			 t_collectable.y_pos + (8* t_collectable.size/10));
	triangle(t_collectable.x_pos - (4* t_collectable.size/10), 
			 t_collectable.y_pos + (8* t_collectable.size/10), 
			 t_collectable.x_pos + (4* t_collectable.size/10), 
			 t_collectable.y_pos + (8* t_collectable.size/10), 
			 t_collectable.x_pos, t_collectable.y_pos);
	triangle(t_collectable.x_pos, 
			 t_collectable.y_pos, 
			 t_collectable.x_pos + (8* t_collectable.size/10), 
			 t_collectable.y_pos, 
			 t_collectable.x_pos + (4* t_collectable.size/10), 
			 t_collectable.y_pos + (8* t_collectable.size/10));
	triangle(t_collectable.x_pos + (4* t_collectable.size/10), 
			 t_collectable.y_pos + (8* t_collectable.size/10), 
			 t_collectable.x_pos + (12* t_collectable.size/10), 
			 t_collectable.y_pos + (8* t_collectable.size/10), 
			 t_collectable.x_pos + (8* t_collectable.size/10), 
			 t_collectable.y_pos);
	//bottom part
	triangle(t_collectable.x_pos - (12* t_collectable.size/10), 
			 t_collectable.y_pos + (8* t_collectable.size/10), 
			 t_collectable.x_pos - (2* t_collectable.size/10), 
			 t_collectable.y_pos + (28* t_collectable.size/10), 
			 t_collectable.x_pos - (4* t_collectable.size/10), 
			 t_collectable.y_pos + (8* t_collectable.size/10));
	triangle(t_collectable.x_pos - (4* t_collectable.size/10), 
			 t_collectable.y_pos + (8* t_collectable.size/10), 
			 t_collectable.x_pos, 
			 t_collectable.y_pos + (28* t_collectable.size/10), 
			 t_collectable.x_pos + (4* t_collectable.size/10), 
			 t_collectable.y_pos + (8* t_collectable.size/10));
	triangle(t_collectable.x_pos + (4* t_collectable.size/10), 
			 t_collectable.y_pos + (8* t_collectable.size/10), 
			 t_collectable.x_pos + (2* t_collectable.size/10), 
			 t_collectable.y_pos + (28* t_collectable.size/10), 
			 t_collectable.x_pos + (12* t_collectable.size/10), 
			 t_collectable.y_pos + (8* t_collectable.size/10));	
}

function drawCanyon(t_canyon)
{
	//Draw the canyon
	// hole
	noStroke();
	fill(100, 155, 255);
	//rect(80, 432, 130, 144);
	rect(t_canyon.x_pos, 432, t_canyon.width, 144);
	// left side rocks
	fill(47,79,79);
	rect(t_canyon.x_pos, 530, 20, 46);
	rect(t_canyon.x_pos + 20, 550, 10, 20);
	rect(t_canyon.x_pos, 490, 30, 40);
	rect(t_canyon.x_pos, 452, 50, 20);
	rect(t_canyon.x_pos, 472, 30, 10);
	rect(t_canyon.x_pos, 482, 10, 5);
	rect(t_canyon.x_pos, 432, 10, 144);
	//right side rocks
	rect(t_canyon.x_pos + (t_canyon.width - 20), 530, 20, 20);
	rect(t_canyon.x_pos + (t_canyon.width - 35), 472, 35, 20);
	rect(t_canyon.x_pos + (t_canyon.width - 45), 487, 45, 5);
	rect(t_canyon.x_pos + (t_canyon.width - 10), 432, 10, 144);
	//bottom
	rect(t_canyon.x_pos + 20, 560, t_canyon.width - 20, 16);
	triangle(t_canyon.x_pos + (t_canyon.width/2 - 15), 560, 
			 t_canyon.x_pos + (t_canyon.width/2 + 31), 560, 
			 t_canyon.x_pos + (t_canyon.width/2), 545);	
}

function checkCollectable(t_collectable)
{
	if(dist(gameChar_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 50)
	{
		t_collectable.isFound = true;
		game_score += 1;
	}
}

function checkCanyon(t_canyon)
{
	if((gameChar_x < (t_canyon.x_pos + t_canyon.width - 20)) 
	&& (gameChar_x > t_canyon.x_pos + 20) 
	&& (gameChar_y >= floorPos_y)
	&& (gameChar_y < floorPos_y + 140))
	{
		isPlummeting = true;
	}
}

function drawGameChar()
{	
	push();
	if(isLeft && isFalling)
	{
		//jumping-left character
		//head
		fill(255,192,203);
		ellipse(gameChar_x, gameChar_y - 58, 25, 16);
		//body
		fill(255,140,0);
		rect(gameChar_x -5, gameChar_y - 50, 10, 30);
		//legs
		stroke(255,192,203);
		strokeWeight(3);
		line(gameChar_x - 4, gameChar_y - 19, gameChar_x - 16, gameChar_y - 8);
		line(gameChar_x + 4, gameChar_y - 19, gameChar_x + 16, gameChar_y - 8);
		//hands
		line(gameChar_x - 4, gameChar_y - 48, gameChar_x - 20, gameChar_y - 55);
		line(gameChar_x + 6, gameChar_y - 48, gameChar_x + 20, gameChar_y - 55);
		//eyes
		noStroke();
		fill(255);
		ellipse(gameChar_x - 5, gameChar_y - 62, 5, 3);
		//cap
		fill(255,0,0);
		arc(gameChar_x, gameChar_y - 64, 22, 22, - PI, 0, CHORD);
		stroke(25,25,112);
		strokeWeight(1);
		line(gameChar_x - 11, gameChar_y - 65, gameChar_x - 20, gameChar_y - 65);
	}
	else if(isRight && isFalling)
	{
		//jumping-right character
		//head
		fill(255,192,203);
		ellipse(gameChar_x, gameChar_y - 58, 25, 16);
		//body
		fill(255,140,0);
		rect(gameChar_x -5, gameChar_y - 50, 10, 30);
		//legs
		stroke(255,192,203);
		strokeWeight(3);
		line(gameChar_x - 4, gameChar_y - 19, gameChar_x - 16, gameChar_y - 8);
		line(gameChar_x + 4, gameChar_y - 19, gameChar_x + 16, gameChar_y - 8);
		//hands
		line(gameChar_x + 4, gameChar_y - 48, gameChar_x + 20, gameChar_y - 55);
		line(gameChar_x - 6, gameChar_y - 48, gameChar_x - 20, gameChar_y - 55);
		//eyes
		noStroke();
		fill(255);
		ellipse(gameChar_x + 5, gameChar_y - 62, 5, 3);
		//cap
		fill(255,0,0);
		arc(gameChar_x, gameChar_y - 64, 22, 22, - PI, 0, CHORD);
		stroke(25,25,112);
		strokeWeight(1);
		line(gameChar_x + 11, gameChar_y - 65, gameChar_x + 20, gameChar_y - 65);
	}
	else if(isLeft)
	{
		//walking left character
		//head
		fill(255,192,203);
		ellipse(gameChar_x, gameChar_y - 58, 25, 16);
		//body
		fill(255,140,0);
		rect(gameChar_x -5, gameChar_y - 50, 10, 30);
		//hands
		line(gameChar_x - 4, gameChar_y - 48, gameChar_x - 10, gameChar_y - 30);
		line(gameChar_x + 6, gameChar_y - 48, gameChar_x + 10, gameChar_y - 30);
		//eyes
		noStroke();
		fill(255);
		ellipse(gameChar_x - 5, gameChar_y - 62, 5, 3);
		//cap
		fill(255,0,0);
		arc(gameChar_x, gameChar_y - 64, 22, 22, - PI, 0, CHORD);
		stroke(25,25,112);
		strokeWeight(1);
		line(gameChar_x - 11, gameChar_y - 65, gameChar_x - 20, gameChar_y - 65);
		//legs	
		stroke(255,192,203);
		strokeWeight(3);
		line(gameChar_x - 4, gameChar_y - 19, gameChar_x - 4 + gameChar_leg, gameChar_y);
		line(gameChar_x + 4, gameChar_y - 19, gameChar_x + 4 - gameChar_leg, gameChar_y);
		noStroke();

		if (gameChar_leg < 5 && gameChar_legInc) 
		{
			gameChar_leg += 1;
			if (gameChar_leg == 4)
			{
				gameChar_legInc = false;
			}
		}
		else if (gameChar_leg > -5 && !gameChar_legInc)
		{
			gameChar_leg -= 1;
			if (gameChar_leg == -4)
			{
				gameChar_legInc = true;
			}
		}
	}
	else if(isRight)
	{
		//walking right character
		//head
		fill(255,192,203);
		ellipse(gameChar_x, gameChar_y - 58, 25, 16);
		//body
		fill(255,140,0);
		rect(gameChar_x -5, gameChar_y - 50, 10, 30);
		//hands
		line(gameChar_x + 4, gameChar_y - 48, gameChar_x + 10, gameChar_y - 30);
		line(gameChar_x - 6, gameChar_y - 48, gameChar_x - 10, gameChar_y - 30);
		//eyes
		noStroke();
		fill(255);
		ellipse(gameChar_x + 5, gameChar_y - 62, 5, 3);
		//cap
		fill(255,0,0);
		arc(gameChar_x, gameChar_y - 64, 22, 22, - PI, 0, CHORD);
		stroke(25,25,112);
		strokeWeight(1);
		line(gameChar_x + 11, gameChar_y - 65, gameChar_x + 20, gameChar_y - 65);
		//legs
		stroke(255,192,203);
		strokeWeight(3);
		line(gameChar_x - 4, gameChar_y - 19, gameChar_x - 4 + gameChar_leg, gameChar_y);
		line(gameChar_x + 4, gameChar_y - 19, gameChar_x + 4 - gameChar_leg, gameChar_y);
		noStroke();

		if (gameChar_leg < 5 && gameChar_legInc) 
		{
			gameChar_leg += 1;
			if (gameChar_leg == 4)
			{
				gameChar_legInc = false;
			}
		}
		else if (gameChar_leg > -5 && !gameChar_legInc)
		{
			gameChar_leg -= 1;
			if (gameChar_leg == -4)
			{
				gameChar_legInc = true;
			}
		}
	}
	else if(isFalling || isPlummeting)
	{
		//jumping facing forwards character
		//head
		fill(255,192,203);
		ellipse(gameChar_x, gameChar_y - 60, 20, 20);
		//body
		fill(255,140,0);
		rect(gameChar_x -10, gameChar_y - 50, 20, 30);
		//legs
		stroke(255,192,203);
		strokeWeight(3);
		line(gameChar_x - 8, gameChar_y - 19, gameChar_x - 20, gameChar_y - 4);
		line(gameChar_x + 8, gameChar_y - 19, gameChar_x + 20, gameChar_y - 4);
		//hands
		line(gameChar_x - 10, gameChar_y - 48, gameChar_x - 20, gameChar_y - 65);
		line(gameChar_x + 10, gameChar_y - 48, gameChar_x + 20, gameChar_y - 65);
		//eyes
		noStroke();
		fill(255);
		ellipse(gameChar_x - 3, gameChar_y - 62, 3, 3);
		ellipse(gameChar_x + 3, gameChar_y - 62, 3, 3);
		//cap
		fill(255,0,0);
		arc(gameChar_x, gameChar_y - 64, 20, 23, - PI, 0, CHORD);
		fill(25,25,112);
		arc(gameChar_x, gameChar_y - 65, 14, 13, - PI, 0, CHORD);
		strokeWeight(1);
	}
	else if(isDead)
	{
		//dead character
		//head
		fill(255,192,203);
		ellipse(gameChar_x + 30, gameChar_y - 10, 20, 20);
		//body
		fill(255,140,0);
		rect(gameChar_x -10, gameChar_y - 20, 30, 20);
		//legs
		stroke(255,192,203);
		strokeWeight(3);
		line(gameChar_x - 9, gameChar_y - 18, gameChar_x - 20, gameChar_y - 13);
		line(gameChar_x - 9, gameChar_y - 1, gameChar_x - 20, gameChar_y -1);
		//cap
		noStroke();
		fill(255,0,0);
		arc(gameChar_x + 30, gameChar_y - 10, 20, 23, PI + HALF_PI, QUARTER_PI, CHORD);
		fill(25,25,112);
		arc(gameChar_x + 32, gameChar_y - 12, 14, 13, PI + HALF_PI, QUARTER_PI, CHORD);
		strokeWeight(1);
	}
	else
	{
		//standing front facing character
		//head
		fill(255,192,203);
		ellipse(gameChar_x, gameChar_y - 60, 20, 20);
		//body
		fill(255,140,0);
		rect(gameChar_x -10, gameChar_y - 50, 20, 30);
		//legs
		stroke(255,192,203);
		strokeWeight(3);
		line(gameChar_x - 8, gameChar_y - 19, gameChar_x - 8, gameChar_y);
		line(gameChar_x + 8, gameChar_y - 19, gameChar_x + 8, gameChar_y);
		//hands
		line(gameChar_x - 10, gameChar_y - 48, gameChar_x - 20, gameChar_y - 30);
		line(gameChar_x + 10, gameChar_y - 48, gameChar_x + 20, gameChar_y - 30);
		//eyes
		noStroke();
		fill(255);
		ellipse(gameChar_x - 3, gameChar_y - 62, 3, 3);
		ellipse(gameChar_x + 3, gameChar_y - 62, 3, 3);
		//cap
		fill(255,0,0);
		arc(gameChar_x, gameChar_y - 64, 20, 23, - PI, 0, CHORD);
		fill(25,25,112);
		arc(gameChar_x, gameChar_y - 65, 14, 13, - PI, 0, CHORD);
		strokeWeight(1);
	}
	pop();
}

function renderFlagpole()
{	
	push();
	stroke(173,255,47);
	strokeWeight(5);
	line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 200);
	fill(250,235,215);
	if(flagpole.isReached)
	{
		rect(flagpole.x_pos, floorPos_y - 25, -50, 20);
	}
	else
	{
		rect(flagpole.x_pos, floorPos_y - 200, -50, 20);
	}
	pop();
}

function checkFlagpole()
{
	var d = abs(gameChar_x - flagpole.x_pos)

	if(d < 15)
	{
		flagpole.isReached = true;
	}
}

function checkPlayerDie()
{
	if(gameChar_y > floorPos_y + 140)
	{
		lives -= 1;

		if(lives > 0)
		{
			startGame();
		}
		else
		{
			isFalling = false;
			isPlummeting = false;
			isDead = true;
		}
	}
}

function startGame()
{
	//init game char
	gameChar_x = width/2;
	gameChar_y = floorPos_y;
	gameChar_leg = 0;
	gameChar_legInc = false;

	//init movement vars
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	//init objects
	canyons = [{x_pos: 160, width: 100},
				{x_pos: 1100, width: 100}];
	collectables = [{x_pos: 100, y_pos: 400, size: 12, isFound: false},
					 {x_pos: 660, y_pos: 210, size: 12, isFound: false},
					 {x_pos: 1500, y_pos: 340, size: 12, isFound: false},
					 {x_pos: 1300, y_pos: 310, size: 12, isFound: false}];
	trees = {x_pos: [-200, 50, 300, 900, 1000, 1500, 1600, 2000],
			y_pos: floorPos_y - 90};
	cloud = {x_pos: [-250, 70, 250, 500, 900, 1200, 1500], 
			y_pos: [100, 80, 120, 100, 70, 90, 130], 
			size: 1};
	mountain = {x_pos: [-400, 600, 1500], 
			y_pos: floorPos_y, 
			size: 10};
	platforms = [];
	platforms.push(createPlatforms(360, floorPos_y - 60, 80));
	platforms.push(createPlatforms(360, floorPos_y - 140, 80));
	platforms.push(createPlatforms(495, floorPos_y - 180, 200));
	platforms.push(createPlatforms(1250, floorPos_y - 80, 100));
	enemies = [];
	enemies.push(new Enemy(500, floorPos_y - 194, 100));
	enemies.push(new Enemy(1200, floorPos_y - 12, 200));

	//init others
	game_score = 0;
	flagpole = {isReached: false, x_pos: 2200};
}

function drawLifeTokens(t_lives)
{
	for (var i = 0; i < t_lives; i++)
	{
		push();
		stroke(220,20,60);
		strokeWeight(6);
		line((i * 30) + 30, 53, (i * 30) + 20, 40);
		line((i * 30) + 20, 40, (i * 30) + 23, 38);
		line((i * 30) + 23, 38, (i * 30) + 27, 40);
		line((i * 30) + 27, 40, (i * 30) + 31, 46);
		line((i * 30) + 31, 46, (i * 30) + 35, 40);
		line((i * 30) + 35, 40, (i * 30) + 39, 38);
		line((i * 30) + 39, 38, (i * 30) + 42, 40);
		line((i * 30) + 42, 40, (i * 30) + 32, 53);
		pop();
	}
}

function createPlatforms(x, y, length)
{
	var p = {
		x: x,
		y: y,
		length: length,
		draw: function()
		{
			push();
			stroke(85,107,47);
			strokeWeight(3);
			fill(189,183,107);
			rect(this.x, this.y, this.length, 15);
			pop();
		},
		checkContact: function(gc_x, gc_y)
		{
			if (gc_x > this.x && gc_x < this.x + this.length)
			{
				var d = this.y - gc_y;
				if (d >= 0 && d < 5)
				{
					return true;
				}
			}
			return false;
		}
	}
	
	return p;
}

function Enemy(x, y, range)
{
	this.x = x;
	this.y = y;
	this.range = range;

	this.currentX = x;
	this.inc = 1;
	this.isMovingLeft = false;
	this.legSpeed = 1;
	this.legIncrementing = true;

	this.update = function()
	{
		this.prevLocation = this.currentX;
		this.currentX += this.inc;

		if (this.currentX >= this.x + this.range)
		{
			this.inc = -1;
			this.isMovingLeft = true;
		}

		else if (this.currentX < this.x)
		{
			this.inc = 1;
			this.isMovingLeft = false;
		}
	}

	this.draw = function()
	{
		this.update();
		if (this.isMovingLeft)
		{
			//draw the alien head turned left
			fill(50,205,50);
			ellipse(this.currentX, this.y - 40, 20, 25);
			//draw the alien antennae turned left
			stroke(0);
			strokeWeight(3);
			line(this.currentX - 5 *-1, this.y - 51, this.currentX - 4 *-1, this.y - 60);
			line(this.currentX + 5 *-1, this.y - 51, this.currentX + 10 *-1, this.y - 60);
			//draw the alien eyes turned left
			strokeWeight(2);
			line(this.currentX + 1 *-1, this.y - 42, this.currentX + 3 *-1, this.y - 45);
			line(this.currentX + 3 *-1, this.y - 45, this.currentX + 5 *-1, this.y - 42);
			line(this.currentX + 5 *-1, this.y - 42, this.currentX + 6 *-1, this.y - 38);
			line(this.currentX + 6 *-1, this.y - 38, this.currentX + 4 *-1, this.y - 35);
			line(this.currentX + 4 *-1, this.y - 35, this.currentX + 2 *-1, this.y - 38);
			line(this.currentX + 2 *-1, this.y - 38, this.currentX + 1 *-1, this.y - 45);
			stroke(255,0,0);
			line(this.currentX + 4 *-1, this.y - 37, this.currentX + 3 *-1, this.y - 44);
			//draw the alien body
			noStroke();
			rect(this.currentX - 3, this.y - 28, 5, 30);
			//draw the right hand
			stroke(50,205,50);
			strokeWeight(3);
			line(this.currentX + 1 *-1, this.y - 20, this.currentX + 15 *-1, this.y - 20);
			//draw the legs
			strokeWeight(2);	
			line(this.currentX - 1, this.y + 2, this.currentX + this.legSpeed, this.y + 12);
			line(this.currentX - 1, this.y + 2, this.currentX - this.legSpeed, this.y + 12);
			if (this.legSpeed < 6 && this.legIncrementing) 
			{
				this.legSpeed += 0.5;
				if (this.legSpeed == 5)
				{
					this.legIncrementing = false;
				}
			}
			else if (this.legSpeed > -6 && !this.legIncrementing)
			{
				this.legSpeed -= 0.5;
				if (this.legSpeed == -5)
				{
					this.legIncrementing = true;
				}
			}
		}
		else
		{
			//draw the alien head turned right
			fill(50,205,50);
			ellipse(this.currentX, this.y - 40, 20, 25);
			stroke(0);
			strokeWeight(3);
			line(this.currentX - 5, this.y - 51, this.currentX - 4, this.y - 60);
			line(this.currentX + 5, this.y - 51, this.currentX + 10, this.y - 60);
			strokeWeight(2);
			line(this.currentX + 1, this.y - 42, this.currentX + 3, this.y - 45);
			line(this.currentX + 3, this.y - 45, this.currentX + 5, this.y - 42);
			line(this.currentX + 5, this.y - 42, this.currentX + 6, this.y - 38);
			line(this.currentX + 6, this.y - 38, this.currentX + 4, this.y - 35);
			line(this.currentX + 4, this.y - 35, this.currentX + 2, this.y - 38);
			line(this.currentX + 2, this.y - 38, this.currentX + 1, this.y - 45);
			stroke(255,0,0);
			line(this.currentX + 4, this.y - 37, this.currentX + 3, this.y - 44);
			//draw the alien body
			noStroke();
			rect(this.currentX - 3, this.y - 28, 5, 30);
			//draw the right hand
			stroke(50,205,50);
			strokeWeight(3);
			line(this.currentX + 1, this.y - 20, this.currentX + 15, this.y - 20);
			//draw the legs
			strokeWeight(2);	
			line(this.currentX - 1, this.y + 2, this.currentX + this.legSpeed, this.y + 12);
			line(this.currentX - 1, this.y + 2, this.currentX - this.legSpeed, this.y + 12);
			if (this.legSpeed < 6 && this.legIncrementing) 
			{
				this.legSpeed += 0.5;
				if (this.legSpeed == 5)
				{
					this.legIncrementing = false;
				}
			}
			else if (this.legSpeed > -6 && !this.legIncrementing)
			{
				this.legSpeed -= 0.5;
				if (this.legSpeed == -5)
				{
					this.legIncrementing = true;
				}
			}
		}
	}

	this.checkContact = function(gc_x, gc_y)
	{
		var d = dist(gc_x, gc_y, this.currentX, this.y)

		if (d < 18)
		{
			return true;
		}

		return false;
	}
}

//END