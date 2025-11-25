(function () {
	const initProductAccordion = () => {
		$(".about__accordion-toggle").click(function () {
			if (!$(this).hasClass("active")) {
				$(this).addClass("active");
				$(this)
					.siblings(".about__accordion-description")
					.eq($(this).index())
					.stop()
					.slideDown(300);
			} else {
				$(this).removeClass("active");
				$(this).siblings(".about__accordion-description").stop().slideUp(300);
			}
		});
	};

	// Mobile slider for static_multicolumns_aside
	let mobileSliderInstance = null;
	const MOBILE_BREAKPOINT = 750;

	const initMobileSlider = () => {
		const productOuter = document.querySelector('.product__outer--static-multicolumns-aside');
		if (!productOuter) return;

		const mediaList = productOuter.querySelector('.product__media-list');
		if (!mediaList) return;

		const isMobile = window.innerWidth < MOBILE_BREAKPOINT;

		if (isMobile && !mobileSliderInstance) {
			// Initialize mobile slider
			setupMobileSlider(mediaList);
		} else if (!isMobile && mobileSliderInstance) {
			// Destroy mobile slider on desktop
			destroyMobileSlider(mediaList);
		}
	};

	const setupMobileSlider = (mediaList) => {
		// Get all media items
		const mediaItems = mediaList.querySelectorAll('.product__media-item');
		if (mediaItems.length < 2) return;

		// Create swiper-wrapper and wrap items
		const wrapper = document.createElement('div');
		wrapper.className = 'swiper-wrapper';
		
		// Move all media items into wrapper
		mediaItems.forEach(item => {
			wrapper.appendChild(item);
		});
		
		mediaList.appendChild(wrapper);
		
		// Create pagination
		const pagination = document.createElement('div');
		pagination.className = 'product__mobile-pagination swiper-pagination';
		mediaList.appendChild(pagination);
		
		// Add swiper class
		mediaList.classList.add('swiper', 'swiper-mobile-initialized');
		
		// Initialize Swiper
		mobileSliderInstance = new Swiper(mediaList, {
			slidesPerView: 1,
			spaceBetween: 0,
			loop: false,
			pagination: {
				el: pagination,
				clickable: true,
			},
		});
	};

	const destroyMobileSlider = (mediaList) => {
		if (mobileSliderInstance) {
			mobileSliderInstance.destroy(true, true);
			mobileSliderInstance = null;
		}

		// Remove pagination
		const pagination = mediaList.querySelector('.product__mobile-pagination');
		if (pagination) {
			pagination.remove();
		}

		// Unwrap items from swiper-wrapper
		const wrapper = mediaList.querySelector('.swiper-wrapper');
		if (wrapper) {
			const items = wrapper.querySelectorAll('.product__media-item');
			items.forEach(item => {
				mediaList.appendChild(item);
			});
			wrapper.remove();
		}

		// Remove swiper classes
		mediaList.classList.remove('swiper', 'swiper-mobile-initialized');
	};

	// Debounce function for resize
	const debounce = (func, wait) => {
		let timeout;
		return function executedFunction(...args) {
			const later = () => {
				clearTimeout(timeout);
				func(...args);
			};
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
		};
	};

	// Handle resize
	const handleResize = debounce(() => {
		initMobileSlider();
	}, 150);

	const initZoomImage = () => {
		const imagesWrapper = document.querySelector(
			".product-media-modal__content"
		);
		const images = imagesWrapper.querySelectorAll(".js-image-zoom");

		images.forEach((el) => {
			el.addEventListener("click", (e) => {
				imagesWrapper.classList.toggle("zoom");
			});
		});
	};



	const revealPopup = () => {
		const stickyBar = document.querySelector('.product__popup'); // Sticky bar
		const secondSection = document.querySelector('.product-section + section'); // Second section
		const footer = document.querySelector('footer'); // Footer

		// Check if the required elements exist
		if (!stickyBar || !secondSection || !footer) {
				console.error('Required elements not found!');
				return;
		}

			const getOffset = (element) => {
				const rect = element.getBoundingClientRect();
				return rect.top + window.scrollY;
			};

			const secondSectionMid = getOffset(secondSection);
			const footerTop = getOffset(footer);

			const handleScroll = () => {
				const scrollPosition = window.scrollY + window.innerHeight;
				const activeOffset = window.scrollY > secondSectionMid && scrollPosition < footerTop;

				stickyBar.classList[activeOffset ? "add" : "remove"]('active');
			};

			// Initial check in case the user starts in the middle of the page
			handleScroll();
};

	document.addEventListener('scroll', () => revealPopup());

	// Resize listener for mobile slider
	window.addEventListener('resize', handleResize);

	document.addEventListener("shopify:section:load", function () {
		initProductAccordion();
		initZoomImage();
		revealPopup();
		initMobileSlider();
	});

	initProductAccordion();
	initZoomImage();
	revealPopup();
	initMobileSlider();
})();

