var pmFrame = '';
var pmWrapperDiv = '';
var pmPaddingBottom = '';
var mosRatio = 0;
var contentWidth = 0;
var contentHeight = 0;
var mId = '';
var pId = '';
var iFrameDetection = 0;
var frameCreated = 0;
var setZ;
var pmIsDonation = 0;
var pmControls = 1;
var pmTopBar = 1;
var pmChatterItems = {'data1' : 'Name', 'data2' : 'Email', 'data3' : 'Comment', 'postBtn' : 'POST', 'commentBtn' : 'ADD COMMENT', 'commSingle' : 'Comment', 'commMulti' : 'Comments'};
var pmChatterColors = {'btnColor' : '#007aec', 'txtColor' : '#FFF'};
var pMosPassEmail = pMosPassEmail || undefined;
var pMosPassFName = pMosPassFName || undefined;
var pMosPassLName = pMosPassLName || undefined;

var Pmframe = function(projectOptions) {
	this.defaultOptions = projectOptions;
	this.init = function() {
		if(!frameCreated) {
			frameCreated = 1;
			pmWrapperDiv = document.getElementById(this.defaultOptions.element);
			pmWrapperDiv.style.position = 'relative';
			pmWrapperDiv.style.overflow = 'visible';
			pmWrapperDiv.style.zIndex = 2;
			pmFrame = document.createElement('iframe');
			var key = querySt("key") ? '&key='+querySt("key") : '';
			if(key == '' && typeof keyPass !== 'undefined') {
				key = '&key='+keyPass;
			}
			if(typeof this.defaultOptions.controls !== 'undefined') {
				pmControls = parseInt(this.defaultOptions.controls);
			}
			if(typeof this.defaultOptions.topBar !== 'undefined') {
				pmTopBar = parseInt(this.defaultOptions.topBar);
			}
			pMosPassEmail = querySt("email") ? querySt("email") : '';
			pmFrame.setAttribute('src', 'https://www.picturemosaics.com/photo-mosaic-tool/responsiveiframe.php?id='+this.defaultOptions.uid+'&p='+this.defaultOptions.pid+'&control='+pmControls+'&topBar='+pmTopBar+'&stor='+this.defaultOptions.stor+key);
			mId = this.defaultOptions.uid;
			pId = this.defaultOptions.pid;
			if(typeof this.defaultOptions.donation !== 'undefined') {
				pmIsDonation = parseInt(this.defaultOptions.donation);
			}
			pmFrame.setAttribute('id', 'pmFrame-'+mId+'-'+pId);
			pmFrame.setAttribute('width', '100%');
			pmFrame.setAttribute('height', '100%');
			pmFrame.setAttribute('frameborder', 0);
			pmFrame.setAttribute('marginheight', 0);
			pmFrame.setAttribute('marginwidth', 0);
			pmFrame.setAttribute('allowtransparency', true);
			pmFrame.setAttribute('allowusermedia', "");
			pmFrame.setAttribute('allow', 'camera *; microphone *');
			pmFrame.setAttribute('scrolling', "no");
			pmFrame.setAttribute('allowfullscreen', "");
			pmFrame.referrerPolicy = "unsafe-url";
			pmFrame.style.width = '100%';
			pmFrame.style.height = '200px';
			pmFrame.style.top = '0';
			pmFrame.style.left = '0';
			pmFrame.addEventListener("load", function() {
			    document.getElementById('pmFrame-'+mId+'-'+pId).contentWindow.postMessage('inIframe-'+iFrameDetection,"*");
			});
			pmWrapperDiv.appendChild(pmFrame);
		}	
	}
}


	function pmToggleFullscreen(enabled){
        if(parseInt(enabled)){
			//document.getElementById('pmFrame-'+mId+'-'+pId).contentWindow.postMessage('removeWidget',"*");
            pmWrapperDiv.style.position = 'fixed';
            pmWrapperDiv.style.top = '0';
            pmWrapperDiv.style.left = '0';
            //pmWrapperDiv.style.paddingBottom = '0';
            pmWrapperDiv.style.height = '100%';
            pmWrapperDiv.style.width = '100%';
            pmWrapperDiv.style.background = '#000';
            pmFrame.style.height = '100%';
			pmWrapperDiv.style.zIndex = setZ;
        } else {
			//document.getElementById('pmFrame-'+mId+'-'+pId).contentWindow.postMessage('addWidget',"*");
            pmWrapperDiv.style.position = 'relative';
            pmWrapperDiv.style.height = '';
            pmWrapperDiv.style.width = '';
            pmWrapperDiv.style.background = 'transparent';
            pmFrame.style.height = contentHeight +'px';
			pmWrapperDiv.style.zIndex = 2;
        }
    }

	var logoAdded = 0;
	var animationPhoto = 0;
	var pmTwitterShareText = '';
	var pmCopiedText = '';
	var pmHoverText = '';
	var pmInstaText = '';
	var pmChatterHtml = '';
	var pmChatterCount = 0;
	var likeText = '';
	var likeTextPlural = '';

	function pmReceiveMessage(event) {
		if ((event.origin.indexOf('picturemosaics.com') >= 0)  || (event.origin.indexOf('livemosaics.com') >= 0)) {
			if(event.data.toString().indexOf('pmSwiperInfo') >= 0) {
				swiperPopup(JSON.parse(event.data.split('|-|')[1]));
			} else if(event.data == 'logo') {
				if(!logoAdded){
					addLogo();
				}
			} else if(event.data.toString().indexOf('pmImage') >= 0) {
				document.getElementById('pmFrame-'+mId+'-'+pId).contentWindow.postMessage(event.data,"*");
			} else if(event.data == 'launchUpload') {
				openUploadFlow();
			} else if(event.data.toString().indexOf('launchWaldo') >= 0) {
				openWaldoFlow(event.data.split('-')[1]);
			} else if(event.data == 'closeWaldo') {
				removeWaldo();
			} else if(event.data == 'pmSsoInfo') {
				sendUploadData();
			} else if(event.data == 'closeMobUpload') {
				removeMobile();
			} else if(event.data.includes('PictureMosaics-chatterData')) {
				buildChatter(event.data.split('-')[2]);
			} else if(event.data.toString().indexOf('pmFullscreen') >= 0) {
				pmToggleFullscreen(event.data.split('-')[1]);
			} else if(event.data.toString().indexOf('pmDonationPurchase') >= 0) {
				fromDonationPurchase(event.data.split('-')[1]);
			} else if(event.data.toString().indexOf('animationCheck') >= 0) {
				checkCookie('animationSetting');
			} else if(event.data.toString().indexOf('animationSet') >= 0) {
				console.log('here');
				setCookie('animationSetting', event.data.split('-')[1], 10);
			} else if(event.data[0].includes('PictureMosaics-width')){
					contentWidth = parseInt(event.data[0].split('-')[2]);
					contentHeight = parseInt(event.data[1].split('-')[2]);
					adjustSize();
			}
		}
	}


	function addLogo() {
		logoAdded = 1;
		var logoArray = ['Virtual Photo Mosaic by Picture Mosaics', 'Virtual Mosaic Technology by Picture Mosaics', 'Photo Mosaic Technology by Picture Mosaics', 'Online Photo Mosaic by Picture Mosaics', 'Interactive Photo Mosaic by Picture Mosaics', 'Photo Mosaic Platform by Picture Mosaics'];
		var logoSelection = Math.floor(Math.random() * logoArray.length);
		var pmLinkWrapper = '<span style="z-index: 1; float: right !important; margin-top:1px !important; line-height:normal !important; height:18px !important; font-size:12px !important; display:block !important;"><a style="font-size:13px !important;" href="https://www.picturemosaics.com"  target="_blank"><img class="click" style="vertical-align:-15% !important; border:none !important; line-height:normal !important; display:inline-block !important; height:13px !important; width:13px !important; margin:0 !important; padding:0 !important;" src="https://cdn.picturemosaics.com/photo-mosaic-tool/images/pmLogo2.svg" alt="Picture Mosaics"></a>&nbsp;<a style="position: relative !important; top: -1px !important; font-size:10px !important; color:#878787 !important; font-family:arial,sans-serif !important; text-decoration:none !important; line-height:normal !important; display:inline-block !important;" href="https://www.picturemosaics.com" target="_blank" title="'+logoArray[logoSelection]+'">'+logoArray[logoSelection]+'</a></span>';	
		pmWrapperDiv.insertAdjacentHTML('afterend', pmLinkWrapper);
	}

	function buildChatter(chatData) {
		var workingChat = JSON.parse(chatData);
		pmChatterHtml = '';
		pmChatterCount = workingChat.length;
		for(var i = 0; i < pmChatterCount; i++) {
			var chatName = '';
			if(mId == 'M1472748') {
				chatName = workingChat[i].fname+' '+workingChat[i].lname; 
			} else {
				if(workingChat[i].lname != '') {
					chatName = workingChat[i].fname+' '+workingChat[i].lname[0]+'.'; 
				} else {
					chatName = workingChat[i].fname;
				}
			}
			pmChatterHtml += '<div class="pmos-chatBlock"><div class="pmos-chatName">'+chatName+'</div><div class="pmos-chatCap">'+workingChat[i].comment+'</div></div>';
		}
		if(pmChatterCount == 1) {
			var txtUse = pmChatterItems.commSingle;
		} else {
			var txtUse = pmChatterItems.commMulti;
		}
		document.getElementById('pmos-chatterCounter').innerHTML = pmChatterCount;
		document.getElementById('pmos-chatterText').innerHTML = txtUse;
		if(window.innerWidth < 768) {
			document.getElementById('swiperChatterData').innerHTML = '<div><div id="pmos-commentBlock" style="text-transform: uppercase;">'+pmChatterItems.commMulti+'</div><div class="pmos-commentClose"><div class="pmos-chatterCloseBtn pmos-noMarginBottom" onclick="undisplayComments();"></div></div></div><div id="pmos-mobileCommentSection">'+pmChatterHtml+'</div><div id="pmosChatterAddBtn" style="background:'+pmChatterColors.btnColor+' !important; color:'+pmChatterColors.txtColor+' !important;" onclick="openChatterAdd();">'+pmChatterItems.commentBtn+'</div>';
		} else {
			document.getElementById('swiperChatterData').innerHTML = '<div id="pmosChatterAddBtn" style="background:'+pmChatterColors.btnColor+' !important; color:'+pmChatterColors.txtColor+' !important;" onclick="openChatterAdd();">'+pmChatterItems.commentBtn+'</div><div id="pmos-mobileCommentSection">'+pmChatterHtml+'</div>';
		}
		
		
	}

	function swiperPopup(photoData) {
		var instaAddData = 0;
		var hasVideo = 0;
		var hasChatter = 0;
		if(parseInt(photoData.chatterEnabled.value)) {
			hasChatter = photoData.chatterEnabled.value;
			pmChatterItems = photoData.chatterTexts;
			pmChatterColors = photoData.chatterColors;
		}
		pmChatterHtml = '';
		pmChatterCount = 0;
		srcPath = photoData.imgPath.value;
		if(photoData.video && photoData.video.value == 1){
			vidPath = photoData.video.path;
			hasVideo = 1;
		}
		if(srcPath.indexOf('animHotlink') >= 0) {
			instaAddData = 1;
		}

	    if(srcPath != '') {
	        var newImg = new Image;
	        newImg.onload = function(){
				if(!hasVideo){
					if(document.getElementById('pmos-swiperImgSrc').tagName == 'VIDEO'){
						var swipeVideo = document.getElementById('pmos-swiperImgSrc');
						var swipeImg = document.createElement('img');
						swipeImg.setAttribute('id', 'pmos-swiperImgSrc');
						swipeImg.setAttribute("src", this.src);
						swipeVideo.replaceWith(swipeImg);
					} else {
						document.getElementById('pmos-swiperImgSrc').src = this.src;
					}
				} else {
					var swipeImg = document.getElementById('pmos-swiperImgSrc');
					var swipeVideo = document.createElement('video');
					swipeVideo.setAttribute('id', 'pmos-swiperImgSrc');
					swipeVideo.setAttribute("src", vidPath);
					swipeVideo.setAttribute("poster", this.src);
					swipeVideo.setAttribute("controls", true);
					swipeVideo.setAttribute("autoplay", true);
					swipeVideo.setAttribute("playsinline", true);
					swipeVideo.setAttribute("type", "video/mp4");
					swipeImg.replaceWith(swipeVideo);

					// var swipeVideoPlay = document.createElement('img');
					
					// swipeVideoPlay.setAttribute('id', 'videoPlay');
					// swipeVideoPlay.setAttribute("src", 'https://cdn.picturemosaics.com/photo-mosaic-tool/images/play_button.png');

					// swipeVideo.parentNode.insertBefore(swipeVideoPlay, swipeVideo.nextSibling)
					// //document.getElementById('pmos-swiperImg').appendChild(swipeVideoPlay);
				}

	            var borderConstant = 300;
	            var windowWidth = window.innerWidth;
	            var windowHeight = window.innerHeight;
	            var imgWidth = this.width;
	            var imgHeight = this.height;
	            //console.log(windowWidth+' '+windowHeight+' '+imgWidth+' '+imgHeight);
	            //IF WINDOWWIDTH > 600px = image = 600px;
	            //IF WINDOWWIDTH < 600px = 68% page width;   
	            var windowRatio = windowWidth/windowHeight;
	            var imgRatio = imgWidth/imgHeight;
	            // if(imgRatio > 1) {
	                if(imgRatio !== 1) {
	                // borderConstant = windowHeight * .3333375;
	                borderConstant = windowHeight * .25;
	            }

	            var swiperData = document.getElementsByClassName("pmos-swiperData");

				var newHeight = windowHeight - borderConstant;
				var newWidth = imgWidth / (imgHeight/newHeight);

	                var swiperDataWidth = 300;

	                if(Object.keys(photoData).length > 2 || instaAddData) {
	                    if(newWidth > windowWidth * .6) {
	                        newWidth = windowWidth * .6;
	                    }
	                    if(windowWidth <= 640){
							if(imgRatio < 1){
								newWidth = windowWidth * .75;
							
								// newImgWidth = newWidth * .8;
								newImgWidth = newWidth * .55;

								newMaxHeight = newImgWidth / imgRatio;
								// document.getElementById('pmos-swiperImg').style.maxHeight = '360px';
								// document.getElementById('pmos-swiperImg').style.width = '100%';

								// document.getElementById('pmos-swiperImgSrc').style.maxHeight = '360px';
								// document.getElementById('pmos-swiperImgSrc').style.width = '100%';
							} else {
	                        newWidth = windowWidth * .75;
	                        newImgWidth = newWidth;
							}
	                       // newHeight = newImgWidth;
	                        swiperDataWidth = newWidth;
	                        document.getElementById('pmos-infoHolderSwiper').style.width = newWidth + 'px';
							if(imgRatio < 1){
								var imgContainer = document.getElementsByClassName("pmos-swiperImg");
								imgContainer[0].style.width = '100%';
								document.getElementById('pmos-swiperImgSrc').style.width = '100%';
								document.getElementById('pmos-swiperImgSrc').style.maxHeight = newMaxHeight + 'px';
							} else if(imgRatio == 1) {
								document.getElementById('pmos-swiperImgSrc').style.width = newImgWidth + 'px';
								document.getElementById('pmos-swiperImgSrc').style.height = newImgWidth + 'px';
							} else {
								document.getElementById('pmos-swiperImgSrc').style.width = newImgWidth + 'px';
							}
	                        // document.getElementById('pmos-swiperImgSrc').style.width = newImgWidth + 'px';
	                        swiperData[0].style.width = swiperDataWidth+ 'px';
	                        swiperData[0].style.height = (swiperDataWidth * .85) + 'px'; 
	                       // swiperData[0].style.display = 'block'; 
	                        swiperData[0].style.maxWidth = swiperDataWidth + 'px'; 
	                        
	                        
	                    } else if(windowWidth <= 1020){
							
	                        newWidth = windowWidth * .75;
	                        newImgWidth = newWidth * .6;
	                        newHeight = newImgWidth;
	                        swiperDataWidth = newWidth - newImgWidth;

							if(windowRatio >= 1 && windowWidth > 640 && windowWidth <= 950){
								if(imgRatio > 1){
									newHeight = newWidth / imgRatio;
								}
								if(imgRatio < 1){
									newWidth = windowWidth * .75;
									newImgWidth = newWidth * .55;
									newHeight = newImgWidth;

									document.getElementById('pmos-swiperImgSrc').style.maxHeight = newImgWidth + 'px';
								}
							} 

	                        document.getElementById('pmos-infoHolderSwiper').style.width = newWidth + 'px';
	                        document.getElementById('pmos-swiperImgSrc').style.width = (newImgWidth) + 'px';
	                        if(imgRatio == 1) {
	                        	document.getElementById('pmos-swiperImgSrc').style.height = newWidth + 'px';
	                        }
	                        swiperData[0].style.height = newHeight+ 'px'; 
	                        swiperData[0].style.width = swiperDataWidth+ 'px'; 
	                       
	                    } else {
							if(imgRatio >= 1){
								newHeight = newWidth / imgRatio;
							}
	                        document.getElementById('pmos-infoHolderSwiper').style.width = (newWidth + swiperDataWidth) + 'px';
	                        swiperData[0].style.height = newHeight+ 'px'; 
	                        swiperData[0].style.width = swiperDataWidth+ 'px'; 
	                        document.getElementById('pmos-swiperImgSrc').style.width = newWidth + 'px';
	                        if(imgRatio == 1) {
	                        	document.getElementById('pmos-swiperImgSrc').style.height = newWidth + 'px';
	                        }
	                    }
	                   
	                } else {
	                    if(newWidth > windowWidth * .666666667) {
	                        newWidth = windowWidth * .66666667;
	                    }
	                    document.getElementById('pmos-infoHolderSwiper').style.width = newWidth + 'px';
	                    document.getElementById('pmos-swiperImgSrc').style.width = newWidth + 'px';
	                }

	            // } else {

	            //     if(imgRatio > 1) {
	            //         borderConstant = windowHeight * .3333375;
	            //     }else{
	            //         borderConstant = windowHeight * .6;
	            //     }
	            //     var newHeight = windowHeight  - borderConstant;
	            //     var newWidth = imgWidth / (imgHeight/ newHeight);

	            //     var swiperDataHeight = 250;
	            //     if(photoData) {
	            //         //swiperData[0].style.display = 'block'; 
	            //         swiperData[0].style.height = swiperDataHeight+ 'px'; 
	            //         if(windowWidth <= 600){
	            //             newHeight = windowHeight * .75;
	            //             newImgHeight = newHeight * .6;
	            //             swiperData[0].style.maxWidth = newHeight + 'px'; 
	            //             document.getElementById('pmos-infoHolderSwiper').style.width = newImgHeight + 'px';
	            //             document.getElementById('pmos-swiperImgSrc').style.width = (newImgHeight) + 'px';
	            //             swiperData[0].style.maxHeight = swiperDataHeight+ 'px'; 

	            //         } else {

	            //             document.getElementById('pmos-infoHolderSwiper').style.width = newHeight + 'px';
	            //             swiperData[0].style.width = newHeight+ 'px'; 
	            //             swiperData[0].style.maxWidth = newHeight + 'px'; 
	            //             document.getElementById('pmos-swiperImgSrc').style.width = newHeight + 'px';
	            //         }

	            //     } else {
	            //         if(imgRatio < 1) {
	            //             if(newHeight > windowHeight * .666666667) {
	            //                 newHeight = windowHeight * .666666667;
	            //             }
	            //             document.getElementById('pmos-infoHolderSwiper').style.width = newHeight + 'px';
	            //             document.getElementById('pmos-swiperImgSrc').style.width = newHeight + 'px';
	            //         } else {
	            //              if(newWidth > windowWidth * .666666667) {
	            //                 newWidth = windowWidth * .66666667;
	            //             }
	            //             document.getElementById('pmos-infoHolderSwiper').style.width = newWidth + 'px';
	            //             document.getElementById('pmos-swiperImgSrc').style.width = newWidth + 'px';
	            //         }
	                   

	            //     }
	            // }
	            var pmDataDiv = document.getElementsByClassName("pmos-swiperData")[0];
	            if(Object.keys(photoData).length > 3 || instaAddData) {

	                // for (const [key, value] of Object.entries(photoData)) {
	                //     console.log(`${key}: ${value}`);
	                //   }
	                var name, caption, cust1, cust2, cust3, likeButton, chatterBtn;
					pmTwitterShareText = photoData.twitterCopy.value;
	                pmCopiedText = photoData.copiedText.value;
	                pmHoverText = photoData.hoverText.value;
	                pmInstaText = photoData.instaAddInfo.value;

	                var dataString = '';
	                dataString += '<div id="pmos-swiperInfoSection"><div class="pmos-swiperContainer">'; //close 1
	                if(instaAddData) {
	                	dataString += '<div class="pmos-swiperValue"><span class="pmos-instaAddText">'+pmInstaText+'</span></div>';
	                }
	                dataString += '<div class="pmos-swiperInnerLeft">'; //close 3
	                if(!instaAddData) {
	                	name = photoData.name.value;
						caption = photoData.caption.value;
		                cust1 = photoData.custom1.value;
		                cust2 = photoData.custom2.value;
		                cust3 = photoData.custom3.value;

		                if(photoData.name.use) {
		                    dataString += '<div class="pmos-swiperName">'+name+'</div>';
		                }
		               
		                if(photoData.custom1.use && cust1 != '') {
		                    dataString += '<div class="pmos-swiperItem">';
		                    if(photoData.custom1.use == 2) {
		                    	dataString += '<div class="pmos-swiperLabel">'+ photoData.custom1.label +'</div>';
		                    }
		                    dataString += '<div class="pmos-swiperValue">'+cust1+'</div></div>';
		                }
		                if(photoData.custom2.use && cust2 != '') {
		                    dataString += '<div class="pmos-swiperItem">';
		                    if(photoData.custom2.use == 2) {
		                    	dataString += '<div class="pmos-swiperLabel">'+ photoData.custom2.label +'</div>';
		                    }
		                    dataString += '<div class="pmos-swiperValue">'+cust2+'</div></div>';
		                }
		                if(photoData.custom3.use && cust3 != '') {
		                    dataString += '<div class="pmos-swiperItem">';
		                    if(photoData.custom3.use == 2) {
		                    	dataString += '<div class="pmos-swiperLabel">'+ photoData.custom3.label +'</div>';
		                    }
		                    dataString += '<div class="pmos-swiperValue">'+cust3+'</div></div>';
		                }
		            }
	                dataString += '</div>'; //close 3
	                
		                dataString += '<div class="pmos-swiperInnerRight">'; //close 4
		                if(!instaAddData) {
				            if(photoData.caption.use && caption != '') {
				                dataString += '<div class="pmos-swiperCap">';
				                if(photoData.caption.use == 2) {
				                	dataString += '<div class="pmos-swiperLabel">'+ photoData.caption.label +'</div>';
				                }
				                dataString += '<div class="pmos-swiperValue">'+caption+'</div></div>';
				            }
				        }
		                dataString += '</div>'; //close 4
		                var pmosNameDisplay = '';
		                var pmosEmailDisplay = '';
		                if(typeof pMosPassFName !== 'undefined'){
						    pmosNameDisplay += pMosPassFName;
						}
						if(typeof pMosPassLName !== 'undefined'){
						    pmosNameDisplay += ' '+pMosPassLName;
						}
						if(typeof pMosPassEmail !== 'undefined'){
						    pmosEmailDisplay += pMosPassEmail;
						}
		                dataString += '<div id="pmos-chatterAddData"><div id="pmos-chatterAddAlign"><div id="pmos-chatterAddContent"><div class="pmos-chatterCloseBtn" onclick="closeChatterAdd();"></div><div><input class="pmos-chatterDataFields pmos-chatterDataItem" type="text" id="pmos-chatterItem1" placeholder="'+pmChatterItems.data1+'" value="'+pmosNameDisplay+'" /></div><div><input class="pmos-chatterDataFields pmos-chatterDataItem" type="email" id="pmos-chatterItem2" placeholder="'+pmChatterItems.data2+'" value="'+pmosEmailDisplay+'" /></div><div><textarea class="pmos-chatterDataFields pmos-chatterCommentItem" id="pmos-chatterItem3" placeholder="'+pmChatterItems.data3+'"></textarea></div><div id="pmos-postBtn" style="background:'+pmChatterColors.btnColor+' !important; color:'+pmChatterColors.txtColor+' !important;" onclick="sendChatterMessage(\''+photoData.code.value+'\', \''+name+'\');">'+pmChatterItems.postBtn+'</div></div></div></div><div id="swiperChatterData">';
		                dataString += '</div></div></div>'; //close 1
						if(photoData.likes || hasChatter) {
							var likeSection = chatterSection = '';
							if(photoData.likes.use) {
								likeText =  photoData.likes.text;
								likeTextPlural =  photoData.likes.text_plural;

								if (photoData.likes.liked >= 0){
									likeButton = '<div id="pmos-likeDiv" class="pmos-unLike" onClick="unLikePhoto (\''+photoData.code.value+'\', '+photoData.likes.total+', 1); return false; event.preventDefault();"><img src="https://www.picturemosaics.com/photo-mosaic-tool/images/like_solid.svg" class="pmos-likeHeart" style="width: 20px;"/></div>';
								} else {
									likeButton = '<div id="pmos-likeDiv" class="pmos-like" onClick="likePhoto(\''+photoData.code.value+'\', '+photoData.likes.total+', 1); return false; event.preventDefault();"><img src="https://www.picturemosaics.com/photo-mosaic-tool/images/like_outline.svg" class="pmos-likeHeart" style="width: 25px;"/></div>';
								}
							
								if(photoData.likes.total == 1) {
									var txtUse = photoData.likes.text;
								} else {
									var txtUse = photoData.likes.text_plural;
								}

								likeSection = '<div class="pmos-specialContainer"><div class="pmos-photoLikeBtn '+photoData.code.value+'-swiper click noselect" style="display: inline-block; vertical-align: middle;" >'+likeButton+'</div><div class="pmos-likeAmount" style="display: inline-block; vertical-align: middle; margin-left: 5px;"><span class="pmos-likeCounter-'+photoData.code.value+'">'+photoData.likes.total+'</span> <span class="pmos-likeText-'+photoData.code.value+'"> '+txtUse+'</span></div></div>';
								
							}

							charText = pmChatterItems.commSingle;
							chatTextPlural = pmChatterItems.commMulti;
							
							if(hasChatter) {
								chatterSection = '<div class="pmos-specialContainer" onclick="displayComments();"><div class="click noselect" style="display: inline-block; vertical-align: middle;"><img src="https://www.picturemosaics.com/photo-mosaic-tool/images/comment.svg" class="pmos-likeHeart" style="width: 34px;"/></div><div class="pmos-likeAmount" style="display: inline-block; vertical-align: middle; margin-left: 5px;"><span id="pmos-chatterCounter">'+pmChatterCount+'</span> <span id="pmos-chatterText"></span></div></div>'
							}
							dataString += '<div id="pmos-SpecialSection">'+likeSection+chatterSection+'</div>';
						}

		                dataString += '<div class="pmos-swiperShare">'; //close 2
		                if(!instaAddData) {
			                if(photoData.facebook.use || photoData.twitter.use || photoData.linkedIn.use || photoData.shareLink.use) {
			                    var encodeString = photoData.shareString.value;
			                    
			                    dataString += '<div class="pmos-swiperShareTxt">'+photoData.sharePhoto.value+'</div>';
			                    dataString += '<div class="pmos-swiperShareIcons">';

			                    if(photoData.facebook.use) {
			                        dataString += '<div title="Share on Facebook" onclick="fbPhotoShare(\''+encodeString+'\');" ontouchstart="fbPhotoShare(\''+encodeString+'\');" class="click pmos-swPhotoFb"></div>';
			                    }
			                    if(photoData.twitter.use) {
			                        dataString += '<div title="Share on Twitter" class="click pmos-swPhotoTw" onclick="twPhotoShare(\''+encodeString+'\');" ontouchstart="twPhotoShare(\''+encodeString+'\');"></div>';
			                    }
			                    if(photoData.linkedIn.use) {
		                            dataString += '<div title="Share on LinkedIn" class="pmos-swPhotoIn click" onclick="InPhotoShare(\''+encodeString+'\');" ontouchstart="InPhotoShare(\''+encodeString+'\');"></div>';
		                        }
			                    if(photoData.shareLink.use) {
			                        dataString += '<div id="pmos-embedLink"><div id="pmos-embedPopup">'+pmCopiedText+'<div id="pmos-embedPopupArrow"></div></div><div title="'+pmHoverText+'" onclick="toggleEmbed(\''+encodeString+'\');" ontouchstart="toggleEmbed(\''+encodeString+'\');" class="pmos-shareEmbedSwiper click"></div></div>';
			                    }
			                    dataString += '</div>';
			                    
			                }
		                }
		                dataString += '</div>';//close 2
	                	
	                pmDataDiv.innerHTML = dataString;
	                //$('.pmos-swiperData').html(dataString);
	                var swiperContainer = document.getElementsByClassName("pmos-swiperContainer");
	                var swiperLeft = document.getElementsByClassName("pmos-swiperInnerLeft");
	                var swiperRight = document.getElementsByClassName("pmos-swiperInnerRight");
	                var swiperShare = document.getElementsByClassName("pmos-swiperShare");
	                var swiperCap = document.getElementsByClassName("pmos-swiperCap");
					//console.log(windowRatio);
	                // if((windowRatio >= 1 && windowWidth > 640) || ((cust1 == '') && (cust2 == '') && (cust3 == '')) ){
					if((windowWidth > 640) || ((cust1 == '') && (cust2 == '') && (cust3 == '')) ){
	                    swiperLeft[0].style.display = "block";
	                    swiperLeft[0].style.width = "100%";
	                    swiperRight[0].style.display = "block";
	                    swiperRight[0].style.width = "100%";
	                }
	                if(windowRatio >= 1 && windowWidth > 640) {
	                	swiperShare[0].style.left = '20px';
	                	swiperShare[0].style.justifyContent = 'start';
	                	swiperRight[0].style.paddingTop = '0px';
	                    // $(".pmos-swiperShare").css({
	                    //     'justify-content': 'start',
	                    //     'left': '20px'
	                    // });
	                    
	                    // $(".pmos-swiperInnerRight").css({
	                    //     'padding-top': '0px'
	                    // });
	                }
	                if(windowRatio >= 1 && windowWidth > 640 && windowWidth <= 950) {
	                	swiperShare[0].style.bottom = '5px';
						swiperShare[0].style.left = '10px';
	                	//swiperCap[0].style.maxHeight = '95px';
	                    // $(".pmos-swiperShare").css({
	                    //     'bottom': '5px'
	                    // });
	                    // $(".pmos-swiperCap").css({
	                    //     'max-height': '95px'
	                    // });
						// $(".pmos-swiperShare").css({
	                    //     'left': '10px'
	                    // });
	                }
	                if(windowWidth <= 640){
	                	pmDataDiv.style.display = "block";
	                } else {
	                	pmDataDiv.style.display = "";
	                }
					if(photoData.likes) {
						if(photoData.likes.use && windowWidth <= 640) {
							swiperShare[0].style.justifyContent = 'flex-start';
						}
					}
	            } else {
	                pmDataDiv.style.display = "none";
	            }
				if(parseInt(photoData.font.exists) && photoData.font.name == 'Custom') {
					var customFont = new FontFace('Custom', 'url('+photoData.font.url+')');
					customFont.load().then(function(loaded_face) {
						document.fonts.add(loaded_face);
						document.getElementsByClassName('pmos-swiperData')[0].style.setProperty('font-family', '"Custom", Arial', "important");
					}).catch(function(error) {
						// error occurred
					});
					} else if(photoData.font.name == 'Roboto') {
						var customFont = new FontFace('Roboto', 'url(https://cdn.picturemosaics.com/fonts/Roboto-Medium-webfont.woff2)');
						customFont.load().then(function(loaded_face) {
							document.fonts.add(loaded_face);
							document.getElementsByClassName('pmos-swiperData')[0].style.setProperty('font-family', '"Roboto", Arial', "important");
						}).catch(function(error) {
							// error occurred
						});
					} else {
						document.getElementsByClassName('pmos-swiperData')[0].style.setProperty('font-family', photoData.font.name, "important");
				}
	            document.getElementById('pmos-swiperPMHolder').style.display = "block";
	            //$("#pmos-swiperPMHolder").show();
	            if(hasChatter) {
	            	getChatterMessages(photoData.code.value);
	            }
			}
	        
	        newImg.src = srcPath;
	    }
	}

	function openShareWindow(url, w, h) {
	    shareWindow = window.open("", "sharer", "left=20,top=20,width="+w+",height="+h+",toolbar=0,scrollbars=0,statusbar=0,resizable=0");
	    shareWindow.location = url;
	}

	function fbPhotoShare(photoCode) {
	    openShareWindow('https://www.facebook.com/sharer.php?u=https://livemosaics.com/share.php?key='+photoCode, 626,436);
	    return false;   
	}

	function InPhotoShare(photoCode) {
	    openShareWindow('https://www.linkedin.com/shareArticle?mini=true&url=https://livemosaics.com/share.php%3Fkey%3D'+photoCode, 626, 436);
	  
	    return false;    
	}

	// Twitter Share
	function twPhotoShare(photoCode) {
		var input = document.createElement("textarea");
		input.innerHTML = pmTwitterShareText+' https://livemosaics.com/share.php?key='+photoCode;
		twitText = encodeURIComponent(input.value);
		twitText = twitText.replace(/'/g,"%27");

		openShareWindow('https://twitter.com/intent/tweet?original_referer=https%3A%2F%2F'+encodeURIComponent('livemosaics.com/share.php?key='+photoCode)+'&ref_src=twsrc%5Etfw&related=twitterapi%2Ctwitter&tw_p=tweetbutton&text='+twitText, 550, 270);
		return false;
	}

	function toggleEmbed(photoCode){
		document.getElementById('pmos-embedPopup').style.display = 'block';
        var str = 'https://livemosaics.com/share.php?key='+photoCode;
        const el = document.createElement('textarea');
	    el.value = str;
	    document.body.appendChild(el);
	    el.select();
	    document.execCommand('copy');
	    document.body.removeChild(el);
	    setTimeout(function(){
	    	document.getElementById('pmos-embedPopup').style.display = 'none';
	    }, 1250);
    }

	function adjustSize() {
		pmFrame.style.height = contentHeight+'px';
	}

	function querySt(name, url = window.location.href) {
		name = name.replace(/[\[\]]/g, '\\$&');
		var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
			results = regex.exec(url);
		if (!results) return '';
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}

	window.addEventListener("message", pmReceiveMessage, false);

	function fadeIn(el) { 
		var fade = document.getElementById(el); 
		fade.style.display = '';
		var opacity = 0; 
		if(el != 'pmos-overlay'){
			var intervalID = setInterval(function() { 
		    if (opacity < 1) { 
		        opacity = opacity + 0.1 
		        fade.style.opacity = opacity; 
		    } else { 
		        clearInterval(intervalID); 
		    } 
		}, 35); 
		fade.style.opacity = 0; 	
			}
	} 

	function fadeOut(el) { 
		var fade = document.getElementById(el); 
		var opacityOrig =  fade.style.opacity; 
		var opacity =  fade.style.opacity; 
		var intervalID = setInterval(function() { 
		    if (opacity > 0) { 
		        opacity = opacity - 0.1 
		        fade.style.opacity = opacity; 
		    } else { 
		        clearInterval(intervalID); 
		        fade.style.opacity = opacityOrig; 
				fade.style.display = 'none';
		    } 
		}, 35); 
	 
	}  

	function init() {
	var maxZ = maxZIndex();
		if(isNaN(maxZ)) {
			maxZ = 1;
		}
		setZ = maxZ * 10000;

		// var modalWrapper = document.createElement('div');
		// var overlay = document.createElement('div');
		// var contentWrapper = document.createElement('div');
		// var iframeWrapper = document.createElement('div');
		// var closeModal = document.createElement('div');
		// var mobileWrapper = document.createElement('div');
		var modalWrapper = '';
		var overlay =  '';
		var contentWrapper = '';
		var iframeWrapper = '';
		var closeModal = '';
		var mobileWrapper = '';

		var modalWrapperCheck = document.getElementById('pmos-modalWrapper');
		if (typeof(modalWrapperCheck) == 'undefined' || modalWrapperCheck == null) {
			var modalWrapper = document.createElement('div');

			modalWrapper.id = "pmos-modalWrapper";
			modalWrapper.setAttribute('style', 'position:absolute;top:0;bottom:0;left:0;right:0; opacity: 0; z-index: '+setZ+';');


			document.body.appendChild(modalWrapper);

			var overlayCheck = document.getElementById('pmos-overlay');
			if (typeof(overlayCheck) == 'undefined' || overlayCheck == null) {
				var overlay = document.createElement('div');
		
				overlay.id = "pmos-overlay";
				overlay.setAttribute('style', 'position:fixed;top:0;bottom:0;left:0;right:0;opacity:0.5;width:100%;height:100%;background-color:black; z-index: '+setZ+';');

				modalWrapper.appendChild(overlay);
				document.getElementById('pmos-overlay').style.display = 'none';
			}

			document.getElementById('pmos-modalWrapper').style.display = 'none';
		}
		

		var contentWrapperCheck = document.getElementById('pmos-contentWrapper');
			
		if (typeof(contentWrapperCheck) == 'undefined' || contentWrapperCheck == null) {
			contentWrapper = document.createElement('div');
			contentWrapper.id = 'pmos-contentWrapper';
			contentWrapper.setAttribute('style', 'position:fixed;top: 50%;left: 50%;transform: translate(-50%, -50%);-webkit-transform: translate(-50%, -50%);-ms-transform: translate(-50%, -50%);opacity:1; background-color: #FFF; padding: 10px; border-radius: 4px; box-shadow: 0 10px 25px rgba(0,0,0,.5); opacity: 0; z-index: '+setZ+';');

			var iframeWrapperCheck = document.getElementById('pmos-iframeWrapper');
			if (typeof(iframeWrapperCheck) == 'undefined' || iframeWrapperCheck == null) {
				iframeWrapper = document.createElement('div');
				iframeWrapper.id = 'pmos-iframeWrapper';
			}

			var closeModalCheck = document.getElementById('pmos-closeModal');
			if (typeof(closeModalCheck) == 'undefined' || closeModalCheck == null) {
				var closeModal = document.createElement('div');
		
				closeModal.id = "pmos-closeModal";
				closeModal.setAttribute('style', 'background-image: url(https://cdn.picturemosaics.com/modal/closeModal.svg); position: absolute; top: -23px; right: -23px; height: 40px; width: 40px; cursor: pointer; background-size: contain;');
		
				closeModal.addEventListener('click', remove);
			}

			contentWrapper.appendChild(closeModal);
			contentWrapper.appendChild(iframeWrapper);

			document.body.appendChild(contentWrapper);

			document.getElementById('pmos-contentWrapper').style.display = 'none';
		}

		var mobileUploadWrapperCheck = document.getElementById('pmos-mobileUploadWrapper');
		if (typeof(mobileUploadWrapperCheck) == 'undefined' || mobileUploadWrapperCheck == null) {
			var mobileWrapper = document.createElement('div');
			
			mobileWrapper.id = 'pmos-mobileUploadWrapper';
			mobileWrapper.setAttribute('style', 'position:fixed; top: 0; left: 0; opacity:1; background-color: #FFF; z-index: '+setZ+'; width:100%; height:100%; padding:0; margin:0; border:0;');

			document.body.appendChild(mobileWrapper);

			document.getElementById('pmos-mobileUploadWrapper').style.display = 'none';

		}

		var swiperWrapper = document.createElement('div');

		swiperWrapper.id = "pmos-swiperPMHolder";
		swiperWrapper.setAttribute('style', 'z-index: '+setZ);
		var newPhotoSwiper='<div class="pmos-swiperMobileContainer"><div class="pmos-swiper-slide"><div id="pmos-infoHolderSwiper" class="pmos-infoHolderSwiper">'; // two now 3 </div> expected
		newPhotoSwiper += '<div class="pmos-swiperImgHolder">';
		newPhotoSwiper += '<div class="pmos-swiperImg"><img id="pmos-swiperImgSrc" /></div><div class="pmos-swiperData"></div></div>';
        newPhotoSwiper += '<div class="pmos-swiper-close" onclick="closeSwiper(); event.preventDefault();" ontouchend="closeSwiper(); event.preventDefault();"></div>';
        newPhotoSwiper += '</div></div></div>';
		swiperWrapper.innerHTML = newPhotoSwiper;
		document.body.appendChild(swiperWrapper);

		var cssId = 'pmmos-css';  // you could encode the css path itself to generate id..
		if (!document.getElementById(cssId))
		{
		    var head  = document.getElementsByTagName('head')[0];
		    var link  = document.createElement('link');
		    link.id   = cssId;
		    link.rel  = 'stylesheet';
		    link.type = 'text/css';
		    link.href = 'https://cdn.picturemosaics.com/photo-mosaic-tool/css/pmos-swiper.css';
		    link.media = 'all';
		    head.appendChild(link);
		}
	}

	function closeSwiper(){
    	document.getElementById('pmos-swiperPMHolder').style.display='none';
		if(document.getElementById('pmos-swiperImgSrc').tagName == 'VIDEO'){
			var swipeVideo = document.getElementById('pmos-swiperImgSrc');
			swipeVideo.pause();
		} 
	}

	function createModal(config) {
		var h = window.innerHeight - 100;
	    if (config) {
	        if (typeof config.content == 'string' && config.content && config.source == 'html') {
	            document.getElementById('pmos-iframeWrapper').innerHTML = config.content;
	            document.getElementById('pmos-iframeWrapper').setAttribute('style', 'overflow: auto; max-width: '+config.width+'; max-height: '+config.height+'; width: '+config.width+'; height: '+h+'px;');
	            document.getElementById('embedIframe').setAttribute('style', 'padding: 0; margin: 0; border: 0;outline: 0;vertical-align: top;width: 100%; height: 100%;');
	        }
	    }
	    fadeIn('pmos-modalWrapper');
	    fadeIn('pmos-contentWrapper');
	    fadeIn('pmos-overlay');
	}

	function createMobileModal(config) {
	    document.getElementById('pmos-mobileUploadWrapper').innerHTML = config.content;
	    fadeIn('pmos-mobileUploadWrapper');
	}

	function removeMobile() {
		fadeOut('pmos-mobileUploadWrapper');
		document.getElementById('pmos-mobileUploadWrapper').innerHTML = '';
	    sendAnimationSignal();
	}

	function remove() {
		fadeOut('pmos-modalWrapper');
	    fadeOut('pmos-contentWrapper');
	    fadeOut('pmos-overlay');
		sendAnimationSignal();
		document.getElementById('pmos-iframeWrapper').innerHTML = '';
	}

	function sendAnimationSignal() {
		document.getElementById('pmFrame-'+mId+'-'+pId).contentWindow.postMessage('animationStart',"*");
	}

	function unLikePhoto(code, passedTotal) {
		document.getElementById('pmFrame-'+mId+'-'+pId).contentWindow.postMessage('likeDecPhoto|'+code+'|'+ passedTotal,"*");

		passedTotal--;
		var btn = document.querySelectorAll("."+code+"-swiper")[0];
		var count = document.querySelectorAll(".pmos-likeCounter-"+code)[0];
		var text = document.querySelectorAll(".pmos-likeText-"+code)[0];
		btn.innerHTML = '<div class="pmos-like" onClick="likePhoto(\''+code+'\', '+passedTotal+', 1); return false;"><img src="https://www.picturemosaics.com/photo-mosaic-tool/images/like_outline.svg" class="pmos-likeHeart" style="width: 25px;"/></div>';
		count.innerHTML = passedTotal;
		if(passedTotal == 1){
			text.innerHTML = ' '+likeText;
		} else {
			text.innerHTML = ' '+likeTextPlural;
		}
	}

	function openChatterAdd() {
		document.getElementById('pmos-chatterAddData').style.display = 'block';
	}

	function closeChatterAdd() {
		document.getElementById('pmos-chatterAddData').style.display = 'none';
	}

	function displayComments() {
		document.getElementById('swiperChatterData').style.display = 'block';
	}

	function undisplayComments() {
		document.getElementById('swiperChatterData').style.display = 'none';
	}

	function sendChatterMessage(code, oname) {
		var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		var chatName = document.getElementById('pmos-chatterItem1').value.trim();
		var chatEmail = document.getElementById('pmos-chatterItem2').value.trim();
		var chatCap = document.getElementById('pmos-chatterItem3').value.trim();
		if(chatName == '') {
			document.getElementById("pmos-chatterItem1").classList.add("pmos-chatterError");
			return;
		} else {
			document.getElementById("pmos-chatterItem1").classList.remove("pmos-chatterError");
		}
		if(!reg.test(chatEmail) || chatEmail == '') {
			document.getElementById("pmos-chatterItem2").classList.add("pmos-chatterError");
			return;
		} else {
			document.getElementById("pmos-chatterItem2").classList.remove("pmos-chatterError");
		}
		if(chatCap == '') {
			document.getElementById("pmos-chatterItem3").classList.add("pmos-chatterError");
			return;
		} else {
			document.getElementById("pmos-chatterItem3").classList.remove("pmos-chatterError");
		}
		var chatterData = JSON.stringify({'name' : chatName, 'oname' : oname, 'email' : chatEmail, 'chat' : chatCap});
		document.getElementById('pmFrame-'+mId+'-'+pId).contentWindow.postMessage('chatterAdd|'+code+'|'+chatterData,"*");

		document.getElementById('pmos-chatterItem1').value = '';
		document.getElementById('pmos-chatterItem2').value = '';
		document.getElementById('pmos-chatterItem3').value = '';

		var chatNameSplit = chatName.split(' ');
		if(typeof chatNameSplit[1] !== 'undefined' && chatNameSplit[1] != '') {
			chatName = chatNameSplit[0]+' '+chatNameSplit[1][0]+'.'; 
		} else {
			chatName = chatNameSplit[0];
		}
		var newChatHtml = '<div class="pmos-chatBlock"><div class="pmos-chatName">'+chatName+'</div><div class="pmos-chatCap">'+chatCap+'</div></div>';

		if((pmChatterCount + 1) == 1) {
			var txtUse = charText;
		} else {
			var txtUse = chatTextPlural;
		}
		document.getElementById('pmos-chatterCounter').innerHTML = (pmChatterCount + 1);
		document.getElementById('pmos-chatterText').innerHTML = txtUse;
		document.getElementById('pmos-mobileCommentSection').innerHTML = newChatHtml+document.getElementById('pmos-mobileCommentSection').innerHTML;
		closeChatterAdd();
	}

	function getChatterMessages(code) {
		document.getElementById('pmFrame-'+mId+'-'+pId).contentWindow.postMessage('chatterGet|'+code,"*");
	}

	function likePhoto(code, passedTotal) {
		document.getElementById('pmFrame-'+mId+'-'+pId).contentWindow.postMessage('likeIncPhoto|'+code+'|'+ passedTotal,"*");

		passedTotal++;
		var btn = document.querySelectorAll("."+code+"-swiper")[0];
		var count = document.querySelectorAll(".pmos-likeCounter-"+code)[0];
		var text = document.querySelectorAll(".pmos-likeText-"+code)[0];
		btn.innerHTML = '<div class="pmos-unLike" onClick="unLikePhoto(\''+code+'\', '+passedTotal+', 1); return false;"><img src="https://www.picturemosaics.com/photo-mosaic-tool/images/like_solid.svg" class="pmos-likeHeart" style="width: 25px;"/></div>'
		count.innerHTML = passedTotal;
		if(passedTotal == 1){
			text.innerHTML = ' '+likeText;
		} else {
			text.innerHTML = ' '+likeTextPlural;
		}
		
	}


	function openUploadFlow(){
		if(!pmIsDonation) {
			if(detectMobile()){
				if(mId == 'M2779793' && pId == 'p0'){
					createMobileModal({content:'<iframe id="mobileEmbedIframe" allowusermedia allow="camera;microphone" style="width:100%; height:100%; padding:0; margin:0; border:0;" src="https://arizonamosaic.com/index_sso.php"></iframe>'});
				}else{
					createMobileModal({content:'<iframe id="mobileEmbedIframe" allowusermedia allow="camera;microphone" style="width:100%; height:100%; padding:0; margin:0; border:0;" src="https://livemosaics.com/upload/upload/'+mId+'/'+pId+'"></iframe>'});
				}
		       
		       //window.top.location = 'https://livemosaics.com/upload/upload/'+mId+'/'+pId+'/?mobile=1';
			}else{
				if(mId == 'M2779793' && pId == 'p0'){
					createModal({
						width: '500px',
						height: '700px',	
						source:'html',
						content:'<iframe id="embedIframe" allowusermedia allow="camera;microphone" src="https://arizonamosaic.com/index_sso.php"></iframe>'});
				}else{
					createModal({
						width: '500px',
						height: '700px',	
						source:'html',
						content:'<iframe id="embedIframe" allowusermedia allow="camera;microphone" src="https://livemosaics.com/upload/upload/'+mId+'/'+pId+'"></iframe>'});
				}
		    	
			}
		} else {
			if(pMosPassEmail != '') {
				if(detectMobile()){
			       createMobileModal({
			       	content:'<iframe id="mobileEmbedIframe" allowusermedia allow="camera;microphone" style="width:100%; height:100%; padding:0; margin:0; border:0;" src="https://livemosaics.com/upload/upload/'+mId+'/'+pId+'"></iframe>'});
			       //window.top.location = 'https://livemosaics.com/upload/upload/'+mId+'/'+pId+'/?mobile=1';
			   }else{
			     createModal({
			     	width: '500px',
			     	height: '700px',	
			       	source:'html',
			       	content:'<iframe id="embedIframe" allowusermedia allow="camera;microphone" src="https://livemosaics.com/upload/upload/'+mId+'/'+pId+'"></iframe>'});
			   }
			} else {
				openDonationFlow();
			}
		}
	}

	function openDonationFlow(){
	   if(detectMobile()){
	       createMobileModal({
	       	content:'<iframe id="mobileEmbedIframe" allowusermedia allow="camera;microphone" style="width:100%; height:100%; padding:0; margin:0; border:0;" src="https://livemosaics.com/upload/donation/step1/'+mId+'/'+pId+'"></iframe>'});
	       //window.top.location = 'https://livemosaics.com/upload/upload/'+mId+'/'+pId+'/?mobile=1';
	   }else{
	     createModal({
	     	width: '495px',
	     	height: '484px',	
	       	source:'html',
	       	content:'<iframe id="embedIframe" allowusermedia allow="camera;microphone" src="https://livemosaics.com/upload/donation/step1/'+mId+'/'+pId+'"></iframe>'});
	   }
	}

	function removeDonationFlow() {
		if(detectMobile()){
			fadeOut('pmos-mobileUploadWrapper');
		} else {
			fadeOut('pmos-modalWrapper');
		}
	}

	function fromDonationPurchase(userInfo) {
		var userArray = JSON.parse(userInfo);
		pMosPassEmail = userArray.email;
		pMosPassFName = userArray.fname;
		pMosPassLName = userArray.lname;
		removeDonationFlow();
		openUploadFlow();
	}

	function sendUploadData() {
		if((typeof pMosPassFName !== 'undefined') && (typeof pMosPassLName !== 'undefined') && (typeof pMosPassEmail !== 'undefined')){		   
			var ssoInfo = JSON.stringify({'fname': pMosPassFName, 'lname' : pMosPassLName, 'email' : pMosPassEmail});
			if(detectMobile()){
				document.getElementById('mobileEmbedIframe').contentWindow.postMessage('ssoInfo-'+ssoInfo,"*");
			} else {
				document.getElementById('embedIframe').contentWindow.postMessage('ssoInfo-'+ssoInfo,"*");
			}
		}
	}

	function openWaldoFlow(data){
	   if(detectMobile()){
	       createMobileModal({
	       	content:'<iframe id="mobileEmbedIframe" allowusermedia allow="camera;microphone" style="width:100%; height:100%; padding:0; margin:0; border:0;" src="https://livemosaics.com/upload/waldo/'+data+'"></iframe>'});
	   }else{
	     createModal({
	     	width: '500px',
	     	height: '600px',	
	       	source:'html',
	       	content:'<iframe id="embedIframe" allowusermedia allow="camera;microphone" src="https://livemosaics.com/upload/waldo/'+data+'"></iframe>'});
	   }
	}

	function removeWaldo() {
		fadeOut('pmos-mobileUploadWrapper');
	}

	function detectMobile(){
	    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
	        return true;
	    }else{
	        return false;
	    }
	}

	function maxZIndex() {
	    var maxZ = 1;
	  	var allElems = document.querySelectorAll('body *');

	  	for(var i = 0; i < allElems.length; i++) {
	   		var st = parseFloat(window.getComputedStyle(allElems[i]).zIndex);
	   		if(!isNaN(st)) {
	   			if(st >= maxZ) {
	   				maxZ = st;
	   			}
	   		}
	   	} 
	   	return maxZ; 
	}

	function setCookie(cname, cvalue, exdays) {
	  const d = new Date();
	  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	  let expires = "expires="+d.toUTCString();
	  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
	  console.log(document.cookie);
	}

	function getCookie(cname) {
	  let name = cname + "=";
	  let ca = document.cookie.split(';');
	  for(let i = 0; i < ca.length; i++) {
	    let c = ca[i];
	    while (c.charAt(0) == ' ') {
	      c = c.substring(1);
	    }
	    if (c.indexOf(name) == 0) {
	      return c.substring(name.length, c.length);
	    }
	  }
	  return "";
	}

	function checkCookie() {
	  var pmAnimationSetting = getCookie("animationSetting");
	  if (pmAnimationSetting != "") {
	    document.getElementById('pmFrame-'+mId+'-'+pId).contentWindow.postMessage('animationSetting|'+pmAnimationSetting,"*");
	  } else {
	    setCookie("animationSetting", 1, 10);
	    document.getElementById('pmFrame-'+mId+'-'+pId).contentWindow.postMessage('animationSetting|1',"*");
	  }
	}

	(function() {
		init();
	})();