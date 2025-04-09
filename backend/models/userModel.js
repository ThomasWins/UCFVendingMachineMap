class User {
  constructor({ Login, Password, UserId, Firstname, Lastname, Admin, Favorites }) {
    this.Login = Login;
    this.Password = Password;
    this.UserId = UserId;
    this.Firstname = Firstname;
    this.Lastname = Lastname;
    this.Admin = Admin || false;
    this.Favorites = Favorites || [];
  }
}

module.exports = User;
