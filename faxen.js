const NO_PAGES = 104;
const PAGES_PER_PAGE = 10;
const COMIC_BASE_URL = "/i-faxens-tidsalder.html#/";
const CONTENT_BASE_URL = "https://s3.eu-central-1.amazonaws.com/i-faxens-tidsalder/sidor";

function load() {
    const pages = getPagesFromUrl();
    const fromPage = pages[0];
    const toPage = pages[1];

    var contentHtml = "";
    for (var i = fromPage; i < toPage; i++) {
        const pageNumberThreeDigits = ("00" + i).slice(-3);
        const pageUrl = CONTENT_BASE_URL + "/sida-" + pageNumberThreeDigits + ".png";

        contentHtml += "<img src=\"" + pageUrl + "\" alt=\"I faxens tidsålder sida " + i +"\"/>";
    }

    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = contentHtml;

    setupNextPrevLinks(fromPage, toPage);
}

function setupNextPrevLinks(from, to) {
    var linksHtml = "";

    linksHtml += "<div class=\"links-group\">";
    linksHtml += getPreviousLink(from, to);
    linksHtml += "<a href=\"/\">Tillbaka</a>";
    linksHtml += getNextLink(from, to);
    linksHtml += "</div>";

    linksHtml += getNumberedLinks(from);
    linksHtml += "<div><a href=\"https://www.vulkanmedia.se/butik/bocker/faxens-tidsalder-av-rasmus-ohman/\">Köp boken</a>";

    const linkContainers = document.getElementsByClassName("links-container");
    for (i = 0; i < linkContainers.length; i++) {
        linkContainers[i].innerHTML = linksHtml;
    }
}

function getPreviousLink(from, to) {
    const fromPrevious = Math.max(1, from - PAGES_PER_PAGE);
    const toPrevious = (from - 1);
    const hrefPrevious = COMIC_BASE_URL + fromPrevious + "-" + toPrevious;
    const stylePrevious = from <= 1 ? "visibility: hidden;" : "";

    return "<a class=\"previous\" href=\"" + hrefPrevious + "\" style=\"" + stylePrevious +
        "\">&lt;- Föregående</a>";
}

function getNextLink(from, to) {
    const fromNext = to + 1;
    const toNext = Math.min(NO_PAGES, to + PAGES_PER_PAGE);
    const hrefNext = COMIC_BASE_URL + fromNext + "-" + toNext;
    const styleNext = to >= NO_PAGES ? "visibility: hidden;" : "";

    return "<a class=\"next\" href=\"" + hrefNext + "\" style=\"" + styleNext + "\">Vidare -></a>";
}

function getNumberedLinks(currentFrom) {
    var linksHtml = "<div class=\"links-group\">";
    for (var from = 1; from <= NO_PAGES; from += PAGES_PER_PAGE) {
        var to = Math.min(NO_PAGES, from + PAGES_PER_PAGE -1);
        var fromTo = from + "-" + to;
        if (from === currentFrom) {
            linksHtml += "<p class=\"current\">" + fromTo + "</p>";
        }
        else {
            linksHtml += "<a href=\"" + COMIC_BASE_URL + fromTo + "\">" + fromTo + "</a>";
        }
    }
    linksHtml += "</div>";
    return linksHtml;
}

function getPagesFromUrl() {
    //todo error handling xss handling etc?
    var pages = window.location.href.split("#/")[1].split("-");
    var pagesNumbers = pages.map(function(x) {
        return parseInt(x);
    });
    pagesNumbers[0] = Math.max(1, pagesNumbers[0]);
    pagesNumbers[1] = Math.min(NO_PAGES, pagesNumbers[1]);

    return pagesNumbers;
}

window.onhashchange = function() {
    load();
};

load();
