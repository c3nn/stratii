const loadingText = $('#loadingText');
var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1,
prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches,
prefersContrastMore = window.matchMedia("(prefers-contrast: more)").matches;
if(isFirefox == true && hasURLParam('ffox') == false){
	alert("attention: you are useing firefox right? well stratii doesn't support firefox so things may be (will be very) broken. I recommend operaGX but chrome is ok too I guess. (if you want to stop seeing this message just type '?ffox' after the domain. EX: 'example.com/?ffox' )")
}

var isGlobalMouseDown = false;
window.addEventListener("mousedown", () => { isGlobalMouseDown = true; });
window.addEventListener("mouseup", () => { isGlobalMouseDown = false; });
function userSelectOff(){ $(':root').css('user-select','none'); }
function userSelectOn(){ $(':root').css('user-select', ''); }

var selectedMoveObjIndex = -1, // polish up
selectedObjIndex = 0; // todo

var mouseMoveStartX,
mouseMoveStartY,
mouseMoveCamStartX = null,
mouseMoveCamStartY,
mouseMoveObjStartX,
mouseMoveObjStartY;
function mouseMoveCamFunct(){
	if(selectedMoveObjIndex != -1){return;}
	s.cameraX = mouseMoveCamStartX - (mouseMoveStartX - event.clientX).toWorldScale()/2;
	s.cameraY = mouseMoveCamStartY - (mouseMoveStartY - event.clientY).toWorldScale()/2;
}
function mouseMoveObjFunct(){
	s.cameraX = mouseMoveCamStartX - (mouseMoveStartX - event.clientX).toWorldScale()/2;
	s.cameraY = mouseMoveCamStartY - (mouseMoveStartY - event.clientY).toWorldScale()/2;
}
mainCanvas.addEventListener("mousedown", (event) => {
	mouseMoveStartX = event.clientX;
	mouseMoveStartY = event.clientY;
	mouseMoveCamStartX = s.cameraX;
	mouseMoveCamStartY = s.cameraY;
	userSelectOff();
	// { do check to see if it's touching an obj } 
	if(false){ // if not on obj, do cam move
		window.addEventListener("mousemove", mouseMoveCamFunct);
	}else{ // if on obj
		// mouseMoveObjStartX = obj.x
		// mouseMoveObjStartY = obj.y
		window.addEventListener("mousemove", mouseMoveObjFunct());
	}
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
}, {passive: true});

