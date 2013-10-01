/*
module ('Cc', 'Ci', 'Cm', 'Cr', and 'Cu' for the 'classes',
'interfaces', 'manager', 'results', and 'utils' properties, respectively. And
`components` for `Components` object itself
*/

/*
This code implements a module which can emit added and visited events.
var folders = [bookmarksService.bookmarksMenuFolder, bookmarksService.toolbarFolder, bookmarksService.unfiledBookmarksFolder];


var { emit, on, once, off } = require("sdk/event/core");
 
var {Cc, Ci, Cu} = require("chrome");

Cu.import("resource://gre/modules/XPCOMUtils.jsm", this);
var bookmarkService = Cc["@mozilla.org/browser/nav-bookmarks-service;1"]
                          .getService(Ci.nsINavBookmarksService);
 
var bookmarkObserver = {
  onItemAdded: function(aItemId, aFolder, aIndex) {
    emit(exports, "added", bookmarkService.getBookmarkURI(aItemId).spec);
  },
  onItemVisited: function(aItemId, aVisitID, time) {
    emit(exports, "visited", bookmarkService.getBookmarkURI(aItemId).spec);
  },
  QueryInterface: XPCOMUtils.generateQI([Ci.nsINavBookmarkObserver])
};
 
bookmarkService.addObserver(bookmarkObserver, false);
 
exports.on = on.bind(null, exports);
exports.once = once.bind(null, exports);
exports.removeListener = function removeListener(type, listener) {
  off(exports, type, listener);
};
*/

var {Cc, Ci, Cu} = require("chrome");
var history = Cc["@mozilla.org/browser/nav-history-service;1"]
	 .getService(Ci.nsINavHistoryService);

var myFolderId = history.toolbarFolder;
var query = history.getNewQuery();
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
	console.log(title);
	// Some type-specific actions.
	if (type == Ci.nsINavHistoryResultNode.RESULT_TYPE_URI) {
		var uri = childNode.uri;
	}
	else if (type == Ci.nsINavHistoryResultNode.RESULT_TYPE_FOLDER) {
		childNode.QueryInterface(Ci.nsINavHistoryContainerResultNode);
		childNode.containerOpen = true;
		// now you can iterate over a subfolder's children
	}
}