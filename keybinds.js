s.keybinds = [];
function createKeybind(key, description = '', funct, modifierKeys = {ctrl: false, alt: false, shift: false, meta: false}){
	s.keybinds.push({
		key: key,
		funct: funct,
		description: description,
		shift: (modifierKeys.shift?true:false),
		meta: (modifierKeys.meta?true:false),
		ctrl: (modifierKeys.ctrl?true:false),
		alt: (modifierKeys.alt?true:false)
	});
};
function reloadKeybinds(){
	$all('.jsKeybindList').forEach(element => {
		element.innerHTML = '';
		s.keybinds.forEach((k, index) => {
			if(k.description == ''){return;}
			element.innerHTML += `<span style="--delay:${index+1};"><span class="keybind">${(k.ctrl?'Ctrl+':'')+(k.alt?'Alt+':'')+(k.shift?'Shift+':'')+(k.meta?'Meta+':'')}${k.key}</span> ${k.description}</span><br>`
		})
	});
}

createKeybind('/', 'show/hide keybinds menu', () => {
	let keybindsOverlay = $('#keybindsOverlay');
	keybindsOverlay.dataset.show = (keybindsOverlay.dataset.show != "true"?"true":"false");
}, );
createKeybind('`', (hasURLParam('dev')?'open console':''), (e) => { // dev
	if(!hasURLParam('dev')){return;}
	try {
		let prVal = prompt("console");
		if(prVal == 'hid'){
			$('#devmenu').style.display = "none";
			$('#devmenu').remove();
		}else if(prVal == 'showSettings'){
			$('#settingsButton').style.display = 'inline';
		}else{
			eval(prVal);
		}
	} catch (error) {
		alert(error)
	}
});
createKeybind('w', 'move camera up', () => {
	s.cameraY += 15/s.cameraZoom;
});
createKeybind('s', 'move camera down', () => {
	s.cameraY += -15/s.cameraZoom;
});
createKeybind('a', 'move camera left', () => {
	s.cameraX += 15/s.cameraZoom;
});
createKeybind('d', 'move camera right', () => {
	s.cameraX += -15/s.cameraZoom;
});
createKeybind(',', 'zoom out', () => {
	s.cameraZoom += -0.1*s.cameraZoom;
});
createKeybind('.', 'zoom in', () => {
	s.cameraZoom += 0.1*s.cameraZoom;
});

window.addEventListener("keydown", e => {
	s.keybinds.forEach(k => {
		if(k.key == e.key && k.shift == e.shiftKey && k.alt == e.altKey && k.meta == e.metaKey && k.ctrl == e.ctrlKey){
			k.funct(e, k);
			return;
		}
	});
});
reloadKeybinds();