class FloatedForm extends HTMLElement {
	constructor() {
		super();
		this.renderForm();
	}

	renderForm() {
		fetch(this.getAttribute("data-product-url"))
			.then((response) => response.text())
			.then((responseText) => {
				const responseHTML = new DOMParser().parseFromString(
					responseText,
					"text/html"
				);
				this.productElement = responseHTML.querySelector(
					'div[id^="ProductInfo-"]'
				);

				this.preventDuplicatedIDs();
				this.removeDOMElements();
				this.setInnerHTML(this, this.productElement.innerHTML);

				if (window.Shopify && Shopify.PaymentButton) {
					Shopify.PaymentButton.init();
				}

				if (window.ProductModel) window.ProductModel.loadShopifyXR();

				this.showMoreFields();
			})
			.finally(() => {
				const selectDropDown = () => {
					$(".product__popup .product-form__controls--dropdown").each(function () {
						const elListItem = $(this).find(".dropdown-select ul li");
						const elItem = $(this).find(".dropdown-select ul");
						const selectedText = $(this).find(
							".dropdown-select .select-label"
						);

						selectedText.on("click", function (e) {
							elItem.toggleClass("active");
							if (elItem.hasClass("active")) {
								e.stopPropagation();
								$(document).click(function () {
									elItem.removeClass("active");
								});
							}
						});

						elListItem.on("click", function () {
							selectedText
								.find("span")
								.text($(this).text())
								.attr("title", $(this).text());
							elItem.removeClass("active");
							document.activeElement.blur();
						});
					});
				};

				selectDropDown();
			});
	}

	setInnerHTML(element, html) {
		element.innerHTML = html;

		// Reinjects the script tags to allow execution. By default, scripts are disabled when using element.innerHTML.
		element.querySelectorAll("script").forEach((oldScriptTag) => {
			const newScriptTag = document.createElement("script");
			Array.from(oldScriptTag.attributes).forEach((attribute) => {
				newScriptTag.setAttribute(attribute.name, attribute.value);
			});
			newScriptTag.appendChild(document.createTextNode(oldScriptTag.innerHTML));
			oldScriptTag.parentNode.replaceChild(newScriptTag, oldScriptTag);
		});
	}

	preventDuplicatedIDs() {
		const sectionId = this.productElement.dataset.section;
		this.productElement.innerHTML = this.productElement.innerHTML.replaceAll(
			sectionId,
			`floated-${sectionId}`
		);

		if (this.productElement.querySelectorAll("variant-selects")) {
			this.productElement
				.querySelectorAll("variant-selects")
				.forEach((radio) => {
					radio.dataset.originalSection = sectionId;
				});
		}

		if (this.productElement.querySelectorAll("variant-radios")) {
			this.productElement
				.querySelectorAll("variant-radios")
				.forEach((radio) => {
					radio.dataset.originalSection = sectionId;
				});
		}
	}

	removeDOMElements() {
		const text = this.productElement.querySelector(".product__text");
		if (text) text.remove();

		const tags = this.productElement.querySelector(".product__tags");
		if (tags) tags.remove();

    const title = this.productElement.querySelector(".product__title__wrapper");
		if (title) title.remove();

		const badges = this.productElement.querySelector(".product__custom-badges");
		if (badges) badges.remove();

    const price = this.productElement.querySelector(".price-wrapper");
		if (price) price.remove();

		const description = this.productElement.querySelector(
			".product__description"
		);
		if (description) description.remove();

		const sku = this.productElement.querySelector(".product__sku");
		if (sku) sku.remove();

		const inventory = this.productElement.querySelector(".product__inventory");
		if (inventory) inventory.remove();

		const pickupAvailability = this.productElement.querySelector(
			"pickup-availability"
		);
		if (pickupAvailability) pickupAvailability.remove();

		const customLiquid = this.productElement.querySelector(".custom-liquid");
		if (customLiquid) customLiquid.remove();

		const complementary = this.productElement.querySelector(
			"product-recommendations"
		);
		if (complementary) complementary.remove();

		const shareButtons = this.productElement.querySelector(".share-buttons");
		if (shareButtons) shareButtons.remove();

		const productModal = this.productElement.querySelectorAll(".product-popup");
		productModal.forEach((advantage) => {
			advantage.remove();
		});

		const productForm = this.productElement.querySelector("floated-form");
		if (productForm) productForm.remove();
	}

	showMoreFields() {
		$(".js-show-more").click(function (e) {
			e.preventDefault();
			$(this).siblings("input").removeClass("hidden");
			$(this).siblings("label").removeClass("hidden");
			$(this).remove();
		});
	}
}

customElements.define("floated-form", FloatedForm);
