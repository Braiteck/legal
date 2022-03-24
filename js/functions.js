$(() => {
	// Есть ли поддержка тач событий или это apple устройство
	if (!is_touch_device() || !/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)) $('html').addClass('custom_scroll')


	// Ленивая загрузка
	setTimeout(() => {
		observer = lozad('.lozad', {
			rootMargin: '200px 0px',
			threshold: 0,
			loaded: el => el.classList.add('loaded')
		})

		observer.observe()
	}, 200)


	// Установка ширины стандартного скроллбара
	$(':root').css('--scroll_width', widthScroll() + 'px')


	// Аккордион
	$('body').on('click', '.accordion .accordion_item .head', function (e) {
		e.preventDefault()

		const $item = $(this).closest('.accordion_item'),
			$accordion = $(this).closest('.accordion')

		if ($item.hasClass('active')) {
			$item.removeClass('active').find('.data').slideUp(300)
		} else {
			$accordion.find('.accordion_item').removeClass('active')
			$accordion.find('.data').slideUp(300)

			$item.addClass('active').find('.data').slideDown(300)
		}
	})


	// Моб. версия
	fiestResize = false

	if ($(window).width() < 375) {
		$('meta[name=viewport]').attr('content', 'width=375, user-scalable=no')

		fiestResize = true
	}


	if (is_touch_device()) {
		if ($(window).width() > 1023) {
			// Подменю на тач скрине
			$('header .menu .item > a.sub_link').addClass('touch_link')

			$('header .menu .item > a.sub_link').click(function (e) {
				const $dropdown = $(this).next()

				if ($dropdown.css('visibility') === 'hidden') {
					e.preventDefault()

					$('header .menu .sub_menu').removeClass('show')
					$dropdown.addClass('show')

					$('body').css('cursor', 'pointer')
				}
			})

			// Закрываем под. меню при клике за её пределами
			$(document).click((e) => {
				if ($(e.target).closest('.menu').length === 0) {
					$('header .menu .sub_menu').removeClass('show')

					$('body').css('cursor', 'default')
				}
			})
		} else {
			$('header .menu .item > a.sub_link').click(function (e) {
				e.preventDefault()

				let parent = $(this).closest('.item')

				$('header .menu .item').hide()
				parent.addClass('show')
			})

			$('header .menu .sub_menu .back_btn').click(function (e) {
				e.preventDefault()

				let parent = $(this).closest('.item')

				$('header .menu .item').show()
				parent.removeClass('show')
			})
		}


		// Закрытие моб. меню свайпом справо на лево
		let ts

		$('body').on('touchstart', (e) => { ts = e.originalEvent.touches[0].clientX })

		$('body').on('touchend', (e) => {
			let te = e.originalEvent.changedTouches[0].clientX

			if ($('body').hasClass('menu_open') && ts > te + 50) {
				// Свайп справо на лево
				$('header .mob_menu_btn').toggleClass('active')
				$('body').toggleClass('menu_open')
				$('header .menu').toggleClass('show')
			} else if (ts < te - 50) {
				// Свайп слева на право
			}
		})
	}
})



// Вспомогательные функции
const setHeight = (className) => {
	let maxheight = 0

	className.each(function () {
		const elHeight = $(this).outerHeight()

		if (elHeight > maxheight) maxheight = elHeight
	})

	className.outerHeight(maxheight)
}


const is_touch_device = () => !!('ontouchstart' in window)


const widthScroll = () => {
	let div = document.createElement('div')

	div.style.overflowY = 'scroll'
	div.style.width = '50px'
	div.style.height = '50px'
	div.style.visibility = 'hidden'

	document.body.appendChild(div)

	let scrollWidth = div.offsetWidth - div.clientWidth
	document.body.removeChild(div)

	return scrollWidth
}