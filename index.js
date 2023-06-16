const mainCanvas = document.querySelector('#mainCanvas'),
mainContext = mainCanvas.getContext('2d'),
lightTexture = [
	0,0,0,0, 0,0,0,255, 0,0,0,255, 0,0,0,255, 0,0,0,255, 0,0,0,255, 0,0,0,255, 0,0,0,0,
	0,0,0,255, 0,0,0,255, 255,255,255,255, 255,255,255,255, 255,255,255,255, 255,255,255,255, 0,0,0,255, 0,0,0,255,
	0,0,0,255, 255,255,255,255, 0,0,0,255, 0,0,0,255, 0,0,0,255, 0,0,0,255, 255,255,255,255, 0,0,0,255,
	0,0,0,255, 255,255,255,255, 0,0,0,255, 255,255,255,255, 0,0,0,255, 0,0,0,255, 255,255,255,255, 0,0,0,255,
	0,0,0,255, 255,255,255,255, 0,0,0,255, 0,0,0,255, 255,255,255,255, 0,0,0,255, 255,255,255,255, 0,0,0,255,
	0,0,0,255, 255,255,255,255, 0,0,0,255, 255,255,255,255, 0,0,0,255, 0,0,0,255, 255,255,255,255, 0,0,0,255,
	0,0,0,255, 255,255,255,255, 0,0,0,255, 0,0,0,255, 255,255,255,255, 0,0,0,255, 255,255,255,255, 0,0,0,255,
	0,0,0,255, 255,255,255,255, 0,0,0,255, 255,255,255,255, 0,0,0,255, 0,0,0,255, 255,255,255,255, 0,0,0,255,
	0,0,0,255, 255,255,255,255, 0,0,0,255, 0,0,0,255, 255,255,255,255, 0,0,0,255, 255,255,255,255, 0,0,0,255,
	0,0,0,255, 255,255,255,255, 0,0,0,255, 255,255,255,255, 0,0,0,255, 0,0,0,255, 255,255,255,255, 0,0,0,255,
	0,0,0,255, 255,255,255,255, 0,0,0,255, 0,0,0,255, 255,255,255,255, 0,0,0,255, 255,255,255,255, 0,0,0,255,
	0,0,0,255, 255,255,255,255, 0,0,0,255, 255,255,255,255, 0,0,0,255, 0,0,0,255, 255,255,255,255, 0,0,0,255,
	0,0,0,255, 0,0,0,255, 255,255,255,255, 255,255,255,255, 255,255,255,255, 255,255,255,255, 0,0,0,255, 0,0,0,255,
	0,0,0,0, 0,0,0,255, 255,255,255,255, 255,255,255,255, 255,255,255,255, 255,255,255,255, 0,0,0,255, 0,0,0,0,
	0,0,0,0, 0,0,0,255, 255,255,255,255, 255,255,255,255, 255,255,255,255, 255,255,255,255, 0,0,0,255, 0,0,0,0,
	0,0,0,0, 0,0,0,255, 0,0,0,255, 255,255,255,255, 255,255,255,255, 0,0,0,255, 0,0,0,255, 0,0,0,0,
	0,0,0,0, 0,0,0,0, 0,0,0,255, 0,0,0,255, 0,0,0,255, 0,0,0,255, 0,0,0,0, 0,0,0,0,
];
mainContext.imageSmoothingEnabled = false;
const $ = function(selector, element = document){return element.querySelector(selector);},
$all = function(selector, element = document){return element.querySelectorAll(selector);};
Element.prototype.$ = function(selector){return $(selector, this);}
Element.prototype.$all = function(selector){return $all(selector, this);}
String.prototype.delChar = function(sel){return this.replace(sel,'')};
function css(name, val = null, options = {resolveToNum: false, obj: $(':root')}){
	let obj = (options.obj?options.obj:$(':root'));
	if(val != null){
		obj.style.setProperty(name, val);
	}else{
		let output = getComputedStyle(obj).getPropertyValue(name);
		return (options.resolveToNum?Number(output.delChar(' ').delChar('px').delChar('%').delChar('s')):output);
	}
}
Element.prototype.css = function(name, val = null, options = {resolveToNum: false}){
	let passedOptions = options;
	passedOptions.obj = this;
	css(name, val, passedOptions)
};

