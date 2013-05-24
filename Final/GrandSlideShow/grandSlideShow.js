/*
 *	grandSlideShow.js
 *
 *	Author:			Adam Burkhalter
 *	Date:			2013 May 23
 *	Description:	The class creates an all purpose slide show that is designed to be extremely malleable and robust.
 *					The goal when creating this slide show was to create a well-defined JavaScript class that was designed
 *					and implemented to professional standards, while still displaying my own personal style. I designed this
 *					slide show in hopes that it would be improved upon in the future. Accordingly, I designed this class to
 *					expand (and contract) gracefully, to a certain extent of course. I tried to implement data encapsulation
 *					as much as possible in order to make this class have a very little footprint. The initial implementation
 *					of this class included two main transition types: a fade and a slide transition. I also started the process
 *					of creating my JavaScript library, so a few external .js files are necessary for this class to function.
 *
 *	Imports:
 *		domFunctions.js
 *		speedVector.js
 *
 *	Parameters:
 *		_container:						The slide show container element
 *		_indicatorPaths (optional):		An array containing two string paths to the slideIndicator images
 *		_transitionType (optional):		A string that tells what transition the slide show should do
 *		_delayTicks (optional):			A number that says how long to wait before transitioning to the next slide 
 *											(aka how many times process is called)
 *
 */
