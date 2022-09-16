let bullets = [],
  tower,
  player,
  player_2,
  players,
  particles = [],
  BULLET_SIZE = 12,
  IDs = [1,2,3,4,5,6,7,8,9,10],
  timer = 5;

  function setup() {
    // set up canvas
    createCanvas(710, 400);

    // init tower unit; spawn randomly
    tower = new Unit(createVector(random(width-100),random(height-100)), 55);

    // init player unit; spawn in centre of canvas
    player = new Unit(createVector(width/2,height/2), 20);
    
    // init player 2 unit; spawn in corney of canvas
    player_2 = new Unit(createVector(100,100), 20);

    // add 10 random particles as enemies!
    for(let i = 0;i<10;i++){
      particles.push(new EnemyParticle());
    }

    // default draw settings
    strokeWeight(6.0);
    stroke(50, 50, 20);
    fill(100)

    // shuffle IDs
    IDs.sort(() => Math.random() - 0.5)
}

// every loop, draw to canvas...
function draw() {
  
  // hue in 360 degree wheel, saturation, brightness
  colorMode(HSB);
  
  // clear background (black)
  background(0);

  // abilities bar
  push()
  strokeWeight(2)
  stroke(0, 0, 0);
  fill(0, 0, 15);
  rect(width/2 - 50, height - 51, 50, 50);
  rect(width/2, height - 51, 50, 50);

  push()
  textSize(10);
  fill(250);
  text('Q', width/2 - 50, height - 40);
  text('W', width/2 + 2, height - 40);
  pop()

  translate(width/2 - 42, height - 42);
  drawHeart(35,35)
  translate(50, 0);
  
  drawStar(35,35)

  describe('two gold rectangles');
  pop()

  // for each enemy particle, create and move
  for(let i = 0;i<particles.length;i++) {
    particles[i].createParticle();
    particles[i].moveParticle();

    // check collision with player
    let partCol = Collision(particles[i].x, particles[i].y,particles[i].r,particles[i].r, player.position.x, player.position.y, player.size, player.size);
    let partCol2 = Collision(particles[i].x, particles[i].y,particles[i].r,particles[i].r, player_2.position.x, player_2.position.y, player_2.size, player_2.size);
    
    // particle size determines damage to player
    if(partCol){
      player.health -=.1*(particles[i].r);
    }

    // particle size determines damage to player
    if(partCol2){
      player_2.health -=.1*(particles[i].r);
    }
  }
  
  // tower
  if (tower.health > 0){
    // draw rectangle with rounded corners dependant on tower health :)
    
    // push() function saves current drawing style settings and transformations
    // pop() restores these settings
    push()
    stroke(125+tower.health, 100+tower.health, 50);
    fill(100);
    rect(tower.position.x, tower.position.y, tower.size, tower.size, 20, 15+(100/tower.health), 10, 5+(1000/tower.health));
    describe('white rect with outline and round edges of different radii that changes upon declining health');
    
    // tower health bar
    stroke(50, 50, 20);
    rect(tower.position.x, tower.position.y-20, tower.size, 5,1)
    pop()
    
    push()
    stroke(120, 60, 80);
    rect(tower.position.x, tower.position.y-20, (tower.size * tower.health/100), 5,1)
    pop()
  }

  // player 1
  if (player.health > 0){
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

    push()
    stroke(255, 204, 50);
    fill(100);
    strokeWeight(0.0);
    circle(player.position.x, player.position.y, player.size);
    describe('white circle with black outline in mid of gray canvas');
    pop()

    push()
    // player health bar
    stroke(50, 50, 20);
    rect(player.position.x-tower.size/2, player.position.y-30, tower.size, 5,1)
    pop()

    push()
    stroke(120, 60, 80);
    rect(player.position.x-tower.size/2, player.position.y-30, (tower.size * player.health/100), 5,1)
    pop()

  } 

  // player 2
  if (player_2.health > 0){
    push()

    strokeWeight(4);
    stroke(255, 204, 50);
    fill(250);
    strokeWeight(0.0);
    circle(player_2.position.x, player_2.position.y, player_2.size);
    describe('white circle with black outline in mid of gray canvas');
    pop()

    push()
    // player health bar
    stroke(50, 50, 20);
    rect(player_2.position.x-tower.size/2, player_2.position.y-30, tower.size, 5,1)
    pop()

    push()
    stroke(120, 60, 80);
    rect(player_2.position.x-tower.size/2, player_2.position.y-30, (tower.size * player_2.health/100), 5,1)
    pop()

  } 

  bullets.forEach(function shoot(bvalue, index){
    push()

    // set colour
    strokeWeight(2);
    stroke(255, 204, 150);
    fill(50, bvalue.lifespan);

    // move bullet
    bvalue.position.x += bvalue.direction.x * 1/10
    bvalue.position.y += bvalue.direction.y * 1/10

    let col = false;

    if (tower.health > 0){
  
      col = Collision(bvalue.position.x, bvalue.position.y,  bvalue.r,  bvalue.r, tower.position.x, tower.position.y, tower.size, tower.size);
  
      if(col) {
        tower.health -= 10;
      }

    }

    // draw bullet only if within bounds, otherwise remove bullet
    if (bvalue.position.x >= 0 && bvalue.position.x <= width && bvalue.position.y >= 0 && bvalue.position.y <= height && !col) {
      bvalue.createParticle()
    } else { 
      bullets.splice(index, 1);
      console.log(bullets.length)
    }

    pop()
  });

  if (keyIsDown(LEFT_ARROW)) {
    player.position.x -= 5;
  }

  if (keyIsDown(RIGHT_ARROW)) {
    player.position.x += 5;
  }

  if (keyIsDown(UP_ARROW)) {
    player.position.y -= 5;
  }

  if (keyIsDown(DOWN_ARROW)) {
    player.position.y += 5;
  }

  // W
  // if (keyIsDown(87)) {
  //   // player_2.position.y -= 5;
  // }

  // S
  if (keyIsDown(83)) {
    player_2.position.y += 5;
  }

  // D
  if (keyIsDown(68)) {
    player_2.position.x += 5;
  }

  // A
  if (keyIsDown(65)) {
    player_2.position.x -= 5;
  }

}