var s = {
	canvasType: 'base',
	gravity: 0.1,
	cameraX: 0,
	cameraY: -250,
	cameraZoom: 0.4,
	showHitboxes: true,
	floorHeight: 1000,
	floorThickness: 100,
	floorColor: {r:250, g:255, b:255, a: 0.55},
	floorBouncyness: 0.8,
	floorEnabled: true,
	globalLighting: {r:100, g:100, b:100},
	background: {r:20, g:20, b:20},
	backgroundEnabled: false,
	physicsIntervalRunning: true,
	physicsIntervalTime: 10,
	renderIntervalRunning: true,
	renderIntervalTime: 10,
};
var framesRendered = 0,
physTicsRan = 0;
objs = [
{
	x: 0,
	y: 0,
	rotation: 0,
	phys: {
		constraints: {
			rotation: 0
		},
		useRect: false,
		radius: 100,
		dynamic: true,
		solid: true,
		xMomentum: 1,
		yMomentum: 0,
		rotationMomentum: 0,
		mass: 0,
		gravityScale: 1,
		bouncyness: 1,
		scale: 1
	},
	vis: {
		visible: true,
		useTexture: true,
		texture: {
			color: [
				0,0,0,0, 		41,94,176,1, 		41,94,176,1, 		0,0,0,0,
				41,94,176,1, 	190,192,199,1, 		12,15,20,1, 		41,94,176,1,
				41,94,176,1, 	12,15,20,1, 		190,192,199,1, 		41,94,176,1,
				0,0,0,0, 		41,94,176,1, 		41,94,176,1, 		0,0,0,0
			],
			normal: [
				0,0,0,0,		87,229,255,1,		152, 231, 255, 1,	0,0,0,0,
				10,142,255,1,	81, 142, 255, 1,	153,128,255,1,		217,141,255,1,
				7,76,255,1,		76,75,255,1,		158,75,255,1,		202,76,255,1,
				0,0,0,0,		70,5,255,1,			125,5,255,1,		0,0,0,0,
			],
			width: 4,
			height: 4,
		},
		mesh: {
			// // useBezier: false,
			file: [[{x: 1, y: 1},{x: 1, y: 1}]],
			color: {r: 255, g: 255, b: 255},
			borderWidth: 2,
		},
		scale: 50,
		xOffset: -100, // calculated after scale
		yOffset: -100, // calculated after scale
		// parallax: 1,
	},
	light: {
		isLight: false,
		color: {r:255, g:100, b:100},
		radialFalloff: 400,
		angularUpperClamp: 45,
		angularLowerClamp: 135,
	},
	func: {
		useFunctions: false,
		renderfunctions: [function(obj){}], // ran every render tic
		physicsfunctions: [function(obj){}], // ran every physics tic
		catch: function(err){console.warn(err);} // handles catch functions however you like
	},

	temp:{}
},
{
	x: -500,
	y: -500,
	rotation: 0,
	phys: {
		constraints: {
			rotation: 0,
		},
		useRect: true,
		width: 150,
		height: 150,
		// dynamic: true,
		// solid: true,
		xMomentum: 1.1,
		yMomentum: 0,
		// rotationMomentum: 0,
		// mass: 0,
		gravityScale: 1,
		// bouncyness: 1,
		scale: 1
	},
	vis: {
		visible: true,
		useTexture: false,
		mesh: {
			// useBezier: false,
			file: [{x: 0, y: 0},{x: 0, y: 3},{x: 3, y: 3}],
			fillColor: {r: 146, g: 243, b: 76},
			borderColor: {r: 0, g: 0, b: 0},
			borderWidth: 0,
			fill: true,
		},
		scale: 50,
		xOffset: 0,
		yOffset: 0,
		// parallax: 1,
	},
	light: {
		isLight: false,
	},

	temp:{}
}];