function GrandSlideShow(_container, _indicatorPaths, _transitionType, _delayTicks)
{
	//Begin Object-wide Variable Declarations
	slides = {
		TRANSITION:		"FADE",
		
		previous:			0,
		current:			0,
		next:				0,
		container:			null,
		content:			null,
		description:		null,
		controlsContainer:	null,
		indicators:			new Array()
	};
	
	//DO NOT CHANGE THE ORDER, but it is OK to add to the list
	TRANSITION_TYPES = [
		"FADE",
		"SLIDE"
	];
	
	ticks = {
		DELAY:			200,
		
		current:		0
	};
	
	slideSpeed = {
		MAX:			new SpeedVector(120, 0),
		DELTA:			new SpeedVector(1, 0),
		
		current:		new SpeedVector(0, 0)
	};
	
	//Begin Data Processing
	if (_indicatorPaths != null 
		&& _indicatorPaths[0] 
		&& _indicatorPaths[1] 
		&& typeof(_indicatorPaths[0]) == "string" 
		&& typeof(_indicatorPaths[1]) == "string")
	{
		slides.indicators.onSrc = _indicatorPaths[0];
		slides.indicators.offSrc = _indicatorPaths[1];
	}
	else
	{
		slides.indicators.onSrc = "GrandSlideShow/slideIndicatorOn.png";
		slides.indicators.offSrc = "GrandSlideShow/slideIndicatorOff.png";
	}
	
	if (_transitionType != null || typeof(_transitionType) == "string" || _transitionType != "")
		slides.TRANSITION = _transitionType.toUpperCase();
		
	if (_delayTicks != null || typeof(_delayTicks) == "number" || _delayTicks > 0)
		ticks.DELAY = _delayTicks;
	
	slides.container = domFunctions.findChildren(
		_container, 
		"*", 
		{className: "slides"}
	)[0];
	
	slides.content = domFunctions.findChildren(
		slides.container, 
		"*", 
		{className: "content"}
	);
	
	slides.description = domFunctions.findChildren(
		slides.container,
		"*",
		{className: "description"}
	);
	
	//Slide Content (Not Descriptions) Initialization
	for (var i = 0, j = slides.content.length; i < j; i++)
	{
		if (TRANSITION_TYPES.indexOf(slides.TRANSITION) == 0) //slides.transition == "FADE";
		{
			slides.content[i].opacity = (i == 0) ? 1 : 0;
			slides.content[i].style.opacity = slides.content[i].opacity;
			
			slides.content[i].style.zIndex = (i == 0) ? 2 : 1;
		}
		else if (TRANSITION_TYPES.indexOf(slides.TRANSITION) == 1) //slides.transition == "SLIDE";
		{
			slides.content[i].left = (i == 0) ? 0 : slides.content[i - 1].left + slides.content[i - 1].offsetWidth;
			slides.content[i].style.left = slides.content[i].left + "px";
		}
	}
	
	//Slide Description Initialization
	for (var i = 0, j = slides.description.length; i < j; i++)
	{
		if (TRANSITION_TYPES.indexOf(slides.TRANSITION) == 0) //slides.transition == "FADE";
		{
			slides.description[i].opacity = (i == 0) ? 1 : 0;
			slides.description[i].style.opacity = slides.description[i].opacity;
			
			slides.description[i].style.zIndex = (i == 0) ? 2 : 1;
		}
		else if (TRANSITION_TYPES.indexOf(slides.TRANSITION) == 1) //slides.transition == "SLIDE";
		{
			slides.description.baseLeft = slides.description[0].offsetLeft;
		
			slides.description[i].left = (i == 0) ? slides.description.baseLeft : slides.description[i - 1].left + slides.content[i - 1].offsetWidth;
			slides.description[i].style.left = slides.description[i].left + "px";
		}
	}
	
	//Slide Indicator Initialization
	//WRAPPER CLASS NOT TRUE CONTROLS CONTAINER, BUT A NECESSARY STYLE CONTAINER
	slides.controlsContainer = domFunctions.findChildren(
		_container,
		"DIV",
		{className: "wrapper"}
	)[0];
	//Get true controls container
	slides.controlsContainer = domFunctions.findChildren(
		slides.controlsContainer,
		"DIV",
		{className: "controls"}
	)[0];
	
	for (var i = 0, j = slides.content.length; i < j; i++)
	{
		slides.indicators.push(
			domFunctions.newChild(
				slides.controlsContainer, 
				"img"
			)
		);
		slides.indicators[i].index = i;
		slides.indicators[i].isActivated = (i == 0) ? true : false;
		slides.indicators[i].isHoveredOver = false;
		
		slides.indicators[i].src = (i == 0) ? slides.indicators.onSrc : slides.indicators.offSrc;
		
		slides.indicators[i].addEventListener(
			"mouseover",
			function()
			{
				if (!this.isActivated)
					this.src = slides.indicators.onSrc;
					
				this.isHoveredOver = true;
			},
			true
		);
		
		slides.indicators[i].addEventListener(
			"mouseout",
			function()
			{
				if (!this.isActivated)
					this.src = slides.indicators.offSrc;
					
				this.isHoveredOver = false;
			},
			true
		);
		
		slides.indicators[i].addEventListener(
			"mousedown",
			function()
			{
				if (this.index != slides.current)
				{
					slides.next = this.index;
					ticks.current = ticks.DELAY;
			
					if (TRANSITION_TYPES.indexOf(slides.TRANSITION) == 0)
					{
						slides.content[slides.current].style.zIndex = 2;
						if (slides.current < slides.description.length)
							slides.description[slides.current].style.zIndex = 2;
						
						slides.content[slides.next].style.zIndex = 1;
						if (slides.next < slides.description.length)
							slides.description[slides.next].style.zIndex = 1;
					}
				}
			},
			true
		);
	}
	
	this.process = function()
	{
		if (ticks.current < ticks.DELAY)
			ticks.current++;
		else if (TRANSITION_TYPES.indexOf(slides.TRANSITION) == 0) //slides.transition == "FADE";
			fadeTransition();
		else if (TRANSITION_TYPES.indexOf(slides.TRANSITION) == 1) //slides.transition == "SLIDE";
			slideTransition();
		else
			ticks.current = 0;
	}
	
	function fadeTransition()
	{
		if (slides.content[slides.current].opacity > 0)
		{
			slides.content[slides.current].opacity -= .1;
			slides.content[slides.next].opacity = 1;
			
			updateSlides();
		}
		else
		{
			slides.content[slides.current].opacity = 0;
			slides.content[slides.next].opacity = 1;
				
			updateSlides();
			
			slides.previous = slides.current;
			slides.current = slides.next;
			
			if (slides.next + 1 >= slides.content.length)
				slides.next = 0;
			else
				slides.next++;
			
			slides.content[slides.current].style.zIndex = 2;
			if (slides.current < slides.description.length)
				slides.description[slides.current].style.zIndex = 2;
			
			slides.content[slides.next].style.zIndex = 1;
			if (slides.next < slides.description.length)
				slides.description[slides.next].style.zIndex = 1;
				
			slides.indicators[slides.previous].src = slides.indicators.offSrc;
			slides.indicators[slides.previous].isActivated = false;
			
			slides.indicators[slides.current].src = slides.indicators.onSrc;
			slides.indicators[slides.current].isActivated = true;
				
			ticks.current = 0;
		}
	}
	
	function slideTransition()
	{
		if (Math.abs(slides.content[slides.next].left) < Math.pow(slideSpeed.current.xSpeed, 2) / 2)
		{
			slideSpeed.current.setComponentSpeeds(
				slideSpeed.current.xSpeed - slideSpeed.DELTA.xSpeed,
				slideSpeed.current.ySpeed - slideSpeed.DELTA.ySpeed
			);
		}
		else if (slideSpeed.current.xSpeed < slideSpeed.MAX.xSpeed)
		{
			slideSpeed.current.setComponentSpeeds(
				slideSpeed.current.xSpeed + slideSpeed.DELTA.xSpeed,
				slideSpeed.current.ySpeed + slideSpeed.DELTA.ySpeed
			);
		}
		else
		{
			slideSpeed.current.setComponentSpeeds(
				slideSpeed.MAX.xSpeed,
				slideSpeed.MAX.ySpeed
			);
		}
		
		for (var i = 0; slides.content[i]; i++)
		{
			slides.content[i].left -= (
				(
					Math.abs(slides.content[slides.next].left) 
					/ slides.content[slides.next].left
				) 
				* slideSpeed.current.xSpeed
			);
			
			if (i < slides.description.length)
				slides.description[i].left = slides.description.baseLeft + slides.content[i].left;
		}
		
		updateSlides();
		
		if (Math.abs(slides.content[slides.next].left) < 5)
		{
			slides.content[slides.next].left = 0;
			
			//Calculate all slide x-coordinates that are left of slides.next
			for (var i = slides.next - 1; i > 0; i--)
				slides.content[i].left = slides.content[i + 1].left - slides.content[i].offsetWidth;
			
			//Calculate all slide x-coordinates that are right of slides.next
			for (var i = slides.next + 1; i < slides.content.length; i++)
				slides.content[i].left = slides.content[i - 1].left + slides.content[i - 1].offsetWidth;
			
			updateSlides();
			
			slides.previous = slides.current;
			slides.current = slides.next;
			
			if (slides.next + 1 >= slides.content.length)
				slides.next = 0;
			else
				slides.next++;
				
			slides.indicators[slides.previous].src = slides.indicators.offSrc;
			slides.indicators[slides.previous].isActivated = false;
			
			slides.indicators[slides.current].src = slides.indicators.onSrc;
			slides.indicators[slides.current].isActivated = true;
			
			slideSpeed.current.setComponentSpeeds(
				0,
				0
			);
			
			ticks.current = 0;
		}
	}
	
	function updateSlides()
	{
		if (TRANSITION_TYPES.indexOf(slides.TRANSITION) == 0)
		{
			slides.content[slides.current].style.opacity = slides.content[slides.current].opacity;
			slides.content[slides.next].style.opacity = slides.content[slides.next].opacity;
			
			if (slides.current < slides.description.length)
				slides.description[slides.current].style.opacity = slides.content[slides.current].opacity;
			if (slides.next < slides.description.length)
				slides.description[slides.next].style.opacity = slides.content[slides.next].opacity;
		}
		else if (TRANSITION_TYPES.indexOf(slides.TRANSITION) == 1)
		{
			for (var i = 0; i < slides.content.length; i++)
			{
				slides.content[i].style.left = slides.content[i].left + "px";
				
				if (i < slides.description.length)
					slides.description[i].style.left = slides.description[i].left + "px";
			}
		}
	}
}