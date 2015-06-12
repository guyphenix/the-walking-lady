
TheWalkingLady.Game = function (game) {};

//  Set up our variables
var score = 0;
var scoreText;
var faller;
var gameMusicIsPlaying = false;
var collectSound;
var powerup;
//  speedNumber controls the walk speed. 1 = slow, 2 = normal, 3 = fast.
var speedNumber = 2;
var powerupSpawnInterval = [8000, 9000, 13000];
var badItemSpawnInterval = [6000, 11000, 15000];
var itemSpawnInterval = [1000, 2000, 3000];
var randArrayNumber = 2;
var lives = 3;
var heart1;
var heart2;
var heart3;
var lifeLostSound;

function collectItem(lady, item) {
	//  Play a sound
	collectSound = this.add.audio('collectItemSound');
	collectSound.play();
	//  Destroy the item
	item.kill();
	//  Add 10 the the score
	score += 10;
	//  Update the score counter in the upper left
	scoreText.text = 'Score: ' + score;
	//  Update the gravity
	faller.body.gravity.y = 100 + score;
}

function createFaller() {
	//  Set up an array with all the different types of items we're going to choose from
	var itemsArray = ['potion', 'cheese', 'bread', 'coin', 'gem'];
	//  Add the item at a random position
	faller = this.add.sprite(Math.floor(Math.random() * 366), -50, itemsArray[Math.floor(Math.random() * 5)]);
	//  Start physics on the item
	this.physics.enable(faller, Phaser.Physics.ARCADE);
	//  Add the item to the 'items' group
	items.add(faller);
	//  Set the gravity for the item
	faller.body.gravity.y = 100 + score;
	//  Randomize the interval
	randArrayNumber = Math.floor(Math.random() * 2);
}

function createPowerup() {
	//  Add the powerup at a random position
	powerup = this.add.sprite(Math.floor(Math.random() * 366), -50, 'powerup');
	//  Start physics on the item
	this.physics.enable(powerup, Phaser.Physics.ARCADE);
	//  Add the item to the powerupGroup group
	powerupGroup.add(powerup);
	//  Set the gravity for the item
	powerup.body.gravity.y = 300;
	//  Randomize the interval
	randArrayNumber = Math.floor(Math.random() * 2);
}

function createBadItem() {
	//  Add the bad item at a random positon
	badItem = this.add.sprite(Math.floor(Math.random() * 366), -50, 'badItem');
	//  Start physics on it
	this.physics.enable(badItem, Phaser.Physics.ARCADE);
	//  Add the item to the badItemGroup group
	badItemGroup.add(badItem);
	//  Set the gravity for the item
	badItem.body.gravity.y = 400;
	//  Randomize the interval
	randArrayNumber = Math.floor(Math.random() * 2);
	
}

function checkLives(floor, item) {
	//  Take away a life
	lives -= 1;
	//  Destroy the item
	item.kill();
	//  Check to see if player is dead
	if (lives === 0) {
		//  Start the game over state
		lifeLostSound.play();
		this.state.start('GameOverScreen');
	}
	if (lives === 2) {
		//  Take away a heart
		heart3.destroy();
		lifeLostSound = this.add.sound('lostLifeSound');
		lifeLostSound.play();
	}
	if (lives === 1) {
		//  Take away a heart
		heart2.destroy();
		lifeLostSound.play();
	}
}

