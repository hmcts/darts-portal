/* clear search text box */
document.getElementById('case-search').addEventListener('click', function(e) {
  e.preventDefault(); // prevents the default action of the link
  document.getElementById('case-search').value = ""; // clears the text box
});
