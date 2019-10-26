let table = document.getElementById('listdates');

// console.log('popup')
// changeColor.onload = function(element) {
var txt = table.innerHTML;


chrome.storage.sync.get('pendingdates',function(data){
    data.pendingdates.map(function(d){
        txt += '<tr><td>'+d+'</td></td></tr>'  
    })
       
    table.innerHTML = txt
});
// };
