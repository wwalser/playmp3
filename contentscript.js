var playmp3s = {};

(function(){
var anchors = document.getElementsByTagName('a'),
	mp3Regex = new RegExp('\\.mp3$'),
	mp3Anchors = [];
function notify(mp3Anchors){
	//notify background of the match and wait for a click on the page action
	playmp3s.mp3Anchors = mp3Anchors;
	chrome.extension.sendRequest({});
}

for (var i = 0; i < anchors.length; i++) {
	var anchor = anchors[i];
	if (mp3Regex.test(anchor.getAttribute('href'))) {
		mp3Anchors.push(anchor);
	}
}

if (mp3Anchors.length){
	notify(mp3Anchors);
}

})();