/**
 * @author Anirban Bhattacharya
 * @desc: The service worker files which can register the service workers
 *       and check for streams
 */
const urlB64ToUint8Array = base64String => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const check = () => {
  if (!("serviceWorker" in navigator)) {
    throw new Error("No Service Worker support!");
  }
  if (!("PushManager" in window)) {
    throw new Error("No Push API Support!");
  }
  if ("serviceWorker" in navigator && "PushManager" in window) {
    return true;
  }
};

const requestNotificationPermission = async () => {
  const permission = await window.Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Permission not granted for Notification");
  } else {
    return true;
  }
};

const registration = async () => {
  const register = await navigator.serviceWorker.register("worker.js", {
    scope: "/"
  });
  return register;
};
const main = async () => {
  check();
  const permission = await requestNotificationPermission();
  if (permission) {
    // register Workers
    const register = await registration();
    const applicationServerKey = urlB64ToUint8Array(
      "BOZYYYkXJZYbFkP7KQzQCZJrRoFV3v6-gBzFhqHrttI2z_DSftrAuJeAM1Ow2noVdBNVoHjLghrQPB3vjQFq4oo"
    );
    // create a subscription
    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    });
    const serverUrl = "http://localhost:9000/save-subscription";

    // send the subscription
    await fetch(serverUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(subscription)
    });
  }
};

const showPushMessage = () => {
  const getNotificationUrl = "http://localhost:9000/send-notification";
  fetch(getNotificationUrl)
    .then(function(response) {
      if (response.status !== 200) {
        console.log(
          "Looks like there was a problem. Status Code: " + response.status
        );
        return;
      }

      // Examine the text in the response
      response.json().then(function(data) {
        debugger
        var title = data.message;
        var options = {
          body: "Invoice download",
          icon: "lvt_logo_new.png",
          vibrate: [200, 100, 200],
          tag: data.tag,
          sound: "https://www2.cs.uic.edu/~i101/SoundFiles/PinkPanther60.wav",
          actions: [
            {
              action: "viewDownloads",
              title: "View Downloads",
              icon: "checkmark.png"
            },
            {
              action: "close",
              title: "Close notification",
              icon: "xmark.png"
            }
          ]
        };
        registration().then((event) =>{
          event.showNotification(title,options)
        })
      });
    })
    .catch(function(err) {
      console.log("Fetch Error :-S", err);
    });
};
// main(); we will not call main in the beginning.
// Check for permission
