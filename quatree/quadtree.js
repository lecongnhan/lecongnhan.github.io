const CAPACITY = 4;

class Point{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}


class QuadTree{
    constructor(position, width, height){
        this.position = position;
        this.width = width;
        this.height = height;
        this.points = [];

        this.devided = false;

        // follows the four quadrants of a Cartesian coordinate system
        this.childI = null;
        this.childII = null;
        this.childIII = null;
        this.childIV = null;
    }

    // reference https://yal.cc/rectangle-circle-intersection-test/
    _intersect(center, radius){
        let nearestX = Math.max(this.position.x - this.width / 2, Math.min(center.x, this.width))
        let nearestY = Math.max(this.position.y - this.height / 2, Math.min(center.y, this.height))
        return Math.pow(center.x - nearestX, 2) + Math.pow(center.y - nearestY, 2) < Math.pow(radius, 2);
    }

    queryCircle(center, radius){
        // if (!this._intersect(center, radius))
        //     return [];

        let result = [];
        for (let i = 0; i < this.points.length; i++){
            let point = this.points[i];

            if (Math.pow(center.x - point.x, 2) + Math.pow(center.y - point.y, 2) <= Math.pow(radius, 2))
                result.push(point);
        }

        if (this.devided){
            result = result.concat(this.childI.queryCircle(center, radius));
            result = result.concat(this.childII.queryCircle(center, radius));
            result = result.concat(this.childIII.queryCircle(center, radius));
            result = result.concat(this.childIV.queryCircle(center, radius));
        }

        return result;
    }

    contains(point){
        return point.x >= this.position.x  - this.width / 2&& 
            point.x <= this.position.x + this.width / 2 &&
            point.y >= this.position.y  - this.height / 2&& 
            point.y <= this.position.y + this.height / 2
    }

    insert(point){
        if (!this.contains(point))
            return false;

        if (this.points.length < CAPACITY){
            this.points.push(point);
            return true;
        }

        if (!this.devided)
            this._devide()

        if (this.childI.insert(point)) return true;
        else if (this.childII.insert(point)) return true;
        else if (this.childIII.insert(point)) return true;
        else return this.childIV.insert(point);
    }

    _devide(){
        let p = this.position;

        this.childI = new QuadTree(
            new Point(
                p.x + this.width / 4,
                p.y - this.height / 4
            ),
            this.width / 2,
            this.height / 2
        )
        this.childII = new QuadTree(
            new Point(
                p.x - this.width / 4,
                p.y - this.height / 4
            ),
            this.width / 2,
            this.height / 2
        )
        this.childIII = new QuadTree(
            new Point(
                p.x - this.width / 4,
                p.y + this.height / 4
            ),
            this.width / 2,
            this.height / 2
        )
        this.childIV = new QuadTree(
            new Point(
                p.x + this.width / 4,
                p.y + this.height / 4
            ),
            this.width / 2,
            this.height / 2
        )

        this.devided = true;
    }

    show(){
        this._drawBoundary();
        this._drawPoints();  

        if (this.devided){
            this.childI.show();
            this.childII.show();
            this.childIII.show();
            this.childIV.show();
        } 
    }

    _drawPoints(){
        stroke(255);
        strokeWeight(2);
        for (let i = 0; i < this.points.length; i++){
            let p = this.points[i];
            point(p.x, p.y);
        }
    }

    _drawBoundary(){
        strokeWeight(1);
        stroke(255);
        noFill();
        rectMode(CENTER);
        rect(
            this.position.x, 
            this.position.y, 
            this.width, 
            this.height
        );
    }
}