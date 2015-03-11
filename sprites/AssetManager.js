function AssetManager() {
	this.downloads = [];
}

AssetManager.prototype.download = function(files, callback) {
    this.downloads.push({
		files : files,
		callback : callback,
	});
}

AssetManager.prototype.downloadAll = function() {
    for (var i = 0; i < this.downloadQueue.length; i++) {
        var path = this.downloadQueue[i];
        var img = new Image();
        var self = this;
        img.addEventListener("load", function() {
			self.successCount += 1;
		}, false);
		img.addEventListener("error", function() {
			self.errorCount += 1;
		}, false);
        img.src = path;
    }
}

AssetManager.prototype.isDone = function() {
    return (this.downloadQueue.length == this.successCount + this.errorCount);
}