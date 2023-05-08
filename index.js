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

var s = {
	canvasType: 'base',
	gravity: 0.1,
	cameraX: 100,
	cameraY: 50,
	cameraZoom: 0.3,
	showHitboxes: true,
	floorHeight: 1000,
	floorThickness: 100,
	floorColor: {r:250, g:255, b:255, a: 0.55},
	floorBouncyness: 0.8,
	floorEnabled: true,
	globalLighting: {r:100, g:100, b:100},
	background: {r:20, g:20, b:20},
	backgroundEnabled: false,
	uiBorderThickness: 3,
	uiBgColor: {r:24, g:24, b:24},
	uiDarkAccentColor: {r:0, g:0, b:0, a: 0.55},
	uiAccentColor: {r:255, g:255, b:255, a: 0.55},
	uiTitleSize: 12,
	physicsIntervalRunning: true,
	physicsIntervalTime: 10,
	renderIntervalRunning: true,
	renderIntervalTime: 10,
};
var framesRendered = 0,
physTicsRan = 0;
objs = [{
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
				10,142,255,1,	81, 142, 255, 1,	153,128,255,1,	217,141,255,1,
				7,76,255,1,	76,75,255,1,		158,75,255,1,		202,76,255,1,
				0,0,0,0,		70,5,255,1,		125,5,255,1,		0,0,0,0,
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
			file: [[{x: 0, y: 0},{x: 0, y: 3},{x: 3, y: 3}]],
			color: {r: 146, g: 243, b: 76},
			borderWidth: 2,
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
function save(toFile = false){
	if(toFile == true){
		//? todo
		return;
	}
	setURLHash(JSON.stringify({s:s,objs:objs}));
}
function load(fromFile = false){ //? BUG: Functions not loaded properly; treated as string
	if(fromFile == true){
		//? todo
		return;
	}
	s = JSON.parse(decodeURI(getURLHash())).s;
	objs = JSON.parse(decodeURI(getURLHash())).objs;
	updateCSSVars();
}
function clearSave(){
	setURLHash('');
}
function cssVar(name, val = null, obj = ':root'){
	if(val != null){
		document.querySelector(obj).style.setProperty('--' + name, val);
	}
	else{
		return getComputedStyle(obj).getPropertyValue('--' + name);
	}
}
function updateCSSVars(){
	cssVar('title-size', `${s.uiTitleSize}px`);
	cssVar('ui-border-thickness', `${s.uiBorderThickness}px`);
	cssVar('bg-color', colorObjToRGB(s.uiBgColor));
	cssVar('dark-accent-color', colorObjToRGB(s.uiDarkAccentColor));
	cssVar('accent-color', colorObjToRGB(s.uiAccentColor));
}
function wtxCords(localx, objx = 0, objzoom = 1, camX = s.cameraX, camZoom = s.cameraZoom){
	let objX = camX + objx * camZoom,
	objZoom = objzoom * camZoom;
	return objX + localx * objZoom;
}
function wtyCords(localy, objy = 0, objzoom = 1, camY = s.cameraY, camZoom = s.cameraZoom){
	let objY = camY + objy * camZoom,
	objZoom = objzoom * camZoom;
	return objY + localy * objZoom;
}
function wtScale(num, objzoom = 1, camZoom = s.cameraZoom){
	return num * objzoom * camZoom;
}
function ctxCords(x, camX = s.cameraX, camZoom = s.cameraZoom){
	return (x - camX) / camZoom;
}
function ctyCords(y, camY = s.cameraY, camZoom = s.cameraZoom){
	return (y - camY) / camZoom;
}
function ctScale(num, camZoom = s.cameraZoom){
	return num / camZoom;
}
function warnMsg(msg, redOutline = false, formalError = null){
	// let element = document.createElement('span'); todo // have another section for the formal error
	console.warn(`warning: ${msg}` + (formalError != null?` /// Formal Error: ${formalError}`:''));
}

function renderGround(context, canvasWidth, thickness, height, color = {r,g,b,a}, camY, camZoom)
{
	context.fillStyle = colorObjToRGB(color);
	context.fillRect(0,camY + height*camZoom, canvasWidth, thickness*camZoom, camY + height*camZoom);
}

function renderObj(context, obj = {x: 0, y: 0, vis: {xOffset: 0, yOffset: 0, scale: 1, texture: {width: 1, height: 1, color: [0,0,0,0], normal: [0,0,0,0]}}}, camX = 0, camY = 0, camZoom = 1, useNormals = false)
{
	if(obj.vis.useTexture == true){
		let objX = camX + Math.round((obj.x + obj.vis.yOffset) * camZoom),
		objY = camY + Math.round((obj.y + obj.vis.yOffset )* camZoom),
		objZoom = Math.round(obj.vis.scale * camZoom);
		for (let i = 0; i < obj.vis.texture.width*obj.vis.texture.height; i++) {
			let tPix = getFromImageDataI(i,(useNormals == true?obj.vis.texture.normal:obj.vis.texture.color));
			drawPixel(objX + (i%obj.vis.texture.width) * objZoom , objY + Math.floor(i/obj.vis.texture.width) * objZoom, tPix, context, objZoom);
		}
	}else{
		let objX = camX + obj.x * camZoom,
		objY = camY + obj.y * camZoom,
		objZoom = obj.vis.scale * camZoom;
		obj.vis.mesh.file.forEach(face => {
			context.fillStyle = colorObjToRGB(obj.vis.mesh.color);
			context.beginPath();
			face.forEach(vertex => {
				context.lineTo(objX + vertex.x * objZoom, objY + vertex.y * objZoom);
			});
			context.fill();
		});
	}
}

function renderTic()
{
	mainContext.clearRect(0,0,mainCanvas.width,mainCanvas.height);
	if(s.backgroundEnabled == true){
		mainContext.fillStyle = colorObjToRGB(s.background);
		mainContext.fillRect(0,0,mainCanvas.width,mainCanvas.height);
	}
	if(s.floorEnabled == true){
		renderGround(mainContext, mainCanvas.width, s.floorThickness, s.floorHeight, s.floorColor, s.cameraY, s.cameraZoom);
	}
	objs.forEach(obj => {
		renderObj(mainContext, obj, s.cameraX, s.cameraY, s.cameraZoom);
	});
	if(s.showHitboxes == true){
		objs.forEach((obj, index) => {
			mainContext.beginPath();
			let color = (index/objs.length)*360
			mainContext.strokeStyle = `hsl(${color}, 80%, 50%)`;
			mainContext.fillStyle = `hsla(${color}, 80%, 50%, 0.2)`;
			if(obj.phys.useRect == true){
				mainContext.rect(wtxCords(obj.x), wtyCords(obj.y), wtScale(obj.phys.width, obj.phys.scale), wtScale(obj.phys.height, obj.phys.scale));
			}else{
				mainContext.arc(wtxCords(obj.x), wtyCords(obj.y), wtScale(obj.phys.radius, obj.phys.scale), 0, 2 * Math.PI)
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
	}
	if(getURLHash() != null){
		loadingText.innerHTML = 'restoring old session...';
		load();
	}else{
		updateCSSVars();
	}

	loadingText.innerHTML = 'checking physicsTic...';
	if(s.physicsIntervalRunning == true){ s.physicsIntervalRunning = false; startPhysicsTic(); }

	loadingText.innerHTML = 'checking renderTic...';
	if(s.renderIntervalRunning == true){ s.renderIntervalRunning = false; startRenderTic(); }
}
