var div = document.createElement('div');
div.id = 'op';
div.className = 'mydict';
div.style.cssText = 'position: absolute; z-index: 999; height: 100px; width: 100px; top: 60px;';
div.innerHTML = '<img src="https://i.imgur.com/WK3AOms.png" alt="arrow" width="64" height="64">';

document.body.appendChild(div);

document.getElementById("op").onclick = function() {showDetail()};

function showDetail() {
    var div = document.createElement('div');
    div.className = 'detail';
    div.style.cssText = 'background-color: rgba(255, 255, 255, 0.8); position: absolute; z-index: 998; height: 1000px; width: 300px; top: 0px;';

    document.body.appendChild(div);
}