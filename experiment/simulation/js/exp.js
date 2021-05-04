var spring,box,stand1,stand2,velocity=0;
var flag=0;
// var exp;

function startAnimation() 
{
  animationArea.start();
  //Construct here
  spring=new Spring(250,10,250,230,160,150,3,0.03,0.9,"#505050");
  box=new sq_component(200,200,100,100,"#904040");
  stand1=new sq_component(90,10,10,500,"#202020");
  stand2=new sq_component(400,10,10,500,"#202020");
  bar=new sq_component(90,0,320,10,"#202020")
}

var animationArea = {
  canvas : document.createElement("canvas"),
  start : function() 
  {
      this.canvas.width=500;
      this.canvas.height=500;
      this.canvas.style.position="absolute";
      this.canvas.style.left="450px"
      this.canvas.style.top="150px"
      this.context = this.canvas.getContext("2d");
      document.body.insertBefore(this.canvas,document.body.childNodes[0]);
      this.interval=setInterval(updateFrame,16);
  },
  clear : function() 
  {
      this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
  }
}

function sq_component(x,y,width,height,color) 
{
  this.x=x;
  this.y=y;
  this.width=width;
  this.height=height;
  this.color=color;
  this.angle=0;
  this.update=function()
  {
    ctx=animationArea.context;
    ctx.fillStyle=this.color;
    ctx.fillRect(this.x,this.y,this.width,this.height);
  }
}

function Spring(x1,y1,x2,y2,restLenght, width, numRounds, k, f,color) 
{
  this.x1 = x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
  this.restLenght = restLenght;
  this.width = width;
  this.numRounds = numRounds;
  this.k = k;
  this.f = f;
  this.color = color;
  this.lineWidth = 6;
  this.update=function()
  {
    ctx=animationArea.context;
    var sPX, sPY, cP1X, cP1Y, cP2X, cP2Y, ePX, ePY;
    ctx.save();
    ctx.lineWidth = this.lineWidth;
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;

    var vx = this.x2 - this.x1;
    var vy = this.y2 - this.y1;
    var vm = Math.sqrt(vx * vx + vy * vy);
    ctx.translate(this.x1, this.y1);
    ctx.rotate(Math.atan2(vy, vx));

    ctx.beginPath();
    ctx.moveTo(0, 0);
    // length of one spring's round
    var l = vm / (this.numRounds + 2);
    // Initial segment, from spring anchor point to the first round
    sPX = l;
    sPY = 0;
    ctx.lineTo(sPX, sPY);
    // half width of spring's rounds
    var hw = 0.5 * this.width;
    for (var i = 0, n = this.numRounds; i < n; i++) 
    {
      cP1X = sPX + l * (i + 0.0);
      cP1Y = sPY + hw;
      cP2X = sPX + l * (i + 0.5);
      cp2Y = sPY + hw;
      ePX = sPX + l * (i + 0.5);
      ePY = sPY;
      ctx.bezierCurveTo(cP1X, cP1Y, cP2X, cp2Y, ePX, ePY);
      cP1X = sPX + l * (i + 0.5);
      cP1Y = sPY - hw;
      cP2X = sPX + l * (i + 1.0);
      cp2Y = sPY - hw;
      ePX = sPX + l * (i + 1.0);
      ePY = sPY;
      ctx.bezierCurveTo(cP1X, cP1Y, cP2X, cp2Y, ePX, ePY);
    }
    // Final segment, from last springs round to the center of mass
    ctx.lineTo(vm, 0);
    //ctx.closePath();
    //ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

function updateFrame()
{   
  animationArea.clear();
  if(flag===1)
  {
    if(box.y===200)
    {
      velocity=1;
    }
    else if(box.y===400)
    {
      velocity=-1;
    }
    box.y+=velocity*2;
    spring.y2+=velocity*2;
  }
  box.update();
  spring.update();
  stand1.update();
  stand2.update();
  bar.update();
}

function start_stop() 
{
  if(flag===0)
  {
    var temp=document.getElementById("bt2");
    temp.innerHTML="Stop";
    flag=1;
  }
  else if(flag===1)
  {
    var temp=document.getElementById("bt2");
    temp.innerHTML="Start";
    flag=0;
  }
}

function restart()
{
  location.reload();
}

function increase()
{
  var edit = document.getElementsByName("edit");
  if(edit[0].checked)
  {
    spring.numRounds+=1;
  }
  else if(edit[1].checked)
  { if(spring.lineWidth<30)
    {spring.lineWidth+=1;}
  }
  else if(edit[2].checked)
  {
    spring.width+=5;
  }
  else if(edit[3].checked)
  {
    spring.k+=0.01;
  }
  else if(edit[4].checked)
  {
    box.color="#202020"
  }
}

function decrease()
{
  var edit = document.getElementsByName("edit");
  if(edit[0].checked)
  {
    spring.numRounds-=1;
  }
  else if(edit[1].checked)
  {
    spring.lineWidth-=1;
  }
  else if(edit[2].checked)
  {
    spring.width-=5;
  }
  else if(edit[3].checked)
  {
    spring.k-=0.01;
  }
  else if(edit[4].checked)
  {
    box.color="#A0A0A0"
  }
}

