document.addEventListener("DOMContentLoaded", function () {
  // actual bibsearch logic
  const filterItems = (searchTerm) => {
    document.querySelectorAll(".bibliography, .unloaded").forEach((element) => element.classList.remove("unloaded"));

    if (!searchTerm) return; // do nothing if the search term is empty

    // Add unloaded class to all non-matching items
    document.querySelectorAll(".bibliography > li").forEach((element, index) => {
      let text = element.innerText.toLowerCase();
      if (text.indexOf(searchTerm) == -1) {
        element.classList.add("unloaded");
      }
    });

    // Add unloaded class to year if no item left in this year
    document.querySelectorAll("h2.bibliography").forEach(function (element) {
      let iterator = element;
      let hideAll = true;
      while (iterator) {
        if (iterator.tagName === "OL") {
          let ol = iterator;
          const unloadedSiblings = ol.querySelectorAll(":scope > li.unloaded");
          const totalSiblings = ol.querySelectorAll(":scope > li");

          if (unloadedSiblings.length === totalSiblings.length) {
            ol.previousElementSibling.classList.add("unloaded"); // Add the '.unloaded' class to the previous grouping element (e.g. year)
            ol.classList.add("unloaded"); // Add the '.unloaded' class to the OL itself
          } else {
            hideAll = false;
          }
        }
        iterator = iterator.nextElementSibling;
        if (iterator && iterator.tagName === "H2") {
          break;
        }
      }
      if (hideAll) {
        element.classList.add("unloaded");
      }
    });
  };

  const updateInputField = () => {
    const hashValue = decodeURIComponent(window.location.hash.substring(1)); // Remove the '#' character
    document.getElementById("bibsearch").value = hashValue;
    filterItems(hashValue);
  };

  // Sensitive search. Only start searching if there's been no input for 300 ms
  let timeoutId;
  document.getElementById("bibsearch").addEventListener("keyup", function () {
    clearTimeout(timeoutId); // Clear the previous timeout
    const searchTerm = this.value.toLowerCase();
    timeoutId = setTimeout(filterItems(searchTerm), 300);
  });

  window.addEventListener("hashchange", updateInputField); // Update the filter when the hash changes

  updateInputField(); // Update filter when page loads
});
