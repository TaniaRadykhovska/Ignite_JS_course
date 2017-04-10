window.onload = function () {
	var header = document.querySelector('header');

//заміна прозорого фону хедера на непрозорий при прокрутці більше, ніж його висота
	window.onscroll = function() {
		var posTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
		posTop > header.offsetHeight ? header.className = 'sticked' : header.className = '';
	};
	// плавна прокрутка до відповідного блока меню
	var pageNav = document.getElementById('pageNav');
	pageNav.onclick = function(event) {

		var posTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
		var href = event.target.getAttribute('href');
		var s = document.querySelector(href).offsetTop - header.offsetHeight;
		var step = Math.ceil((s - posTop) / 100);
		var condition = step > 0
			? function (position) { return position < s; }
			: function (position) { return position > s; };
		var t = setInterval(function(){
			if(condition(posTop)) {
				window.scroll(0, posTop += step);
			} else {
				clearInterval(t);
			}
		}, 5);
		event.preventDefault();
	};

	$( "#btn-nav" ).on('click', function() {
	  $( "#pageNav" ).slideToggle();
	});

	$('#goToContact').on('click', function() {
		$('#pageNav li a[href="#contact"]').click();
	});

	
	$( "#pageUp" ).on('click', function() {
		$('#pageNav li a[href="#top"]').click();
	});

	
// головний слайдер
	new Slider({
		block: $('#slider'),
		rotateDelay: 3000
	});

//слайдер з відгуками
	new Slider({
		block: $('#client-slider'),
		buttons: true
	});

	new Slider({
		block: $('#clients-slider'),
		items: 6,
		rotateDelay: 3000
	});

// збільшення в розмірі іконок при наведенні мишкою на них
	var icons = document.getElementsByClassName('icon-h');
	for (var i = 0; i < icons.length; i++) {
		icons[i].addEventListener('mouseover', function(event) {
			this.classList.add('active');
			event.stopPropagation();
		});
		icons[i].addEventListener('mouseout', function(event) {
			this.classList.remove('active');
			event.stopPropagation();
		});	
	}

// фільтр блоків по категоріям
	var filterElements = document.getElementsByClassName('work-example');
	var filterBtn = document.getElementsByClassName('filter-btn');

	for (var i = 0; i < filterBtn.length; i++) {
		filterBtn[i].addEventListener ('click', function() {
			for (var i = 0; i < filterBtn.length; i++) {
				filterBtn[i].classList.remove('selected');
			}
			this.classList.add('selected');
			var showBlocksAttr = this.dataset.category;
			for (var i = 0; i < filterElements.length; i++) {
				filterElements[i].style.display = (showBlocksAttr == 'all' || filterElements[i].classList.contains(showBlocksAttr)) ? 'block' : 'none';				
			}
		});
	}

// анімація прокрутки цифр до необхідних
	var number = document.getElementsByClassName('number');
	var numberPer = document.getElementsByClassName('number-per');

	$(window).scroll(function(){
		if ( $(window).scrollTop() >= $('#number-holder').offset().top) {
			for (var i = 0; i < number.length; i++) {
				runCounter(number[i].dataset.count, number[i], '');
			}
		}
	});

	$(window).scroll(function(){
		if ( $(window).scrollTop() >= $('#number-per-holder').offset().top) {
			for (var i = 0; i < numberPer.length; i++) {
				runCounter(numberPer[i].dataset.count, numberPer[i], ' %');
			}
		}
	});


// профіль співробітника
	var member = document.querySelectorAll('.member-team');
	var aboutScills = document.querySelectorAll('.about-scills');
	for (var i = 0; i < member.length; i++) {
		member[i].addEventListener('click', function(e) {
			var id = this.dataset.member;
			for (var i = 0; i < member.length; i++) {
				member[i].classList.remove('active');
			}
			this.classList.add('active');
			for (var i = 0; i < aboutScills.length; i++) {
				aboutScills[i].classList.remove('active');
			}
			document.getElementById(id).classList.add('active');
			for (var i = 0; i < numberPer.length; i++) {
				numberPer[i].innerText = '0 %';
				runCounter(numberPer[i].dataset.count, numberPer[i], ' %');
			}

			window.scrollBy(0, 500);
		});
	}

//валідація форми
	var valid = {
		name: /^[a-z]*$/i,
		email: /^[a-z0-9_\.@]*$/i,
		subject: /^[a-z0-9]*$/i
	}
	var elValidated = document.querySelectorAll('.validate .form-el');
	for (var i = 0; i < elValidated.length; i++) {
		elValidated[i].addEventListener('keyup', function(e) {
			var attr = this.getAttribute('name');
			if (!valid[attr].test(this.value)) {
				this.style.borderColor = '#f36464';
				this.classList.add('active');
			} else {
				this.style.borderColor = '#fff';
				this.classList.remove('active');
			}
		})
	}
	document.querySelector('.validate .btn').onclick = function (e) {
		for (var i = 0; i < elValidated.length; i++) {
			if (!elValidated[i].value) {
				for (var i = 0; i < elValidated.length; i++) {
					elValidated[i].style.borderColor = '#f36464';		
				}
				return false;
			}
		}
	}

}


