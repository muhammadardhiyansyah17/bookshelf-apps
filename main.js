const books = [];
const RENDER_EVENT = 'render-books';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOK_APPS';

document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addInputBook();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function () {
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    incompleteBookshelfList.innerHTML = '';

    const completeBookshelfList = document.getElementById('completeBookshelfList');
    completeBookshelfList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isChecked) {
            incompleteBookshelfList.append(bookElement);
        } else {
            completeBookshelfList.append(bookElement);
        }

    }
});

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});



function makeBook(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('p');
    textAuthor.innerText = `Penulis: ${bookObject.author}`;

    const bookyear = document.createElement('p');
    bookyear.innerText = `Tahun : ${bookObject.year}`;

    const textContainer = document.createElement('article')
    textContainer.classList.add('book-item');
    textContainer.append(textTitle, textAuthor, bookyear);

    const container = document.createElement('div');
    container.classList.add('action');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);


    if (bookObject.isChecked) {
        const belumDibaca = document.createElement('button');
        belumDibaca.innerText = "Belum selesai di Baca";
        belumDibaca.classList.add("green");
        belumDibaca.addEventListener('click', function () {
            toggleBelumDibaca(bookObject.id);
        });

        const deleteBook = document.createElement('button');
        deleteBook.innerText = " Hapus Buku";
        deleteBook.classList.add("red");
        deleteBook.addEventListener('click', function () {
            deleteButton(bookObject.id);
        });

        container.append(belumDibaca, deleteBook);
    } else {
        const checkButton = document.createElement('button');
        checkButton.innerText = "Sudah Dibaca";
        checkButton.classList.add("green");
        checkButton.addEventListener('click', function () {
            finishButton(bookObject.id);
        });

        const deleteBook = document.createElement('button');
        deleteBook.innerText = " Hapus Buku";
        deleteBook.classList.add("red");
        deleteBook.addEventListener('click', function () {
            deleteButton(bookObject.id);
        });
        container.append(checkButton, deleteBook);
    }

    return container;
}

function addInputBook() {
    const textJudul = document.getElementById('inputBookTitle').value;
    const textPenulis = document.getElementById('inputBookAuthor').value;
    const textTahun = document.getElementById('inputBookYear').value;
    const textChecked = document.getElementById('inputBookIsComplete').checked;

    const generateID = generateId();
    const bookObject = generateBookObject(generateID, textJudul, textPenulis, textTahun, textChecked);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function finishButton(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) {
        return;
    } else {
        bookTarget.isChecked = true;
        alert('buku berhasil ditambahkan kelesai dibaca');

    }
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}
function deleteButton(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) {
        return;
    } else {
        books.splice(bookTarget, 1);
        alert('Apakah anda yakin akan menghapus buku?');
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }
}

function toggleBelumDibaca(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null)
        return;

    bookTarget.isChecked = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }

    return -1;

}

function findBook(bookId) {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }

    return null;
}



function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isChecked) {
    return {
        id,
        title,
        author,
        year,
        isChecked
    }
}


function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

function loadDataFromStorage() {
    const serializeData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializeData);

    if (data !== null) {
        for (const book of data) {
            books.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}