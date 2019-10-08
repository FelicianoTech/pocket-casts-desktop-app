const electron = require( "electron" );
const path = require('path');
const { shell, app, Tray, Menu, BrowserWindow, globalShortcut } = electron;
const HOMEPAGE = "https://play.pocketcasts.com/web/"
const iconPath = path.join(__dirname, 'tray-icon.png');

let mainWindow;
let appIcon = null;

// Avoid Multiple Instances
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) { app.quit(); }

app.on( "ready", () => {
	mainWindow = new BrowserWindow({
		width: 1200,
		height: 900,
		webPreferences: {
			nodeIntegration: false
		}
	});
  
  var contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Show',
      click: function(){
        mainWindow.show();
      }
    },
    { 
      type: 'separator' 
    },
    { 
      label: 'Play / Pause',
      click: function(){
		    mainWindow.webContents.executeJavaScript( "document.querySelector( '.play_pause_button' ).click()");
      }
    },
    { 
      label: 'Skip forward 30 sec',
      click: function(){
		    mainWindow.webContents.executeJavaScript( "document.querySelector( '.skip_forward_button' ).click()");
      }
    },
    { 
      label: 'Skip back 15 sec',
      click: function(){
		    mainWindow.webContents.executeJavaScript( "document.querySelector( '.skip_back_button' ).click()");
      }
    },
    { 
      type: 'separator' 
    },
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

	mainWindow.setMenuBarVisibility( false );
	mainWindow.loadURL( HOMEPAGE );

	mainWindow.webContents.on( "will-navigate", ( ev, url ) => {
		parts = url.split( '/' );

		if( parts[0] + "//" + parts[2] != HOMEPAGE ){
			ev.preventDefault();
			shell.openExternal( url );
		}
	});

	// Register media controls
	globalShortcut.register( 'MediaPlayPause', () => {
		mainWindow.webContents.executeJavaScript( "document.querySelector( '.play_pause_button' ).click()");
	});
	globalShortcut.register( 'MediaPreviousTrack', () => {
		mainWindow.webContents.executeJavaScript( "document.querySelector( '.skip_back_button' ).click()");
	});
	globalShortcut.register( 'MediaNextTrack', () => {
		mainWindow.webContents.executeJavaScript( "document.querySelector( '.skip_forward_button' ).click()");
	});


  mainWindow.on( "closed", () => {
      mainWindow = null;
  });
});

app.on( "window-all-closed", () => {
  console.log("window-all-closed");
	if( process.platform !== "darwin" ){
		app.quit()
	}
});
