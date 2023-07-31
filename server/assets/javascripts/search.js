/* clear search text box */
document.getElementById('clearLink').addEventListener('click', function(event) {
  event.preventDefault();
  document.getElementById('case-search').value = '';
});
