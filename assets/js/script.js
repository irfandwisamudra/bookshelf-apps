var index = 0;
carousel();

function carousel() {
  var i;
  var x = document.getElementsByClassName("slide");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  index++;
  if (index > x.length) {
    index = 1;
  }
  x[index - 1].style.display = "block";
  setTimeout(carousel, 3000);
}

document.addEventListener("DOMContentLoaded", function () {
  const formInput = document.getElementById("bookForm");
  const formSearch = document.getElementById("searchBook");
  const formEditBook = document.getElementById("formEditBook");

  formInput.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();

    document.getElementById("bookFormTitle").value = "";
    document.getElementById("bookFormAuthor").value = "";
    document.getElementById("bookFormYear").value = "";
    document.getElementById("bookFormIsComplete").checked = false;
  });

  formSearch.addEventListener("submit", function (event) {
    event.preventDefault();

    const inputSearch = document.getElementById("searchBookTitle").value;
    bookSearch(inputSearch);
  });

  formEditBook.addEventListener("submit", function (event) {
    event.preventDefault();
    editBook();
  });

  if (isStorageSupported()) {
    fetchJson();
  }
});

document.addEventListener("onjsonfetched", function () {
  renderFromBooks();
});
