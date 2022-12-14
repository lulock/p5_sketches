let bullets = [],
  tower,
  player,
  player_2,
  players,
  abilities_bar,
  creeps = [],
  BULLET_SIZE = 6,
  BAR_SIZE = 55,
  IDs = [1,2,3,4,5,6,7,8,9,10],
  timer = 5,
  ghost;

var sprite_sheet;
var cat_animation;
var ALLY = 0;
var ENEMY = 1;

  function preload(){
    createCanvas(710, 400);

    player_2 = new Player(createVector(100,100), 20);
    player = new Player(createVector(width/2,height/2), 50);
    ghost = new Sprite(player.position.x, player.position.y, 90, 70);
    bat = new Sprite(player_2.position.x, player_2.position.y, 30, 30);
    bat.scale = 1.6;
    ghost.scale = 0.6;
    ghost.addAni('running', 'assets/catruns001.png', 6);
    bat.addAni('running', 'assets/bat001.png', 4);
    ghost.addAni('idle', 'assets/catruns003.png', 3);
    bat.addAni('idle', 'assets/bat001.png', 1);
    // ghost.ani.stop()
    // cat_animation = loadAnimation('assets/catruns.png', {size:[90, 70], frames: 6});
    // cat_animation = loadAnimation(sprite_sheet);
  }

  function setup() {

    // hue in 360 degree wheel, saturation, brightness
    colorMode(HSB);

    // set up canvas
    createCanvas(710, 400);

    // init abilities bar ui_unit
    abilities_bar = new AbilityBar(createVector(width/2 - 50, height - 51), 50)

    // init tower unit; spawn randomly
    tower = new Tower(createVector(random(width-100),random(height-100)), 55, ENEMY);

    // init player unit; spawn in centre of canvas
    // player = new Player(createVector(width/2,height/2), 10);
    
    // init player 2 unit; spawn in corney of canvas
    player_2 = new Player(createVector(100,100), 20);

    // add 5 randomly placed creeps as enemies! TODO: make particle system?
    for(let i = 0;i<5;i++){
      creeps.push(new Creep());
      // creeps.push(new EnemyParticle());
    }

    // shuffle IDs for no good reason
    IDs.sort(() => Math.random() - 0.5)
}

// every loop, draw to canvas...
function draw() {
  
  // clear background (black)
  clear();
  background(0);
  // animation(cat_animation, width/2,height/2);
  	// stop/play a sprite animation
	// if (mouse.pressing()) {
	// 	ghost.ani.stop();
	// } else {
	// 	ghost.ani.play();
	// }

  // for each enemy creep, create and move towards tower
  for(let i = 0;i<creeps.length;i++) {
    creeps[i].display();
    // creeps[i].moveParticle();
    creeps[i].moveToUnit(tower);

    // check collision with player(s)
    let partCol = Collision(creeps[i].position.x, creeps[i].position.y,creeps[i].size,creeps[i].size, player.position.x, player.position.y, player.size, player.size);
    let partCol2 = Collision(creeps[i].position.x, creeps[i].position.y,creeps[i].size,creeps[i].size, player_2.position.x, player_2.position.y, player_2.size, player_2.size);
    
    // particle size determines damage to player
    if(partCol){
      player.health -=.1*(creeps[i].size);
    }
    // particle size determines damage to player
    if(partCol2){
      player_2.health -=.1*(creeps[i].size);
    }

  }

  // if(player_2.attackUnit(player)){
  // }

  // Ctrl
  if (keyIsDown(17)) {
    drawLine();
  }
  
  // tower
  tower.display()
  
  // player 1 bullets TODO: put this in Unit class update function. Give Bullet class it's own collision detection
  // player.bullets.forEach(function shoot(bullet, index){
  //   bullet.createParticle();
  //   bullet.moveParticle();

  //   if (bullet.isDead()){
  //     bullets.splice(index, 1);
  //   }

  //   let col = false;

  //   if (tower.health > 0){

  //     col = Collision(bullet.position.x, bullet.position.y,  bullet.r,  bullet.r, tower.position.x, tower.position.y, tower.size, tower.size);

  //     if(col) {
  //       tower.health -= 10;
  //     }

  //   };
  // });

  player.update();

  // player 1
  player.display();
  // clear();
  // ghost.ani.draw(player.position.x, player.position.y)

  // player 2
  player_2.display();

  // abilities bar
  abilities_bar.display();

  // key functions
  controls();

  // test get enemey creeps
  // let creeps = player.getNearbyCreeps(100);
  // if (creeps.length > 0){
  //   console.log(creeps);
  // }

}

