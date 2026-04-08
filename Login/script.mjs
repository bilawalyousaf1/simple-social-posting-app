let user_string = localStorage.getItem("currentUsers");
let string_data = JSON.parse(user_string);

if (string_data) {
  window.location.href = "../posts/index.html";
}

document.querySelector(".sign-form").addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  console.log("email", email);
  console.log("password", password);

  if (!email) {
    alert("Please Enter Your Email");
    return;
  }

  if (!email.includes("@")) {
    alert("Please Enter Valid Email");
    return;
  }

  if (!password) {
    alert("Please Enter Your Password");
    return;
  }

  let string_data = localStorage.getItem("user");
  let all_users = JSON.parse(string_data) || [];

  let existing_users = all_users.find((user) => {
    return user.email.toLowerCase() === email.toLowerCase();
  });

  if (!existing_users) {
    alert("Email or Password Is Incorrect");
    return;
  }

  if (existing_users.password !== password) {
    alert("Email Or Password Is Incorrect");
    return;
  }

  localStorage.setItem("currentUsers", JSON.stringify(existing_users));

  Swal.fire({
    icon: "success",
    title: "Login Successfully",
    showConfirmButton: false,
    timer: 2000,
  }).then(() => {
    window.location.href = "../posts/index.html";
  });

  document.querySelector(".sign-form").reset();
});

const passwordInput = document.querySelector("#password");
const showPass = document.querySelector(".show-pass");
const hidePass = document.querySelector(".hide-pass");
showPass.addEventListener("click", () => {
  passwordInput.type = "text";
  showPass.style.display = "none";
  hidePass.style.display = "block";
});

hidePass.addEventListener("click", () => {
  passwordInput.type = "password";
  showPass.style.display = "block";
  hidePass.style.display = "none";
});
