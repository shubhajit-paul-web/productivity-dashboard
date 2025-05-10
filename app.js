function openFeatures() {
    const featuresElem = document.querySelectorAll(".feature");
    const windowsElem = document.querySelectorAll(".window");
    const widowCloseBtns = document.querySelectorAll(".window-close-btn");

    featuresElem.forEach(function(feature) {
        feature.addEventListener("click", function(e) {
            windowsElem[e.target.id].style.display = "block";
        });
    });

    widowCloseBtns.forEach(function(btn, index) {
        btn.addEventListener("click", function() {
            windowsElem[index].style.display = "none";
        });
    });
}

openFeatures();

