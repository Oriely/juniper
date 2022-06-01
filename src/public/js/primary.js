let site_descriptions = document.querySelectorAll('.site-link-inner');
let nav_items = document.querySelectorAll('.nav-item');


if(window.innerWidth > 760)  {
    
    site_descriptions.forEach(function (elem){
        elem.addEventListener('mouseover', function (event) {
            elem.lastElementChild.style.maxHeight = elem.lastElementChild.scrollHeight + "px";

        }, false);

        elem.addEventListener('mouseleave', function (event) {
            elem.lastElementChild.style.maxHeight = 0;
        }, false);
    });

    // nav_items.forEach(function (elem){
    //     elem.addEventListener('mouseover', function (event) {
    //         elem.lastElementChild.lastElementChild.style.maxWidth = "100%";
    //     }, false);

    //     elem.addEventListener('mouseleave', function (event) {
    //         elem.lastElementChild.lastElementChild.style.maxWidth = 0;
    //     }, false);
    // });
}

const sites = [];