$(function () {
  $.get("/users", function (users) {
    users.forEach(function (user) {
      $("<li></li>")
        .text(user.userid)
        .appendTo("ul#users");
    });
  });
});