function keyReleased(){
  // ghost.ani.stop()
  ghost.ani = 'idle';
  bat.ani = 'idle';
}

function controls(){
  
  if (keyIsDown(LEFT_ARROW)) {
    player.position.x -= 5;
    ghost.ani = 'running';
    ghost.x -= 5;
    ghost.mirror.x = false;
  }
  
  if (keyIsDown(RIGHT_ARROW)) {
    player.position.x += 5;
    ghost.ani = 'running';
    ghost.x += 5;
    ghost.mirror.x = true;
  }
  
  
  if (keyIsDown(UP_ARROW)) {
    player.position.y -= 5;
    // ghost.ani.play();
    ghost.ani = 'running';
    ghost.y -= 5;
  }
  
  if (keyIsDown(DOWN_ARROW)) {
    player.position.y += 5;
    ghost.ani = 'running';
    // ghost.ani.play();
    ghost.y += 5;
  }
  
  // ghost.ani.play();
  // Z
  if (keyIsDown(90)) {
    player_2.position.y += 5;
    bat.ani = 'running';
    bat.y += 5;
  }

  // S
  if (keyIsDown(83)) {
    player_2.position.y -= 5;
    bat.ani = 'running';
    bat.y -= 5;
  }

  // D
  if (keyIsDown(68)) {
    player_2.position.x += 5;
    bat.mirror.x = true;
    bat.ani = 'running';
    bat.x += 5;
  }

  // A
  if (keyIsDown(65)) {
    player_2.position.x -= 5;
    bat.mirror.x = false;
    bat.ani = 'running';
    bat.x -= 5;
  }

}

// helper functions

function getCreeps(isEnemyTeam = true){
  if (isEnemyTeam){
    return creeps;
  }else{
    return [] // currently only enemy creeps. return empty list
  }
}

function getUnits(team){
  print("team is", team)
  let allUnits = [player, player_2, tower].concat(creeps);
  let selectedUnits = [];
  allUnits.forEach((unit) => {
    print("unit team is", unit.team)
    if (unit.team === team){
      selectedUnits.push(unit);
    }
  });

  selectedUnits = selectedUnits.filter((unit) => {
    return unit.isDead() === false;
  });

  console.log("all units")
  console.log(allUnits)
  console.log("selected units")
  console.log(selectedUnits)

  return selectedUnits;// currently only enemy creeps. return empty list
}

// key functions
function keyPressed() {
  console.log(player.health)

  // Q key for player health boost
  if (keyCode == 81) {
    boostHealth(5);
  }
   // W key for some other combat ability ...
  if (keyCode == 87) {
      console.log("ABILITY ATTACK")
  }
}

// boost health

function boostHealth(num){
  player.health = Math.min(Math.max(player.health + num, 0), 100)
}

// draw a 8-bit heart
function drawHeart(w,h) {
  let heart = [
    [0,1,1,0,1,1,0],
    [1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1],
    [0,1,1,1,1,1,0],
    [0,0,1,1,1,0,0],
    [0,0,0,1,0,0,0]
  ];
  
  push()
  for (var x = 0; x < 7; x++) {
		for (var y = 0; y <7; y++) {
      // print(heart[x])
      if(heart[y][x]){
        strokeWeight(1);
        stroke(0);
        fill(0, 100, 100);
        rect(x*(w/7), y*(h/7), w/7, h/7);
      }
		}
	}

  pop()
}

// draw a 8-bit star
function drawStar(w,h) {
  let star = [
    [0,0,0,0,0,0,1],
    [0,0,1,1,0,1,0],
    [0,0,0,1,1,0,0],
    [0,0,1,1,1,1,0],
    [0,1,1,1,0,1,0],
    [1,1,1,0,0,0,0],
    [1,1,0,0,0,0,0]
  ];
  
  push()
  for (var x = 0; x < 7; x++) {
		for (var y = 0; y <7; y++) {
      // print(heart[x])
      if(star[x][y]){
        strokeWeight(1);
        stroke(0);
        fill(0, 0, 100);
        rect(x*(w/7), y*(h/7), w/7, h/7);
      }
		}
	}

  pop()
}

//
function drawLine(){
  push()
  strokeWeight(4);
  stroke(255, 204, 50);
  let vec = createVector(mouseX - player.position.x, mouseY - player.position.y)

  if(vec.mag()>=100){
    // let normx = vec.x / vec.mag();
    // let normy = vec.y / vec.mag();
    // line(player.position.x, player.position.y, player.position.x + 100*normx, player.position.y + 100*normy);
    line(player.position.x, player.position.y, mouseX, mouseY); // TEMP
  }else{
    line(player.position.x, player.position.y, mouseX, mouseY);
  }
  describe('a line running from player to mouse pos');
  pop()

}

