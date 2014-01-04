var {Cc, Ci, Cu} = require("chrome");
var { emit, on, once, off } = require("sdk/event/core");
var bookmarkService = Cc["@mozilla.org/browser/nav-bookmarks-service;1"].getService(Ci.nsINavBookmarksService);

/*let { Bookmark, save } = require("sdk/places/bookmarks");
 
// Create a new bookmark instance, unsaved
let bookmark = Bookmark({ title: "Mozilla", url: "http://mozila.org" });
 
// Attempt to save the bookmark instance to the Bookmarks database
// and store the emitter
let emitter = save(bookmark);
 
// Listen for events
emitter.on("data", function (saved, inputItem) {
  // on a "data" event, an item has been updated, passing in the
  // latest snapshot from the server as `saved` (with properties
  // such as `updated` and `id`), as well as the initial input
  // item as `inputItem`
  console.log(saved.title === inputItem.title); // true
  console.log(saved !== inputItem); // true
  console.log(inputItem === bookmark); // true
  console.log(saved.title);
  console.log(inputItem.title);
}).on("end", function (savedItems, inputItems) {
  // Similar to "data" events, except "end" is an aggregate of
  // all progress events, with ordered arrays as `savedItems`
  // and `inputItems`
  console.log(JSON.stringify(savedItems));
  console.log(JSON.stringify(inputItems));
});*/

/*
RESULT_TYPE_URI = 0; // nsINavHistoryResultNode
RESULT_TYPE_VISIT = 1; // nsINavHistoryVisitResultNode
RESULT_TYPE_FULL_VISIT = 2; // nsINavHistoryFullVisitResultNode
RESULT_TYPE_DYNAMIC_CONTAINER = 4; // nsINavHistoryContainerResultNode
RESULT_TYPE_QUERY = 5; // nsINavHistoryQueryResultNode
RESULT_TYPE_FOLDER = 6; // nsINavHistoryQueryResultNode
RESULT_TYPE_SEPARATOR = 7; // nsINavHistoryResultNode
RESULT_TYPE_FOLDER_SHORTCUT = 9; // nsINavHistoryQueryResultNode


 Adds a bookmark observer. If ownsWeak is false, the bookmark service will
 keep an owning reference to the observer.  If ownsWeak is true, then
 aObserver must implement nsISupportsWeakReference, and the bookmark
 service will keep a weak reference to the observer.

void addObserver(in nsINavBookmarkObserver observer, in boolean ownsWeak)


 Get the URI for a bookmark item.

nsIURI getBookmarkURI(in long long aItemId)


 Used to see if the given URI is bookmarked, or any page that redirected to
 it is bookmarked. For example, if I bookmark "mozilla.org" by manually
 typing it in, and follow the bookmark, I will get redirected to
 "www.mozilla.org". Logically, this new page is also bookmarked. This
 function, if given "www.mozilla.org", will return the URI of the bookmark,
 in this case "mozilla.org".

 If there is no bookmarked page found, it will return NULL.

nsIURI getBookmarkedURIFor(in nsIURI aURI)


 Get the date added time for an item.

PRTime getItemDateAdded(in long long aItemId)


 Get a globally unique identifier for an item, meant to be used in
 sync scenarios.  Even if their contents are exactly the same
 (including an item in a different profile with the same ItemId),
 the GUID would be different.
  @param   aItemId
           The ID of the item to get the GUID for
  @return The GUID string.

AString getItemGUID(in long long aItemId)


 Get the ID of the item with the given GUID.
 @param   aGUID
          The GUID string of the item to search for
 @return The item ID, or -1 if not found.

long long getItemIdForGUID(in AString aGUID)


 Get the title for an item.

 If no item title is available it will return a void string (null in JS).

  @param aItemId
         The id of the item whose title should be retrieved
  @return The title of the item.

AUTF8String getItemTitle(in long long aItemId)


*/


var history = Cc["@mozilla.org/browser/nav-history-service;1"].getService(Ci.nsINavHistoryService);
exports.on = on.bind(null, exports);
exports.once = once.bind(null, exports);
exports.removeListener = function removeListener(type, listener) {
  off(exports, type, listener);
};


/*
void onItemChanged(
  in long long aItemId,
  in ACString aProperty,
  in boolean aIsAnnotationProperty,
  in AUTF8String aNewValue,
  in PRTime aLastModified, 
  in unsigned short aItemType, 
  in long long aParentId, 
  in ACString aGUID, 
  in ACString aParentGUID 
);

void onItemRemoved(
  in long long aItemId,
  in long long aParentId,
  in long aIndex,
  in unsigned short aItemType, 
  in nsIURI aURI, 
  in ACString aGUID, 
  in ACString aParentGUID 
);

*/

