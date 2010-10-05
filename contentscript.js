(function(){
var anchors = document.getElementsByTagName('a'),
	mp3Regex = new RegExp('\.mp3$'),
	mp3Anchors = [];

function notify(mp3Anchors){
	//notify background of the match and wait for a click on the page action
	chrome.extension.sendRequest({}, function(){
		function player(anchor){
			var container = document.createElement('p'),
				mp3Location = anchor.getAttribute('href'),
				embed = '<embed \
						type="application/x-shockwave-flash" \
						wmode="transparent" \
						src="http://www.google.com/reader/ui/3523697345-audio-player.swf?audioUrl='
						+ mp3Location +
						'" height="27" \
						width="320">\
					</embed><br>';
			container.innerHTML = embed;
			container.insertBefore(anchor);
			return container;
		}
		
		for (var i = 0; i < mp3Anchors.length; i++) {
			var anchor = mp3Anchors[i],
				elementAfter = anchor.nextSibling,
				parent = anchor.parentNode;
			
			parent.removeChild(anchor);
			parent.insertBefore(player(anchor), elementAfter);
		}
	});
}


for(var i = 0; i < anchors.length; i++){
	var anchor = anchors[i];
	if (mp3Regex.test(anchor.getAttribute('href'))) {
		mp3Anchors.push(anchor);
	}
}

if (mp3Anchors.length){
	notify(mp3Anchors);
}

})();