(function(){
var anchors = document.getElementsByTagName('a'),
	mp3Regex = new RegExp('\\.mp3$'),
	mp3Anchors = [];

function notify(mp3Anchors){
	//notify background of the match and wait for a click on the page action
	chrome.extension.sendRequest({}, function(){
		var player = document.createElement('div'),
			songList;
		
		player.innerHTML = '<audio></audio><select class="playMp3SongList"></select>';
		songList = player.lastChild;
		
		for (var i = 0; i < mp3Anchors.length; i++) {
			var songOption = document.createElement('option');
				anchor = mp3Anchors[i];
			songOption.setAttribute('value', anchor.getAttribute('href'));
			songOption.textContent = anchor.textContent;
			songList.insertBefore(songOption);
		}
		document.body.insertBefore(player);
	});
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