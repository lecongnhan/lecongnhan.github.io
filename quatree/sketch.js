const WD_WIDTH = 750;
const WD_HEIGHT = 750;
const RADIUS = 100;

var quadtree;
var points = [];
function setup() {
  createCanvas(WD_WIDTH, WD_HEIGHT)

  for (let i = 0; i < 10000; i++){
    points.push(new Point(
      random(WD_WIDTH),
      random(WD_HEIGHT)
    ))
  }

  console.log(quadtree)
}

function draw() {
  background(0);

  let startTime = millis();
  quadtree = new QuadTree(new Point(WD_WIDTH / 2, WD_HEIGHT / 2), WD_WIDTH - 2, WD_HEIGHT - 2)
  for (let i = 0; i < points.length; i++)
    quadtree.insert(points[i]);

  let foundPoints = quadtree.queryCircle(new Point(mouseX, mouseY), RADIUS);
  console.log("total " + points.length + " points, found " + foundPoints.length + " in " + Math.floor(millis() - startTime) + " ms");
  quadtree.show();

  noFill();
  strokeWeight(1);
  stroke(255);
  ellipse(mouseX, mouseY, RADIUS * 2, RADIUS * 2);
  
  strokeWeight(5);
  stroke("green");
  for (let i = 0; i < foundPoints.length; i++)
    _drawPoint(foundPoints[i]);
}

function _drawPoint(p){
  point(p.x, p.y);
}

function mousePressed(){
  points.push(new Point(mouseX, mouseY));
}

function mouseDragged(){
  points.push(new Point(mouseX, mouseY));
}

function touchMoved(){
  console.log("a")
  console.log(quadtree.queryCircle(new Point(mouseX, mouseY), 100));
  return false;
}