const loadingText = document.querySelector('#loadingText');
var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
if(isFirefox == true && hasURLParam('ffox') == false){
	alert("attention: you are useing firefox right? well stratii doesn't support firefox so things may be (will be very) broken. I recommend operaGX but chrome is ok too I guess. (if you want to stop seeing this message just type '?ffox' after the domain. EX: 'example.com/?ffox' )")
}

var isGlobalMouseDown = false;
window.addEventListener("mousedown", () => { isGlobalMouseDown = true; });
window.addEventListener("mouseup", () => { isGlobalMouseDown = false; });

// mouse movement camera control

var mouseMoveStartX,
mouseMoveStartY,
mouseMoveCamStartX,
mouseMoveCamStartY,
isCanvasMouseDown = false,
isCanvasMiddleMouseDown = false;
mainCanvas.addEventListener("mousedown", (event) => {
	isCanvasMouseDown = true;
	if(event.button == 1){
		isCanvasMiddleMouseDown = true;
	}
	mouseMoveStartX = event.clientX;
	mouseMoveStartY = event.clientY;
	mouseMoveCamStartX = s.cameraX;
	mouseMoveCamStartY = s.cameraY;
});
mainCanvas.addEventListener("mouseup", (event) => {
	isCanvasMouseDown = false;
	isCanvasMiddleMouseDown = false;
});
mainCanvas.addEventListener("mousemove", (event) => {
	if(isCanvasMouseDown != true || selectedObjIndex != -1){return;}
	s.cameraX = mouseMoveCamStartX - (mouseMoveStartX - event.clientX);
	s.cameraY = mouseMoveCamStartY - (mouseMoveStartY - event.clientY);
})
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
	document.querySelector('#winSmaller').addEventListener('click', () => {
		let winBar = document.querySelector('#winBar'),
		winSmaller = document.querySelector('#winBar .lastDiv #winSmaller');
		
		if(winSmaller.style.position != 'fixed'){
			winBar.style.top = 'calc(var(--winBarHeight) * -1)';
			setTimeout(() => {
				winSmaller.style.top = 'var(--winBarHeight)';
				winSmaller.style.position = 'fixed';
				winSmaller.innerHTML = 'Expand_more';
				winSmaller.style.borderBottomLeftRadius = 'calc(var(--winBarHeight) * 0.4)';
			}, 600)
		}else{
			winSmaller.style.top = '0px';
			setTimeout(() => {
				winBar.style.top = '0px';
				winSmaller.style.position = 'relative';
				winSmaller.innerHTML = 'Expand_less';
				winSmaller.style.borderBottomLeftRadius = '0px';
			}, 200)
		}
	});
	
	// all elements that need extra js
	loadingText.innerHTML = 'applying layout JS...';

	//! document.querySelector('.mainContainer').style.transition = 'height 0.6s cubic-bezier(0.075, 0.82, 0.165, 1)';
	
	function canvasResize(){
		mainCanvas.height = mainCanvas.clientHeight;
		mainCanvas.width = mainCanvas.clientWidth;
	}
	canvasResize();
	new ResizeObserver(canvasResize).observe(mainCanvas)
	
	document.querySelectorAll(':is(.vSplit, .hSplit)[data-title]').forEach(element => {
		let isVSplit = element.className.includes('vSplit'),
		el = document.createElement('span');
		el.className = 'data-title';
		el.innerHTML = element.dataset.title;
		element.addEventListener("scroll", () => {
			el.style.left = `${element.scrollLeft}px`
			el.style.bottom = `-${element.scrollTop}px`
			if(element.scrollTop == 0){
				el.style.width = '100%';
			}else{
				el.style.width = '0%';
			}
        }, { passive: true });
		let DOMel = element.appendChild(el);
		if(element.matches('*:last-child')){return;} // skips if it's the last child

		DOMel.style.cursor = (isVSplit?"e-resize":"n-resize");
		DOMel.addEventListener("mousedown", () => {
			let startX = window.event.clientX,
			startY = window.event.clientY,
			startWidth = element.clientWidth,
			startHeight = element.clientHeight;
			let mousemoveFunct = function(){
				let newWidth = startWidth + (window.event.clientX - startX),
				newHeight = startHeight + (window.event.clientY - startY);
				if(isVSplit == true && newWidth > 10){
					element.style.flex = `0 0 ${newWidth}px`;
				}else if(isVSplit == false && newHeight > 10){
					element.style.flex = `0 0 ${newHeight}px`;
				}
			};
			window.addEventListener("mousemove", mousemoveFunct);
			window.addEventListener("mouseup", () => {
				window.removeEventListener("mousemove", mousemoveFunct);
			}, {once: true});
		});
	});

	document.querySelectorAll('.jsClearIntervalPhysics').forEach(element => {
		element.addEventListener('click', clearPhysicsTic);
	});
	document.querySelectorAll('.jsStartIntervalPhysics').forEach(element => {
		element.addEventListener('click', startPhysicsTic);
	});
	document.querySelectorAll('.jsStepPhysics').forEach(element => {
		element.addEventListener('click', physicsTic);
	});
	document.querySelectorAll('.jsShowPhysNum').forEach(element => {
		setInterval(() => {
			element.innerHTML = physTicsRan;
		}, 20);
	})

	document.querySelectorAll('.jsClearIntervalRender').forEach(element => {
		element.addEventListener('click', clearRenderTic);
	});
	document.querySelectorAll('.jsStartIntervalRender').forEach(element => {
		element.addEventListener('click', startRenderTic);
	});
	document.querySelectorAll('.jsStepRender').forEach(element => {
		element.addEventListener('click', renderTic);
	});
	document.querySelectorAll('.jsShowFramesRendered').forEach(element => {
		setInterval(() => {
			element.innerHTML = framesRendered;
		}, 20)
	})

	document.querySelectorAll(':is(.hSplit, .vSplit)[data-height]').forEach(element => {
		element.style.height = element.dataset.height;
	});
	document.querySelectorAll(':is(.hSplit, .vSplit)[data-width]').forEach(element => {
		element.style.width = element.dataset.width;
	});
	

	if(hasURLParam('lolcat')){
		let lolCatTimerGG = 0;
		setInterval(function(){
			cssVar('accent-color', `hsl(${lolCatTimerGG},100%,50%)`);
			lolCatTimerGG += 5;
			if(lolCatTimerGG > 360){
				lolCatTimerGG -= 360;
			}
		}, 50);
	}

	setTimeout(function(){
		document.querySelector('#loadingUi').style.height = '0px';
		document.querySelector('#loadingUi').style.opacity = '0';
		setTimeout(function(){
			document.querySelector('#loadingUi').remove();
		}, 5000)
	}, (hasURLParam('skipIntro') == true?0:2500));
	
	loadingText.innerHTML = '';
	document.querySelector('#stratiiIntroLogo').style.color = 'var(--accent-color)';
}

