var bookmarks = require('./bookmark.js');
var ss = require("sdk/simple-storage");
var tabs = require("sdk/tabs");
var data = require("sdk/self").data;
var Request = require("sdk/request").Request;
var connectTo = 'http://127.0.0.1:8000/';
var bookmarksList = new Array();
/*tabs.open("www.urjc.es");
tabs.open("www.gmail.com");
tabs.open("www.facebook.com");
tabs.open("http://127.0.0.1:8000/login/");*/
var panel = require("sdk/panel").Panel({
  contentURL: data.url('twitter.html'),
  contentScriptFile: data.url('twitterScript.js')
});


var myWidget = require("sdk/widget").Widget({
  id: "myWidget",
  label: "Django test",
  width:60,
  content: "Bookmarks",
  panel:panel,
  contentScriptWhen: 'ready',
  onClick:function(){
  	var bookmarksList = getbook();
  	panel.port.emit('take',bookmarksList);
  }
});

/*tabs.on('open',function(tab){
	console.log("TAB open = " + tab.url);

});*/

var tabsList = new Array();
function openTabs(){
	if (tabsList.length > 0){
		tabs.open({
			url: tabsList[0].url,
			inNewWindow:true,
		
			});
		for (var i=1;i<tabsList.length;i++){
			tabs.open(tabsList[i].url);
		}
	}

}
tabs.on('pageshow',function(tab){
	//console.log("TAB LOAD = " + tab.url + ' with ID = ' + tab.id);
	var aTab = new Object();
	aTab.url = tab.url;
	aTab.id = tab.id;
	aTab.title = tab.title;
	//console.log(JSON.stringify(aTab));
	var found = false;
	for (var i=0;i<tabsList.length;i++){
		if (tabsList[i].id == tab.id){
			//console.log("Here");
			tabsList[i] = aTab;
			found = true;
			break;
		} 
	}
	if (!found){
		//console.log("Not found");
		tabsList.push(aTab);
	}
	//console.log(JSON.stringify(tabsList));

});

tabs.on('close',function(tab){
	//console.log("TAB CLOSE = " + tab.id);
	var found = false;
	for (var i=0;i<tabsList.length;i++){
		if (tabsList[i].id == tab.id){
			//console.log("found");
			tabsList.splice(i,1);
			found = true;
			break;
		} 
	}
	if (!found){
		//console.log("Not found!");
	}
	//console.log(JSON.stringify(tabsList));	
});
//var bookmarksList = new Array();
function searchForParent(childNode, whereToSearch){
	var parentId = childNode.parentId;
	
	//console.log("Parent ID of "+ childNode.title +" = " + parentId);
	//console.log(JSON.stringify(bookmarksList));
	for (var i=0;i<whereToSearch.length;i++){
		//console.log("Searching in ......");
		//console.log("Title = "+ whereToSearch[i].title +" & ID of this = " + whereToSearch[i].id);
		if (whereToSearch[i].itemId == parentId){
			//console.log("Indent level of  "+ childNode.title + "  "+childNode.indentLevel);
			whereToSearch[i].children.push(childNode);
			//console.log();
			console.log("Break and return!");
			break;
			return;
		
		}
		if (whereToSearch[i].children){
			if (whereToSearch[i].children.length > 0){
				searchForParent(childNode,whereToSearch[i].children);
			}
		}
	
	}

}


//var allBookmarks = new Array();
function getbook(){
	bookmarksList = new Array();
	var folderIds = bookmarks.getFoldersId();
	for each (var id in folderIds){
		var thisFolder = new Object();
		thisFolder.itemId = id;
		thisFolder.title = bookmarks.nameFolder(id);
		thisFolder.children = new Array();
		bookmarksList.push(thisFolder);
		bookmarks.getFoldersChildren(id);
	}
	
	console.log(JSON.stringify(bookmarksList));
	//saveBookmarks();
	return bookmarksList;
	
}




bookmarks.on('take',function(things){
	var ifFolder = things[1];
	if (ifFolder){
		//console.log("A Folder " + things[0].title);
		if (!things[0].children){
			//console.log("Create children folder!!!!");
			//console.log("No children " + things[0].title);
			//var aux = new Object();
			//aux = things[0];
			//aux.children = new Array();
			things[0].children = new Array();
		}
		//console.log("<ul>"+things[0].title);
		//console.log("SEarch for parent = " + things[0].title);
		searchForParent(things[0],bookmarksList);
	}
	else{
		//console.log("<li>"+things[0].title);
		//console.log("Not a folder = " + things[0].title);
		searchForParent(things[0],bookmarksList);
	}

});

function reDirectAuth(){
	tabs.open(connectTo+'login/');
}


function saveHistory(dataToSave){
	/*This is to send the tabs list to the server.*/
	//console.log('Send ');
	/*var dataToSave = new Array();
	for each (var tabToSave in tabs){				
		var newTab = {'id':tabToSave.id,'title':tabToSave.title,'url':tabToSave.url};
		dataToSave.push(newTab);		
	}*/
	console.log("DATAS = " + JSON.stringify(dataToSave))
	var URL = connectTo + 'save/history/';
	console.log("Going to send = " + URL);
	var sendMessage = Request({
		url: URL,
		contentType: 'application/json',
		content:  JSON.stringify(dataToSave),
		onComplete: function (response) {
			console.log(response.text);
		    	console.log(response.status);
		    	console.log(JSON.stringify(response.headers));
		    	console.log(response.statusText);
		    			
		    	if (response.status == '401' && response.headers.error == 'Unauthorized'){
		    		reDirectAuth();
		    	}
		    	else if (response.status == '200'){
		    		console.log("SAVED CORRECTLY");
		    			
		    	}
	 	}
 	});
	sendMessage.post();
	
}

function saveBookmarks(dataToSave){
	/*This is to send the tabs list to the server.*/
	console.log('Send ');
	/*var dataToSave = new Array();
	for each (var tabToSave in tabs){				
		var newTab = {'id':tabToSave.id,'title':tabToSave.title,'url':tabToSave.url};
		dataToSave.push(newTab);		
	}*/
	console.log(JSON.stringify(dataToSave))
	var URL = connectTo + 'add/all/bookmarks/';
	console.log("Going to send = " + URL);
	var sendMessage = Request({
		url: URL,
		contentType: 'application/json',
		content:  JSON.stringify(dataToSave),
		onComplete: function (response) {
			console.log(response.text);
		    	console.log(response.status);
		    	console.log(JSON.stringify(response.headers));
		    	console.log(response.statusText);
		    			
		    	if (response.status == '401' && response.headers.error == 'Unauthorized'){
		    		reDirectAuth();
		    	}
		    	else if (response.status == '200'){
		    		console.log("SAVED CORRECTLY");
		    			
		    	}
	 	}
 	});
	sendMessage.post();

}

var {Cc, Ci, Cu} = require("chrome");
exports.main = function(options, callbacks) {
	/*Reasons:
	install
	enable
	startup
	upgrade
	downgrade
	*/
	//bookmarks.on('bookmarks',saveBookmarks);
	//bookmarks.on('history',saveHistory);
	//console.log(options.loadReason);
	/*if (!ss.storage.id){
		var uuidGenerator = Cc['@mozilla.org/uuid-generator;1'].
                          getService(Ci.nsIUUIDGenerator);
                ss.storage.id = uuidGenerator.generateUUID().toString();
		console.log("Added = " + ss.storage.id);
	}
	else{
		console.log("Already saved = " + ss.storage.id);
	
	}
*/
	bookmarksList = bookmarks.getBookmarks();
	console.log(bookmarksList);

}


