scripts.push(function()
{
	var testGame = new PongGame("pongGame");
	
	var element = document.getElementById("pongGameButton");
	element.startPong = function()
	{
		testGame.unPause();
		this.style.display = "none";
		
		var pauseSlideShow = document.createEvent("Event")
		pauseSlideShow.initEvent("mousedown", true, true)
		document.getElementById("grandSlideShowPauseButton").dispatchEvent(pauseSlideShow);
	}
	element.resetPong = function()
	{
		testGame.resetGame = true;
		this.style.display = "none";
	}
	
	element.addEventListener(
		"mousedown",
		element.startPong,
		true
	);

	animatedObjects.push(new Object());
	animatedObjects[animatedObjects.length - 1].process = function()
	{
		testGame.update();
	}
});

function PongGame(
	_containerID)
{
	var container = document.getElementById(_containerID);
	var context = container.getContext("2d");
	
	this.resetGame = false;
	var gameOver = false;
	var isPaused = true;
	
	var mainBall = new BouncingBall(
		context, 
		new Point2D(
			container.offsetWidth / 2 - 20, 
			container.offsetHeight / 2 - 20),
		40, 
		new Rectangle(
			container.offsetWidth,
			container.offsetHeight),
		"rgba(0, 0, 255, 1)"
	);
	
	var mainPaddle = new Paddle(
		context, 
		new Point2D(
			20, 
			container.offsetHeight / 2 - 75),
		new Rectangle(
			50,
			150),
		new Rectangle(
			container.offsetWidth,
			container.offsetHeight),
		"rgba(0, 0, 255, 1)"
	);
	
	document.body.addEventListener(
		"keydown",
		function(event)
		{		
			if (event.keyCode == 87) //w
				mainPaddle.velocity().setComponentSpeeds(0, 20);
			else if (event.keyCode == 83) //s
				mainPaddle.velocity().setComponentSpeeds(0, -20);
		},
		true
	);
	document.body.addEventListener(
		"keyup",
		function(event)
		{		
			mainPaddle.velocity().setComponentSpeeds(0, 0);
		},
		true
	);
	
	container.width = container.offsetWidth;
	container.height = container.offsetHeight;
	
	this.update = function()
	{
		if (this.resetGame)
		{
			context.clearRect(0, 0, container.width, container.height);
			
			mainBall.setPosition(
				container.width / 2 - 20, 
				container.height / 2 - 20
			);
			
			mainBall.velocity().setSpeed(
				20,
				(Math.random() * .5 * Math.PI) - (.25 * Math.PI)
			);
		
			gameOver = false;
			this.resetGame = false;
		}
		else if (!gameOver && !isPaused)
		{
			mainBall.update();
			
			if (
				mainBall.x() - mainBall.radius() < mainPaddle.x() + mainPaddle.size().width() &&
				mainBall.x() - mainBall.radius() > mainPaddle.x() + mainPaddle.size().width() - mainBall.velocity().speed() &&
				mainBall.y() + mainBall.radius() > mainPaddle.y() &&
				mainBall.y() - mainBall.radius() < mainPaddle.y() + mainPaddle.size().height() &&
				mainBall.velocity().x() < 0
			)
			{
				mainBall.velocity(
					new SpeedVector(
						mainBall.velocity().speed() + 1, 
						(((mainPaddle.y() - mainBall.y()) + mainPaddle.size().height() / 2) / (mainPaddle.size().height() * 2)) * Math.PI, //WAS: mainBall.velocity().y(),
						true
					)
				);
			}
			else if (mainBall.x() - mainBall.radius() < 0 || mainBall.x() + mainBall.radius() > mainBall.border().width())
			{
				mainBall.velocity(
					new SpeedVector(
						mainBall.velocity().x() * -1, 
						mainBall.velocity().y()
					)
				);
				
				if (mainBall.x() - mainBall.radius() < 0)
				{
					mainBall.setPosition(0 + mainBall.radius(), mainBall.y());
					gameOver = true;
				}
				else if (mainBall.x() + mainBall.radius() > mainBall.border().width())
					mainBall.setPosition(mainBall.border().width() - mainBall.radius(), mainBall.y());
			}
			
			if (mainBall.y() - mainBall.radius() < 0 || mainBall.y() + mainBall.radius() > mainBall.border().height())
			{
				mainBall.velocity(
					new SpeedVector(
						mainBall.velocity().x(), 
						mainBall.velocity().y() * -1
					)
				);
				
				if (mainBall.y() - mainBall.radius() < 0)
					mainBall.setPosition(mainBall.x(), 0 + mainBall.radius());
				else if (mainBall.y() + mainBall.radius() > mainBall.border().height())
					mainBall.setPosition(mainBall.x(), mainBall.border().height() - mainBall.radius());
			}
			
			mainPaddle.update();
			
			if (mainPaddle.y() < 0)
			{
				mainPaddle.velocity().setComponentSpeeds(0, 0);
				mainPaddle.setPosition(mainPaddle.x(), 0);
				mainPaddle.update();
			}
			else if (mainPaddle.y() > mainPaddle.border().height() - mainPaddle.size().height())
			{
				mainPaddle.velocity().setComponentSpeeds(0, 0);
				mainPaddle.setPosition(mainPaddle.x(), mainPaddle.border().height() - mainPaddle.size().height());
				mainPaddle.update();
			}
		}
		else if (gameOver)
		{
			context.fillStyle = "rgba(255, 0, 0, .02)";
			context.fillRect(0, 0, container.width, container.height);
			
			var element = document.getElementById("pongGameButton");
			element.removeEventListener(
				"mousedown",
				element.startPong
			);
			
			element.value = "Play Again?";
			element.style.display = "block";
			
			element.addEventListener(
				"mousedown",
				element.resetPong,
				true
			);
		}
	}
	
	this.unPause = function()
	{
		isPaused = false;
	}
	this.pause = function()
	{
		isPaused = true;
	}
}

