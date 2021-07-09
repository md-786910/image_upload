// hide alertImage
// upload.hbs
let alertimg = document.getElementById("alertimg");
setTimeout(() => {
    alertimg.style.opacity = 0;
}, 3000);

function change() {
    let ans = document.getElementById("inputField").value;
    alert(ans)
}

// login.hbs
let alertmsg = document.getElementById("alertmsg");
setTimeout(() => {
    alertmsg.style.opacity = 0;
}, 3000)

// index.hbs
let alertmsg1 = document.getElementById("alertmsg1");
setTimeout(() => {
    alertmsg1.style.opacity = 0;
}, 3000)

// download image by  click
function downloaded(down) {
    down.save
}
