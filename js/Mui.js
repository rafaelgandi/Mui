/* 
	Mui - My/Mobile UI
		- This is my personal mobile ui framework template. Very basic!
		- This is primarily built for my Android 2.3.6 LG Optimus E400 L3 phone.
		- Dependent on Zepto.js
	LM: 12-06-12	
 */
Zepto(function () {
	window.Mui = (function (self, document, z, undefined) {
		var $root = z(document),
			$muipages = z('section.mui_page'),
			$muiHeader = z('#mui_header'),
			$muiHeaderH1 = $muiHeader.find('h1'),
			$muiHeaderButtonCon = z('#mui_header_side_button_con'),
			t = z.trim,
			pageIndexArr = [],
			pageScrollPosition = [],
			headerMarkup = {};
			
		var initActivePage = function () {
			// Make sure to always have an active page on load.
			if (! $muipages.filter('section.mui_active_page').length) {
				$muipages.eq(0).addClass('mui_active_page');
			}
			$muipages.filter('section.mui_active_page').css('left', '0px').show();
		};		
		var makePageIndexArr = function () {
			var i = 0;
			$muipages.each(function () {
				var $me = z(this);
				$me.attr('data-mui-index',i);
				pageScrollPosition[this.id] = 0;
				pageIndexArr[i] = this;
				i++;
			});
		};
		var getPagesGreaterThanIndex = (function () {
			var cache = {};
			return function (_index) {
				if (!! cache[_index]) {
					return cache[_index];
				}
				var key = _index,
					i = ++_index,
					collection = [];
				while (pageIndexArr[i] !== undefined) {
					collection.push(pageIndexArr[i]);
					i++;
				}
				cache[key] = z(collection);
				return cache[key];
			};
		})();
		
		var resolvePageMinHeight = function () {
			//$muipages.css('minHeight', z(window).height()+'px');
			//$muipages.css('minHeight', (self.screen.height+10)+'px');
			//alert(z(window).height() + ' ==== '+ self.screen.height);
		};
		
		var initEvents = function () {
			var Events = {
				rememberScrollPosition: function (e, _$page) {
					pageScrollPosition[_$page[0].id] = self.scrollY;
					self.scrollTo(0, 0);	
				}
			};			
			$root.on('mui_beforepagechange', Events.rememberScrollPosition);
		};
		
		var Mui = {
			$CURRENT_PAGE: $muipages.filter('section.mui_active_page'),
			$ROOT: $root,
			
			getPageScrollPosition: function (_page) {
				var p = _page || false;
				if (!! p) {
					return pageScrollPosition[p];
				}
				return 0;
			},
			
			buildHeaderMarkupForPageId: function (_pageId) {
				$muiHeader.show();				
				if (headerMarkup[_pageId] !== undefined) {
					$muiHeaderH1.html(headerMarkup[_pageId].label);
					$muiHeaderButtonCon.html(headerMarkup[_pageId].buttons);
					return Mui;
				}
				// This code runs when a page is fullscreen (does not have a header) //
				z('#'+_pageId).css('top', '0px');
				$muiHeader.hide();
				return Mui;
			},
			
			gotoPage: (function () {
				var cache = {};
				return function (_page, _data) {
					var pageId = t(_page).replace(/#/ig, ''),				
						// Get the page to show.
						$page = (cache[pageId] !== undefined) 
										? cache[pageId] // Use cache copy if available.
										: (function () {
											cache[pageId] = z('#'+pageId);
											return cache[pageId]; // Save a cache copy
										})(),							
						// The data-mui-index value of the previous page.	
						prevPageIndex = parseInt(Mui.$CURRENT_PAGE.attr('data-mui-index'),10),						
						// The data-mui-index value of the new page to show.
						newPageIndex = parseInt($page.attr('data-mui-index'),10),						
						// Get all the other pages except the new page to show.
						$otherPages = $muipages.not($page),					
						// Used as a flag to make sure the onComplete() function only 
						// runs once every function call to Mui.gotoPage().
						ran = false; 
					_data = _data || false;
					$page.data('sent', '');
					if (!! _data) { $page.data('sent', _data); }				
					$page.show();
					$muipages.removeClass('mui_active_page');
					
					var onComplete = function () {
						// Make sure to run only once every Mui.gotoPage() call.				
						if (ran) { return; } ran=true;						
						$page.addClass('mui_active_page').show();														
						$root.trigger('mui_afterpagechange', [$page]);
						$otherPages.hide();						
					};					
					// The code below controls the page slide left/right functionality //	
					if (prevPageIndex <= newPageIndex) {					
						$page.animate({						
							'left':'0px'
						}, {
							complete: onComplete,
							duration: 300
							// Removed easing here because it tends to bogdown the  animation
							// on android 4.0.4... wierdness
							// easing: 'ease'
							// LM: 12-04-12	
						}); // right to left					
						
					}
					else {	
						$page.css('left', '0px');
						getPagesGreaterThanIndex(newPageIndex).animate({							
							// If you change this you also need to change the 
							// .mui_page selector in the Mui.css file.
							'left':'800px' 
						}, {complete: onComplete}); // left to right											
					}
					Mui.buildHeaderMarkupForPageId(pageId);
					$root.trigger('mui_beforepagechange', [Mui.$CURRENT_PAGE]);	
					Mui.$CURRENT_PAGE = $page;
					$root.trigger('mui_pagechange', [$page, _data]);
					$root.trigger(pageId, [$page, _data]);
				};
			})(),
			
			setHeaderMarkup: function (_data) {
				headerMarkup = _data;
				return Mui;
			}
		};
		
		// Call all the inital function for Mui here //
		(function _initialize() {
			makePageIndexArr();
			initActivePage();
			resolvePageMinHeight();
			initEvents();
		})();
		
		return Mui;
		
	})(window, document, Zepto);
});
