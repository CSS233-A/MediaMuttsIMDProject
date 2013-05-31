/*
 * Speed Object
 *
 *	Properties:
 *		x			-	The x component of the speed vector
 *		y		-	The y component of the speed vector
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
function SpeedVector(_x, _y)
{
	var x;
	var y;
	var speed;
	var angle;
	
	this.x = function(_x)
	{
		if (_x != null)
		{
			x = _x;
			this.setComponentSpeeds(x, y)
		}
		
		return x;
	}
	this.y = function(_y)
	{
		if (_y != null)
		{
			y = _y;
			this.setComponentSpeeds(x, y)
		}
	
		return y;
	}
	this.speed = function()
	{
		return x;
	}
	this.angle = function()
	{
		return x;
	}
	this.setComponentSpeeds = function(_x, _y)
	{
		if (_x != null && _y != null)
		{
			x = _x;
			y = _y;
			speed = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
			angle = Math.acos(x / speed);
		}
	}
	this.setSpeed = function(_speed, _angle)
	{	
		if (_angle != null && _speed != null)
		{
			speed = speed;
			angle = _angle
			x = speed * Math.cos(angle);
			y = speed * Math.sin(angle);
		}
	}
	
	if (arguments[2])
		this.setSpeed(_x, _y);
	else
		this.setComponentSpeeds(_x, _y);
}