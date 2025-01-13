const electron = require( "electron" );
const path = require('path');
const { shell, app, Tray, Menu, BrowserWindow, globalShortcut } = electron;
const HOMEPAGE = "https://play.pocketcasts.com/podcasts"
const fs = require('fs');

let iconPath = path.join(__dirname, 'tray-icon.png');
let mainWindow;
let appIcon = null;

class Store {
  constructor(opts) {
      const userDataPath = (electron.app || electron.remote.app).getPath('userData');
      this.path = path.join(userDataPath, opts.configName + '.json');

      this.data = parseDataFile(this.path, opts.defaults);
  }

  get(key) {
      return this.data[key];
  }

  set(key, val) {
      this.data[key] = val;
      fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

function parseDataFile(filePath, defaults) {
  try {
      return JSON.parse(fs.readFileSync(filePath));
  } catch (error) {
      return defaults;
  }
}

function getValidatedWindowDimension(dimen) {
  if (dimen <= 0) return 1
  else return dimen
}

// Avoid Multiple Instances
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) { app.quit(); }

app.on( "ready", () => {
  const userPrefs = new Store({
    configName: 'prefs',
    defaults: {
      windowWidth: 1200, 
      windowHeight: 900
    }
  });

	mainWindow = new BrowserWindow({
		width: getValidatedWindowDimension(userPrefs.get('windowWidth')),
		height: getValidatedWindowDimension(userPrefs.get('windowHeight')),
		webPreferences: {
			nodeIntegration: false
    },
    show: false
  });
  
  if (userPrefs.get("windowMaximized") == true){
    // if the user starts the app maximized, set the unmaximized size to the default window size
    mainWindow.setSize(1200, 900)
    mainWindow.maximize()
  }

  mainWindow.show()
  
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
  if (iconPath.includes('/app.asar/')){
		iconPath = iconPath.replace('/app.asar/', '/')
  }
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
  
  mainWindow.on( "resize", () => {
    let { width, height } = mainWindow.getBounds();

    userPrefs.set('windowWidth', width);
    userPrefs.set('windowHeight', height);
  });

  mainWindow.on( "maximize", () => {
    userPrefs.set('windowMaximized', true);
  });

  mainWindow.on( "unmaximize", () => {
    userPrefs.set('windowMaximized', false);
  });

  mainWindow.on( "closed", () => {
      mainWindow = null;
  });
});

app.on( "window-all-closed", () => {
	if( process.platform !== "darwin" ){
		app.quit()
	}
});
