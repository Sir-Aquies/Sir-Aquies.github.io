var mediaLinks = document.getElementById('media_links');
window.addEventListener('scroll', ToogleMediaContainer);
function ToogleMediaContainer() {
    if (window.scrollY < 500) {
        mediaLinks.classList.add('media-container-show');
    }
    else {
        mediaLinks.classList.remove('media-container-show');
    }
}
ToogleMediaContainer();
//# sourceMappingURL=HomeScripts.js.map