function startUi(){ // run after webpage loaded
	loadingText.innerHTML = 'starting UI...';
	
	function canvasResize(){
		mainCanvas.height = mainCanvas.clientHeight;
		mainCanvas.width = mainCanvas.clientWidth;
		canvasZoomPosX = mainCanvas.width / 2;
		canvasZoomPosY = mainCanvas.height / 2;
		renderTic();
	}
	canvasResize();
	new ResizeObserver(canvasResize).observe(mainCanvas);

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

			element.css('flex', `0 0 ${(isVSplit?newHeight:newWidth)}px`);
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
			let splitBorderThickness = css('--split-border-thickness', null, {resolveToNum: true});
			passesY = (event.offsetY + splitBorderThickness > element.clientHeight);
			passesX = (event.offsetX + splitBorderThickness > element.clientWidth);
			if(isVSplit == true){
				if(passesY){
					element.css('cursor', 'n-resize');
				}else{
					element.css('cursor', 'auto');
				}
			}else{
				if(passesX){
					element.css('cursor', 'e-resize');
				}else{
					element.css('cursor', 'auto');
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
		});
	});
	$all(':is(.vSplit, .hSplit)[data-title]').forEach(element => {
		let isVSplit = element.matches('.vSplit'),
		el = document.createElement('span');
		el.className = 'data-title';
		el.innerHTML = element.dataset.title;
		element.addEventListener("scroll", () => {
			el.css('bottom', `-${element.scrollTop}px`)
			if(element.scrollTop == 0 && element.scrollLeft == 0){
				el.css('width', '100%');
			}else{
				el.css('width', '0%');
			}
        }, { passive: true });
		let DOMel = element.appendChild(el);
		if(element.matches('*:last-child')){return;} // skips if it's the last child

		DOMel.css('cursor', (isVSplit?"n-resize":"e-resize"));
		DOMel.addEventListener("mousedown", () => {
			mouseDownFunct(element, isVSplit);
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
	});

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
		}, (prefersReducedMotion?1000:20));
	});

	$all(':is(.hSplit, .vSplit)[data-height]').forEach(element => {
		if(element.matches('*:last-child')){statusWarnMsg('using [data-width] on :last-child may have unintended behavior')}
		element.css('flex', `0 0 ${element.dataset.height}`);
	});
	$all(':is(.hSplit, .vSplit)[data-width]').forEach(element => {
		if(element.matches('*:last-child')){statusWarnMsg('using [data-width] on :last-child may have unintended behavior')}
		element.css('flex', `0 0 ${element.dataset.width}`);
	});

	setInterval(() => {
		$all('.jsClock').forEach(element => {
			var checkTime = function(i) {
				if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
				return i;
			};
			let now = new Date(),
			h = now.getHours(),
			m = now.getMinutes(),
			s = now.getSeconds(),
			msg = (h == 0 && m <= 5?'<span style="color: white; text-decoration: underline;"> be sure to rest soon, ok </span>':'');
			element.innerHTML = msg + (h == 0?12:(h > 13?h-12:h)) + ":" + checkTime(m) + ":" + checkTime(s) + (h > 12?'PM':'AM');
		});
	}, 1000);

	$('#statusBar').oncontextmenu = function(){
		css('--status-bar-open', 0);
		return false;
	}
	$('#menuBar').oncontextmenu = function(){
		css('--menu-bar-open', 0);
		return false;
	}

	window.oncontextmenu = function(e){
		if(e.clientY <= 10 & css('--menu-bar-open') < 1){
			css('--menu-bar-open', '');
			return false;
		}else if(e.clientY >= window.innerHeight-10 & css('--status-bar-open') < 1){
			css('--status-bar-open', '');
			return false;
		}
		return true;
	}
	mainCanvas.oncontextmenu = function(e){
		return false;
	}

	$all('*[data-tooltip]').forEach(element => {
		element.addEventListener("mouseover", event => {
			if(!$(':root:has(*[data-tooltip]:hover)')){return;}
			let tooltip = $('#tooltip');
			tooltip.css('top', `${event.clientY - tooltip.clientHeight - 5}px`);
			tooltip.css('left', `${event.clientX + 5}px`);
			tooltip.innerHTML = $('*[data-tooltip]:hover').dataset.tooltip;
		});
	});

	$('#statusMsg').addEventListener('click', () => {
		$('#statusMsg').innerHTML = '';
	});

	$all('.tabCont').forEach(element => {
		let isVSplit = (element.matches('.vSelector')?true:false),
		newEl = document.createElement('div');
		newEl.className = 'tabBar';
		let DOMel = element.appendChild(newEl);
		DOMel.css('cursor', (isVSplit?"n-resize":"e-resize"));
		DOMel.addEventListener("mousedown", () => {
			mouseDownFunct(element, isVSplit);
		});
	});
	$all('.tabCont .tab').forEach(element => {
		let newEl = document.createElement('span');
		newEl.className = 'tabButton';
		newEl.innerHTML = element.dataset.title;
		let DOMel = element.parentElement.$('.tabBar').appendChild(newEl);
		DOMel.addEventListener('click', () => {
			element.parentElement.$all('.tab').forEach(el => {
				if(el.dataset.title == newEl.innerHTML){
					el.dataset.show = "true";
				}else{
					el.dataset.show = "false";
				}
			});
		});
	});

	if(hasURLParam('lolcat')){	
		let lolCatTimerGG = 0;
		setInterval(() => {
			css('--accent-color', `hsl(${lolCatTimerGG},100%,50%)`);
			lolCatTimerGG += 5;
			if(lolCatTimerGG > 360){
				lolCatTimerGG -= 360;
			}
		}, 50);
	}

	setTimeout(() => {
		if(prefersReducedMotion != true){
			$('#loadingUi').css('height', '0px');
		}
		$('#loadingUi').css('opacity', '0');
		setTimeout(() => {
			$('#loadingUi').remove();
		}, (prefersReducedMotion?1000:5000))
	}, (hasURLParam('skipIntro')?0:(prefersReducedMotion?1000:2500)));
	
	loadingText.innerHTML = '';
	let today = new Date;
	if(today.getMonth() == 5){
		$('#stratiiIntroLogo').css('-webkit-text-stroke', '2px var(--accent-color)');
	}else{
		$('#stratiiIntroLogo').css('color', 'var(--accent-color)');
	}
}
