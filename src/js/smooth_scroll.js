export function smoothScroll() {
    const cardsPerPage = 40;
    let cardsTotal = document.querySelectorAll('div.gallery-wrap').length;

    if ( cardsTotal > cardsPerPage) {
        const { height: cardHeight } = document.querySelector('.gallery')
            .firstElementChild
            .getBoundingClientRect();
        
        window.scrollBy({
            top: cardHeight * 2,
            behavior: 'smooth',
        });
    }
}
 