export default function SideModule() {
    const sideOpen = document.querySelector('.side-open')
    const sideClose = document.querySelector('.side-close')
    const sideFixed = document.querySelector('.side-fixed')
    const sideOverlay = document.querySelector('.side-overlay')
    const body = document.getElementsByTagName("body")[0];

    function Open() {
        sideFixed.classList.add('open')
        sideOverlay.classList.add('open')
        sideOpen.classList.add('close')
        body.style.overflowY = "hidden"
    }

    function Close() {
        sideFixed.classList.remove('open')
        sideOverlay.classList.remove('open')
        sideOpen.classList.remove('close')
        body.style.overflowY = "auto"
    }
    if (sideOpen) {
        sideOpen.addEventListener('click', () => {
            Open();
        })
    }
    if (sideClose) {
        sideClose.addEventListener('click', () => {
            Close();
        })
    }
    if (sideOverlay) {
        sideOverlay.addEventListener('click', () => {
            Close();
        })
    }
}