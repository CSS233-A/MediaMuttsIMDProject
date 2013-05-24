/*
 * Speed Object
 *
 *	Properties:
 *		xSpeed		-	The x component of the speed vector
 *		ySpeed		-	The y component of the speed vector
 *		speed		-	The total speed of the vector
 *		angle		-	The direction of the speed vector
 *		
 *	Methods:
 *		setSpeed
 *			Description:
 *				Updates the speed vector
 *			Parameters:
 *				speed	-	The speed of the vector
 *				angle	-	The direction of the speed vector
 *
 *		setComponentSpeeds
 *			Description:
 *				Updates the speed vector through setting the component speeds
 *			Parameters:
 *				x		-	The x speed of the vector
 *				y		-	The y speed of the vector
 *
 */
function SpeedVector(x, y)
{
	this.setComponentSpeeds(x, y);
}
SpeedVector.prototype.setSpeed = function(speed, angle)
{
	
	if (angle != null && speed != null)
	{
		this.speed = speed;
		xSpeed = this.speed * Math.cos(angle);
		ySpeed = this.speed * Math.sin(angle);
	}
}
SpeedVector.prototype.setComponentSpeeds = function(x, y)
{
	if (x != null && y != null)
	{
		this.xSpeed = x;
		this.ySpeed = y;
		this.speed = Math.sqrt(Math.pow(this.xSpeed, 2) + Math.pow(this.ySpeed, 2))
		this.angle = Math.acos(this.xSpeed/this.speed);
	}
}