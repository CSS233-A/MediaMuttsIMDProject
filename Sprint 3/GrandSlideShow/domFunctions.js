if (!domFunctions)
{
	var domFunctions = {
		findChildren:	function (_parent, _nodeName, _attributes)
		{
			if (_parent && _parent.nodeName)
			{
				var children = new Array();
				_nodeName = _nodeName.toUpperCase();
				
				if (_nodeName === "*")
				{
					var child = _parent.firstChild;
					
					while (child)
					{
						var isGoodChild = true;
					
						for (var property in _attributes)
						{
							if (!child[property] || child[property] != _attributes[property])
							{
								isGoodChild = false;
								break;
							}
						}
						
						if (isGoodChild)
							children[children.length] = child;
							
						child = child.nextSibling;
					}
				}
				else
				{
					var child = _parent.firstChild;
					
					while (child)
					{
						var isGoodChild = true;
					
						for (var property in _attributes)
						{
							if (!child[property] || child[property] != _attributes[property])
							{
								isGoodChild = false;
								break;
							}
						}
						
						if (isGoodChild && child.nodeName == _nodeName)
							children[children.length] = child;
							
						child = child.nextSibling;
					}
				}
				
				return children;
			}
		}, // end of function "findChildren"
		newChild:	 	function(_parent, _nodeName)
		{
			var child = document.createElement(_nodeName);
			
			if (child)
			{
				_parent.appendChild(child);
			}
			
			return child;
		}// end of function "newChild"
	};
}