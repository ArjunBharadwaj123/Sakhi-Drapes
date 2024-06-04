document.addEventListener("DOMContentLoaded", function() {
    // Get the current URL path
    var path = window.location.pathname;
    var page = path.split("/").pop();

    // Get all the links in the navbar
    var links = document.querySelectorAll(".navbar ul li a");

    // Loop through the links and add the active class to the current page link
    links.forEach(function(link) {
        var href = link.getAttribute("href");
        if (href === page) {
            link.classList.add("active");
        }
    });
});