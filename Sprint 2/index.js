function initialize()
{
	var interval;

	var animatedObjects = new Array();

	var mainSlideShow = new GrandSlideShow(document.getElementById("mainSlideShow"), "Fade");
	animatedObjects.push(mainSlideShow);
	
	for (var i = 0; i < animatedObjects.length; i++)
	{
		if (typeof(animatedObjects[i].process) != "function")
			animatedObjects[i].process = function () {};
	}
	
	interval = setInterval(
			function() { mainInterval(animatedObjects); }, 
			33);
}

function mainInterval(_intervalObjects)
{
	for (var i = 0; i < _intervalObjects.length; i++)
		_intervalObjects[i].process();
}