function keyPressed() {
  print(player.health)
  if (keyCode === 87) {
    if(player.health <= 95){
      player.health += 5;
    }else if(player.health.toFixed()<100){
      player.health +=1;
      player.health.toFixed();

    }
  }
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
// cooldown
function cooldown(key) {
  if(key == 87){
    ellipse(width/2, height/2, 50,50)
  }
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


// load bullet on click
function mouseClicked() {
  bullets.push(new Particle(createVector(player.position.x,player.position.y),createVector(mouseX - player.position.x,mouseY - player.position.y)));
}


// collision function
let Collision = function(x1,y1,w1,h1,x2,y2,w2,h2) {
  if (x1 < x2+w2 && x2 < x1+w1 &&
    y1 < y2+h2 && y2 < y1+h1) {
      print("collision")
      return true
    } else {  
      return false
    }
};

// simple unit class
class Unit {
  // setting the position, size, health, and unique ID
  constructor(position, size){
    this.ID = IDs.pop()
    console.log(this.ID)
    this.position = position.copy();
    this.size = size;
    this.health = 100;
  }
};

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
    if(this.x < 0 || this.x > width)
      this.xSpeed*=-1;
    if(this.y < 0 || this.y > height)
      this.ySpeed*=-1;
    
    // move at constant speed
    this.x+=this.xSpeed;
    this.y+=this.ySpeed;
  }
};

// bullet particle class
class Particle {
  // setting the co-ordinates, radius and the
  // speed of a particle in both the co-ordinates axes.
  constructor(position, direction){
    this.position = position.copy();
    this.direction = direction.copy();
    this.lifespan = 255;
    this.acceleration = createVector(0, 0.05);
    this.velocity = createVector(random(-1, 1), random(-1, 0));
    this.r = BULLET_SIZE;
  }

  // particle creation
  createParticle() {
    ellipse(this.position.x, this.position.y, this.r, this.r);
  }

  // particle motion
  moveParticle() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.lifespan -= 2;
  }
  // check if particle is dead
  isDead(){
    return this.lifespan < 0;
  };

};