var bookmarkObserver = {
  
 onItemChanged: function(aItemId, aProperty, aIsAnnotationProperty, aNewValue, aLastModified, aItemType, aParentId,  aGUID, aParentGUID ) {
    //console.log("Bookmark Item changed URI = " + aURI.spec);
    console.log("Bookmark Item changed With title = " + aNewValue);
   // console.log("Bookmark Item changed with title = " + bookmarkService.getItemTitle(aItemId));
     console.log("Bookmark Item changed GUID = " + aGUID);
     console.log("Bookmark Item changed id = " + aItemId);
     console.log("Bookmark Item changed TYPE = " + aItemType);
     console.log("Bookmark Item changed Property = " + aProperty);
     console.log("\r\n\r\n");
     /*try{
     		var toSend = new Object();
	     if (aProperty == 'title'){
	     		//An item's title has been changed by the user:
	     		//console.log("The Bookmark with " + bookmarkService.getBookmarkURI(aItemId).spec + " title has changed to: " + bookmarkService.getItemTitle(aItemId) +" and it's GUID is: " + aGUID);
	     		//console.log("T");
	     		var title = bookmarkService.getItemTitle(aItemId);
	     		var url = bookmarkService.getBookmarkURI(aItemId).spec;
	     		toSend = {'title':title,'url':url,'GUID':aGUID,'typeOf':'bookmarks','reason':'update'};
	     		console.log([toSend]);
	     		emit(exports,'bookmarks',[toSend]);
	     
	     }
	     else if (aProperty == 'bookmarkProperties/description'){
	     		//An item has been added:
	     		//console.log("The Bookmark has been added " + bookmarkService.getBookmarkURI(aItemId).spec + " and title " + bookmarkService.getItemTitle(aItemId) +" and it's GUID is: " + aGUID);
	     		var title = bookmarkService.getItemTitle(aItemId);
	     		var url = bookmarkService.getBookmarkURI(aItemId).spec;
	     		toSend = {'title':title,'url':url,'GUID':aGUID,'typeOf':'bookmarks','reason':'add'};
	     		console.log(toSend);
	     		emit(exports,'bookmarks',[toSend]);
	     }

	     //	console.log("changed " +aNewValue);
	     //	console.log("changed "+ aProperty);
	     
	}
	catch(e){
	console.log(e.toString());
	}*/
  },
   
  onItemMoved:function( aItemId,aOldParentId,aOldIndex,aNewParentId,aNewIndex,aItemType, aGUID, aOldParentGUID, aNewParentGUID ){
  	console.log("Moved from = " + aOldParentId);
  	console.log("Moved item = " + aItemId);
  	console.log("Moved to = " + aNewParentId);
  	console.log("Item type moved = " + aItemType);
  
  },
  onItemRemoved: function(aItemId, aParentId,aIndex, aItemType,  aURI, aGUID,  aParentGUID ){
  try{
  	var toSend = new Object();
   	if (aURI != null){
	   //console.log("Bookmark Item removed URI = " + aURI.spec);
	   //console.log("Bookmark Item removed title = " + bookmarkService.getItemTitle(aItemId));
	    //console.log("Bookmark Item removed GUID = " + aGUID);
	    //var title = bookmarkService.getItemTitle(aItemId);
	    //var url = bookmarkService.getBookmarkURI(aItemId).spec;
	    console.log(aItemType);
	    toSend = {'title':aURI.spec,'url':aURI.spec,'itemId':aItemId,'parentId':aParentId};
	    console.log(JSON.stringify(toSend));
	    emit(exports,'bookmarks',[toSend]);
	    //console.log(toSend);
	    //console.log("Bookmark Item removed TYPE = " + aItemType);
	    //console.log("\r\n\r\n");
    	}
    
  }
  catch(e){
  console.log(e.toString());
  }
  },
  onItemAdded: function( aItemId, aParentId, aIndex, aItemType, aURI, aGUID, aParentGUID){
  	console.log("Item added = " + aItemId);
  	console.log("Parent of item added = " + aParentId);
  	console.log("Type added = " + aItemType);
  
  },
  QueryInterface: function(iid) {
    if (iid.equals(Ci.nsINavBookmarkObserver) ||
        iid.equals(Ci.nsISupports)) {
      return this;
    }
    throw Cr.NS_ERROR_NO_INTERFACE;
  },
};


