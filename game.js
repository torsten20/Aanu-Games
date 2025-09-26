// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

score=0;
level=1;
ballspeed=11;
go=0; //game not over

docheight=document.documentElement.clientHeight
docwidth=document.documentElement.clientWidth

console.log(docheight,docwidth);

aratio=4/3;

canvas.width = 600;
canvas.height = 800;

if(docheight>docwidth*aratio){
  zoom=docwidth/canvas.width;
} else {
  zoom=docheight/canvas.height;

}

zoom=zoom-0.05;
document.firstElementChild.style.zoom = zoom;

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
  bgReady = true;
};
bgImage.src = "images/bg.png";

var starImage = new Image();
starImage.src="images/star.png";

// basket image
var basketReady = false;
var basketImage = new Image();
basketImage.onload = function () {
  basketReady = true;
};
basketImage.src = "images/basket_tr.png";

// ball image
var ballReady = false;
var ballImage = new Image();
ballImage.onload = function () {
  ballReady = true;
};

//ballImage.src = "images/alphabet_tr_2.png";
ballImage.src = "images/alphabet_tr_3.png";
var bsfcImage=new Image();
bsfcImage.src='images/bubble_tr.png';
//Dimensions of a single letter
var letterw=25;
var letterh=31;

var latLetw=25;
var latLeth=17;

var basketw=60;
var basketh=70;

var Nbaskets=5;
//store the x location of randomly picked letters
var xloc=[];
var baskets=[];

var balls=[];

var ranidx;

var star =
{
  active:1,
  x:200,
  y:400
}


var ballsCaught = 0;
var score=0;
var miss=0;

//Time
var time=0
var tinterval=0

// Handle keyboard controls
var keysDown = {};
var key=-1;

addEventListener("keydown", function (e) {
  keysDown[e.keyCode] = true;
  key=e.keyCode;
}, false);

addEventListener("keyup", function (e) {
  delete keysDown[e.keyCode];
  key=-1;
}, false);



//implement touch recognision

var startX;
var startY;
var diffX=0;
var diffY=0;
var etouch=0;

bgc=0;

addEventListener("touchstart", function (e) {
  const touch = e.changedTouches[0];
  startX = touch.clientX;
  startY = touch.clientY;

  baskets.forEach(function(basket){
   if(startX>=basket.x*zoom && startX<=basket.x*zoom+basketw*zoom && startY>=basket.y*zoom && startY<=(basket.y+basketh)*zoom){ //is the touch within the area of a basket?
     baskets.forEach(function (obasket){
       obasket.active=0;
     });
    basket.active=1;
   }
  });
  //if tap in top third change background picture
  if(startY<canvas.height/3.) {
    bgc=bgc+1;
    if(bgc>5){
      bgc=0;
    }
    if(bgc==0){
      bgImage.src = "images/bg.png";
    } else {
      bgImage.src = "images/bg-"+bgc+".png";

    }
     
  }

  etouch=1;
  e.preventDefault();
},{passive: false});

addEventListener("touchmove", function (e) {
  const touch = e.changedTouches[0];
  diffX = touch.clientX - startX;
  diffY = touch.clientY - startY;
  startX = touch.clientX;
  startY = touch.clientY;
  etouch=1;
  e.preventDefault();
},{passive:false});

addEventListener("touchend", function (e) {
  e.preventDefault();
  diffX=diffY=0;
  etouch=0;

  baskets.forEach(function(basket){
    basket.active=0;
    basket.x=basket.x0;
    basket.y=basket.y0;
  });
},{passive:false});


var test=0;

