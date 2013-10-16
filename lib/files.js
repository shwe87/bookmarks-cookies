/*Only access to the temporary files*/

var {components,Cc, Ci, Cu} = require("chrome");

var tmp = 'TmpD';
/*Creating nSIFile object*/
components.utils.import("resource://gre/modules/FileUtils.jsm");
/*var file = components.classes["@mozilla.org/file/directory_service;1"].
           getService(components.interfaces.nsIProperties).
           get("CurProcD", components.interfaces.nsIFile);
*/
var temporary = components.classes["@mozilla.org/file/directory_service;1"].
           getService(components.interfaces.nsIProperties).
           get(tmp, components.interfaces.nsIFile);



exports.createFolder = function (folderName){
	/*creates a folder called "DIR" in the user's profile folder.*/
	var dir = FileUtils.getDir(tmp, [folderName], true);
	console.log(dir.path);

}

exports.createFile = function(fileName){
	/*Create temporary file in the /tmp directory*/
	var file = FileUtils.getFile(tmp, [fileName]);
	file.createUnique(components.interfaces.nsIFile.NORMAL_FILE_TYPE, FileUtils.PERMS_FILE);
	// do whatever you need to the created file
	console.log(file.path);
}

exports.iterateDir = function (){
	var entries = temporay.directoryEntries;
	var array = [];
	while(entries.hasMoreElements()){
		var entry = entries.getNext();
  		entry.QueryInterface(components.interfaces.nsIFile);
  		array.push(entry);
  		
	}
	console.log(array);

}

