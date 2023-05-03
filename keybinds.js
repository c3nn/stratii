window.addEventListener("keydown", e => {
	if(hasURLParam('dev')){
		console.log(e)
		if(e.key == "`"){
			try {
				let prVal = prompt("console");
				if(prVal == 'hid'){
					document.querySelector('#devmenu').style.display = "none";
				}else{
					eval(prVal);
				}
			} catch (error) {
				alert(error)
			}
		}
	}
	if(e.key == "q"){
		if(uiOpen == false){
			openUI();
		}else{
			closeUI();
		}
	}
	if(e.key == "w"){
		s.cameraY += 15/s.cameraZoom;
	}
	if(e.key == "s"){
		s.cameraY += -15/s.cameraZoom;
	}
	if(e.key == "a"){
		s.cameraX += 15/s.cameraZoom;
	}
	if(e.key == "d"){
		s.cameraX += -15/s.cameraZoom;
	}
	if(e.key == ","){
		s.cameraZoom += -0.1*s.cameraZoom;
	}
	if(e.key == "."){
		s.cameraZoom += 0.1*s.cameraZoom;
	}
});
