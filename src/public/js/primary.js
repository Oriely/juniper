let columns = document.querySelectorAll('.column');
let descriptions = document.querySelectorAll('.description');

const data =  {
    mouseX: 0,
    mouseY: 0
}

window.addEventListener('mousemove', (e) => {
    data.mouseX = e.clientX;
    data.mouseY = e.clientY;
})

if(window.innerWidth > 760)  {
    
    columns.forEach(function (column){
        column.addEventListener('mouseover', function (event) {
            column.lastElementChild.lastElementChild.style.maxHeight = column.lastElementChild.scrollHeight + "px";

        }, false);

        column.addEventListener('mouseleave', function (event) {
            column.lastElementChild.lastElementChild.style.maxHeight = null;
        }, false);
    });
}