// функція прокрутки цифр до необхідних
function runCounter(count, element, text) {
	if (element.innerText != '0' + text) {
		return;
	}
	var counter = 0;
	var step = Math.ceil(count / 400);
	var timeInterval = setInterval(function() {
		element.innerText = counter + text || counter;
		if (counter == count) {
			clearInterval(timeInterval);
		} else if (counter > count) {
			element.innerText = count;
			clearInterval(timeInterval);
		}
		counter += step;
	}, 5);
}

function Slider(options) {
	var defaultOptions = {
		block: null,
		activeClass: 'active',
		rotateDelay: 0,
		items: 1,
		buttons: false
	};
	$.extend(this, defaultOptions, options);
	this.slides = this.block.find('.slider-item');
	this.active = this.block.find('.' + this.activeClass).first().index();

	this.autoRotate = this.rotateDelay > 0;
	this.rotate = this.autoRotate;
	this.rotateTimeout = null;

	this.show = function (index) {
		this.slides.removeClass(this.activeClass);
		for (var i = 0; i < this.items; i++) {			
			this.slides.eq(index + i).addClass(this.activeClass);
		}
	};
	this.prev = function () {
		this.active--;
		if (this.active < 0) {
			this.active = this.slides.length - this.items;
		}
		this.show(this.active);
	};
	this.next = function () {
		this.active++;
		if (this.active > this.slides.length - this.items) {
			this.active = 0;
		}
		this.show(this.active);
	};
	this.disableAutoRotate = function () {
		if (!this.autoRotate) {
			return;
		}
		this.rotate = false;
		if (this.rotateTimeout != null) {
			clearTimeout(this.rotateTimeout);
		}
		var enableRotate = function () {
			this.rotate = true;
			clearTimeout(this.rotateTimeout);
		};
		this.rotateTimeout = setTimeout(
			enableRotate.bind(this),
			5000
		);
	};
	this.rotateSlide = function () {
		if (this.rotate) {
			this.next();
		}
	};

	var showPrev = function () {
		this.disableAutoRotate();
		this.prev();
	};
	var showNext = function () {
		this.disableAutoRotate();
		this.next();
	};
	this.block.on('click', '.control-prev', showPrev.bind(this));
	this.block.on('click', '.control-next', showNext.bind(this));

	if (this.buttons) {
		var buttonsHolder = '<ul class="controls"></ul>';
		this.block.append(buttonsHolder);
		var index = 0;
		
		for (var i = 0; i < this.slides.length; i++) {
			index = i;
			var li = '<li><a data-index="' + index + '"></a></li>';
			$('.controls').append(li);
		}

		var showSlide = this.show.bind(this);
		this.block.on('click', '.controls li a', function () {
			showSlide($(this).data('index'));
		});
	}

	if (this.autoRotate) {
		setInterval(
			this.rotateSlide.bind(this),
			this.rotateDelay
		);
	}
}