function setCookie(cname, cvalue, exdays) {
	const d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	let expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
	let name = cname + "=";
	let decodedCookie = decodeURIComponent(document.cookie);
	let ca = decodedCookie.split(';');
	for(let i = 0; i <ca.length; i++) {
		let c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}
function hasCookie(cname) {
	return (getCookie(cname)?true:false);
}
function deleteCookie(cname){
	if(!hasCookie(cname)){return}
	setCookie(cname, '', 0);
}
function bezier(points, t) {
	var n = points.length - 1;
	var b = [];
	for (var i = 0; i <= n; i++) {
		b.push({ x: points[i].x, y: points[i].y });
	}
	for (var r = 1; r <= n; r++) {
		for (var i = 0; i <= n - r; i++) {
			b[i].x = (1 - t) * b[i].x + t * b[i+1].x;
			b[i].y = (1 - t) * b[i].y + t * b[i+1].y;
		}
	}
	return { x: b[0].x, y: b[0].y };
}
function drawPixel(x, y, color = {r,g,b,a}, context, scale = 1){
	context.fillStyle = colorObjToRGB(color);
	context.fillRect(Math.floor(x), Math.floor(y), Math.floor(scale), Math.floor(scale));
}
function getImageDataFromContext(context, width, height, withoutDotData){
	if(withoutDotData == true){ return context.getImageData(0,0,width,height, { willReadFrequently: true }); }
	return context.getImageData(0,0,width,height, { willReadFrequently: true }).data;
}
function getFromImageData(x, y, width, imageData){
	return {
		r: imageData[y * (width * 4) + x * 4],
		g: imageData[(y * (width * 4) + x * 4) + 1],
		b: imageData[(y * (width * 4) + x * 4) + 2],
		a: imageData[(y * (width * 4) + x * 4) + 3]
	};
}
function getFromImageDataI(i, imageData){
	return {
		r: imageData[i*4],
		g: imageData[(i*4)+1],
		b: imageData[(i*4)+2],
		a: imageData[(i*4)+3]
	};
}
function colorObjToRGB(value = {r,g,b,a}){
	return `rgba(${value.r},${value.g},${value.b},${(value.a != undefined?value.a:1)})`;
}
function pthag(a,b){
	return Math.sqrt(a*a + b*b);
}
function setURLParam(name,value){
	let params = new URLSearchParams(window.location.search);
	params.set(name,value);
	window.location.search = params.toString();
}
function deleteURLParam(name){
	const params = new URLSearchParams(window.location.search);
	params.delete(name);
	window.location.search = params.toString();
}
function getURLParam(name){
	const params = new URLSearchParams(window.location.search);
	return params.get(name);
}
function hasURLParam(name){
	const params = new URLSearchParams(window.location.search);
	return params.has(name);
}
function setURLHash(value){
	location.hash = value;
}
function getURLHash(){
	if(location.hash == ''){return null;}
	return location.hash.replace('#','');
}
function getSaveString(){
	saveCSSVars();
	return JSON.stringify({s:s,objs:objs});
}
function loadFromString(string){
	try {
	
	s = JSON.parse(string).s;
	objs = JSON.parse(string).objs;
	setCSSVars();
	
	}catch(error){statusErrMsg('error loading save', error);}
}
function saveToHash(){
	setURLHash(getSaveString());
}
function loadFromHash(){ //? BUG: Functions not loaded properly; treated as string
	loadFromString(decodeURI(getURLHash()));
}
function saveToFile(){
	let blob = new Blob([getSaveString()]);
	let d = new Date();
	saveAs(blob, `stratii_${d.getTime()}_save.txt`)
}
function loadFromFile(){
	let input = document.createElement('input');
	input.type = 'file';
	input.onchange = event => { 
		let file = event.target.files[0];
		let reader = new FileReader();
		reader.readAsText(file,'UTF-8');
		reader.onload = readerEvent => {
			let content = readerEvent.target.result;
			console.log(content)
			loadFromString(content);
		}
	}
	input.click();
}
function saveToCookies(){
	setCookie('save', getSaveString(), 1)
}
function loadFromCookies(){
	if(!hasCookie('save')){statusWarnMsg('no save cookie found');}
	loadFromString(getCookie('save'));
}
function clearSave(){
	setURLHash('');
}
function saveCSSVars(){
	let varList = ['bg-color','dark-accent-color','accent-color','yellow-color','red-color','split-border-thickness','title-size','menu-bar-height','status-bar-height']
	s.cssVars = []
	varList.forEach(item => {
		s.cssVars.push({name:item,val:css('--' + item)});
	});
}
function setCSSVars(){
	if(!s.cssVars){statusErrMsg('cssVarsNotSaved','custom ui properties will not be restored');return;}
	s.cssVars.forEach(v => {
		css('--' + v.name,v.val);
	})
}
var canvasZoomPosX = mainCanvas.width / 2,
canvasZoomPosY = mainCanvas.height / 2;
Number.prototype.toCanvasXCords = function(camX = s.cameraX, camZoom = s.cameraZoom){
	let totalX = camX + this;
	return totalX + ((totalX - canvasZoomPosX)*(camZoom - 1));
}
Number.prototype.toCanvasYCords = function(camY = s.cameraY, camZoom = s.cameraZoom){
	let totalY = camY + this;
	return totalY + ((totalY - canvasZoomPosY)*(camZoom - 1));
}
Number.prototype.toCanvasScale = function(camZoom = s.cameraZoom){
	return this * camZoom;
}
Number.prototype.toWorldXCords = function(precision = 0.1, guessLimit = 1000, camX = s.cameraX, camZoom = s.cameraZoom){
	// try to guess the best result IDK
	// W = world cords
	// C = canvas cords
	let bestGuessW = -500,
	guessNum = 0,
	bestDifferenceC = 1000;
	while(bestDifferenceC > precision && guessNum < guessLimit){
		let guessW = bestGuessW + Math.random()*(bestDifferenceC*2-bestDifferenceC).toWorldScale();
		let differenceC = Math.abs(guessW.toCanvasXCords() - this);
		// console.warn(bestGuessW);
		if(differenceC < bestDifferenceC){ // problem?
			bestGuessW = guessW;
			bestDifferenceC = differenceC;
		}
		guessNum++
	}
	return bestGuessW;
};
// mainCanvas.addEventListener('click', event => {
// 	let result = event.clientX.toWorldXCords();
// 	console.log(result);
// 	objs[0].x = result;
// });
Number.prototype.toWorldYCords = function(camY = s.cameraY, camZoom = s.cameraZoom){
	// return -(this/(camZoom-1))-camY;
	//! I DONT KNOW AAAAAA
	return 0;
}
Number.prototype.toWorldScale = function(camZoom = s.cameraZoom){
	return this / camZoom;
}
function createStatusMsg(msg, tooltip = 'no info more provided', color = ''){
	if(tooltip == ''){tooltip = 'no info more provided';}
	let element = $('#statusMsg');
	element.innerHTML = msg;
	element.dataset.tooltip = tooltip;
	element.css('--c', color);
	setTimeout(() => {
		if(element.innerHTML == msg){
			element.innerHTML = '';
		}
	}, 10000);
}
function statusMsg(msg, tooltip = ''){
	createStatusMsg(msg, tooltip);
}
function statusWarnMsg(msg, tooltip = ''){
	createStatusMsg('Warning: ' + msg, tooltip, 'var(--yellow-color)');
}
function statusErrMsg(msg, tooltip = ''){
	createStatusMsg('Error: ' + msg, tooltip, 'var(--red-color)');
}

function renderTexture(texture, width, height, x, y, scale = 1, canvas = mainContext, camX = s.cameraX, camY = s.cameraY, camZoom = s.cameraZoom)
{
	let canvasX = x.toCanvasXCords(camX, camZoom),
	canvasY = y.toCanvasYCords(camY, camZoom),
	pixelSize = Math.round(scale.toCanvasScale(camZoom));
	for(let i = 0; i < width*height; i++){
		let pixelColor = getFromImageDataI(i, texture);
		let pixelX = (i%width);
		let pixelY = Math.floor(i/width);
		drawPixel(canvasX + (pixelX*pixelSize), canvasY + (pixelY*pixelSize), pixelColor, canvas, pixelSize);
	}
}

function renderMesh(mesh, x, y, scale, canvas = mainContext, camX = s.cameraX, camY = s.cameraY, camZoom = s.cameraZoom)
{
	canvas.beginPath();
	canvas.fillStyle = colorObjToRGB(mesh.fillColor);
	canvas.strokeStyle = colorObjToRGB(mesh.borderColor);
	canvas.lineWidth = mesh.borderWidth.toCanvasScale();
	mesh.file.forEach(vertex => {
		canvas.lineTo((x + vertex.x*scale).toCanvasXCords(camX, camZoom), (y + vertex.y*scale).toCanvasYCords(camY, camZoom));
	});
	if(mesh.fill == true){
		canvas.fill();
	}
	if(mesh.borderWidth != 0){
		canvas.stroke();
	}
}

function renderObjTexture(obj = {x: 0, y: 0, vis: {xOffset: 0, yOffset: 0, scale: 1, texture: {width: 1, height: 1, color: [0,0,0,0], normal: [0,0,0,0]}}}, canvas = mainContext, camX = s.cameraX, camY = s.cameraY, camZoom = s.cameraZoom, useNormals = false)
{
	renderTexture((useNormals?obj.vis.texture.normal:obj.vis.texture.color), obj.vis.texture.width, obj.vis.texture.height, obj.x, obj.y, obj.vis.scale, canvas, camX, camY, camZoom);
}

function renderObjModel(obj = {x: 0, y: 0, vis: {xOffset: 0, yOffset: 0, scale: 1, mesh: {file: [{x: 0, y: 0}], fillColor: {r,g,b}, borderColor: {r,g,b}, borderWidth: 2, fill: true}}}, canvas = mainContext, camX = s.cameraX, camY = s.cameraY, camZoom = s.cameraZoom)
{
	renderMesh(obj.vis.mesh, obj.x+obj.vis.xOffset, obj.y+obj.vis.yOffset, obj.vis.scale, canvas, camX, camY, camZoom);
}

function renderTic()
{
	mainContext.clearRect(0,0,mainCanvas.width,mainCanvas.height);
	if(s.backgroundEnabled == true){
		mainContext.fillStyle = colorObjToRGB(s.background);
		mainContext.fillRect(0,0,mainCanvas.width,mainCanvas.height);
	}
	if(s.floorEnabled == true){
		mainContext.fillStyle = colorObjToRGB(s.floorColor);
		mainContext.fillRect(0,(s.floorHeight).toCanvasYCords(), mainCanvas.width, s.floorThickness*s.cameraZoom);
	}

	objs.forEach(obj => {
		if(obj.vis.useTexture){
			renderObjTexture(obj);
		}else{
			renderObjModel(obj);
		}
	});

	if(s.showHitboxes == true){
		objs.forEach((obj, index) => {
			mainContext.beginPath();
			let color = (index/objs.length)*360;
			mainContext.strokeStyle = `hsl(${color}, 80%, 50%)`;
			mainContext.fillStyle = `hsla(${color}, 80%, 50%, 0.2)`;
			if(obj.phys.useRect == true){
				mainContext.rect(obj.x.toCanvasXCords(), obj.y.toCanvasYCords(), obj.phys.width.toCanvasScale(), obj.phys.height.toCanvasScale());
			}else{
				mainContext.arc(obj.x.toCanvasXCords(), obj.y.toCanvasYCords(), obj.phys.radius.toCanvasScale(), 0, 2 * Math.PI)
			}
			mainContext.stroke();
			mainContext.fill();
		});
	}

	objs.forEach(obj => {
		if(!obj.func || obj.func.useFunctions == false){return;}
		obj.func.renderfunctions.forEach((func) => {
			try {
				func(obj);
			} catch (error) {
				obj.func.catch(error);
			}
		});
	});

	framesRendered++
}

function physicsTic()
{
	objs.forEach(obj => {
		obj.x += obj.phys.xMomentum;
		obj.y += obj.phys.yMomentum;
		obj.phys.yMomentum += s.gravity;
		if(obj.phys.useRect == true){ // using rect

			if(obj.y + obj.phys.height > s.floorHeight){
				obj.phys.yMomentum = -obj.phys.yMomentum;
				obj.y = s.floorHeight-obj.phys.height;
			}

		}else{ // using radius

			if(obj.y + obj.phys.radius > s.floorHeight){
				obj.phys.yMomentum = -obj.phys.yMomentum;
				obj.y = s.floorHeight-obj.phys.radius;
			}

		}
	});

	objs.forEach(obj => {
		if(!obj.func || obj.func.useFunctions == false){return;}
		obj.func.physicsfunctions.forEach((func) => {
			try {
				func(obj);
			} catch (error) {
				obj.func.catch(error);
			}
		});
	});

	physTicsRan++
}

var physicsTicInterval;
function startPhysicsTic(){
	if(s.physicsIntervalRunning == true){return;}
	physicsTicInterval = setInterval(physicsTic, s.physicsIntervalTime);
	s.physicsIntervalRunning = true;
}
function clearPhysicsTic(){
	if(s.physicsIntervalRunning == false){return;}
	clearInterval(physicsTicInterval);
	s.physicsIntervalRunning = false;
}

var renderTicInterval;
function startRenderTic(){
	if(s.renderIntervalRunning == true){return;}
	renderTicInterval = setInterval(renderTic, s.renderIntervalTime);
	s.renderIntervalRunning = true;
}
function clearRenderTic(){
	if(s.renderIntervalRunning == false){return;}
	clearInterval(renderTicInterval);
	s.renderIntervalRunning = false;
}

function startMain()
{
	loadingText.innerHTML = 'starting MAIN...';

	if(hasURLParam('dev') == true){
		console.log('dev mode detected');
		document.querySelector('#devmenu').style.display = 'block';
		setInterval(() => {document.querySelector('#objsTEST').innerHTML = JSON.stringify(objs);}, 100)
		setInterval(() => {document.querySelector('#sTEST').innerHTML = JSON.stringify(s);}, 100)
	}else{
		document.querySelector('#devmenu').remove();
	}
	if(getURLHash() != null){
		loadingText.innerHTML = 'restoring old session...';
		loadFromHash();
	}

	loadingText.innerHTML = 'checking physicsTic...';
	if(s.physicsIntervalRunning == true){ s.physicsIntervalRunning = false; startPhysicsTic(); }

	loadingText.innerHTML = 'checking renderTic...';
	if(s.renderIntervalRunning == true){ s.renderIntervalRunning = false; startRenderTic(); }
}
