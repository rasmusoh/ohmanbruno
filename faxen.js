const NO_PAGES = 104;
const PAGES_PER_PAGE = 10;

function load() {
    const pages = getPagesFromUrl();
    const fromPage = pages[0];
    const toPage = pages[1];
    const contentDiv = document.getElementById("content");
    contentDiv.innerHTML = '';
    for (var i = fromPage; i < toPage; i++) {

        const formattedNumber = ("00" + i ).slice(-3);
        const pageUrl = "https://s3.eu-central-1.amazonaws.com/i-faxens-tidsalder/sidor/sida-"
            +formattedNumber+".png";

        const img = document.createElement("IMG");
        img.setAttribute("src", pageUrl);
        img.setAttribute("alt", "I faxens tidsålder sida "+i);

        contentDiv.appendChild(img);  
    }

    setupNextPrevLinks(fromPage, toPage);
}


function getPagesFromUrl() {
    //todo error handling xss handling etc?
    var pages = window.location.href.split("#/")[1].split("-");
    var pagesNumbers = pages.map(function (x) { return parseInt(x); });
    pagesNumbers[0] = Math.max(1, pagesNumbers[0]);
    pagesNumbers[1] = Math.min(NO_PAGES, pagesNumbers[1]);

    return pagesNumbers;
}

function setupNextPrevLinks(from, to) {
    const baseUrl = "/i-faxens-tidsalder.html#/";
    const previousLinks = document.getElementsByClassName("previous");
    for (i = 0; i < previousLinks.length; i++) {
        var link = previousLinks[i];
        if (from > 1) {
            link.style.visibility = "visible";
            const toPrev = from - 1; 
            const fromPrev = Math.max(1, toPrev-PAGES_PER_PAGE);;
            link.setAttribute("href",baseUrl+fromPrev+"-"+toPrev);
        } else {
            link.style.visibility = "hidden";
        }
    }

    const nextLinks = document.getElementsByClassName("next");
    for (i = 0; i < nextLinks.length; i++) {
        var link = nextLinks[i];
        if (to < NO_PAGES) {
            link.style.visibility = "visible";
            const fromNext = to+1;
            const toNext = Math.min(NO_PAGES, fromNext+PAGES_PER_PAGE);
            link.setAttribute("href",baseUrl+fromNext+"-"+toNext);
        } else {
            link.style.visibility = "hidden";
        }
    };
}

window.onhashchange = function() { 
    load();
};

load();
