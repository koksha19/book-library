const deleteBook = (btn) => {
  const bookId = btn.parentNode.querySelector('[name="bookId"]').value;
  const csrf = btn.parentNode.querySelector('[name="_csrf"]').value;
  const bookItem = btn.closest("article");

  fetch("/admin/books/" + bookId, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((data) => {
      console.log(data);
      bookItem.remove();
    })
    .catch((err) => console.log(err));
  console.log(bookId, csrf);
};
