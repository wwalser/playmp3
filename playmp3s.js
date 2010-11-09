(function(){
var player = document.createElement('div'),
	songList,
	playerRichCombo;
	
player.innerHTML = '<audio></audio><select class="playMp3SongList"></select>';
songList = $(player.lastChild);
	
for (var i = 0; i < playmp3s.mp3Anchors.length; i++) {
	var songOption = document.createElement('option');
	anchor = playmp3s.mp3Anchors[i];
	songOption.setAttribute('value', anchor.getAttribute('href'));
	songOption.textContent = anchor.textContent;
	songList.append(songOption);
}

$(player).addClass('playmp3s').appendTo('body');
songList.richcombo();
$('.richComboContainer').addClass('playmp3s');
songList.richcombo('refresh');

playerRichCombo = songList.richcombo('widget');
playerRichCombo.position({
	my: "right top",
	at: "right top",
	of: window,
	collision: "none"
});

})();