// Reset the game when the player catches a ball
var reset = function () {
  var success;
  //get array of x, y and hit from all balls
  let x = balls.map(ball => ball.x);
  let y = balls.map(ball => ball.y);
  let hit=balls.map(ball => ball.hit);
  balls.forEach((ball,index) => {
    if (ball.hit==1)
    {
      success=0;
      c=0;
      while(success==0){ //as long as there is an overlap with one of the other balls
        ball.x= 32 + (Math.random() * (canvas.width - 64)); //generate random position
        x[index]=ball.x;
        success=1;
        for(i=0;i<balls.length;i++ ){
          if( ball.x >= x[i]-50 && ball.x <= x[i]+50 && y[i]<400  && i!=index && c<20 ){ //if there is overlap with one of the other balls less than 400px down, set success to 0 and keep looping
                                                                                         //stop trying after 20 attempts
            success=0;
          }
        }
        c++;
      }
      ball.y=-40;
      ball.speed=ballspeed+(Math.random()-0.5)*5;
      //ball.speed=10+(Math.random()-0.5)*10;
      ball.hit=0;
      ranidx=Math.round(Math.random()*(Nbaskets-1));
      ball.xloc=xloc[ranidx];
    }
  });


};

// Update game objects
var update = function (modifier) {
  var idx;
  //baskets.forEach(function(basket){
  baskets.forEach((basket,index) => {
    if(etouch==0){
      if(basket.active==1){
        idx=index;
        if (38 in keysDown) { // Player holding up
          if(basket.y-basket.speed*modifier>0)
          {
            basket.y -= basket.speed * modifier;
          }
        }
        if (40 in keysDown) { // Player holding down
          if(basket.y+basket.speed*modifier<canvas.height-60)
          {
            basket.y += basket.speed * modifier;
          }
        }
        if (37 in keysDown) { // Player holding left
          if(basket.x-basket.speed*modifier>0)
          {
            basket.x -= basket.speed * modifier;
          }
        }
        if (39 in keysDown) { // Player holding right
          if(basket.x+basket.speed*modifier<canvas.width-50)
          {
            basket.x += basket.speed * modifier;
          }
        }
        /*if (49 in keysDown){
          bgImage.src = "images/bg.png";
        }
        if (50 in keysDown){
          bgImage.src = "images/bg-1.png";
        }
        if (51 in keysDown){
          bgImage.src = "images/bg-2.png";
        }
        if (52 in keysDown){
          bgImage.src = "images/bg-3.png";
        }
        if (53 in keysDown){
          bgImage.src = "images/bg-4.png";
        }
        if (54 in keysDown){
          bgImage.src = "images/bg-5.png";
        }*/

        
      } //if basket active
    } else {//if touch is used
      if(basket.active==1){ //if basket is active (was touched) move it 
        //basket.x=basket.x+diffX/zoom;
        //basket.y=basket.y+diffY/zoom;
        basket.x=startX/zoom-basketw/2.;
        basket.y=startY/zoom-basketh/2.;
      }
      
    }

        balls.forEach(function (ball) {//move balls
          if(ball.active==1)
          {
             ball.y+=ball.speed*modifier
             if(ball.y>canvas.height-77-44) //canvas height-height of line-size of circle
             {
               miss+=1;
               ball.hit=1;
               reset();
             }
          }

          // Are they touching?
          if (
            basket.x <= (ball.x + letterw)
            && ball.x <= (basket.x + 50)
            && basket.y <= (ball.y + letterh)
            && ball.y <= (basket.y + 60)
          ) {
            if(basket.xloc==ball.xloc){
              ++ballsCaught;
              score=score+10*level;
              ball.hit=1;
              star.active=1;
              star.x=ball.x;
              star.y=ball.y;
              star.time=time;
            } else {
              miss+=1;
              ball.hit=1;
              star.active=2;
              star.time=time;
            }
            reset();
          }
        });

  });

  if (32 in keysDown){  //Player pressing space
    baskets[idx].active=0; //shift to next basket
    baskets[idx].x=baskets[idx].x0;
    baskets[idx].y=baskets[idx].y0;
    if(idx<4){
      baskets[idx+1].active=1;
    } else {
      baskets[0].active=1;
    }
    delete keysDown[32]; //otherwise baskets shift multiple times if key is pressed too long
  }


  //create new balls
  if(tinterval>5*balls.length && balls.length<10)
  {
    level+=1;
    var success;
    //get array of x and y coordinates from all balls
    let x = balls.map(ball => ball.x);
    let y = balls.map(ball => ball.y);

    success=0;
    c=0;
    while(success==0){ //as long as there is an overlap with one of the other balls
      nbx= 32 + (Math.random() * (canvas.width - 64)); //generate random position
      success=1;
      for(i=0;i<balls.length;i++ ){
        if( nbx >= x[i]-50 && nbx <= x[i]+50 && y[i]<400 && c<20 ){ //if there is overlap with one of the other balls set success to 0 and keep looping
          success=0;
        }
      }
      c++;
    }

    ranidx=Math.round(Math.random()*(Nbaskets-1));
    let newBall=
    {
      speed:ballspeed+(Math.random()-0.5)*5,
      x:nbx,
      active:1,
      hit:1,
      xloc:xloc[ranidx]
    }
    balls.push(newBall);
    tinterval=0;
  }
  if(balls.length>=10 && tinterval>30){ //after level 10 don't add more balls but increase their speed by 2 every 30s
    tinterval=0;
    ballspeed+=2;
    level+=1;
  }

  reset();

};

