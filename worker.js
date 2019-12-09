// urlB64ToUint8Array is a magic function that will encode the base64 public key
// to Array buffer which is needed by the subscription option
  self.addEventListener('activate',function(){
    console.log('activated');
  })
  self.addEventListener('push', function(event) {
    if(event) {
            const data = event.data.json()
      console.log('Push has been received')
      var title = data.message;
      var options = {
        body: "Invoice download",
        icon:"lvt_logo_new.png",
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
      event.waitUntil(self.registration.showNotification(title, options))

  }
  })

  
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  switch(event.action){
    case 'viewDownloads':
    clients.openWindow('https://qasim.lavante.com/cassim/login?service=https%3A%2F%2Fqasim.lavante.com%2Fsim%2Flogin.lvp'); //which we got from above
    break;
    }
});