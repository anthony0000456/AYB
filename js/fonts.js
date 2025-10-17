// Font loading and FOUC prevention
(function() {
    // Check for modern font loading API
    if ("fonts" in document) {
        Promise.all([
            document.fonts.load("1em Poppins"),
            document.fonts.load("600 1em Poppins"),
            document.fonts.load("700 1em Poppins")
        ]).then(() => {
            document.documentElement.classList.add("fonts-loaded", "critical-loaded");
        }).catch(() => {
            // Fallback: show content after timeout if font loading fails
            setTimeout(() => {
                document.documentElement.classList.add("fonts-loaded", "critical-loaded");
            }, 2000);
        });
    } else {
        // Fallback for browsers without font loading API
        document.documentElement.classList.add("fonts-loaded", "critical-loaded");
    }
    
    // Ensure content is shown even if something goes wrong
    setTimeout(() => {
        document.documentElement.classList.add("fonts-loaded", "critical-loaded");
    }, 3000);
})();