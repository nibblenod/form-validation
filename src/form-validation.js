export class formValidation {
  email;
  form;
  country;
  postalCode;
  password;
  confirmPassword;

  constructor() {
    this.initialize();
  }

  initialize() {
    this.#selectElements();
    this.#addEventListeners();
  }
  #selectElements() {
    this.email = document.querySelector("#email");
    this.form = document.querySelector("form");
    this.country = document.querySelector("#country");
    this.postalCode = document.querySelector("#postal-code");
    this.password = document.querySelector("#password");
    this.confirmPassword = document.querySelector("#confirm-password");
  }
  #addEventListeners() {
    this.email.addEventListener("input", () => this.#validateEmail(this.email));
    this.form.addEventListener("submit", (event) =>
      this.#validateForm(event, this.form),
    );
    this.country.addEventListener("input", () =>
      this.#validateCountry(this.country),
    );
    this.postalCode.addEventListener("input", () =>
      this.#validatePostalCode(this.postalCode, this.country),
    );
    this.password.addEventListener("input", () => {
      this.#validatePassword(this.password);
    });
    this.password.addEventListener("blur", () => {
      this.#validateConfirmPassword(this.confirmPassword, this.password);
    });
    this.confirmPassword.addEventListener("input", () =>
      this.#validateConfirmPassword(this.confirmPassword, this.password),
    );
    this.confirmPassword.addEventListener("click", () =>
      this.#validateConfirmPassword(this.confirmPassword, this.password),
    );
  }

  #validateConfirmPassword(confirmPassword, password) {
    confirmPassword.setCustomValidity("");
    if (confirmPassword.value !== password.value) {
      confirmPassword.setCustomValidity(
        "Passwords do not match. Please re-enter.",
      );
    }
    confirmPassword.reportValidity();
  }
  #validatePassword(password) {
    password.setCustomValidity("");
    const constraint = new RegExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
    );
    if (password.validity.valueMissing) {
      password.setCustomValidity("Enter password!");
    } else if (!constraint.test(password.value)) {
      password.setCustomValidity(
        "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
      );
    }
    password.reportValidity();
  }

  #validatePostalCode(postalCode, country) {
    postalCode.setCustomValidity("");
    if (!country.validity.valid) {
      postalCode.setCustomValidity("No country selected!");
      postalCode.reportValidity();
      return;
    }
    const constraints = {
      ch: [
        "^(CH-)?\\d{4}$",
        "Swiss postal codes must have exactly 4 digits: e.g. CH-1950 or 1950",
      ],
      fr: [
        "^(F-)?\\d{5}$",
        "French postal codes must have exactly 5 digits: e.g. F-75012 or 75012",
      ],
      de: [
        "^(D-)?\\d{5}$",
        "German postal codes must have exactly 5 digits: e.g. D-12345 or 12345",
      ],
      nl: [
        "^(NL-)?\\d{4}\\s*([A-RT-Z][A-Z]|S[BCE-RT-Z])$",
        "Dutch postal codes must have exactly 4 digits, followed by 2 letters except SA, SD and SS",
      ],
    };

    const constraint = new RegExp(constraints[country.value][0], "");

    if (constraint.test(postalCode.value)) {
      postalCode.setCustomValidity("");
    } else {
      postalCode.setCustomValidity(constraints[country.value][1]);
    }
    postalCode.reportValidity();
  }

  #validateCountry(countryElement) {
    countryElement.setCustomValidity("");
    if (countryElement.validity.valueMissing) {
      countryElement.setCustomValidity("Selecting a country is mandatory!");
    }
    countryElement.reportValidity();
  }

  #validateEmail(emailElement) {
    emailElement.setCustomValidity("");
    if (emailElement.validity.typeMismatch) {
      emailElement.setCustomValidity("Enter an email address!");
    } else if (emailElement.validity.valueMissing) {
      emailElement.setCustomValidity("Email address is mandatory!");
    }
    emailElement.reportValidity();
  }

  #validateForm(event, formElement) {
    if (!formElement.checkValidity()) {
      formElement.reportValidity();
      event.preventDefault();
    }
  }
}
