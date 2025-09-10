const INCOMPLETE_BOOK = "incompleteBookList";
const COMPLETE_BOOK = "completeBookList";

function addBook() {
  const idBook = +new Date();
  const inputBookTitle = document.getElementById("bookFormTitle").value;
  const inputBookAuthor = document.getElementById("bookFormAuthor").value;
  const inputBookYear = document.getElementById("bookFormYear").value;
  const inputBookIsComplete =
    document.getElementById("bookFormIsComplete").checked;

  const book = createBook(
    idBook,
    inputBookTitle,
    inputBookAuthor,
    inputBookYear,
    inputBookIsComplete
  );
  const bookObject = composeBookObject(
    idBook,
    inputBookTitle,
    inputBookAuthor,
    inputBookYear,
    inputBookIsComplete
  );

  books.push(bookObject);

  if (inputBookIsComplete) {
    document.getElementById(COMPLETE_BOOK).append(book);
  } else {
    document.getElementById(INCOMPLETE_BOOK).append(book);
  }

  updateJson();

  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Buku berhasil ditambahkan",
    showConfirmButton: false,
    timer: 1500,
  });
}

function createBook(
  idBook,
  inputBookTitle,
  inputBookAuthor,
  inputBookYear,
  inputBookIsComplete
) {
  const book = document.createElement("article");
  book.setAttribute("id", idBook);
  book.setAttribute("data-bookid", idBook);
  book.setAttribute("data-testid", "bookItem");
  book.classList.add("card", "my-3");

  const bookTitle = document.createElement("h5");
  bookTitle.classList.add("text-truncate");
  bookTitle.style.maxWidth = "200px";
  bookTitle.setAttribute("data-testid", "bookItemTitle");
  bookTitle.innerText = inputBookTitle;

  const bookAuthor = document.createElement("span");
  bookAuthor.classList.add("text-truncate", "d-inline-block");
  bookAuthor.style.maxWidth = "200px";
  bookAuthor.setAttribute("data-testid", "bookItemAuthor");
  bookAuthor.innerText = "Penulis: " + inputBookAuthor;

  const bookYear = document.createElement("span");
  bookYear.classList.add("text-truncate", "d-inline-block");
  bookYear.style.maxWidth = "200px";
  bookYear.setAttribute("data-testid", "bookItemYear");
  bookYear.innerText = "Tahun: " + inputBookYear;

  const br = document.createElement("br");

  const cardContainer = document.createElement("div");
  cardContainer.classList.add(
    "card-body",
    "border-start",
    "border-4",
    "border-info",
    "d-flex",
    "justify-content-between",
    "flex-wrap"
  );

  const cardContent = document.createElement("div");
  cardContent.classList.add("card-content", "pe-1");

  const cardAction = addAction(inputBookIsComplete, idBook);

  cardContent.append(bookTitle, bookAuthor, br, bookYear);
  cardContainer.append(cardContent);
  cardContainer.append(cardAction);
  book.append(cardContainer);

  return book;
}

function editBook() {
  const editBookId = document.getElementById("editBookId").value;
  const editBookTitle = document.getElementById("editBookTitle").value;
  const editBookAuthor = document.getElementById("editBookAuthor").value;
  const editBookYear = document.getElementById("editBookYear").value;
  const editBookIsComplete =
    document.getElementById("editBookIsComplete").checked;

  const bookIndex = books.findIndex((book) => book.id == editBookId);
  if (bookIndex !== -1) {
    books[bookIndex].title = editBookTitle;
    books[bookIndex].author = editBookAuthor;
    books[bookIndex].year = parseInt(editBookYear);
    books[bookIndex].isComplete = editBookIsComplete;

    updateJson();

    const modalEdit = document.getElementById("modalEdit");
    modalEdit.style.display = "none";

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Buku berhasil diubah",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      window.location.reload();
    });
  }
}

function addAction(inputBookIsComplete, idBook) {
  const cardActions = document.createElement("div");
  cardActions.classList.add("d-flex", "flex-wrap", "align-items-start");

  const actionDelete = createActionDelete(idBook);
  const actionRead = createActionRead(idBook);
  const actionUndo = createActionUndo(idBook);
  const actionEdit = createActionEdit(idBook);

  cardActions.append(actionDelete, actionEdit);

  if (inputBookIsComplete) {
    cardActions.append(actionUndo);
  } else {
    cardActions.append(actionRead);
  }

  return cardActions;
}

