// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

var name;
score=0;
level=1;
ballspeed=13;
go=0; //game not over

docheight=document.documentElement.clientHeight
docwidth=document.documentElement.clientWidth

console.log(docheight,docwidth);

aratio=4/3;

canvas.width=600;
canvas.height=800;

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

ballImage.src = "images/alphabet_tr_3.png";
var bsfcImage=new Image();
bsfcImage.src='images/bubble_tr.png';

//length & width of ball image
balld=60;

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
        ball.x= 5 + (Math.random() * (canvas.width - balld-5)); //generate random position
        x[index]=ball.x;
        success=1;
        for(i=0;i<balls.length;i++ ){
          //if( ball.x >= x[i]-50 && ball.x <= x[i]+50 && y[i]<400  && i!=index && c<20 ){ //if there is overlap with one of the other balls less than 400px down, set success to 0 and keep looping
          if( ball.x >= x[i]-balld && ball.x <= x[i]+balld && y[i]<400  && i!=index && c<20 ){ //if there is overlap with one of the other balls less than 400px down, set success to 0 and keep looping
                                                                                         //stop trying after 20 attempts
            success=0;
          }
        }
        c++;
      }
      ball.y=-40;
      ball.speed=ballspeed+(Math.random()-0.5)*5;
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
       
      } //if basket active
    } else {//if touch is used
      if(basket.active==1){ //if basket is active (was touched) move it 
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
      //nbx= 32 + (Math.random() * (canvas.width - 64)); //generate random position
      nbx= 5 + (Math.random() * (canvas.width - balld-5)); //generate random position
      success=1;
      for(i=0;i<balls.length;i++ ){
        //if( nbx >= x[i]-50 && nbx <= x[i]+50 && y[i]<400 && c<20 ){ //if there is overlap with one of the other balls set success to 0 and keep looping
        if( nbx >= x[i]-balld && nbx <= x[i]+balld && y[i]<400 && c<20 ){ //if there is overlap with one of the other balls set success to 0 and keep looping
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
      //ctx.drawImage(bsfcImage, ball.x, ball.y, 60, 60);
      ctx.drawImage(bsfcImage, ball.x, ball.y, balld, balld);
      ctx.drawImage(ballImage, ball.xloc,0,letterw,letterh,ball.x+(balld-letterw)/2, ball.y+(balld-letterh)/2,letterw,letterh);
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

function getCookieValue(name) {

 const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=');
    
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null; // Cookie not found

}


// The main game loop
//var main = function () {
async function main() {
  var now = Date.now();
  var delta = now - then;
  var highscore="";

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
    ctx.fillText("GAME OVER!", 150, 150);
    ctx.textAlign = "centre";
    ctx.fillText("Your score: "+score, 150, 220);
  

    //get name for highscore ranking
    player = prompt("Please enter your name:");
    
    highscore=getCookieValue(name);
    //set cookie for highscore list
    let expires = "";
    
    const date = new Date();
    var days=10000;
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Convert days to milliseconds
    expires = "; expires=" + date.toUTCString();
    var hslist=[];
    if(highscore==null){
      highscore=player+": "+score;
      hsmax=1;
      hslist[0]=highscore;
    } else {
      highscore=player+": "+score+"*"+highscore;
      //only store 10 highest scores
      var hs2d=new Array(10);

      for(var i=0;i<hs2d.length;i++) {
        hs2d[i]=new Array(2);
      }
      hslist=highscore.split('*');
      
      if(hslist.length>10){
        hsmax=10;
      } else {
        hsmax=hslist.length;
      }

      for(var i=0;i<hsmax;i++){
        [n,s]=hslist[i].split(': ');
        hs2d[i][0]=n;
        hs2d[i][1]=s;
      }
      hs2d=hs2d.sort((a,b)=>b[1]-a[1]);
      for(var i=0;i<hsmax;i++){
        hslist[i]=hs2d[i][0]+': '+hs2d[i][1];
      }
      highscore=hslist.join('*');

    }//else
    
    document.cookie = name + "=" + encodeURIComponent(highscore) + expires + "; path=/";

    ctx.font = "35px Helvetica";
    ctx.fillText("Highscores", 150, 280);

    ctx.font = "25px Helvetica";
    ctx.textAlign = "centre";
    //list max 10 high score entries
    
    for(var i=0;i< hsmax;i++) { 
      ctx.fillText(hslist[i], 150, 320+30*i);
    }

    await new Promise(r => setTimeout(r, 2000));

    let restart = confirm("Your score is "+score+". Start another game?");
    if (restart) {
    //reset everything

      //ctx.fillStyle = "rgba(0, 0, 0, 0)";
      //ctx.clearRect(0, 0, canvas.width, canvas.height);
      //ctx.beginPath();

      keysDown = {};
      key=-1;
      score=0;
      level=1;
      miss=0;
      balls=[];
      menu(); 

    }



  }
};


var bubMenu=function(bubx,buby,bubd,text,cookie){
//draw bubbles for menu page 
  var hslist=[];
  var bubImg = new Image();
  bubImg.src = "images/bubble_tr.png";
  
  ctx.font = "23px Helvetica";
  ctx.drawImage(bubImg,0,0,bubImg.width,bubImg.height,bubx,buby,bubd,bubd);
  ctx.fillStyle = "black";
  ctx.textAlign = "centre";
  ctx.fillText(text, bubx+0.1*bubd, buby+0.5*bubd);
  highscore=getCookieValue(cookie);
  if(highscore !=null){
    hslist=highscore.split('*');
  } else{
    hslist[0]=" ";
  }
  fs=Math.floor(bubd/12.);
  ctx.font = fs+"px Helvetica";
  ctx.fillText(hslist[0], bubx+Math.floor(bubd/7.), buby+Math.floor(bubd/1.5));
  ctx.font = "23px Helvetica";
}

var menu = function () {
//Menu page
    
  var titleImg = new Image();
  titleImg.src = "images/title.png";
  ctx.drawImage(titleImg, 0, 0, titleImg.width, titleImg.height,0,0,canvas.width,canvas.height);
  ctx.textBaseline="alphabetic";
  
  //bubx,buby,bubd,text,cookie
  bubMenu(20,20,120,"1) Vowels","vowel");
  bubMenu(100,50,210,"2) Consonants 1","con1");
  bubMenu(285,10,210,"3) Consonants 2","con2");
  bubMenu(300,200,210,"4) Consonants 3","con3");
  bubMenu(40,240,160,"5) All letters","all");

  mtap=0;
  if(etouch==1){
    if(startX>20*zoom && startX<140*zoom){
      //vowels
      if(startY>20*zoom && startY<140*zoom){
        xoff=0;
        Nletter=12;
        mtap=1;
        name="vowel";
      }
    }
    if(startX>100*zoom && startX<310*zoom){
      //consonants 2
      if(startY>50*zoom && startY<260*zoom){
        xoff=12;
        Nletter=10;
        mtap=1;
        name="con1";
      }
    }
    if(startX>40*zoom && startX<200*zoom){
      //all letters
      if(startY>240*zoom && startY<400*zoom){
        xoff=0;
        Nletter=22;
        mtap=1;
        name="all";
      }
    }
  }

  if (key==49){
    xoff=0;
    Nletter=12;
    name="vowel";
  }
  if (key==50){
     xoff=12;
     Nletter=10;
     name="con1";
  }
  if (key==51){
     xoff=12;
     Nletter=10;
     name="con2";
  }
  if (key==52){
     xoff=12;
     Nletter=10;
     name="con3";
  }
  if (key==53){
     xoff=0;
     Nletter=22;
     name="all";
  }

  if((key>=49 && key<=54) || mtap==1){
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
        xloc:xloc[Math.round(Math.random()*5)]
      }
    ]

    
    keysDown[49] = true;
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    bgImage.src = "images/bg.png";
    time=0;
    then = Date.now();
    main();
  } else {
    requestAnimationFrame(menu);
  }
};
// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;


// Let's play this game!
var then = Date.now();
reset();
menu();