bookmarkService.addObserver(bookmarkObserver, false);

var historyList = new Array();
var historyObserver = {
/*here	onVisit: function(aURI,aVisitID,aTime,aSessionID,aReferringID,aTransitionType,aGUID,aAdded){
		/*console.log("Visited = " + aURI.spec);
		console.log("Visited GUID = " + aGUID);
		console.log("VISITED Visit ID = " + aVisitID);*/
		//console.log("VISITED aAdded = " + aAdded);
/*here		try{
			if (aAdded == false){
				//console.log("Here");
				var toSend = new Object();
				var url = aURI.spec;
				var aQueries = {};
				var aResultCount = {};
				var options = {};
				history.queryStringToQueries(aURI.spec,aQueries,aResultCount,options);
				//console.log("COUNT = " + aResultCount.value);
				//console.log("OPTIONS = " + options.value);
				//console.log(aQueries.value);
				var result = history.executeQueries(aQueries.value, aResultCount.value,options.value);
				//var result = history.executeQuery(aQueries.value, options.value);
				result.root.containerOpen = true;
				var count = result.root.childCount;
				//console.log(count);
				for (var i = 0; i < count; i++) {
					  var node = result.root.getChild(i);
					  // do something with the node properties...
					  var title = node.title;
					  var url = node.uri;
					  var visited = node.accessCount;
					  var lastVisitedTimeInMicrosecs = node.time;
					  var iconURI = node.icon; // is null if no favicon available
					  if (title == null){
					  	var now = new Date(node.time/1000);
	    					  //var dateA = now.toString();
					          var aHistory = new Object();
					          aHistory.url = url;
					          aHistory.time =  new Date(now);
					          console.log(aHistory.time);
					          aHistory.GUID = aGUID;
					  	 historyList.push(aHistory);
					  	  console.log("Pushed " + JSON.stringify(historyList));
					  	  emit(exports,'history',[aHistory]);
					  	  //console.log();
					  	  //console.log();
					  	  //console.log();
						 // console.log("History Add TITLE = " + title);
						  // console.log("History add URL "+url );
						  
	    					  //console.log("History add GUID = " + aGUID);
						  //console.log("History add LAST visited = " + new Date(dateA)+ "\r\n\r\n");
						
					}
					
				  
				}

				result.root.containerOpen = false;
				
			
			}
			/*var aQueries =  history.getNewQuery();;
			var aResultCount;
			var options;
			 history.queryStringToQueries(aURI.spec,aQueries,aResultCount, options);
			 console.log(aResultCount);
			 console.log*/
/*here		}
		catch(e){
		console.log("ERROR HISTORY = " + e.toString());
		}
	
	}   here*/
	onDeleteURI: function(aURI,aGUID){
		console.log("Visit deleted = " + aURI.spec);
	},
	onDeleteURI:function(aURI,aGUID){
		console.log("Deleted = " + aURI.spec);
	
	},
	onClearHistory:function(){
		console.log("History cleared");
	},
	onDeleteVisits: function(aURI,aVisitTime,aGUID){
		console.log("Deleted visit = " + aURI.spec);
	
	},
  
  QueryInterface: function(){try{XPCOMUtils.generateQI([Ci.nsINavHistoryObserver]);}catch(e){console.log("ERROR HISTORY");}}
};
history.addObserver(historyObserver,false);
exports.getFoldersId = function(){
        //There are three main folders, everything else will be their children
        var allFoldersId = [bookmarkService.bookmarksMenuFolder,bookmarkService.toolbarFolder,bookmarkService.unfiledBookmarksFolder];
        console.log("Menu folder =" + bookmarkService.bookmarksMenuFolder);
        console.log("Toolbar folder =" + bookmarkService.toolbarFolder);
        console.log("Unfiled folder =" + bookmarkService.unfiledBookmarksFolder);
        return allFoldersId;
}        

exports.nameFolder = function(ID){
	//console.log("ID is = " + ID);
        var name = "";
        if (ID == 2){
                name = "Bookmarks Menu";        
        }
        else if (ID == 3){
                name = "Bookmarks Toolbar";
        }
        else{//ID = 5
                name = "Unsorted Bookmarks";
        }
        //console.log("NAME = " + name);
        return name;

}

exports.ifSubFolder = function(node){
        var type = node.type;
        var subFolder = false;
        if ((type == Ci.nsINavHistoryResultNode.RESULT_TYPE_FOLDER) /*|| (type == Ci.nsINavHistoryResultNode.RESULT_TYPE_QUERY)*/){
                //console.log(node.title + "is a subfolder!");
                subFolder = true;        
        }
        return subFolder;
}

