var bookmarks = require('./bookmark.js');


var folderIds = bookmarks.getFoldersId();
for each (var id in folderIds){
	console.log(bookmarks.nameFolder(id));
	var children = bookmarks.getFoldersChildren(id);
	// children will be an array of all the children of the folder:
	for (j=0;j<children.length;j++){
		var ifURI = bookmarks.ifUri(children[j]);
		var ifSubFolder = bookmarks.ifSubFolder(children[j]);
		if (ifURI == true){
			console.log(children[j].title);
		}
		else if (ifSubFolder == true){
			console.log(children[j].title);
			var allChildren = bookmarks.getSubFoldersBookmarks(children[j]);
			for(k=0;k<allChildren.length;k++){
				console.log(allChildren[k].title);
			}
		}
		
	
	}

}
