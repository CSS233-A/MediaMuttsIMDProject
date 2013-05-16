/*
 * Grand Slide Show Object Object
 *
 *	Properties:
 *		slides				-	An array of all of the images that play in the slide show
 *		slideIndicators		-	The y component of the speed vector
 *		waitTicks			-	The duration between each slide change
 *		currentWaitTicks	-	The time since the last slide change
 *		maxSlideSpeed		-	A SpeedVector that contains the max speed of the slide change
 *		currentSlideSpeed	-	The current speed of the slides changing their position
 *		deltaSlideSpeed		-	The acceleration of currentSlideSpeed
 *		isPaused			-	A boolean that determines whether or not the slide show is paused
 *		transitionType		-	A string that says what slide transition should be used
 *		
 *	Methods:
 *		process
 *			Description:
 *				Processes the slide show
 *
 *		fadeTransition
 *			Description:
 *				Transitions the slides via fading
 *		
 *		slideTransition
 *			Description:
 *				Transitions the slides via sliding
 *
 */
function GrandSlideShow(containerElement, transition)
{
	this.slides = new Array();
	this.slides.parentObject = this;
	this.slides.previousSlide = 0;
	this.slides.currentSlide = 0;
	this.slides.nextSlide = 1;
	
	this.description = new Array();
	
	this.slideIndicators = new Array();
	
	this.waitTicks = 200;
	this.currentWaitTicks = 0;
	
	this.maxSlideSpeed = new SpeedVector(120, 0);
	this.currentSlideSpeed = new SpeedVector(0, 0);
	this.deltaSlideSpeed = new SpeedVector(1, 0);
	
	this.isPaused = false;
	
	if (transition == null || transition == "")
		this.transitionType = "FADE";
	else
		this.transitionType = transition;
	
	
	//Starting off collecting the slides
	var temp = containerElement.lastChild
	
	while (temp.nodeType != 1)
	{
		temp = temp.previousSibling;
	}
	
	temp = containerElement.firstChild;
	
	while (temp != null)
	{
		if (temp.nodeName == "DIV" && temp.className.search("slides") != -1)
			break;
			
		temp = temp.nextSibling;
	}
	
	this.slides.container = temp;
	this.slides.container.parentObject = this;
	
	temp = temp.firstChild;
	
	while (temp != null)
	{
		if (temp.className != null && temp.className.search("slide") != -1)
		{
			this.slides[this.slides.length] = temp;
			this.slides[this.slides.length - 1].parentObject = this;
			
			if (this.transitionType.toUpperCase() == "FADE")
			{
				if (this.slides.length == 1)
					this.slides[this.slides.length - 1].opacity = 1;
				else
					this.slides[this.slides.length - 1].opacity = 0;
					
				this.slides[this.slides.length - 1].style.opacity = this.slides[this.slides.length - 1].opacity;
			}
			else if (this.transitionType.toUpperCase() == "SLIDE")
			{
				if (this.slides.length == 1)
					this.slides[this.slides.length - 1].left = 0;
				else if (this.slides.length > 1)
					this.slides[this.slides.length - 1].left = this.slides[this.slides.length - 2].left + this.slides[this.slides.length - 2].offsetWidth;
					
				this.slides[this.slides.length - 1].style.left = this.slides[this.slides.length - 1].left + "px";
			}
		}
		else if (temp.className != null && temp.className.search("description") != -1)
		{
			this.description[this.description.length] = temp;
			this.description[this.description.length - 1].parentObject = this;
			
			if (this.transitionType.toUpperCase() == "FADE")
			{
				if (this.description.length == 1)
					this.description[this.description.length - 1].opacity = 1;
				else
					this.description[this.description.length - 1].opacity = 0;
					
				this.description[this.description.length - 1].style.opacity = this.description[this.description.length - 1].opacity;
			}
			else if (this.transitionType.toUpperCase() == "SLIDE")
			{
				this.description[this.description.length - 1].baseLeft = this.description[this.description.length - 1].offsetLeft;
				
				if (this.description.length == 1)
					this.description[this.description.length - 1].left = this.description[this.description.length - 1].baseLeft;
				else if (this.description.length > 1)
					this.description[this.description.length - 1].left = this.description[this.description.length - 2].left + this.slides[this.slides.length - 2].offsetWidth;
					
				
				this.description[this.description.length - 1].style.left = this.description[this.description.length - 1].left + "px";
			}
		}
			
		temp = temp.nextSibling;
	}
	//End of collecting slides
	
	//Start adding slide indicators
	temp = containerElement.lastChild;
	
	while (temp != null)
	{
		if (temp.nodeName == "DIV" && temp.className.search("wrapper") != -1)
			break;
			
		temp = temp.previousSibling;
	}
	
	temp = temp.lastChild;
	
	while (temp != null)
	{
		if (temp.nodeName == "DIV" && temp.className.search("controls") != -1)
			break;
			
		temp = temp.previousSibling;
	}
	
	while (this.slideIndicators.length < this.slides.length)
	{
		this.slideIndicators[this.slideIndicators.length] = document.createElement("img");
		this.slideIndicators[this.slideIndicators.length - 1].parentObject = this;
		this.slideIndicators[this.slideIndicators.length - 1].index = this.slideIndicators.length - 1;
		this.slideIndicators[this.slideIndicators.length - 1].isOn = false;
		this.slideIndicators[this.slideIndicators.length - 1].isHovering = false;
		this.slideIndicators[this.slideIndicators.length - 1].on = "Pictures/Grand Slide Show/slideIndicatorOn.png";
		this.slideIndicators[this.slideIndicators.length - 1].off = "Pictures/Grand Slide Show/slideIndicatorOff.png";
		
		if (this.slideIndicators.length == 1)
			this.slideIndicators[this.slideIndicators.length - 1].src = this.slideIndicators[this.slideIndicators.length - 1].on;
		else
			this.slideIndicators[this.slideIndicators.length - 1].src = this.slideIndicators[this.slideIndicators.length - 1].off;
			
		this.slideIndicators[this.slideIndicators.length - 1].onmouseover = function()
		{
			if (!this.isOn)
				this.src = this.on;
				
			this.isHovering = true;
		}
		
		this.slideIndicators[this.slideIndicators.length - 1].onmouseout = function()
		{
			if (!this.isOn)
				this.src = this.off;
				
			this.isHovering = false;
		}
		
		this.slideIndicators[this.slideIndicators.length - 1].onmousedown = function()
		{
			if (this.index != this.parentObject.slides.currentSlide)
			{
				this.parentObject.slides.nextSlide = this.index;
				this.parentObject.currentWaitTicks = this.parentObject.waitTicks;
			}
		}
		
		temp.appendChild(this.slideIndicators[this.slideIndicators.length - 1]);
	}
	//End of slide indicators
	
	this.slides.container.onmouseover = function()
	{
		this.parentObject.isPaused = true;
	}
	this.slides.container.onmouseout = function()
	{
		this.parentObject.isPaused = false;
	}
}
GrandSlideShow.prototype.process = function()
{
	if (true) //Possibly change to "!this.isPaused"
	{
		if (this.currentWaitTicks < this.waitTicks)
		{
			this.currentWaitTicks++;
			
			if (!this.slideIndicators[this.slides.previousSlide].isHovering)
			{
				this.slideIndicators[this.slides.previousSlide].isOn = false;;
				this.slideIndicators[this.slides.previousSlide].src = this.slideIndicators[this.slides.previousSlide].off;
			}
			
			this.slideIndicators[this.slides.currentSlide].isOn = true;;
			this.slideIndicators[this.slides.currentSlide].src = this.slideIndicators[this.slides.currentSlide].on;
		}
		else if (this.transitionType.toUpperCase() == "FADE")
			this.fadeTransition();
		else if (this.transitionType.toUpperCase() == "SLIDE")
			this.slideTransition();
		else
			this.currentWaitTicks = 0;
	}
}
GrandSlideShow.prototype.fadeTransition = function()
{
	if (this.slides[this.slides.currentSlide].opacity > 0 && this.slides[this.slides.nextSlide].opacity < 1)
	{
		this.slides[this.slides.currentSlide].opacity -= .1;
		this.slides[this.slides.nextSlide].opacity += .1;
		
		this.updateSlides();
	}
	else
	{
		this.slides[this.slides.currentSlide].opacity = 0;
		if (this.slides.currentSlide < this.description.length)
			this.description[this.slides.currentSlide].opacity = 0;
			
		this.slides[this.slides.nextSlide].opacity = 1;
		if (this.slides.nextSlide < this.description.length)
			this.description[this.slides.nextSlide].opacity = 0;
		
		this.updateSlides();
		
		this.slides.previousSlide = this.slides.currentSlide;
		this.slides.currentSlide = this.slides.nextSlide;
		
		if (this.slides.nextSlide + 1 >= this.slides.length)
			this.slides.nextSlide = 0;
		else
			this.slides.nextSlide++;
			
		this.currentWaitTicks = 0;
	}
}
GrandSlideShow.prototype.slideTransition = function()
{
	if (Math.abs(this.slides[this.slides.nextSlide].left) < this.currentSlideSpeed.xSpeed * this.currentSlideSpeed.xSpeed / 2)
	{
		this.currentSlideSpeed.setComponentSpeeds(
				this.currentSlideSpeed.xSpeed - this.deltaSlideSpeed.xSpeed, 
				this.currentSlideSpeed.ySpeed - this.deltaSlideSpeed.ySpeed);
	}
	else if (this.currentSlideSpeed.xSpeed < this.maxSlideSpeed.xSpeed)
	{
		this.currentSlideSpeed.setComponentSpeeds(
				this.currentSlideSpeed.xSpeed + this.deltaSlideSpeed.xSpeed, 
				this.currentSlideSpeed.ySpeed + this.deltaSlideSpeed.ySpeed);
	}
	else
		this.currentSlideSpeed.setComponentSpeeds(this.maxSlideSpeed.xSpeed, this.maxSlideSpeed.ySpeed);
	
	var i = 0;
		
	while (this.slides[i])
	{
		this.slides[i].left -= (Math.abs(this.slides[this.slides.nextSlide].left)/this.slides[this.slides.nextSlide].left) * this.currentSlideSpeed.xSpeed;
		this.slides[i].style.left = this.slides[i].left + "px";
		
		if (i < this.description.length)
		{
			this.description[i].left = this.description[i].baseLeft + this.slides[i].left;
			this.description[i].style.left = this.description[i].left + "px";
		}
		
		i++;
	}

	if (Math.abs(this.slides[this.slides.nextSlide].left) < this.maxSlideSpeed.xSpeed / 20)
	{
		this.slides[this.slides.nextSlide].left = 0;
		
		if (this.slides.nextSlide > 0)
		{
			i = this.slides.nextSlide;
			
			while (i-- > 0)
				this.slides[i].left = this.slides[i + 1].left - this.slides[i].offsetWidth;
			
		}
		
		if (this.slides.nextSlide < this.slides.length - 1)
		{
			i = this.slides.nextSlide;
			
			while (i++ < this.slides.length - 1)
				this.slides[i].left = this.slides[i - 1].left + this.slides[i - 1].offsetWidth;
		}
		
		i = 0;
		
		while (this.slides[i])
		{
			this.slides[i].style.left = this.slides[i].left + "px";
			
			i++;
		}
		
		this.slides.previousSlide = this.slides.currentSlide;
		this.slides.currentSlide = this.slides.nextSlide;
		
		if (this.slides.nextSlide + 1 >= this.slides.length)
			this.slides.nextSlide = 0;
		else
			this.slides.nextSlide++;
			
		this.currentSlideSpeed.setComponentSpeeds(0, 0);
		
		this.currentWaitTicks = 0;
	}
}
GrandSlideShow.prototype.updateSlides = function()
{
	this.slides[this.slides.currentSlide].style.opacity = this.slides[this.slides.currentSlide].opacity;
	if (this.slides.currentSlide < this.description.length)
		this.description[this.slides.currentSlide].style.opacity = this.slides[this.slides.currentSlide].opacity;
	
	this.slides[this.slides.nextSlide].style.opacity = this.slides[this.slides.nextSlide].opacity;
	if (this.slides.nextSlide < this.description.length)
		this.description[this.slides.nextSlide].style.opacity = this.slides[this.slides.nextSlide].opacity;
}