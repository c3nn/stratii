const mainCanvas = document.querySelector('#mainCanvas'),
mainContext = mainCanvas.getContext('2d');
renderCanvas = document.querySelector('#renderCanvas'),
renderContext = renderCanvas.getContext('2d'),
mainContext.imageSmoothingEnabled = false;
renderContext.imageSmoothingEnabled = false;

var canvasType = 'base',
cameraX = 0,
cameraY = 0,
zoom = 1,
ppr = true, // Pixel Perfect Rendering
globalLighting = 10,
background = 'rgb(90, 55, 28)',
backgroundEnabled = true,
framesRendered = 0,
objs = [{
	isDynamic: true,
	isSolid: true,
	width: 1,
	height: 1,
	x: 0,
	y: 0,
	xmomentum: 0,
	ymomentum: 0,
	mass: 1,
	bouncyness: 1,
	isTextured: true,
	textureWidth: 4,
	textureHeight: 4,
	texture: [
		0,0,0,0, 		41,94,176,255, 		41,94,176,255, 		0,0,0,0,
		41,94,176,255, 	190,192,199,255, 	12,15,20,255, 		41,94,176,255,
		41,94,176,255, 	12,15,20,255, 		190,192,199,255, 	41,94,176,255,
		0,0,0,0, 		41,94,176,255, 		41,94,176,255, 		0,0,0,0
	],
	normalTexture: [
		0,0,0,0,		87,229,255,255,		152, 231, 255, 255,		0,0,0,0,
		10,142,255,255,	81, 142, 255, 255,	153,128,255,255,		217,141,255,255,
		7,76,255,255,	76,75,255,255,		158,75,255,255,			202,76,255,255,
		0,0,0,0,		70,5,255,255,		125,5,255,255,			0,0,0,0,
	],
	textureScale: 50,
	isLight: false,
},
{
	isDynamic: false,
	isSolid: false,
	isHidden: true,
	x: 400,
	y: 300,
	xmomentum: 0,
	ymomentum: 0,
	isTextured: true,
	textureWidth: 1,
	textureHeight: 1,
	textureScale: 50,
	isLight: true,
	lightColor: {r:255, g:255, b:255},
	lightFalloffColor: {r:0, g:0, b:0},
	lightFalloff: 800,
	lightDirection: 0,
	lightDirectionalFalloff: 1,
}];

function resizeCanvas(canvas){
	canvas.width = window.innerWidth-400;
	canvas.height = window.innerHeight;
}
window.onresize = function(){
	resizeCanvas(mainCanvas);
	resizeCanvas(renderCanvas);
};
window.onresize();

