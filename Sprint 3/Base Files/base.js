var scripts = [];

function initialize()
{
	for (var i = 0, j = scripts.length; i < j; i++)
	{
		if (typeof(scripts[i]) == "function")
		{
			scripts[i]();
		}
	}
}

scripts.push(function()
{
	var searchBox = document.getElementById("searchBox");
	searchBox.addEventListener(
		"focus", 
		function()
		{
			if (this.value == "Search")
				this.value = "";
		},
		true);
	searchBox.addEventListener(
		"blur", 
		function()
		{
			if (this.value == "")
				this.value = "Search";
		},
		true);
});