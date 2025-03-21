window.onload = function () {

    const burger = document.querySelector('.burger');
    const navlinks = document.querySelector('.navlinks')
    burger.onclick = ()=> {
        burger.classList.toggle('opened');
        navlinks.classList.toggle('opened');
    }
    navlinks.querySelectorAll('a').forEach(link => {
        link.onclick = () => {
            if (navlinks.classList.contains('opened')) {
                navlinks.classList.toggle('opened');
            }
        };
    });
    window.onscroll = () => {}

}
