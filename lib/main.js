/*
module ('Cc', 'Ci', 'Cm', 'Cr', and 'Cu' for the 'classes',
'interfaces', 'manager', 'results', and 'utils' properties, respectively. And
`components` for `Components` object itself

*/

/*
var {Cc,Ci,Cu,components} = require("chrome");
Cu.import("resource://gre/modules/XPCOMUtils.jsm", this);
var bookmarkService = Cc["@mozilla.org/browser/nav-bookmarks-service;1"]
                          .getService(Ci.nsINavBookmarksService);
 
var bookmarkObserver = {
  onItemAdded: function(aItemId, aFolder, aIndex) {
    console.log("added ", bookmarkService.getBookmarkURI(aItemId).spec);
  },
  onItemVisited: function(aItemId, aVisitID, time) {
    console.log("visited ", bookmarkService.getBookmarkURI(aItemId).spec);
  },
  QueryInterface: XPCOMUtils.generateQI([components.interfaces.nsINavBookmarkObserver])
};
 
exports.main = function() {
  bookmarkService.addObserver(bookmarkObserver, false);   
};
 
exports.onUnload = function() {
  bookmarkService.removeObserver(bookmarkObserver);
}

*/
/*
var bookmarks = require("./bookmark");
 
function logAdded(uri) {
  console.log("added: " + uri);
}
 
function logVisited(uri) {
  console.log("visited: " + uri);
}
 
exports.main = function() {
  bookmarks.on("added", logAdded);
  bookmarks.on("visited", logVisited);
};
 
exports.onUnload = function() {
  bookmarks.removeListener("added", logAdded);
  bookmarks.removeListener("visited", logVisited);
}

*/


var {Cc, Ci, Cu} = require("chrome");
var bookmarkService = Cc["@mozilla.org/browser/nav-bookmarks-service;1"]
                          .getService(Ci.nsINavBookmarksService);

var history = Cc["@mozilla.org/browser/nav-history-service;1"]
	 .getService(Ci.nsINavHistoryService);
var query = history.getNewQuery();
var myFolderId = bookmarkService.bookmarksMenuFolder;
console.log(myFolderId);
query.setFolders([myFolderId], 1);
var result = history.executeQuery(query, history.getNewQueryOptions());
// The root property of a query result is an object representing the folder you specified above.
var folderNode = result.root;
// Open the folder, and iterate over its contents.
folderNode.containerOpen = true;
for (var i=0; i < folderNode.childCount; ++i) {
	var childNode = folderNode.getChild(i);
	 // Some item properties.
	var title = childNode.title;
	var id = childNode.itemId;
	var type = childNode.type;
	console.log(title + " " + type);

	// Some type-specific actions.
	if (type == Ci.nsINavHistoryResultNode.RESULT_TYPE_URI) {
		var uri = childNode.uri;
		console.log("URI " + uri);
	}
	else if (type == Ci.nsINavHistoryResultNode.RESULT_TYPE_FOLDER) {
		childNode.QueryInterface(Ci.nsINavHistoryContainerResultNode);
		childNode.containerOpen = true;
		// now you can iterate over a subfolder's children
		for(var j=0; j < childNode.childCount;++j){
			var myChild = childNode.getChild(j);
			var myType = myChild.type;
			if (myType == Ci.nsINavHistoryResultNode.RESULT_TYPE_URI){
				console.log(myChild.title + " " + myChild.uri);
			
			}
			//console.log(myChild.title);
		}
	}
}
