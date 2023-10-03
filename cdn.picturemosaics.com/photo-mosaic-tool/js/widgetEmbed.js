var pmWidgetFrame = '';
var pmwWrapperDiv = '';
var widgetWidth = 0;
var widgetHeight = 0;
var mId = '';
var pId = '';
var widgetiFrameDetection = (window === window.parent) ? 0 : 1;
var widgetFrameCreated = 0;
var wsetZ;
var Pmwidgetframe = function(projectOptions) {
	this.defaultOptions = projectOptions;
	this.init = function() {
		if(!widgetFrameCreated) {
			widgetFrameCreated = 1;
			pmwWrapperDiv = document.getElementById(this.defaultOptions.element);
			pmwWrapperDiv.style.position = 'relative';
			pmwWrapperDiv.style.overflow = 'visible';
			pmwWrapperDiv.style.zIndex = 2;
			pmWidgetFrame = document.createElement('iframe');

			pmWidgetFrame.setAttribute('src', 'https://www.picturemosaics.com/photo-mosaic-tool/widgetIframe.php?id='+this.defaultOptions.uid+'&p='+this.defaultOptions.pid+'&stor='+this.defaultOptions.stor);
			mId = this.defaultOptions.uid;
			pId = this.defaultOptions.pid;
			pmWidgetFrame.setAttribute('id', 'pmWidgetFrame-'+mId+'-'+pId);
			pmWidgetFrame.setAttribute('width', '100%');
			pmWidgetFrame.setAttribute('height', '100%');
			pmWidgetFrame.setAttribute('frameborder', 0);
			pmWidgetFrame.setAttribute('marginheight', 0);
			pmWidgetFrame.setAttribute('marginwidth', 0);
			pmWidgetFrame.setAttribute('allowtransparency', true);
			pmWidgetFrame.setAttribute('allowusermedia', "");
			pmWidgetFrame.setAttribute('allow', 'camera');
			pmWidgetFrame.setAttribute('scrolling', "no");
			pmWidgetFrame.setAttribute('allowfullscreen', "");
			pmWidgetFrame.referrerPolicy = "unsafe-url";
			pmWidgetFrame.style.width = '100%';
			pmWidgetFrame.style.height = '0';
			pmWidgetFrame.style.top = '0';
			pmWidgetFrame.style.left = '0';
			pmWidgetFrame.addEventListener("load", function() {
			    document.getElementById('pmWidgetFrame-'+mId+'-'+pId).contentWindow.postMessage('inIframe-'+widgetiFrameDetection,"*");
			});
			pmwWrapperDiv.appendChild(pmWidgetFrame);
		}	
	}
}

function pmWidgetReceiveMessage(event) {
	if ((event.origin.indexOf('picturemosaics.com') >= 0)  || (event.origin.indexOf('livemosaics.com') >= 0)) {
		if(event.data[0].includes('widgets-carousel')){
				widgetWidth = parseInt(event.data[0].split('-')[3]);
				widgetHeight = parseInt(event.data[1].split('-')[3]);
				adjustWidgetSize();
		} else if(event.data.toString().indexOf('imageClicked') >= 0){
			console.log("recieved click");
			if(document.getElementById('pictureMosaicsEmbed')){
				console.log(event.data.split('||')[1]);
				document.getElementById('pmFrame-'+mId+'-'+pId).contentWindow.postMessage('carouselClick||'+event.data.split('||')[1]+'',"*");
			} else {
				console.log("no pmEmbed exists");
			}
		}
	}
}

function adjustWidgetSize() {
	pmWidgetFrame.style.height = widgetHeight+'px';
}

window.addEventListener("message", pmWidgetReceiveMessage, false);