/*
 *	Paddle
 *
 *	Author:			Adam Burkhalter
 *	Date:			2013 May 29
 *	Description:	The class creates a drawable paddle whose designed purpose was to work with the pong game
 *
 *	Imports:
 *		physics.js
 *
 *	Parameters:
 *		context:						The canvas context on which to draw on
 *		_position (optional):			A Point2D object that describes initial position of the paddle; default is (0, 0)
 *		_size (optional):				A Rectangle object that describes the size of the paddle; default is 40px X 100px
 *		_borderRectangle (optional):	A Rectangle object that describes the boundaries of the paddle draw area; default is 100px X 100px
 *		_color (optional):				A color value for the paddle
 *
 */
function Paddle(
	context,
	_position,
	_size,
	_borderRectangle, 
	_color)
{
	var position = new Point2D(_position.x(), _position.y());
	
	var size = (_size != null) ? _size : new Rectangle(40, 100);
	var borderRectangle = (_borderRectangle != null) ? _borderRectangle : new Rectangle(100, 100);
	
	var velocity = new SpeedVector(0, 0);
	
	var color = (_color != null) ? _color : "rgba(0, 0, 0, 1)";
	
	this.update = function()
	{
		context.clearRect(
			position.x(),
			position.y(),
			size.width(),
			size.height()
		);
		
		position.set(
			position.x() + velocity.x(),
			position.y() - velocity.y()
		);
		
		draw();
	}
	
	this.x = function()
	{
		return position.x();
	}
	
	this.y = function()
	{
		return position.y();
	}
	
	this.setPosition = function (_x, _y)
	{
		position.set(_x, _y);
	}
	
	this.size = function()
	{
		return size;
	}
	
	this.velocity = function(_velocity)
	{
		if (_velocity)
			velocity.setComponentSpeeds(_velocity.x(), _velocity.y());
			
		return velocity;
	}
	
	this.border = function()
	{
		return borderRectangle;
	}
	
	function draw()
	{
		context.fillRect(
			position.x(),
			position.y(),
			size.width(),
			size.height()
		);
		context.fillStyle = color;
		context.fill();
	}
}

/*
 *	Bouncing Ball
 *
 *	Author:			Adam Burkhalter
 *	Date:			2013 May 29
 *	Description:	The class creates a drawable ball whose designed purpose was to work with the pong game
 *
 *	Imports:
 *		physics.js
 *
 *	Parameters:
 *		context:						The canvas context on which to draw on
 *		_position (optional):			A Point2D object that describes initial position of the paddle; default is (0, 0)
 *		_radius (optional):				A number that describes the size of the ball; default is 10px
 *		_borderRectangle (optional):	A Rectangle object that describes the boundaries of the ball draw area; default is 100px X 100px
 *		_color (optional):				A color value for the paddle
 *
 */
function BouncingBall(
	context,
	_position, 
	_radius, 
	_borderRectangle, 
	_color)
{
	var position = new Point2D(_position.x(), _position.y());
	
	var velocity = new SpeedVector(0, 0);
	velocity.setSpeed(
		20,
		(Math.random() * .5 * Math.PI) - (.25 * Math.PI)
	);
	
	var radius = (_radius != null) ? _radius : 10;
	
	var borderRectangle = (_borderRectangle != null) ? _borderRectangle : new Rectangle(100, 100);
	
	var color = (_color != null) ? _color : "rgba(0, 0, 0, 1)";
	
	draw();
	
	this.update = function()
	{
		context.clearRect(
			position.x() - (radius + 1),
			position.y() - (radius + 1),
			(radius + 1) * 2,
			(radius + 1) * 2
		);
		
		position.set(
			position.x() + velocity.x(),
			position.y() - velocity.y()
		);
		
		draw();
	}
	
	this.x = function()
	{
		return position.x();
	}
	
	this.y = function()
	{
		return position.y();
	}
	
	this.setPosition = function (_x, _y)
	{
		position.set(_x, _y);
	}
	
	this.radius = function()
	{
		return radius;
	}
	
	this.velocity = function(_velocity)
	{
		if (_velocity)
			velocity.setComponentSpeeds(_velocity.x(), _velocity.y());
			
		return velocity;
	}
	
	this.border = function()
	{
		return borderRectangle;
	}
	
	function draw()
	{
		context.beginPath();
		context.arc(
			position.x(),
			position.y(),
			radius,
			0,
			2 * Math.PI
		);
		context.fillStyle = color;
		context.fill();
	}
}
