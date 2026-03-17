# How to Build the Android App (APK)

Now that the project has been converted for Mobile using Capacitor, you can build a native Android app.

## Prerequisites
*   **Android Studio** installed on your computer.

## Steps

### 1. Open the Project
1.  Open **Android Studio**.
2.  Click **Open** (or File > Open).
3.  Navigate to this folder: `f:\My mini project3\tourist safety monitor system\TourChain\frontend\tourist\android`.
4.  Click **OK**.
5.  Wait for Gradle sync to finish (this downloads dependencies and might take a few minutes).

### 2. Run the App
1.  Connect your Android phone via USB (ensure USB Debugging is ON) OR use an Emulator.
2.  Click the **Green Play Button** (Run 'app') in the top toolbar.
3.  The app will launch on your device!

### 3. Build APK (for sharing)
1.  Go to menu **Build** > **Build Bundle(s) / APKs** > **Build APK(s)**.
2.  Once done, a notification will appear. Click **locate** to see the `.apk` file.
3.  You can copy this file to any Android phone to install "TourChain".

## Important Note on Servers
Since the app connects to your Local Application (Localhost):
*   **Emulator**: `localhost` refers to the emulator itself. You usually need to use `10.0.2.2` to access your computer's localhost.
*   **Real Device**: You must be on the same WiFi. You should likely update `config.js` to use your computer's **Local IP Address** (e.g., `192.168.1.x`) instead of `localhost`.
    *   Find IP: Run `ipconfig` in terminal.
    *   Update `frontend/tourist/www/config.js`.
    *   Run `npx cap sync` in `frontend/tourist`.

## Syncing Changes
If you modify your HTML/CSS/JS code in `frontent/tourist/www`:
1.  Run `npx cap sync` in the terminal (inside `frontend/tourist`).
2.  Re-run the app in Android Studio.
