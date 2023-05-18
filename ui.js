const loadingText = document.querySelector('#loadingText'),
$ = function(selector){return document.querySelector(selector);},
$all = function(selector){return document.querySelectorAll(selector);};
var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches,
prefersContrastMore = window.matchMedia("(prefers-contrast: more)").matches;
if(isFirefox == true && hasURLParam('ffox') == false){
	alert("attention: you are useing firefox right? well stratii doesn't support firefox so things may be (will be very) broken. I recommend operaGX but chrome is ok too I guess. (if you want to stop seeing this message just type '?ffox' after the domain. EX: 'example.com/?ffox' )")
}
if(prefersContrastMore == true){
	s.uiAccentColor = {r: 255,g: 255,b: 255};
	s.uiBgColor = {r: 0,g: 0,b: 0};
	s.uiDarkAccentColor = {r: 70,g: 70,b: 70};
	updateCSSVars();
}

var isGlobalMouseDown = false;
window.addEventListener("mousedown", () => { isGlobalMouseDown = true; });
window.addEventListener("mouseup", () => { isGlobalMouseDown = false; });
function userSelectOff(){
	$(':root').style.userSelect = 'none';
}
function userSelectOn(){
	$(':root').style.userSelect = 'auto';
}

var selectedMoveObjIndex = -1, // polish up
selectedObjIndex = 0; // todo

var mouseMoveStartX,
mouseMoveStartY,
mouseMoveCamStartX = null,
mouseMoveCamStartY;
function mouseMoveCamFunct(){
	if(selectedMoveObjIndex != -1){return;}
	s.cameraX = mouseMoveCamStartX - (mouseMoveStartX - event.clientX);
	s.cameraY = mouseMoveCamStartY - (mouseMoveStartY - event.clientY);
}
mainCanvas.addEventListener("mousedown", (event) => {
	mouseMoveStartX = event.clientX;
	mouseMoveStartY = event.clientY;
	mouseMoveCamStartX = s.cameraX;
	mouseMoveCamStartY = s.cameraY;
	userSelectOff();
	window.addEventListener("mousemove", mouseMoveCamFunct);
});
window.addEventListener("mouseup", (event) => {
	if(mouseMoveCamStartX != null){
		window.removeEventListener('mousemove', mouseMoveCamFunct);
		userSelectOn();
	}
	mouseMoveCamStartX = null;
});
mainCanvas.addEventListener("wheel", (event) => {
	if(event.deltaY > 100 || event.deltaY < -100 || (s.cameraZoom == 0.02 && event.deltaY >= 0)){return;}
	s.cameraZoom -= event.deltaY/250 * Math.abs(0-s.cameraZoom);
	if(s.cameraZoom < 0.02){
		s.cameraZoom = 0.02;
	}
}, { passive: true});

