/*
 * Speed Vector Object
 *
 *	Properties:
 *		x			-	The x component of the speed vector
 *		y			-	The y component of the speed vector
 *		speed		-	The total speed of the vector
 *		angle		-	The direction of the speed vector
 *		
 *	Methods:
 *		x
 *			Description:
 *				Returns the value of x
 *
 *		y
 *			Description:
 *				Returns the value of y
 *
 *		speed
 *			Description:
 *				Returns the value of speed
 *
 *		angle
 *			Description:
 *				returns the value of angle
 
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
	var x = 0;
	var y = 0;
	var speed = 0;
	var angle = 0;
	
	this.x = function()
	{
		return x;
	}
	
	this.y = function()
	{
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
		}
		else
		{
			x = 0;
			y = 0;
		}
		
		speed = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
		angle = (speed != 0) ? Math.acos(x / speed) : 0;
	}
	
	this.setSpeed = function(_speed, _angle)
	{
		
		if (_angle != null && _speed != null)
		{
			speed = _speed;
			angle = _angle;
			x = speed * Math.cos(_angle);
			y = speed * Math.sin(_angle);
		}
	}
	
	if (arguments[2])
		this.setSpeed(_x, _y);
	else
		this.setComponentSpeeds(_x, _y);
}

/*
 * Point 2D Object
 *
 *	Properties:
 *		x			-	The x component point
 *		y			-	The y component point
 *		
 *	Methods:
 *		x
 *			Description:
 *				Updates the x component or returns the value of x; method is both a getter and setter
 *			Parameters:
 *				_x		-	The new x component
 *
 *		y
 *			Description:
 *				Updates the y component or returns the value of y; method is both a getter and setter
 *			Parameters:
 *				_y		-	The new y component
 *
 *		set
 *			Description:
 *				Updates the both the x and the y components of the point
 *			Parameters:
 *				_x		-	The new x component
 *				_y		-	The new y component
 *
 *		get
 *			Description:
 *				Returns both the x and the y components of the point in the form of an array
 *
 */
function Point2D(_x, _y)
{
	var x = (_x != null) ? _x : 0;
	var y = (_y != null) ? _y : 0;
	
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
	
	this.get = function()
	{
		return [x, y];
	}
}

/*
 * Rectangle Object
 *
 *	Properties:
 *		width		-	The x component point
 *		height		-	The y component point
 *		
 *	Methods:
 *		width
 *			Description:
 *				Updates the width component or returns the value of width; method is both a getter and setter
 *			Parameters:
 *				_width		-	The new width
 *
 *		height
 *			Description:
 *				Updates the height component or returns the value of height; method is both a getter and setter
 *			Parameters:
 *				_height		-	The new height component
 *
 */
function Rectangle(_width, _height)
{
	var width = (_width != null) ? _width : 0;
	var height = (_height != null) ? _height : 0;
	
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
}