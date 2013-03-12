/* 
	Mui - My/Mobile UI
		- This is my personal mobile ui framework template. Very basic!
		- This is primarily built for my Android 2.3.6 LG Optimus E400 L3 phone.
		- Dependent on Zepto.js
	LM: 03-12-13	
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
			$muipages.filter('section.mui_active_page').show();
		};				
		
		var resolvePageMinHeight = function () {
			$muipages.css('minHeight', z(window).height()+'px');
			//$muipages.css('minHeight', (self.screen.height+10)+'px');
			//alert(z(window).height() + ' ==== '+ self.screen.height);
		};
		
		var getPageScrollPosition = function (_page) {
			var p = _page || false;
			if (!! p) {
				return (!! pageScrollPosition[p]) ? pageScrollPosition[p] : 0;
			}
			return 0;
		};
		
		var initEvents = function () {
			var Events = {
				rememberScrollPosition: function (e, _$page) {
					pageScrollPosition[_$page[0].id] = self.scrollY;
					//self.scrollTo(0, 0);	
				},
				setScrollPosition: function (e, _$page) {
					self.scrollTo(0, getPageScrollPosition(_$page[0].id));	
				}
			};			
			$root.on('mui_beforepagechange', Events.rememberScrollPosition);
			$root.on('mui_afterpagechange', Events.setScrollPosition);
		};
		
		var Mui = {
			$CURRENT_PAGE: $muipages.filter('section.mui_active_page'),
			$ROOT: $root,
			getPageScrollPosition: getPageScrollPosition,
			
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
						// Get all the other pages except the new page to show.
						$otherPages = $muipages.not($page); 
					_data = _data || false;
					$page.data('sent', '');
					if (!! _data) { $page.data('sent', _data); }					
					$root.trigger('mui_beforepagechange', [Mui.$CURRENT_PAGE]);	
					
					$page.addClass('mui_active_page').show();	
					
					Mui.buildHeaderMarkupForPageId(pageId);
					$otherPages.removeClass('mui_active_page').hide();	
					
					Mui.$CURRENT_PAGE = $page;
					$root.trigger('mui_pagechange', [$page, _data]);
					$root.trigger(pageId, [$page, _data]);
					$root.trigger('mui_afterpagechange', [$page]);					
				};
			})(),
			
			setHeaderMarkup: function (_data) {
				headerMarkup = _data;
				return Mui;
			}
		};
		
		// Call all the inital function for Mui here //
		(function _initialize() {
			initActivePage();
			resolvePageMinHeight();
			initEvents();
		})();
		
		return Mui;
		
	})(window, document, Zepto);
});
