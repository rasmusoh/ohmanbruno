const NO_PAGES = 104;
const PAGES_PER_PAGE = 10;
const COMIC_BASE_URL = '/i-faxens-tidsalder.html';
const CONTENT_BASE_URL =
    'https://s3.eu-central-1.amazonaws.com/i-faxens-tidsalder/sidor';

function load() {
    const pages = getPagesFromUrl();
    const fromPage = pages[0];
    const toPage = pages[1];

    var contentHtml = '';
    for (var i = fromPage; i < toPage; i++) {
        const pageNumberThreeDigits = ('00' + i).slice(-3);
        const pageUrl =
            CONTENT_BASE_URL + '/sida-' + pageNumberThreeDigits + '.png';

        contentHtml +=
            '<img src="' +
            pageUrl +
            '" alt="I faxens tidsålder sida ' +
            i +
            '"/>';
    }

    const contentDiv = document.getElementById('content');
    contentDiv.innerHTML = contentHtml;

    setupHeaderLinks(fromPage, toPage);
}

function setupHeaderLinks(from, to) {
    var linksHtml = '';

    linksHtml += '<div class="links-group">';
    linksHtml += getPreviousLink(from);
    linksHtml += '<a href="/">Tillbaka</a>';
    linksHtml += getNextLink(to);
    linksHtml += '</div>';

    linksHtml += getNumberedLinks(from);
    linksHtml +=
        '<div class="links-group"><a href="https://www.vulkanmedia.se/butik/bocker/faxens-tidsalder-av-rasmus-ohman/">Köp boken</a></div>';

    const linkContainers = document.getElementsByClassName('links-container');
    for (i = 0; i < linkContainers.length; i++) {
        linkContainers[i].innerHTML = linksHtml;
    }
}

function getPreviousLink(from) {
    const fromPrevious = Math.max(1, from - PAGES_PER_PAGE);
    const toPrevious = from - 1;
    const stylePrevious = from <= 1 ? 'visibility: hidden;' : '';

    return (
        '<a class="previous" href="' +
        getUrlFromPages(fromPrevious, toPrevious) +
        '" style="' +
        stylePrevious +
        '">&lt;- Föregående</a>'
    );
}

function getNextLink(to) {
    const fromNext = to + 1;
    const toNext = Math.min(NO_PAGES, to + PAGES_PER_PAGE);
    const styleNext = to >= NO_PAGES ? 'visibility: hidden;' : '';

    return (
        '<a class="next" href="' +
        getUrlFromPages(fromNext, toNext) +
        '" style="' +
        styleNext +
        '">Vidare -></a>'
    );
}

function getNumberedLinks(currentFrom) {
    var linksHtml = '<div class="links-group">';

    for (var from = 1; from <= NO_PAGES; from += PAGES_PER_PAGE) {
        var to = Math.min(NO_PAGES, from + PAGES_PER_PAGE - 1);
        var fromTo = from + '-' + to;
        if (from === currentFrom) {
            linksHtml += '<p class="current">' + fromTo + '</p>';
        } else {
            linksHtml +=
                '<a href="' +
                getUrlFromPages(from, to) +
                '">' +
                fromTo +
                '</a>';
        }
    }
    linksHtml += '</div>';
    return linksHtml;
}

function getUrlFromPages(from, to) {
    return COMIC_BASE_URL + '?from=' + from + '&to=' + to;
}

function getPagesFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const from = parseInt(urlParams.get('from'));
    const to = parseInt(urlParams.get('to'));
    return [Math.max(1, from), Math.min(NO_PAGES, to)];
}

window.onhashchange = function() {
    load();
};

load();