// Draw everything
var render = function () {
  if (bgReady) {
    ctx.drawImage(bgImage, 0, 0, bgImage.width, bgImage.height,0,0,canvas.width,canvas.height);
  }

  baskets.forEach((basket,index) => {
    if (basketReady) {
      ctx.drawImage(basketImage, basket.x, basket.y,basketw,basketh);
      if(basket.active==0){
        ctx.drawImage(ballImage, basket.xloc,43,latLetw,latLeth,basket.x+10, basket.y+10,latLetw+10,latLeth+10);
      } else{
        ctx.drawImage(ballImage, basket.xloc,43,latLetw,latLeth,basket.x+10, basket.y+10,latLetw+15,latLeth+15);
      }
    }
  });

  balls.forEach(function (ball) {
    if (ballReady) {
      ctx.drawImage(bsfcImage, ball.x, ball.y, 60, 60);
      ctx.drawImage(ballImage, ball.xloc,0,letterw,letterh,ball.x+(60-letterw)/2, ball.y+(60-letterh)/2,letterw,letterh);
    }
  });
  T=0.5
  if(star.active==1 && time-star.time<T){   //if score
    fac=(time-star.time)/T;
    ctx.drawImage(starImage, 0,0,50,50,star.x, star.y,50*fac,50*fac);
  } else if (star.active==2 && time-star.time<0.1 && go==0){ //if fail
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "red";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.globalAlpha = 1.0;
  } else {
    star.active=0;
  }


  // Score
  ctx.fillStyle = "rgb(250, 250, 250)";
  ctx.font = "24px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Time: "+Math.floor(time)+" s Score: " + score+" Balls missed: "+miss+" Level: "+level, 32, 32);
};

// The main game loop
var main = function () {
  var now = Date.now();
  var delta = now - then;

  time+=delta/1000
  tinterval+=delta/1000

  update(delta / 1000);
  render();

  then = now;

  if(miss<10){
  // Request to do this again ASAP
    requestAnimationFrame(main);
  }else { //Game over
    go=1;
    render();
    ctx.font = "45px Helvetica";
    ctx.textAlign = "centre";
    ctx.fillText("GAME OVER!", 150, 350);
    ctx.textAlign = "centre";
    ctx.fillText("Your score: "+score, 150, 420);
    
    /*
    //get name for highscore ranking
    player = prompt("Please enter your name:");
    //if cookie already exists, get cookie with previous highscores and add new one
    
    name="player"
    const cookieName = `${encodeURIComponent(name)}=`;
    const cookie = document.cookie;
    let value = null;
    
    const startIndex = cookie.indexOf(cookieName);
    if (startIndex > -1) {
      const endIndex = cookie.indexOf(';', startIndex);
      if (endIndex == -1) {
        endIndex = cookie.length;
      }
     //get the highscore list
     value = decodeURIComponent(cookie.substring(startIndex + name.length, endIndex) );
    }
    

    ctx.fillText("Highscore: "+value, 150, 500);

    //set cookie to remember high scores
    value=value+score+" "+player+";";
    let cookieText=`${encodeURIComponent("player")}=${encodeURIComponent(value)}`;
    
    var date = new Date();
    var days=10000;
    date.setTime(date.getTime() + (days*24*60*60*1000));
    
    cookieText += `; expires=${date.toUTCString()}`;
    
    document.cookie=cookieText;
    */
  }
};


