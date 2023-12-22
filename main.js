// [
//   {
//     id: string | number,
//     title: string,
//     author: string,
//     year: number,
//     isComplete: boolean,
//   },
// ];

const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOK_APPS";
let isComplete = false;

// 14
const checkbox = document.getElementById("inputBookIsComplete");
checkbox.addEventListener("click", function () {
  if (checkbox.checked) {
    isComplete = true;
  } else {
    isComplete = false;
  }
});

// 3
function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

// 8
function findBook(bookId) {
  for (bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

// 10
function findBookIndex(bookId) {
  for (index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

// 11
function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

// 13
function searchBook() {
  const query = document.getElementById("searchBookTitle").value.toLowerCase();
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );

  let filteredIncompleteBooks = [];
  let filteredCompleteBooks = [];

  for (const book of books) {
    const title = book.title.toLowerCase();
    if (title.includes(query) && !book.isComplete) {
      filteredIncompleteBooks.push(book);
    }
  }

  for (const book of books) {
    const title = book.title.toLowerCase();
    if (title.includes(query) && book.isComplete) {
      filteredCompleteBooks.push(book);
    }
  }

  while (incompleteBookshelfList.firstChild) {
    incompleteBookshelfList.removeChild(incompleteBookshelfList.firstChild);
  }

  for (const book of filteredIncompleteBooks) {
    const bookItem = makeBook(book);
    incompleteBookshelfList.appendChild(bookItem);
  }

  while (completeBookshelfList.firstChild) {
    completeBookshelfList.removeChild(completeBookshelfList.firstChild);
  }

  for (const book of filteredCompleteBooks) {
    const bookItem = makeBook(book);
    completeBookshelfList.appendChild(bookItem);
  }
}

document
  .getElementById("searchBook")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    searchBook();
  });

// 4
function makeBook(bookObject) {
  const textBookTitle = document.createElement("h3");
  textBookTitle.innerText = bookObject.title;

  const textBookAuthor = document.createElement("p");
  textBookAuthor.innerText = `Penulis: ${bookObject.author}`;

  const textBookYear = document.createElement("p");
  textBookYear.innerText = `Tahun: ${bookObject.year}`;

  const actionBook = document.createElement("div");
  actionBook.classList.add("action");

  const textContainer = document.createElement("article");
  textContainer.classList.add("book_item");
  textContainer.append(textBookTitle, textBookAuthor, textBookYear, actionBook);

  textContainer.setAttribute("id", `book-${bookObject.id}`);

  // 6
  if (bookObject.isComplete) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("green");
    undoButton.innerText = "Belum selesai dibaca";

    undoButton.addEventListener("click", function () {
      undoBookFromCompleted(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("red");
    trashButton.innerText = "Hapus buku";

    trashButton.addEventListener("click", function () {
      removeBookFromCompleted(bookObject.id);
    });

    actionBook.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("green");
    checkButton.innerText = "Sudah dibaca";

    checkButton.addEventListener("click", function () {
      addBookToCompleted(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("red");
    trashButton.innerText = "Hapus buku";

    trashButton.addEventListener("click", function () {
      removeBookFromCompleted(bookObject.id);
    });

    actionBook.append(checkButton, trashButton);
  }

  return textContainer;
}

// 5
document.addEventListener(RENDER_EVENT, function () {
  const listIncompleted = document.getElementById("incompleteBookshelfList");
  const listCompleted = document.getElementById("completeBookshelfList");

  listIncompleted.innerHTML = "";
  listCompleted.innerHTML = "";

  for (bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isComplete) {
      listCompleted.append(bookElement);
    } else {
      listIncompleted.append(bookElement);
    }
  }
});

// 2
function addBook() {
  const textBookTitle = document.getElementById("inputBookTitle").value;
  const textBookAuthor = document.getElementById("inputBookAuthor").value;
  const textBookYear = document.getElementById("inputBookYear").value;

  const generatedID = generateId();
  const bookObject = generateBookObject(
    generatedID,
    textBookTitle,
    textBookAuthor,
    textBookYear,
    isComplete
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// 7
function addBookToCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// 9
function removeBookFromCompleted(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function undoBookFromCompleted(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

// 1
document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  // 12
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});
