var clipboard = require('clipboard');
var fs = require('fs');
var remote = require('remote');
var Menu = remote.require('menu');
var MenuItem = remote.require('menu-item');

var menu = new Menu();
menu.append(new MenuItem({
    label: 'Cut',
    accelerator: 'CommandOrControl+X',
    selector: 'cut:'
}));
menu.append(new MenuItem({
    label: 'Copy',
    accelerator: 'CommandOrControl+C',
    selector: 'copy:'
}));
menu.append(new MenuItem({
    label: 'Paste',
    accelerator: 'CommandOrControl+V',
    selector: 'paste:'
}));


window.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    menu.popup(remote.getCurrentWindow());
}, false);