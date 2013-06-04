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
		return speed;
	}
	this.angle = function()
	{
		return angle;
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
			speed = Math.abs(_speed);
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

function Point2D(_x, _y)
{
	var x;
	var y;
	
	this.x = function(_x)
	{
		if (_x != null)
			x = _x;
			
		return x;
	}
	this.y = function(_y)
	{
		if (_y != null)
			y = _y;
			
		return y;
	}
	this.set = function(_x, _y)
	{
		this.x(_x);
		this.y(_y);
	}
	
	this.set(_x, _y);
}

function Rectangle(_width, _height)
{
	var width;
	var height;
	
	this.width = function(_width)
	{
		if (_width != null)
			width = _width;
			
		return width;
	}
	this.height = function(_height)
	{
		if (_height != null)
			height = _height;
			
		return height;
	}
	this.set = function(_width, _height)
	{
		this.width(_width);
		this.height(_height);
	}
	
	this.set(_width, _height);
}