function createObj(options = {
	// physics
	isDynamic: true, // does the obj use gravity
	isSolid: true, // does the obj colide with other objects
	isCircle: false, // does it use radius? (width & height aren't used)
	width: 1, // width of bounding box if isCircle is false
	height: 1, // height of bounding box if isCircle is false
	radius: 1, // only used if isCircle
	scale: 1, // scales bounding area
	x: 0,
	y: 0,
	xmomentum: 0,
	ymomentum: 0,
	mass: 1,
	gravityScale: 1,
	bouncyness: 1,

	// Rendering
	isHidden: false, // can you see the obj? ignores everything else if true
	isTextured: false, // does the object have a texture? uses mesh if not
	textureWidth: 1, // width of the texture array
	textureHeight: 1, // height of the texture array
	texture: new Uint8ClampedArray, // rgba values, uses textureWidth & textureHeight
	textureScale: 1, // can only be a multiple of 2 if isTextured / can be anything if mesh
	// textureRotation: 0, // 0-360
	normalTexture: new Uint8ClampedArray, // rgba values, uses textureWidth & textureHeight
	mesh: [[{x:0,y:0},{x:100,y:100},{x:200,y:0}]], // array of arrays of vertices; mesh[ face[ vertices{x:0, y:0} ] ]
	color: '#ffffff',

	// isLight
	isLight: false, // does the object emmit light?
	lightColor: {r:255, g:255, b:255}, // light color at center
	lightFalloffColor: {r: 0, g: 0, b: 0}, // light color at edge
	lightFalloff: 100, // pixels the light reaches
	lightDirection: 0, // 0-360
	lightDirectionalFalloff: 1, // 0-1

	// functions
	runFunctions: false, // run functions?
	// onFloorHit: function(){}, // runs when hitting the floor
	// onSideHit: function(){}, // runs when hitting the side
	// onInAir: function(){}, // runs when in air
	onEvery: function(){}, // runs every frame
	// onSpawn: function(){} // runs when obj spawns
}){
	objs.push(options);
}
function drawPixel(x, y, color = '#000000', canvasContext, scale = 1) {
	canvasContext.fillStyle = color;
	canvasContext.fillRect((ppr == true?Math.round(x):x), (ppr == true?Math.round(y):y), (ppr == true?Math.round(scale):scale), (ppr == true?Math.round(scale):scale));
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
function pthag(a,b){
	return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}

function render(isLighting)
{
	let gBaseCanvas = document.createElement('canvas');
	gBaseCanvas.width = mainCanvas.width;
	gBaseCanvas.height = mainCanvas.height;
	let gBaseContext = gBaseCanvas.getContext('2d');
	let gNormalCanvas = document.createElement('canvas');
	gNormalCanvas.width = mainCanvas.width;
	gNormalCanvas.height = mainCanvas.height;
	let gNormalContext = gNormalCanvas.getContext('2d');

	if(backgroundEnabled == true){
		gBaseContext.fillStyle = background;
		gBaseContext.fillRect(0,0,gBaseCanvas.width, gBaseCanvas.height);
	}
	objs.forEach(obj => {
		if(obj.isHidden == true){return;}
		
		// write to canvas using texture || mesh
		if(obj.isTextured == true){
			// write to (base && normal) canvas using texture
			// when drawing normals; blue channel needs to be maxxed
			for (let i = 0; i < obj.textureWidth * obj.textureHeight; i++) {
				let texturePixel = getFromImageDataI(i, obj.texture);
				let normalPixel = getFromImageDataI(i, obj.normalTexture)

				drawPixel(cameraX + (ppr == true?Math.round(obj.x * zoom):obj.x * zoom) + (i%obj.textureWidth) * (ppr == true?Math.round(obj.textureScale * zoom):obj.textureScale * zoom), cameraY + (ppr == true?Math.round(obj.y * zoom):obj.y * zoom) + Math.floor(i/obj.textureWidth) * (ppr == true?Math.round(obj.textureScale * zoom):obj.textureScale * zoom), `rgba(${texturePixel.r},${texturePixel.g},${texturePixel.b},${texturePixel.a/255})`,gBaseContext, obj.textureScale * zoom);
				drawPixel(cameraX + (ppr == true?Math.round(obj.x * zoom):obj.x * zoom) + (i%obj.textureWidth) * (ppr == true?Math.round(obj.textureScale * zoom):obj.textureScale * zoom), cameraY + (ppr == true?Math.round(obj.y * zoom):obj.y * zoom) + Math.floor(i/obj.textureWidth) * (ppr == true?Math.round(obj.textureScale * zoom):obj.textureScale * zoom), `rgba(${normalPixel.r},${normalPixel.g},${normalPixel.b},${normalPixel.a/255})`, gNormalContext, obj.textureScale * zoom);
			}
		}else{
			// write to base canvas using mesh
			gBaseContext.fillStyle = obj.color;
			gNormalContext.fillStyle = 'rgb(0,0,0)';
			obj.mesh.forEach(face => {
				gBaseContext.beginPath();
				gNormalContext.beginPath();``
				face.forEach(vertex => {
					gBaseContext.lineTo(cameraX + obj.x + vertex.x, cameraY + obj.y + vertex.y);
					gNormalContext.lineTo(cameraX + obj.x + vertex.x, cameraY + obj.y + vertex.y);
				});
				gBaseContext.fill();
				gNormalContext.fill();
			});
		}
	});
	framesRendered++
	document.querySelector('#frames').innerHTML = framesRendered;
	if(isLighting != true){
		mainContext.putImageData(getImageDataFromContext((canvasType == 'base'?gBaseContext:gNormalContext), mainCanvas.width, mainCanvas.height, true), 0, 0);
		return;
	}

	// compute light for each pixel
	let baseImageData = getImageDataFromContext(gBaseContext, gBaseCanvas.width, gBaseCanvas.height),
	normalImageData = getImageDataFromContext(gNormalContext, gNormalCanvas.width, gNormalCanvas.height);
	objs.forEach(obj => {
		if(obj.isLight != true){return;}
		
		for (let i = 0; i < renderCanvas.width * renderCanvas.height; i++){
			let pixelX = Math.floor(i%renderCanvas.width),
			pixelY = Math.floor(i/renderCanvas.width),
			lightFalloffAmount = pthag(pixelX - (obj.x + cameraX), pixelY - (obj.y + cameraY)) / obj.lightFalloff;
			if(lightFalloffAmount > 1 && lightFalloffAmount < 0){return;}

			let basePixel = getFromImageDataI(i, baseImageData),
			normalPixel = getFromImageDataI(i, normalImageData);
			drawPixel(pixelX, pixelY,
			`rgb(
				${((obj.lightColor.r - (lightFalloffAmount * (obj.lightColor.r - obj.lightFalloffColor.r))) / 255) * basePixel.r},
				${((obj.lightColor.g - (lightFalloffAmount * (obj.lightColor.g - obj.lightFalloffColor.g))) / 255) * basePixel.g},
				${((obj.lightColor.b - (lightFalloffAmount * (obj.lightColor.b - obj.lightFalloffColor.b))) / 255) * basePixel.b}
			)`
			, renderContext, 1);
		}
	});

};


// createObj();
// render();
var renderInterval = setInterval(function(){
	if(renderCanvas.style.display == 'none'){
		render(false);
	}
}, 10);

var mouseMoveStartX,
mouseMoveStartY,
mouseMoveCamStartX,
mouseMoveCamStartY,
isMouseDown = false;
mainCanvas.addEventListener("mousedown", (event) => {
	mouseMoveStartX = event.clientX;
	mouseMoveStartY = event.clientY;
	mouseMoveCamStartX = cameraX;
	mouseMoveCamStartY = cameraY;
	isMouseDown = true;
});
mainCanvas.addEventListener("mouseup", (event) => {
	isMouseDown = false;
});
mainCanvas.addEventListener("mousemove", (event) => {
	if(isMouseDown != true){return;}
	cameraX = mouseMoveCamStartX - (mouseMoveStartX - event.clientX);
	cameraY = mouseMoveCamStartY - (mouseMoveStartY - event.clientY);
})
mainCanvas.addEventListener("wheel", (event) => {
	if(event.deltaY > 100 || event.deltaY < -100){return;}
	zoom -= event.deltaY/250 * Math.abs(0-zoom);
	cameraX += event.deltaY/10 * Math.abs(0-zoom);
	cameraY += event.deltaY/10 * Math.abs(0-zoom);
	if(zoom < 0.02){
		zoom = 0.02;
	}
}, { passive: true});
function errMsg(message){
	function beGone(){
		element.style.height = '0px';
		element.style.borderWidth = '0px';
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