function startUi(){ // run after webpage loaded
	loadingText.innerHTML = 'starting UI...';

	// electron extras
	loadingText.innerHTML = 'applying electron JS...';

	document.querySelector('#winSmaller').addEventListener('click', () => {
		let winBar = $('#winBar'),
		winSmaller = $('#winBar .lastDiv #winSmaller');
		
		if(winSmaller.style.position != 'fixed'){
			cssVar('winBarIsOpen', 0);
			winBar.style.top = 'calc(var(--winBarHeightTrue) * -1)';
			setTimeout(() => {
				winSmaller.style.top = 'var(--winBarHeightTrue)';
				winSmaller.style.position = 'fixed';
				winSmaller.innerHTML = 'Expand_more';
				winSmaller.style.borderBottomLeftRadius = 'calc(var(--winBarHeightTrue) * 0.4)';
			}, 600)
		}else{
			winSmaller.style.top = '0px';
			setTimeout(() => {
				winBar.style.top = '0px';
				cssVar('winBarIsOpen', 1);
				winSmaller.style.position = 'relative';
				winSmaller.innerHTML = 'Expand_less';
				winSmaller.style.borderBottomLeftRadius = '0px';
			}, 200)
		}
	});

	loadingText.innerHTML = 'applying layout JS...';
	
	function canvasResize(){
		mainCanvas.height = mainCanvas.clientHeight;
		mainCanvas.width = mainCanvas.clientWidth;
		renderTic()
	}
	canvasResize();
	new ResizeObserver(canvasResize).observe(mainCanvas)

	let mouseDownFunct = function(element, isVSplit){
		userSelectOff();
		let minSpace = 10;
		let startX = window.event.clientX,
		startY = window.event.clientY,
		startWidth = element.clientWidth,
		startHeight = element.clientHeight;
		let mousemoveFunct = function(){
			let newWidth = startWidth + (window.event.clientX - startX),
			newHeight = startHeight + (window.event.clientY - startY);
			if((isVSplit?newHeight < minSpace:newWidth < minSpace) || (isVSplit?newHeight > element.parentElement.clientHeight-minSpace:newWidth > element.parentElement.clientWidth-minSpace)){return;}

			element.style.flex = `0 0 ${(isVSplit?newHeight:newWidth)}px`;
		};
		window.addEventListener("mousemove", mousemoveFunct);
		window.addEventListener("mouseup", () => {
			userSelectOn();
			window.removeEventListener("mousemove", mousemoveFunct);
		}, {once: true});
	};
	$all(':is(.vSplit, .hSplit)').forEach(element => {
		if(element.matches('*:last-child')){return;}
		let isVSplit = element.matches('.vSplit');
		var passesY,
		passesX;
		element.addEventListener('mousemove', event => {
			passesY = (event.offsetY + s.uiBorderThickness > element.clientHeight);
			passesX = (event.offsetX + s.uiBorderThickness > element.clientWidth);
			if(isVSplit == true){
				if(passesY){
					element.style.cursor = 'n-resize';
				}else{
					element.style.cursor = 'auto';
				}
			}else{
				if(passesX){
					element.style.cursor = 'e-resize';
				}else{
					element.style.cursor = 'auto';
				}
			}
		});
		element.addEventListener('mousedown', event => {
			if(isVSplit == true){
				if(!passesY){return;}
			}else{
				if(!passesX){return;}
			}
			mouseDownFunct(element, isVSplit);
		})
	});
	$all(':is(.vSplit, .hSplit)[data-title]').forEach(element => {
		let isVSplit = element.matches('.vSplit'),
		el = document.createElement('span');
		el.className = 'data-title';
		el.innerHTML = element.dataset.title;
		element.addEventListener("scroll", () => {
			el.style.bottom = `-${element.scrollTop}px`
			if(element.scrollTop == 0 && element.scrollLeft == 0){
				el.style.width = '100%';
			}else{
				el.style.width = '0%';
			}
        }, { passive: true });
		let DOMel = element.appendChild(el);
		if(element.matches('*:last-child')){return;} // skips if it's the last child

		DOMel.style.cursor = (isVSplit?"n-resize":"e-resize");
		DOMel.addEventListener("mousedown", () => {
			mouseDownFunct(element, isVSplit);
		});
	});

	let selObjMouseOffsetX = 0,
	selObjMouseOffsetY = 0;
	mainCanvas.addEventListener('mousedown', event => {
		if(event.button == 1){return;}

		objs.forEach((obj, index) => {
			// maybe need bounding offset if it ever exists?
			let localX = ctxCords(event.offsetX) - obj.x,
				localY = ctyCords(event.offsetY) - obj.y;
			let setObj = function(){
				selObjMouseOffsetX = localX;
				selObjMouseOffsetY = localY;
				selectedObjIndex = index;
				selectedMoveObjIndex = index;
				obj.temp.noPhys = true;
				obj.phys.xMomentum = 0;
				obj.phys.yMomentum = 0;
			};
			if(obj.phys.useRect == true){
				if((localX > 0 && localX < obj.phys.width) && (localY > 0 && localY < obj.phys.height)){
					setObj();
				}
			}else{
				if(pthag(localX, localY) < obj.phys.radius){
					setObj();
				}
			}
		});
	});
	mainCanvas.addEventListener('mousemove', event => {
		if(selectedMoveObjIndex == -1 || event.button == 1){return;}
		
		let obj = objs[selectedMoveObjIndex];

		obj.x = ctxCords(event.offsetX)-selObjMouseOffsetX;
		obj.y = ctyCords(event.offsetY)-selObjMouseOffsetY;
		obj.phys.xMomentum = 0;
		obj.phys.yMomentum = 0;

		selObjMouseMovmentX = event.movementX;
		selObjMouseMovmentY = event.movementY;
	});
	mainCanvas.addEventListener('mouseup', event => {
		if(selectedMoveObjIndex == -1){return;}

		let obj = objs[selectedMoveObjIndex];
		obj.temp.noPhys = false;
		selectedMoveObjIndex = -1;

		obj.phys.xMomentum = ctScale(selObjMouseMovmentX);
		obj.phys.yMomentum = ctScale(selObjMouseMovmentY);
	});

	$all('.jsClearIntervalPhysics').forEach(element => {
		element.addEventListener('click', clearPhysicsTic);
	});
	$all('.jsStartIntervalPhysics').forEach(element => {
		element.addEventListener('click', startPhysicsTic);
	});
	$all('.jsStepPhysics').forEach(element => {
		element.addEventListener('click', physicsTic);
	});
	let numFormatter = Intl.NumberFormat('en', { notation: 'compact' });
	$all('.jsShowPhysNum').forEach(element => {
		setInterval(() => {
			element.innerHTML = numFormatter.format(physTicsRan);
		}, (prefersReducedMotion?1000:20));
	})

	$all('.jsClearIntervalRender').forEach(element => {
		element.addEventListener('click', clearRenderTic);
	});
	$all('.jsStartIntervalRender').forEach(element => {
		element.addEventListener('click', startRenderTic);
	});
	$all('.jsStepRender').forEach(element => {
		element.addEventListener('click', renderTic);
	});
	$all('.jsShowFramesRendered').forEach(element => {
		setInterval(() => {
			element.innerHTML = numFormatter.format(framesRendered);
		}, (prefersReducedMotion?1000:20))
	})

	$all(':is(.hSplit, .vSplit)[data-height]').forEach(element => {
		if(element.matches('*:last-child')){warnMsg('using [data-width] on :last-child may have unintended behavior')}
		element.style.flex = `0 0 ${element.dataset.height}`;
	});
	$all(':is(.hSplit, .vSplit)[data-width]').forEach(element => {
		if(element.matches('*:last-child')){warnMsg('using [data-width] on :last-child may have unintended behavior')}
		element.style.flex = `0 0 ${element.dataset.width}`;
	});


	if(hasURLParam('lolcat')){
		let lolCatTimerGG = 0;
		setInterval(() => {
			cssVar('accent-color', `hsl(${lolCatTimerGG},100%,50%)`);
			lolCatTimerGG += 5;
			if(lolCatTimerGG > 360){
				lolCatTimerGG -= 360;
			}
		}, 50);
	}

	setTimeout(() => {
		if(prefersReducedMotion != true){
			$('#loadingUi').style.height = '0px';
		}
		$('#loadingUi').style.opacity = '0';
		setTimeout(() => {
			$('#loadingUi').remove();
		}, (prefersReducedMotion?1000:5000))
	}, (hasURLParam('skipIntro')?0:(prefersReducedMotion?1000:2500)));
	
	loadingText.innerHTML = '';
	$('#stratiiIntroLogo').style.color = 'var(--accent-color)';
}
