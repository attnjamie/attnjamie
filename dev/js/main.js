'use strict';

(function() {
	$(document).on('ready', function() {
		// copyright content
		var favoriteThings = [
			"cold brew coffee",
			"Cowgirl Creamery cheese",
			"strawberries",
			"Blue Bottle coffee",
			"Choco Tacos",
			"grilled pork belly",
			"coconut water",
			"peanut butter",
			"green tea ice cream",
			"empanadas",
			"tacos <i>al pastor</i>",
			"burrata",
			"waffle fries",
			"stouts",
			"porters",
			"grapefruit juice",
			"matcha",
			"dismantling the patriarchy",
			"challenging heteronormativity"
		];

		// do the Knuth shuffle
		function shuffle(array) {
		  var currentIndex = array.length, temporaryValue, randomIndex ;
		  while (0 !== currentIndex) {
		    randomIndex = Math.floor(Math.random() * currentIndex);
		    currentIndex -= 1;
		    temporaryValue = array[currentIndex];
		    array[currentIndex] = array[randomIndex];
		    array[randomIndex] = temporaryValue;
		  }

		  return array;
		}

		var insertCopyright = function(targetEl) {
			shuffle(favoriteThings);
			var baseStr = "© " + new Date().getFullYear() + " | Powered mainly by " + favoriteThings[0] + " and " + favoriteThings[1] + ".";

			$(targetEl).html(baseStr);
		}($('#copyright'));
		// do nav bar stuff
		var toggleCurrentClass = function(li) {
			var targetDot = $(li).find('.nav__dot');
			var targetAnchor = $(li).find('.nav__anchor');
			$('.nav__dot').removeClass('nav__dot--current');
			$('.nav__anchor').removeClass('nav__anchor--current');
			$('.nav__list-item').find('a').blur();
			$(targetDot).addClass('nav__dot--current');
			$(targetAnchor).addClass('nav__anchor--current');
		};

		var offsets = [],
			mobileAgent = false;

		$(window).on('resize load', function() {
			offsets = [];

			$('.section__content').each(function() {
				offsets.push($(this).offset().top - $('nav').height() * 2);
			});

			$('.nav__list-item').on('click', function(e) {
				e.preventDefault();
				var href = $(this).find('a').attr('href');
			    $('html, body')
			    	.animate({
			       scrollTop: $(href).offset().top - $('nav').height()
			    	}, 500);

			    return false;
			});

			offsets.push($(document).height());

			// mobile stuff
			if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
				mobileAgent = true;
			}
			if (mobileAgent || $(window).width() < 640) {
				$('video').remove();
			}
			else {
				if ($('video').length) {
					$('video').attr('autoplay', true);
				}
			}
		})



		$(window).on('load scroll', function() {
			var windowPos = $(this).scrollTop(),
				heroHeight = $('.hero__video').height() - 100,
				$heroText   = $('.hero__content'),
				$navBar		 = $('nav');

			if (windowPos > heroHeight) {
				$navBar.addClass('nav--even');
			}
			else {
				$navBar.removeClass('nav--even');
			}

			for (var i = 0; i < offsets.length; i++) {
				if (windowPos > offsets[i] && windowPos < offsets[i+1]) {
					toggleCurrentClass($('.nav__list-item')[i]);
				}
				if (windowPos + $(window).height() === offsets[offsets.length]) {
		       		toggleCurrentClass($('.nav__list-item')[offsets.length-2]);
		       	}
			}

			if ($(window).width() < 640) {
				if ($navBar.offset().top > $heroText.offset().top - $navBar.height()*2) {
					$heroText.fadeOut();
				}
				if (windowPos === 0) {
					$heroText.fadeIn();
				}
			}
		});

		var $oakUnderline = $('.about__oakland__underline');
		var calculateUnderlinePosition = function(letterIndex) {
			var roughPercentage = (letterIndex / 7) * 100;
			if (letterIndex === 6) {
				roughPercentage = 100;
			}
			return Math.ceil(roughPercentage) + "%";
		}

		$('.about__oakland__letter').hover(
			function() {
				var currentLetter = $(this);
				var currentLetterIdx = $('.about__oakland__letter').index(this);

				$('.about__oakland__letter').not(currentLetter).addClass('about__oakland__letter--invert');
				$(this).addClass('about__oakland__letter--focus');
				var underlinePosition = calculateUnderlinePosition(currentLetterIdx);
				$('.about__oakland__underline').css('left', underlinePosition);
				// var org = $(this).find('.about__oakland__org');
				// org.css('opacity', 1);
			},
			function() {
				$('.about__oakland__letter').removeClass('about__oakland__letter--invert')
				$(this).removeClass('about__oakland__letter--focus')
				// var org = $(this).find('.about__oakland__org');
				// org.css('opacity', 0);
			}
		);
	});

})();
