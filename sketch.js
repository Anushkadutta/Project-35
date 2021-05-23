//Create variables here
var dog, happyDog, database, foodS, foodStock;
var foodObj;
var feedTime, lastFeed;
var feed, add;
function preload()
{
  //load images here
  dog_img = loadImage("dog.png");
  dogHappy = loadImage("happy.png");
}

function setup() {
  createCanvas(1000, 500);
  
  dog = createSprite(700,200,20,20);
  dog.addImage(dog_img);
  dog.scale = 0.3;

  database = firebase.database();
  console.log(database);
  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  foodObj = new Food();

  feed = createButton("Feed The Dog 🥛 ");
  feed.position(700,95);
  feed.mousePressed(feedDog);
  add = createButton("Add food");
  add.position(850,95);
  add.mousePressed(addFood);
}


function draw() {  
  background(46,139,87);

  foodObj.display();

  textSize(25)
  fill("white")
  text("Food remaining:"+foodS, 100,50)

  drawSprites();
  //add styles here
  
  fill(255,255,254);
  textSize(25);

  if(lastFeed>=12){
    text("last feed : " + lastFeed%12+" PM",350,30)
  } else if(lastFeed==0){
    text("last Feed : 12 AM " ,350,30)
  }else{
    text("last Feed : "+ lastFeed+ " AM",350,30)
  }
  feedTime = database.ref("feedTime");
feedTime.on("value",function(data){
  lastFeed = data.val();

})



}

function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function writeStock(x){

  if(x<=0){
    x=0;
  } else {
    x = x-1;
  }

  database.ref('/').update({
    Food : x
  })
}

function addFood(){
  foodS++
  database.ref('/').update({
    Food: foodS
  })
}

function feedDog(){
  dog.addImage(dogHappy);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    feedTime : hour()
  })
}

