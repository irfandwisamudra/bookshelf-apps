const BOOKS_KEY = "BOOKSHELF_APPS";

let books = [];

function isStorageSupported() {
  if (typeof Storage === "undefined") {
    alert("Browser Anda tidak mendukung web storage!");
    return false;
  } else {
    return true;
  }
}

function updateJson() {
  if (isStorageSupported()) {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
  }
}

function fetchJson() {
  let data = JSON.parse(localStorage.getItem(BOOKS_KEY));

  if (data !== null) {
    books = data;
  }

  document.dispatchEvent(new Event("onjsonfetched"));
}

function composeBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year: parseInt(year),
    isComplete,
  };
}

function renderFromBooks() {
  document.getElementById(COMPLETE_BOOK).innerHTML = "";
  document.getElementById(INCOMPLETE_BOOK).innerHTML = "";
  for (const book of books) {
    const newBook = createBook(
      book.id,
      book.title,
      book.author,
      book.year,
      book.isComplete
    );

    if (book.isComplete) {
      document.getElementById(COMPLETE_BOOK).append(newBook);
    } else {
      document.getElementById(INCOMPLETE_BOOK).append(newBook);
    }
  }
}

function deleteBookFromJson(idBook) {
  for (let arrayPosition = 0; arrayPosition < books.length; arrayPosition++) {
    if (books[arrayPosition].id == idBook) {
      books.splice(arrayPosition, 1);
      break;
    }
  }
}

function findBook(idBook) {
  for (const book of books) {
    if (book.id == idBook) return book;
  }
  return null;
}
