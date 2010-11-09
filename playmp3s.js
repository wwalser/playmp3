(function(){
var player = document.createElement('div'),
	songList;
	
player.innerHTML = '<audio></audio><select class="playMp3SongList"></select>';
songList = player.lastChild;
	
for (var i = 0; i < playmp3s.mp3Anchors.length; i++) {
	var songOption = document.createElement('option');
	anchor = playmp3s.mp3Anchors[i];
	songOption.setAttribute('value', anchor.getAttribute('href'));
	songOption.textContent = anchor.textContent;
	songList.insertBefore(songOption);
}
document.body.insertBefore(player);
})();
