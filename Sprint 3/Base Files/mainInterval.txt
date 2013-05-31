var animatedObjects = [];

scripts.push(function()
{
	for (var i = 0; i < animatedObjects.length; i++)
	{
		if (typeof(animatedObjects[i].process) != "function")
			animatedObjects[i].process = function () {};
	}
	
	interval = setInterval(
			function() { mainInterval(animatedObjects); }, 
			33);

	function mainInterval(_intervalObjects)
	{
		for (var i = 0; i < _intervalObjects.length; i++)
			_intervalObjects[i].process();
	}
});