exports. ifUri = function(childNode){
        var uri = false;
        var type = childNode.type;
        if (type == Ci.nsINavHistoryResultNode.RESULT_TYPE_URI) {
                uri = true;                
        }        
        //console.log("URI " + uri);
        return uri;
}
        
exports.getFoldersChildren = function (myFolderId){
	var ifFolder = false;        
        var query = history.getNewQuery();
        //allChildren = new Array();
        //var myFolderId = bookmarkService.bookmarksMenuFolder;
        //console.log(myFolderId);
        query.setFolders([myFolderId], 1);
        var result = history.executeQuery(query, history.getNewQueryOptions());
        // The root property of a query result is an object representing the folder you specified above.
        var folderNode = result.root;
        // Open the folder, and iterate over its contents.
        folderNode.containerOpen = true;
        //console.log("ID = " + myFolderId + " Child count = " + folderNode.childCount);
        for (var i=0; i < folderNode.childCount; ++i) {
                var child = folderNode.getChild(i);
                var childNode = new Object();
                 // Some item properties.
                childNode.title = child.title;
                childNode.url = child.uri;
                childNode.id = child.itemId;
                childNode.type = child.type;
                childNode.dateAdded = child.dateAdded;
                childNode.lastModified = child.lastModified;
                childNode.parentId = child.parent.itemId;
                childNode.time =child.time;
                //childNode.indentLevel = child.indentLevel;
                
                //console.log(title + " type is " + type);
                //allChildren.push(childNode);
                //console.log(title + " " + type);
                
                // Some type-specific actions.
                if (childNode.type == Ci.nsINavHistoryResultNode.RESULT_TYPE_URI) {
                       
                        var uri = childNode.uri;
                        childNode.ifFolder = false;
                        //console.log("URI " + uri);
                        //emit(exports, 'take',childNode);
                        //this.getFoldersChildren(id);
                        saveBookmark(childNode);
                }
                else if (childNode.type == Ci.nsINavHistoryResultNode.RESULT_TYPE_FOLDER) {
                        /*childNode.QueryInterface(Ci.nsINavHistoryContainerResultNode);
                        childNode.containerOpen = true;*/
                        ifFolder = true;
                        childNode.ifFolder = true;
                        saveBookmark(childNode);
                        //console.log('************'+title+'**********');
                        //emit(exports, 'take',[childNode,ifFolder]);
                        
                        this.getFoldersChildren(child.itemId);
                        // now you can iterate over a subfolder's children
                        /*for(var j=0; j < childNode.childCount;++j){
                                var myChild = childNode.getChild(j);
                                var myType = myChild.type;
                                if (myType == Ci.nsINavHistoryResultNode.RESULT_TYPE_URI){
                                        console.log(myChild.title + " " + myChild.uri);
                        
                                }
                                //console.log(myChild.title);
                        }*/
                }
                
                //return [childNode, ifFolder];
               
        }
        //var returnValue = new Object();
        //returnValue.allChildren = allChildren;
        //returnValue.ifFolder = ifFolder;
        //return returnValue;

}





function saveBookmark(aBookmark){
	var ifFolder = aBookmark.ifFolder;
	if (ifFolder){
		//console.log("A Folder " + things[0].title);
		if (!aBookmark.children){
			//console.log("Create children folder!!!!");
			//console.log("No children " + things[0].title);
			//var aux = new Object();
			//aux = things[0];
			//aux.children = new Array();
			aBookmark.children = new Array();
		}
		//console.log("<ul>"+things[0].title);
		//console.log("SEarch for parent = " + things[0].title);
		searchForParent(aBookmark,bookmarksList);
	}
	else{
		//console.log("<li>"+things[0].title);
		//console.log("Not a folder = " + things[0].title);
		searchForParent(aBookmark,bookmarksList);
	}

}

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
			//console.log("Break and return!");
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

var bookmarksList = new Array();
//var allBookmarks = new Array();
function getbook(){
	bookmarksList = new Array();
	var folderIds = this.getFoldersId();
	for each (var id in folderIds){
		var thisFolder = new Object();
		thisFolder.itemId = id;
		thisFolder.title = this.nameFolder(id);
		thisFolder.children = new Array();
		bookmarksList.push(thisFolder);
		this.getFoldersChildren(id);
	}
	
	//console.log(JSON.stringify(bookmarksList));
	return bookmarksList;
	
}
exports.getBookmarks = getbook;