// load bullet on click
function mouseClicked() {
  player.bullets.push(new Bullet(createVector(player.position.x,player.position.y),createVector(mouseX - player.position.x,mouseY - player.position.y)));
}


// collision function
let Collision = function(x1,y1,w1,h1,x2,y2,w2,h2) {
  if (x1 < x2+w2 && x2 < x1+w1 &&
    y1 < y2+h2 && y2 < y1+h1) {
      // print("collision")
      return true;
    } else {  
      return false;
    }
};

// simple unit class
class Unit {
  // setting the position, size, health, and unique ID
  constructor(position, size, team = ALLY){
    this.ID = IDs.pop()
    // console.log(this.ID)
    this.position = position.copy(); // TODO: is this corner coord or centre?
    this.size = size;
    this.health = 100;
    this.attackRange = 100;
    this.bullets = [];
    this.team = team;
  };

  // get position
  getPosition() {
    return this.position;
  }

  update(){

    // use a reverse for-loop to clean up dead bullets
    var i;
    for (i = this.bullets.length - 1; i >= 0; i -= 1) {
        if (this.bullets[i].isDead()) {
            this.bullets.splice(i, 1);
        }
    }

    this.bullets.forEach(function shoot(bullet){
      bullet.createParticle();
      bullet.moveParticle();
    });

  };

  // change this to nearby units
  getNearbyCreeps(radius = this.attackRange, isEnemyTeam = true){
    let creeps = getCreeps(isEnemyTeam);
    let nearby = [];
    creeps.forEach((creep) => {
      if (dist(creep.x,creep.y, this.position.x, this.position.y) <= radius){
        nearby.push(creep);
      };
    });
    return nearby;
  };

  isDead(){
    return this.health <= 0;
    // if (this.health <= 0) {
    //   return true;
    // } else {
    //   return false;
    // }
  };

};

class AbilityBar extends Unit { // TODO: make this a UIUnit and make that a different thing lol
  constructor(position, size) {
    super(position, size)
  }

  display() {
    push()
    strokeWeight(2)
    stroke(0, 0, 0);
    fill(0, 0, 15);

    translate(this.position.x, this.position.y);
    rect(0, 0, this.size, this.size);
    rect(50, 0, this.size, this.size);

    push()
    textSize(10);
    fill(250);
    text('Q', 0, 12);
    text('W', 52, 12);
    pop()

    translate(8, 9);
    drawHeart(35,35)
    translate(50, 0);
    
    drawStar(35,35)

    describe('a square on the left of centre bottom screen with a heart and the letter Q, another square on the right of centre bottom screen with a sword.');
    pop()
  }

}

class Tower extends Unit {
  constructor(position, size, team) {
    super(position, size, team)
  }

  display() {
    if (this.health > 0){

      push();
      strokeWeight(6.0);
      
      stroke(125+this.health, 100+this.health, 50);
      fill(100);

      translate(this.position.x, this.position.y);

      rect(0, 0, this.size, this.size, 20, 15+(100/this.health), 10, 5+(1000/this.health));
      describe('white rect with outline and round edges of different radii that changes upon declining health');
      
      // tower health bar
      stroke(50, 50, 20);
      rect(0, -20, BAR_SIZE, 5,1);

      stroke(120, 60, 80);
      rect(0, -20, (BAR_SIZE * this.health/100), 5,1);

      pop();
    }
  }
};

class Player extends Unit {
  constructor(position, size, team) {
    super(position, size, team)
  }

  display() {

    if (this.health > 0) {
      push()

      // stroke(50,50,50)
      fill(100);
      // fill(50, 100);
      noStroke();

      translate(this.position.x, this.position.y);
      // circle(0, 0, this.size);
      // describe('white circle');
      
      // player health bar
      strokeWeight(6.0);
      stroke(50, 50, 20);

      rect(-BAR_SIZE/2, -30, BAR_SIZE, 5,1);
 
      stroke(120, 60, 80);
      rect(-BAR_SIZE/2, -30, ( BAR_SIZE * this.health/100), 5,1);
      pop();
    }

  }
};

