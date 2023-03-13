function errMsg(message){
	function beGone(){
		element.style.height = '0px';
		element.style.borderWidth = '0px';
		element.style.marginTop = '0px';
		setTimeout(function(){
			element.remove();
		}, 1000)
	}
	let element = document.createElement('span');
	element.className = 'errorMessage';
	element.deleteMePlz = true;
	element.innerHTML = message;
	element.onclick = function(){beGone();};
	element.onmouseover = function(){this.deleteMePlz = false; this.style.background = '#000000'};
	document.querySelector('.errorContainer').appendChild(element);
	let deleteTimeout = setTimeout(function(){
		if(element.deleteMePlz == true){
			beGone();
		}
	}, 3000);
}
