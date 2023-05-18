try{

const { ipcRenderer } = require('electron');
const ipc = ipcRenderer;

winBar.style.display = 'flex';
cssVar('winBarIsOpen', 1); // todo

winClose.addEventListener("click", () => {
	ipc.send('closeApp');
});
winMaximize.addEventListener("click", () => {
	ipc.send('maximizeApp');
});
winMinimize.addEventListener("click", () => {
	ipc.send('minimizeApp');
});

}catch(error){
	if(error != "ReferenceError: require is not defined"){
		console.warn(error);
	}
}