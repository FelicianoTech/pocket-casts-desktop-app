const electron = require( "electron" );
const { shell, app, BrowserWindow, globalShortcut } = electron;
const HOMEPAGE = "https://play.pocketcasts.com/web/"

let mainWindow;

app.on( "ready", () => {
	window = new BrowserWindow({
		width: 1200,
		height: 900,
		webPreferences: {
			nodeIntegration: false
		}
	});

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
