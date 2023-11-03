export default function AosModule() {
    AOS.init({
        startEvent: 'DOMContentLoaded',
        offset: 0,
        duration: 1200,
        delay: '200',
        easing: 'ease',
        once: true,
        mirror: true,
        disable: function() {
            return $(window).width() <= 768;
        },
    });
}