var item=0;
var Nitems=5;
var y=0;
var menu = function () {

  y=150+70*item;

  ctx.font = "45px Helvetica";
  ctx.fillStyle = "blue";
  ctx.fillRect(150,110,400,60);
  ctx.fillStyle = "white";
  ctx.textAlign = "centre";
  ctx.fillText("1 Vowels", 150, 150);
  ctx.fillStyle = "blue";
  ctx.fillRect(150,180,400,60);
  ctx.fillStyle = "white";
  ctx.textAlign = "centre";
  ctx.fillText("2 Consonants 1", 150, 220);
  ctx.fillStyle = "blue";
  ctx.fillRect(150,250,400,60);
  ctx.fillStyle = "white";
  ctx.textAlign = "centre";
  ctx.fillText("3 Consonants 2", 150, 290);
  ctx.fillStyle = "blue";
  ctx.fillRect(150,320,400,60);
  ctx.fillStyle = "white";
  ctx.textAlign = "centre";
  ctx.fillText("4 Consonants 3", 150, 360);
  ctx.fillStyle = "blue";
  ctx.fillRect(150,390,400,60);
  ctx.fillStyle = "white";
  ctx.textAlign = "centre";
  ctx.fillText("5 All letters", 150, 430);

  mtap=0;
  if(etouch==1){
    if(startX>150*zoom && startX<400*zoom){
      //vowels
      if(startY>110*zoom && startY<170*zoom){
        xoff=0;
        Nletter=12;
        mtap=1;
      }
      //consonants 2
      if(startY>180*zoom && startY<240*zoom){
        xoff=12;
        Nletter=10;
        mtap=1;
      }
      //all letters
      if(startY>390*zoom && startY<450*zoom){
        xoff=0;
        Nletter=22;
        mtap=1;
      }

    }
  }

  if (key==49){
    xoff=0;
    Nletter=12;
  }
  if (key==50){
     xoff=12;
     Nletter=10;
  }
  if (key==51){
     xoff=12;
     Nletter=10;
  }
  if (key==52){
     xoff=12;
     Nletter=10;
  }
  if (key==53){
     xoff=0;
     Nletter=22;
  }

  if((key>=49 && key<=54) || mtap==1){
    //var xloc=[]
    Nbaskets=5;
    var ran=0;
    for(i=0;i<Nbaskets;i++){
      ran=Math.floor(Math.random()*(Nletter-1))*(letterw+1);
      while(xloc.includes(xoff*(letterw+1)+ran)){
        ran=Math.floor(Math.random()*(Nletter-1))*(letterw+1);
      }
      xloc[i]=xoff*(letterw+1)+ran;
    }
    // Game objects
    baskets =[
      {
        speed: 256, // movement in pixels per second
        active: 1,
        x0: 30,
        x: 30,
        y:canvas.height-60,
        y0:canvas.height-60,
        xloc:xloc[0]
      }
    ]

    for(i=1;i<Nbaskets;i++)
    {
      let newBasket=
      {
        speed:256,
        active:0,
        x:30+120*i,
        x0:30+120*i,
        y:canvas.height-60,
        y0:canvas.height-60,
        xloc:xloc[i]
      }
      baskets.push(newBasket);
    }

    let balls=[
      {
        speed:ballspeed,
        active:1,
        hit:1,
        xloc:xloc[0]
        //xloc:xloc[Math.round(Math.random()*5)]
      }
    ]

    console.log(balls[0].xloc)
    
    keysDown[49] = true;
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    main();
  } else {
    requestAnimationFrame(menu);
  }
}
// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;


// Let's play this game!
var then = Date.now();
reset();
menu();