TheWalkingLady.Game.prototype = {
	create: function () {
		//  Set the screen's background color
		this.stage.backgroundColor = '#ffedb7';
		//  Start the physics system
		this.physics.startSystem(Phaser.Physics.ARCADE);
		
		//  Add the floor
		floor = this.add.sprite(0, this.world.height - 32, 'floor');
		//  Enable physics on it
		this.physics.arcade.enable(floor);
		//  Make the floor a static object so it doesn't fall when the lady is on it
		floor.body.immovable = true;

		//  Add the lady
		lady = this.add.sprite(this.world.width / 2, this.world.height - 94, 'lady');
		lady.anchor.set(0.5, 0);
		//  Make her twice as big
		lady.scale.setTo(2, 2);
		//  Turn off smoothing so the pixel art looks nice
		lady.smoothed = false;
		//  Setup physics for the lady
		this.physics.arcade.enable(lady);
		lady.body.gravity.y = 300;
		lady.body.collideWorldBounds = true;
		//  Add her animations
		lady.animations.add('left', [10, 9, 11, 9], 7, true);
		lady.animations.add('right', [4, 5, 3], 7, true);

		//  Create a group for all the falling items
		items = this.add.group();
		//  Enable physics on them
		items.enableBody = true;
		
		//  Create a group for all the powerups
		powerupGroup = this.add.group();
		//  Enable physics on them
		powerupGroup.enableBody = true;
		
		//  Create a group for all the bad items
		badItemGroup = this.add.group();
		//  Enable physics on them
		badItemGroup.enableBody = true;

		//  Add the score text in the upper left
		scoreText = this.add.text(8, 8, 'Score: 0', {fontSize: '14px', fill: '#000'});
		
		//  Add the main item spawn timer. This runs the createFaller function every 2 seconds. It only repeats 1000 times,
		//  which should be more than enough. The player should lose before it reaches 1000.
		this.time.events.repeat(itemSpawnInterval[randArrayNumber], 1000, createFaller, this);
		
		//  Add the powerup item spawn timer. It runs the createPowerup function every once in a while.
		this.time.events.repeat(powerupSpawnInterval[randArrayNumber], 1000, createPowerup, this);
		
		//  Add the bad item spawn timer. It runs the createBadItem function every once in a while.
		this.time.events.repeat(badItemSpawnInterval[randArrayNumber], 1000, createBadItem, this);
			
		//  Render Hearts
		heart1 = this.add.sprite(100, 10, 'heart');
		heart2 = this.add.sprite(130, 10, 'heart');
		heart3 = this.add.sprite(160, 10, 'heart');
	},
	
	update: function () {
		//  Reset the lady's movement
		lady.body.velocity.x = 0;

		//  Key events
		cursors = this.input.keyboard.createCursorKeys();
		//  Check the speed number
		switch (speedNumber) {
		case 1:
			//  Slow speed controls
			if (cursors.left.isDown) {
				lady.body.velocity.x = -50;
				lady.animations.play('left');
			} else if (cursors.right.isDown) {
				lady.body.velocity.x = 50;
				lady.animations.play('right');
			} else {
				lady.animations.stop();
				lady.frame = 7;
			}
			break;
		case 2:
			//  Normal speed controls
			if (cursors.left.isDown) {
				lady.body.velocity.x = -200;
				lady.animations.play('left');
			} else if (cursors.right.isDown) {
				lady.body.velocity.x = 200;
				lady.animations.play('right');
			} else {
				lady.animations.stop();
				lady.frame = 7;
			}
			break;
		case 3:
			//  Fast speed controls
			if (cursors.left.isDown) {
				lady.body.velocity.x = -400;
				lady.animations.play('left');
			} else if (cursors.right.isDown) {
				lady.body.velocity.x = 400;
				lady.animations.play('right');
			} else {
				lady.animations.stop();
				lady.frame = 7;
			}
			break;
		}
		
		//  Collision checking
		//  Run the collectItem function when the lady catches an item
		this.physics.arcade.overlap(lady, items, collectItem, null, this);
		
		//  Run the checkLives runction when an item touches the floor
		this.physics.arcade.collide(items, floor, checkLives, null, this);
		
		//  Run this function when a powerup touches the floor
		this.physics.arcade.overlap(powerupGroup, floor, function (floor, powerupOnGround) {
			//  Destroy the powerup
			powerupOnGround.kill();
		}, null, this);
		
		//  Run this function when the lady catches a powerup
		this.physics.arcade.overlap(powerupGroup, lady, function (lady, powerupCaught) {
			//  Destroy the powerup
			powerupCaught.kill();
			//  Play the powerup sound
			powerupSound = this.add.audio('powerupSound');
			powerupSound.play();
			//  Increase the speed
			speedNumber = 3;
			//  Wait 6 seconds, then reset the speed back to normal
			this.time.events.add(Phaser.Timer.SECOND * 6, function () {
				speedNumber = 2;
			}, this);
		}, null, this);
		
		//  Run this function when a bad item touches the floor
		this.physics.arcade.overlap(badItemGroup, floor, function (floor, badItemOnGround) {
			//  Destroy the bad item
			badItemOnGround.kill();
		}, null, this);
		
		//  Run this function when the lady catches a bad item
		this.physics.arcade.overlap(badItemGroup, lady, function (lady, badItemCaught) {
			//  Destroy the bad item
			badItemCaught.kill();
			//  Play the bad item sound
			badItemSound = this.add.audio('badItemSound');
			badItemSound.play();
			//  Decrease the speed
			speedNumber = 1;
			//  Wait 6 seconds, then reset the speed back to normal
			this.time.events.add(Phaser.Timer.SECOND * 6, function () {
				speedNumber = 2;
			}, this);
		}, null, this);

		//  Make the lady and the floor collide
		this.physics.arcade.collide(lady, floor);
		
		//  Check if music isn't already playing
		if (gameMusicIsPlaying === false) {
			// Play the music on a loop
			gameMusic = this.add.audio('gameMusic');
			gameMusic.loop = true;
			gameMusic.play();
			//  Set the variable so we can check it later
			gameMusicIsPlaying = true;
		}
    }
};