class Creep extends Unit {
  constructor() {
    super(createVector(random(0,width), random(0,height)), random(1,8), ENEMY);
    this.xSpeed = random(-2,2);
    this.ySpeed = random(-1,1.5);
    this.targetPosition = createVector(random(-200, 200), random(-200, 200));
  }

  display(){
    if (this.health > 0) {
      push();
      noStroke();
      fill(20,30,50);
      circle(this.position.x,this.position.y,this.size);
      pop();
    }
  }

  // update(){
  //   super.update();
  //   // bounce within canvas bounds
  //   // if(this.position.x < 0 || this.position.x > width){
  //   //   this.xSpeed*=-1;
  //   // }
  //   // if(this.position.y < 0 || this.position.y > height){
  //   //   this.ySpeed*=-1;
  //   // }
  // }

    // particle motion
    moveToUnit(unit) {

      // move at constant speed
      this.position.x = lerp(this.position.x, unit.position.x + this.targetPosition.x, 0.005);
      this.position.y = lerp(this.position.y, unit.position.y + this.targetPosition.y, 0.005);
  
      // this.x+=this.xSpeed;
      // this.y+=this.ySpeed;
    }

    getSpeed(){
      return [this.xSpeed, this.ySpeed];
    }
}

// enemy particle class
class EnemyParticle {
  // setting the co-ordinates, radius and the
  // speed of a particle in both the co-ordinates axes.
  constructor(){
    this.x = random(0,width);
    this.y = random(0,height);
    this.r = random(1,8);
    this.xSpeed = random(-2,2);
    this.ySpeed = random(-1,1.5);
    this.targetPosition = createVector(random(-200, 200), random(-200, 200));
  }

// particle creation
  createParticle() {
    push()
    noStroke();
    fill(20,30,50);
    circle(this.x,this.y,this.r);
    pop()
  }

// particle motion
  moveParticle() {
    // bounce within canvas bounds
    if(this.x < 0 || this.x > width){
      this.xSpeed*=-1;
    }
    if(this.y < 0 || this.y > height){
      this.ySpeed*=-1;
    }
    
    // move at constant speed
    this.x+=this.xSpeed;
    this.y+=this.ySpeed;
  }

  // particle motion
  moveToUnit(unit) {

    // move at constant speed
    this.x = lerp(this.x, unit.position.x + this.targetPosition.x, 0.005);
    this.y = lerp(this.y, unit.position.y + this.targetPosition.y, 0.005);

    // this.x+=this.xSpeed;
    // this.y+=this.ySpeed;
  }

  // particle ATTACKS
  attackUnit(unit) {
    let col = Collision(this.x, this.y,  this.r+100,  this.r+100, unit.position.x, unit.position.y, unit.size, unit.size);

    if(col){
      console.log("SHOOT")
    }
  }

  // get position
  getPosition() {
    return [this.x, this.y]
  }

  // get speed
  getSpeed() {
    return [this.xSpeed, this.ySpeed]
  }

};

// bullet particle class
class Bullet {
  // setting the co-ordinates, radius and the
  // speed of a particle in both the co-ordinates axes.
  constructor(position, direction, team = ALLY){
    this.position = position.copy();
    this.direction = direction.copy();
    this.lifespan = 255;
    this.acceleration = createVector(0, 0.05);
    this.velocity = createVector(random(-1, 1), random(-1, 0));
    this.r = BULLET_SIZE;
    this.hit = false;
    this.team = team;
  }

  // particle creation
  createParticle() {
    let withinBounds = this.position.x >= 0 && this.position.x <= width && this.position.y >= 0 && this.position.y <= height;
    if (withinBounds){
      push();
      // set colour
      strokeWeight(1);
      stroke(255, 204, 150);
      fill(50, this.lifespan);

      ellipse(this.position.x, this.position.y, this.r, this.r);
      pop();

    }else{
      this.lifespan = 0;
    };
  }

  // particle motion
  moveParticle() {
    let withinBounds = this.position.x >= 0 && this.position.x <= width && this.position.y >= 0 && this.position.y <= height; 

    if (withinBounds){
      this.position.x += this.direction.x * 1/10;
      this.position.y += this.direction.y * 1/10;
    } else {
      this.lifespan = 0;
    };

    let units = getUnits(ENEMY);
    units.forEach((unit) => {
      let col = Collision(this.position.x, this.position.y, this.r,  this.r, unit.position.x, unit.position.y, unit.size, unit.size);
      if (col) {
        unit.health -= this.r;
        this.lifespan = 0;
      }
    });
  }

  // check if particle is dead
  isDead(){
    // print("particle is dead")
    return this.lifespan <= 0;
  };

};