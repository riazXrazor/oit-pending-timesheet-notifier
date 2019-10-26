var storage = chrome.storage.sync;
var notify = chrome.notifications.create;
var badge = chrome.browserAction.setBadgeText;

chrome.runtime.onInstalled.addListener(function() {

            chrome.identity.getAuthToken(
                {'interactive': true},
                 (token) => {
                    if(!token){
                        console.log("no token")
                        return;
                    }

                    checkforlogs(token);

                    setInterval(function(){
                        checkforlogs(token);
                    },10*6000)
        
                }
            );

});


  function checkforlogs(token){
    storage.set({'pendingdates': []}, function() {
        var headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+token
        };
        

        
        fetch('https://www.googleapis.com/gmail/v1/users/me/messages?q=from:info@optimizeitsystems.com',{
            headers: headers,
        })
        .then(r => r.json())
        .then(e => e.messages.length ?  e.messages[0].id : new Error("No Messages"))
        .then(id => {
            return fetch('https://www.googleapis.com/gmail/v1/users/me/messages/'+id,{
                headers: headers,
            })
        })
        .then(r => r.json())
        .then(e =>{ 
            storage.get('pendingdates',function(data){
                
                var oldlist = data.pendingdates;
                var newList = [];
                
                var content = e.snippet
                var pendingdates = content.match(/(\d{1,4}([.\-/])\d{1,2}([.\-/])\d{1,4})/g);

                pendingdates.map(function(date){
                    if(!oldlist.includes(date)){
                        newList.push(date)
                    }
                })

                if(newList.length){
                    storage.set({'pendingdates': newList});
                    notify(
                        'oit-pending-timesheet-notifier',{   
                        type: 'basic', 
                        iconUrl: 'images/get_started32.png', 
                        title: "OIT Pending Timesheet Notifier", 
                        message: "You have "+newList.length+" pending timesheet logs" 
                    });
                    badge({text: newList.length.toString()});
                }

            })
            
        })
        .catch(e => console.error(e) )
    });
  }




