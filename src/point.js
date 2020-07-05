/*
 * A central point to which all lines from the edges of the canvas are drawn to.
 * -----------------------------------------------------------------------------
 * @author:    Caleb Nii Tetteh Tsuru Addy
 * @date:      27th June, 2020 
 * @email:     calebniitettehaddy@gmail.com 
 * @twitter:   @cnttaddy
 * @github :   https://github.com/niitettehtsuru/InfinityHallway2
 * @codepen:   https://codepen.io/niitettehtsuru/pen/rNxJmGW
 * @license:   GNU General Public License v3.0 
 * */
class Point
{
    constructor(screenWidth,screenHeight,interval,position)
    {         
        this.screenWidth = screenWidth; 
        this.screenHeight = screenHeight;  
        this.interval = interval;//amount of space between adjacent points on the edge of the canvas
        this.toggleInterval = true;//switches between increasing and decreasing the interval 
        this.position = position;//whether the point is left or right oriented 
        this.xCoord = this.screenWidth/2;
        this.yCoord = this.screenHeight/2;  
        this.angle  = this.getAngle();//the angle the center of the screen makes with the x-axis
        this.unitDistance = 5;//distance moved per animation frame 
        this.switch = true;//true to move diagonally, false to move vertically.
        this.speed = this.setInitialSpeed();   
        this.strokeWeight = 0.5; 
        this.goup = true; 
        this.borderPoints = this.getBorderPoints();//the points on the edges of the canvas
    }  
    getAngle()//find the angle between the center and the rightmost corner
    { 
        let angle = atan((this.screenHeight/2)/(this.screenWidth/2)); 
        return angle; 
    } 
    getBorderPoints()//get points on the edges of the canvas
    {
        let borderPoints = []; 
        //if this point is to the left of the horizontal center  
        if(this.position === 'left') 
        {
            //get border points on the left wall 
            for(let y = 0; y < this.screenHeight; y+=this.interval) 
            {
                borderPoints.push({x:0,y:y});//points on the left wall 
            }   
            if(!this.switch)//if point is moving vertically
            { 
                //get border points on the bottom wall
                for(let x = 0; x < this.screenWidth/2; x+=this.interval) 
                { 
                    borderPoints.push({x:x,y:this.screenHeight});//points on the bottom wall
                }
                //get border points on the top wall  
                for(let x = 0; x < this.screenWidth/2; x+=this.interval) 
                {
                    borderPoints.push({x:x,y:0});//points on the top wall 
                }  
            } 
            else //if point is moving diagonally
            {
                //get border points on the top wall  
                for(let x = 0; x < this.screenWidth; x+=this.interval) 
                {
                    borderPoints.push({x:x,y:0});//points on the top wall 
                }  
            }
        }
        else //if this point is to the right of the horizontal center
        {   
            //get border points on the right wall 
            for(let y = 0; y < this.screenHeight; y+=this.interval) 
            { 
                borderPoints.push({x:this.screenWidth,y:y});//points on the right wall
            }  
            if(!this.switch)//if point is moving vertically
            {  
                //get border points on the top wall  
                for(let x = this.screenWidth/2; x < this.screenWidth; x+=this.interval) 
                {
                    borderPoints.push({x:x,y:0});//points on the top wall 
                }
                //get border points on the bottom wall
                for(let x = this.screenWidth/2; x < this.screenWidth; x+=this.interval) 
                { 
                    borderPoints.push({x:x,y:this.screenHeight});//points on the bottom wall
                }
            } 
            else//if point is moving diagonally
            {
               //get border points on the bottom wall
                for(let x = 0; x < this.screenWidth; x+=this.interval) 
                { 
                    borderPoints.push({x:x,y:this.screenHeight});//points on the bottom wall
                } 
            }
        } 
        return borderPoints; 
    }
    setInitialSpeed()//Set the speed at start. 
    {    
        
        if(this.switch)//if point is to move diagonally
        {
            let x = Math.random() > 0.5? this.unitDistance * cos(this.angle) : -this.unitDistance * cos(this.angle);// 
            let y = x > 0? -this.unitDistance * sin(this.angle): this.unitDistance * sin(this.angle); //move up
            return {x:x,y:y}; 
        }
        else //if point is to move vertically
        {
            let x = 0;//no horizontal movement  
            let y = Math.random() > 0.5? -this.unitDistance:this.unitDistance;  
            return {x:x,y:y}; 
        }  
    } 
    pointHitsTopWall()
    {
        if(this.yCoord < 0)
        {
            return true;
        }
        return false; 
    }
    pointHitsBottomWall()
    {
        if(this.yCoord > this.screenHeight)
        {
            return true;
        }
        return false; 
    }   
    checkCollisionWithWall( )
    { 
        if(this.pointHitsTopWall())
        {    
            if(this.switch)//if point is moving diagonally
            {
                this.speed.y = -this.speed.y;
                this.speed.x = -this.speed.x;
            } 
            else//if point is moving vertically
            {
                this.yCoord = 1;//ensure point never goes beyond the top edge 
                this.speed.y = -this.speed.y; 
            }
        }
        else if(this.pointHitsBottomWall())
        {    
            if(this.switch)//if point is moving diagonally
            {
                this.speed.y = -this.speed.y;  
                this.speed.x = -this.speed.x;   
            }  
            else//if point is moving vertically
            {
                this.yCoord =  this.screenHeight - 1;//ensure point never goes beyond the bottom edge 
                this.speed.y = -this.speed.y; 
            }
        }  
    }  
    checkCenterReached()//check if point has reached the center of the screen
    {  
        if(this.switch)//if movement is diagonal
        {
            let dy = this.screenHeight/2 - this.yCoord; 
            let dx = this.screenWidth/2 - this.xCoord; 
            let distance = Math.sqrt(dx*dx + dy*dy); 
            //if the distance between the center and the current position is less than unit distance, 
            if(distance < this.unitDistance/2)
            { 
                this.xCoord = this.screenWidth/2; 
                this.yCoord = this.screenHeight/2; 
                this.angle  = this.getAngle();//the angle the center of the screen makes with the x-axis 
                this.switch = !this.switch;//move vertically
                this.speed  = this.setInitialSpeed(); 
            }
        }
        else //if movement is vertical
        {
            let dy = this.screenHeight/2 - this.yCoord; 
            let dx = this.screenWidth/2 - this.xCoord; 
            let distance = Math.sqrt(dx*dx + dy*dy); 
            //if the distance between the center and the current position is less than unit distance, 
            if(distance < this.unitDistance)
            { 
                this.xCoord = this.screenWidth/2; 
                this.yCoord = this.screenHeight/2; 
                this.switch = !this.switch;//move diagonally
                this.goup = !this.goup;
                this.speed  = this.setInitialSpeed();

            }
        }  
    }
    update( )
    {     
        //keep the point moving in its current direction  
        this.yCoord += this.speed.y;
        if(this.switch)//for diagonal movement
        {
            this.xCoord += this.speed.x; 
        } 
        this.checkCollisionWithWall(); 
        this.checkCenterReached(); 
        /*This creates the effect of darkening and then lighting the animation*/ 
        if(this.toggleInterval)
        {
            this.interval-=0.1;//keep reducing the interval...
            if(this.interval < 3)//...until it reaches 1,...
            {
                this.toggleInterval = !this.toggleInterval;//...then stop and switch
            }
        }
        else 
        {
            this.interval+=0.1;//keep increasing the interval...
            if(this.interval > 5)//...until it reaches 5,...
            {
                this.toggleInterval = !this.toggleInterval;//...then stop and switch
            }
        }  
        //get border points for the new intervals
        this.borderPoints = this.getBorderPoints(); 
    }
    draw()
    {   
        stroke(0);//black 
        strokeWeight(this.strokeWeight);
        //draw border points
        let xCoord = this.xCoord, 
            yCoord = this.yCoord; 
        this.borderPoints.forEach(function(bp)
        {   
            line(bp.x,bp.y,xCoord,yCoord); 
        }); 
    } 
} 
 