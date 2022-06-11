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



    
class SiteList {
    /**
     * 
     * @param {Element} container
     * @param {Array} data 
     */
    constructor(container, data) {
        this.container = container 
        this.data = data;
    }

    createTableRow() {
        const row = document.createElement('li');

        row.className = 'site-list-row';

        const siteName = document.createElement('div').className

    }

    update() {

    }
}

// siteList.innerHTML = `
// <div class="site-list-row-labels" >
//     <div class="site-name">Site Name</div>
//     <div class="site-description">Site subtitle</div>
//     <div class="site-url">Site URL</div>
//     <div></div>
// </div>
// `;
// sites.forEach((site) => {
// siteList.innerHTML += `
//     <div class="site-list-row" data-siteid="${site.id}">
//         <div class="site-name">${site.name}</div>
//         <div class="site-description">${site.description}</div>
//         <div class="site-url">${site.url}</div>
//         <div class="site-list-controlls">
//             <button class="site-edit" data-siteid="${site.id}"><i class="fa-solid fa-pencil"></i></button>
//             <button class="site-remove" data-siteid="${site.id}"><i class="fa-solid fa-trash-can"></i></button>
//         </div>
//     </div>
// `;
// })