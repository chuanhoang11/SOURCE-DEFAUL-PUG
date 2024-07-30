AOS.init({
    startEvent: 'DOMContentLoaded',
    offset: 0,
    duration: 1200,
    delay: '200',
    easing: 'ease',
    once: true,
    mirror: true,
    disable: function () {
        return $(window).width() <= 768;
    },
});

$('.gallery').each(function () {
    const $this = $(this);
    const $item = $this.find('.gItem');
    $(function () {
        $this.lightGallery({
            selector: $item,
            thumbnail: true,
            zoom: true,
        });
    });
});


function functionSlider(element, customizeOption, typePagi) {
    const swiperSlider = document.querySelectorAll(element);
    if (swiperSlider) {
        swiperSlider.forEach((item) => {
            const swiper = item.querySelector(".swiper");
            const pagi = item.querySelector(".swiper-pagination");
            const next = item.querySelector(".swiper-next");
            const prev = item.querySelector(".swiper-prev");
            if (!typePagi) {
                typePagi = "bullets";
            }
            var nameSlide = new Swiper(swiper, {
                watchSlidesProgress: true,
                pagination: {
                    el: pagi,
                    type: typePagi,
                    clickable: true,
                },
                navigation: {
                    nextEl: next,
                    prevEl: prev,
                },
                fadeEffect: {
                    crossFade: true,
                },
                ...customizeOption,
            });
        });
    }
}
function logMess(mess) {
    console.log(mess)
}

window.logMess = logMess;
window.functionSlider = functionSlider;
