var pmTagWidgetFrame = '';
var pmwWrapperDiv = '';
var tagWidgetWidth = 0;
var tagWidgetHeight = 0;
var mId = '';
var pId = '';
var widgetiFrameDetection = (window === window.parent) ? 0 : 1;
var tagWidgetFrameCreated = 0;
var wsetZ;
var PmTagWidgetframe = function(projectOptions) {
	this.defaultOptions = projectOptions;
	this.init = function() {
		if(!tagWidgetFrameCreated) {
			tagWidgetFrameCreated = 1;
			pmwWrapperDiv = document.getElementById(this.defaultOptions.element);
			pmwWrapperDiv.style.position = 'relative';
			pmwWrapperDiv.style.overflow = 'visible';
			pmwWrapperDiv.style.zIndex = 2;
			pmTagWidgetFrame = document.createElement('iframe');
			var tag = 1;
			pmTagWidgetFrame.setAttribute('src', 'https://www.picturemosaics.com/photo-mosaic-tool/widgetIframe.php?id='+this.defaultOptions.uid+'&p='+this.defaultOptions.pid+'&stor='+this.defaultOptions.stor+'&tag='+tag);
			mId = this.defaultOptions.uid;
			pId = this.defaultOptions.pid;
			if(tag) {
				pmTagWidgetFrame.setAttribute('id', 'pmWidgetFrame-tag-'+mId+'-'+pId);
			} else {
				pmTagWidgetFrame.setAttribute('id', 'pmWidgetFrame-carousel-'+mId+'-'+pId);
			}
			pmTagWidgetFrame.setAttribute('width', '100%');
			pmTagWidgetFrame.setAttribute('height', '100%');
			pmTagWidgetFrame.setAttribute('frameborder', 0);
			pmTagWidgetFrame.setAttribute('marginheight', 0);
			pmTagWidgetFrame.setAttribute('marginwidth', 0);
			pmTagWidgetFrame.setAttribute('allowtransparency', true);
			pmTagWidgetFrame.setAttribute('allowusermedia', "");
			pmTagWidgetFrame.setAttribute('allow', 'camera');
			pmTagWidgetFrame.setAttribute('scrolling', "no");
			pmTagWidgetFrame.setAttribute('allowfullscreen', "");
			pmTagWidgetFrame.referrerPolicy = "unsafe-url";
			pmTagWidgetFrame.style.width = '100%';
			pmTagWidgetFrame.style.height = '0';
			pmTagWidgetFrame.style.top = '0';
			pmTagWidgetFrame.style.left = '0';
			pmTagWidgetFrame.addEventListener("load", function() {
				if(tag) {
					document.getElementById('pmWidgetFrame-tag-'+mId+'-'+pId).contentWindow.postMessage('inIframe-'+widgetiFrameDetection,"*");
				}
			    
			});
			pmwWrapperDiv.appendChild(pmTagWidgetFrame);
		}	
	}
}

function pmTagWidgetReceiveMessage(event) {
	if ((event.origin.indexOf('picturemosaics.com') >= 0)  || (event.origin.indexOf('livemosaics.com') >= 0)) {
		//if(event.data[0].includes('widgets-carousel')){
		//		widgetWidth = parseInt(event.data[0].split('-')[3]);
		//		widgetHeight = parseInt(event.data[1].split('-')[3]);
		//		adjustCarouselSize();
		//} else 
		if(event.data[0].includes('widgets-tag')){
				tagWidgetWidth = parseInt(event.data[0].split('-')[3]);
				tagWidgetHeight = parseInt(event.data[1].split('-')[3]);
				adjustTagCloudSize();
		} else if(event.data.toString().indexOf('tagClick') >= 0){
			if(document.getElementById('pictureMosaicsEmbed')){
				document.getElementById('pmFrame-'+mId+'-'+pId).contentWindow.postMessage('tagClick||'+event.data.split('||')[1]+'',"*");
			}
		}
	}
}

// function adjustCarouselSize() {
// 	pmWidgetFrame.style.height = widgetHeight+'px';
// }

function adjustTagCloudSize() {
	pmTagWidgetFrame.style.height = tagWidgetHeight+'px';
}

window.addEventListener("message", pmTagWidgetReceiveMessage, false);