function createActionDelete(idBook) {
  const actionDelete = document.createElement("button");
  actionDelete.classList.add("btn", "btn-sm", "btn-outline-danger", "me-1");
  actionDelete.setAttribute("data-testid", "bookItemDeleteButton");
  actionDelete.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

  actionDelete.addEventListener("click", function () {
    Swal.fire({
      title: "Konfirmasi Hapus",
      text: "Apakah Anda yakin ingin menghapus buku ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        const cardParent = document.getElementById(idBook);
        cardParent.addEventListener("eventDelete", function (event) {
          event.target.remove();
        });
        cardParent.dispatchEvent(new Event("eventDelete"));

        deleteBookFromJson(idBook);
        updateJson();

        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Buku berhasil dihapus",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  });

  return actionDelete;
}

function createActionRead(idBook) {
  const action = document.createElement("button");
  action.classList.add("btn", "btn-sm", "btn-outline-success", "ms-1");
  action.setAttribute("data-testid", "bookItemIsCompleteButton");
  action.innerHTML = '<i class="fa-solid fa-circle-check"></i>';

  action.addEventListener("click", function () {
    const cardParent = document.getElementById(idBook);
    cardParent.remove();

    // Ambil dari data penyimpanan agar konsisten
    const bookData = findBook(idBook);
    if (!bookData) return;

    deleteBookFromJson(idBook);

    const movedBook = createBook(
      idBook,
      bookData.title,
      bookData.author,
      bookData.year,
      true
    );
    document.getElementById(COMPLETE_BOOK).append(movedBook);

    const bookObject = composeBookObject(
      idBook,
      bookData.title,
      bookData.author,
      bookData.year,
      true
    );

    books.push(bookObject);
    updateJson();

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Buku ditandai sebagai selesai dibaca",
      showConfirmButton: false,
      timer: 1500,
    });
  });

  return action;
}

function createActionUndo(idBook) {
  const action = document.createElement("button");
  action.classList.add("btn", "btn-sm", "btn-outline-secondary", "ms-1");
  action.setAttribute("data-testid", "bookItemIsCompleteButton");
  action.innerHTML = '<i class="fa-solid fa-rotate-left"></i>';

  action.addEventListener("click", function () {
    const cardParent = document.getElementById(idBook);
    cardParent.remove();

    const bookData = findBook(idBook);
    if (!bookData) return;

    deleteBookFromJson(idBook);

    const movedBook = createBook(
      idBook,
      bookData.title,
      bookData.author,
      bookData.year,
      false
    );
    document.getElementById(INCOMPLETE_BOOK).append(movedBook);

    const bookObject = composeBookObject(
      idBook,
      bookData.title,
      bookData.author,
      bookData.year,
      false
    );

    books.push(bookObject);
    updateJson();

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Buku ditandai sebagai belum selesai dibaca",
      showConfirmButton: false,
      timer: 1500,
    });
  });

  return action;
}

function createActionEdit(idBook) {
  const actionEdit = document.createElement("button");
  actionEdit.classList.add("btn", "btn-sm", "btn-outline-warning", "mx-1");
  actionEdit.setAttribute("data-testid", "bookItemEditButton");
  actionEdit.innerHTML = '<i class="fa-solid fa-pencil"></i>';

  actionEdit.addEventListener("click", function () {
    const bookIndex = books.findIndex((book) => book.id == idBook);

    if (bookIndex !== -1) {
      const book = books[bookIndex];
      showModalEdit(
        book.id,
        book.title,
        book.author,
        book.year,
        book.isComplete
      );
    }
  });

  return actionEdit;
}

function bookSearch(keyword) {
  const filter = keyword.toUpperCase();
  const titles = document.querySelectorAll('[data-testid="bookItemTitle"]');

  titles.forEach((titleEl) => {
    const titlesText = titleEl.textContent || titleEl.innerText;
    if (titlesText.toUpperCase().indexOf(filter) > -1) {
      titleEl.closest(".card").style.display = "";
    } else {
      titleEl.closest(".card").style.display = "none";
    }
  });
}

function showModalEdit(idBook, bookTitle, bookAuthor, bookYear, isComplete) {
  const modalEdit = document.getElementById("modalEdit");

  document.getElementById("editBookId").value = idBook;
  document.getElementById("editBookTitle").value = bookTitle;
  document.getElementById("editBookAuthor").value = bookAuthor;
  document.getElementById("editBookYear").value = bookYear;
  document.getElementById("editBookIsComplete").checked = isComplete;

  const modal = new bootstrap.Modal(modalEdit);
  modal.show();
}
