// Page and resources have loaded.
$(window).bind("load", function() {
	
});

// This code loads the IFrame Player API code asynchronously.
var ytScriptTag = document.createElement('script');
ytScriptTag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(ytScriptTag, firstScriptTag);

// This function creates an <iframe> (and YouTube player) after the API code downloads.
var ytplayer, ytplayerReady, ytIframeAPIReady;

function onYouTubeIframeAPIReady() {

	ytplayerReady = true;

	loadVideo("8AvI-3Ows-8");

}

function initYouTubeIframeAPI(videoId) {
	if(ytplayerReady){
		ytIframeAPIReady = true;
		ytplayer = new YT.Player('ytplayer', {
			height:'100%',
			width: '100%',
			videoId: videoId,
			playerVars : {
				cc_load_policy: 0,
				controls : 0,
				enablejsapi: 1,
				disablekb: 1,
				// html5: 1,
				iv_load_policy: 3,
				modestbranding: 1,
				origin: window.location.host,
				playsinline: 1,
				rel: 0,
				showinfo: 0
			},
			events: {
				'onReady': onYtPlayerReady,			
				'onError': onYtPlayerError,
				'onStateChange': onYtPlayerStateChange
			}
		});
	}
}

function onYtPlayerReady(event) {
	event.target.playVideo();
}

function onYtPlayerStateChange(event) {
	if (event.data == YT.PlayerState.ENDED) {
		console.log("ENDED");
	}
	else if (event.data == YT.PlayerState.PLAYING) {
		console.log("PLAYING");
	}
	else if (event.data == YT.PlayerState.PAUSED) {
		console.log("PAUSED");
	}
	else if (event.data == YT.PlayerState.BUFFERING) {
		console.log("BUFFERING");
	}
	else if (event.data == YT.PlayerState.CUED) {
		console.log("CUED");
	}
}

function onYtPlayerError(event) {
	console.log("Error: " + event);
}

function seekVideoTo(seconds, allowSeekAhead) {
	ytplayer.seekTo(seconds, allowSeekAhead);
	//allowSeekAhead = false when dragging.
	//allowSeekAhead = true when user releases drag.
}

function playVideo() {
	ytplayer.playVideo();
}

function pauseVideo() {
	ytplayer.pauseVideo();
}

function stopVideo() {
	ytplayer.stopVideo();
	ytplayer.clearVideo();
}

function loadVideo(videoId) {
	if(!ytIframeAPIReady) initYouTubeIframeAPI(videoId);
	else ytplayer.loadVideoById(videoId);
}

function setVolume(volPercent){
	if(volPercent > 100)  volPercent = 100;
	else if(volPercent < 0) volPercent = 0;
	ytplayer.setVolume(volPercent);
}

function getVolume(volPercent){
	return ytplayer.getVolume();
}

function toggleMute(videoId) {
	if(ytplayer.isMuted()) {
		ytplayer.unMute();
	} else {
		ytplayer.mute();
	}
}

function analyzeVideoUrl(url) {
    var vidInfo = {
        provider: null,
        url: url,
        id: null
    }
    if(typeof url != "string") url = "";
    
    if(url.contains('youtube.com') || url.contains('youtu.be')){
    	vidInfo.provider = "youtube";
    	vidInfo.id = getYouTubeID(url);
    }
    else if(url.contains('vimeo.com')){
    	vidInfo.provider = "vimeo";
    	vidInfo.id = getVimeoID(url);
    }

    return vidInfo;
}

function getYouTubeID(url){
	var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
	var match = url.match(regExp);
	if (match&&match[7].length==11){
		return match[7];
	}else{
		return "";
	}
}

function getVimeoID(url) {
	var match = /vimeo.*\/(\d+)/i.exec( url );
	if ( match ) { return match[1]; }
}