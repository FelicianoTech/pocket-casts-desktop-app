const electron = require( "electron" );
const path = require('path');
const { shell, app, Tray, Menu, BrowserWindow, globalShortcut } = electron;
const HOMEPAGE = "https://play.pocketcasts.com/web/"
const iconPath = path.join(__dirname, 'tray-icon.png');

let mainWindow;
let appIcon = null;

app.on( "ready", () => {
	window = new BrowserWindow({
		width: 1200,
		height: 900,
		webPreferences: {
			nodeIntegration: false
		}
	});
  
  var contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Quit',
      accelerator: 'Alt+F4',
      click: function(){
        app.quit();
      }
    }
  ]);
  appIcon = new Tray(iconPath);
  appIcon.setToolTip('Pocket Casts');
  appIcon.setContextMenu(contextMenu);

	window.setMenuBarVisibility( false );
	window.loadURL( HOMEPAGE );

	window.webContents.on( "will-navigate", ( ev, url ) => {
		parts = url.split( '/' );

		if( parts[0] + "//" + parts[2] != HOMEPAGE ){
			ev.preventDefault();
			shell.openExternal( url );
		}
	});

	// Register media controls
	globalShortcut.register( 'MediaPlayPause', () => {
		window.webContents.executeJavaScript( "document.querySelector( '.play_pause_button' ).click()");
	});
	globalShortcut.register( 'MediaPreviousTrack', () => {
		window.webContents.executeJavaScript( "document.querySelector( '.skip_back_button' ).click()");
	});
	globalShortcut.register( 'MediaNextTrack', () => {
		window.webContents.executeJavaScript( "document.querySelector( '.skip_forward_button' ).click()");
	});

	window.on( "closed", () => {
		window = null;
	});
});

app.on( "window-all-closed", () => {
	if( process.platform !== "darwin" ){
		app.quit()
	}
});