var selectedObjIndex = -1,
selObjMouseX,
selObjMouseY;
mainCanvas.addEventListener('mousedown', event => {
	if(event.button == 1){return;}

	objs.forEach((obj, index) => {
		if(obj.phys.useRect == true){

		}else{
			if(pthag(ctxCords(event.clientX) - obj.x, ctyCords(event.clientY) - obj.y) < obj.phys.radius){
				selectedObjIndex = index;
				obj.phys.xMomentum = 0;
				obj.phys.yMomentum = 0;
			}
		}
	});
});
mainCanvas.addEventListener('mousemove', event => {
	if(isCanvasMouseDown == false || event.button == 1 || selectedObjIndex == -1){return;}
	
	let obj = objs[selectedObjIndex];

	obj.x = ctxCords(event.clientX);
	obj.y = ctyCords(event.clientY);
	obj.phys.xMomentum = 0;
	obj.phys.yMomentum = 0;

	selObjMouseMovmentX = event.movementX;
	selObjMouseMovmentY = event.movementY;
});
mainCanvas.addEventListener('mouseup', event => {
	if(selectedObjIndex == -1){return;}

	let obj = objs[selectedObjIndex];
	selectedObjIndex = -1;

	obj.phys.xMomentum = ctScale(selObjMouseMovmentX);
	obj.phys.yMomentum = ctScale(selObjMouseMovmentY);
});
