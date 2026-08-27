const { app, BrowserWindow, session } = require("electron");
const { spawn } = require("child_process");
const path = require("path");

let backend = null;

function startBackend() {
    backend = spawn(process.execPath, [path.join(__dirname, "server.js")], {
        cwd: __dirname,
        windowsHide: true
    });

    backend.on("error", (error) => {
        console.error("Backend error:", error);
    });

    backend.on("exit", (code) => {
        console.log("Backend stopped:", code);
    });
}

function createWindow() {

    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 900,
        minHeight: 600,

        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    win.loadFile(path.join(__dirname, "index.html"));

    win.webContents.on("did-finish-load", () => {
        console.log("GURUAI app loaded successfully.");
    });
}

app.whenReady().then(() => {

    /*
       Allow microphone access for GURUAI voice input.
    */

    session.defaultSession.setPermissionRequestHandler(
        (webContents, permission, callback) => {

            if (permission === "media") {
                callback(true);
            } else {
                callback(false);
            }

        }
    );

    startBackend();
    createWindow();

});


app.on("window-all-closed", () => {

    if (backend) {
        backend.kill();
        backend = null;
    }

    if (process.platform !== "darwin") {
        app.quit();
    }

});