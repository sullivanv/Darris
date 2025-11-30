(function () {
	const initSlider = () => {
		const sliders = document.querySelectorAll(".product-card-js");
		const dir = document.querySelector('html').getAttribute("dir");

		let nextEl = ".product-button-group .swiper-button-next";
		let prevEl = ".product-button-group .swiper-button-prev";
		if (dir === 'rtl') {
			[nextEl, prevEl] = [prevEl, nextEl];
		}
		sliders.forEach((slider, index) => {
			const productSlider = new Swiper(slider, {
				pagination: {
					el: ".product-pagination .swiper-pagination",
					clickable: true,
				},
				navigation: {
					nextEl: nextEl,
					prevEl: prevEl,
				},
				allowTouchMove: true,
				990: {
					allowTouchMove: false,
				},
			});
		});
	};

	initSlider();

	document.addEventListener("shopify:section:load", function () {
		initSlider();
	});
})();
