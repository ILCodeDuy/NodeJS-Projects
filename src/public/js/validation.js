function Validator(options) {
  function getParent(element, selecter) {
    while (element.parentElement) {
      if (element.parentElement.matches(selecter)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }
  function validate(inputElement, rule) {
    var errorElement = getParent(
      inputElement,
      options.formGroupSelector
    ).querySelector(options.errorSelecter);
    var errorMessage;

    var rules = selecterRules[rule.selecter];

    for (var i = 0; i < rules.length; i++) {
        // switch(inputElement.type) {
        //     case 'radio':
        //         break;
        //     case 'checkbox':
        //         errorMessage = rules[i](formElement.querySelector(rule.selecter + ':checked'));
        //         break;
        //     default:
        //         errorMessage = rules[i](inputElement.value);
        // }
    errorMessage = rules[i](inputElement.value);
      if (errorMessage) {
        break;
      }
    }

    if (errorMessage) {
      errorElement.innerText = errorMessage;
      getParent(inputElement, options.formGroupSelector).classList.add(
        "invalid"
      );
    } else {
      errorElement.innerText = "";
      getParent(inputElement, options.formGroupSelector).classList.remove(
        "invalid"
      );
    }

    return !errorMessage;
  }

  var selecterRules = {};

  var formElement = document.querySelector(options.form);

  if (formElement) {
    formElement.onsubmit = function (e) {
      // e.preventDefault();

      isFormValid = true;

      options.rules.forEach(function (rule) {
        var inputElement = formElement.querySelector(rule.selecter);
        var isValid = validate(inputElement, rule);
        if (!isValid) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        if (typeof options.onSubmit === "function") {
          var enableInput = formElement.querySelectorAll(
            "[name]:not([disabled])"
          );
          var formValues = Array.from(enableInput).reduce(function (
            values,
            input
          ) {
            values[input.name] = input.value;
            return values;
          },
          {});
        }
        options.onSubmit(formValues);
      }
    };
  }

  options.rules.forEach(function (rule) {
    if (Array.isArray(selecterRules[rule.selecter])) {
      selecterRules[rule.selecter].push(rule.test);
    } else {
      selecterRules[rule.selecter] = [rule.test];
    }

    var inputElement = formElement.querySelector(rule.selecter);

    if (inputElement) {
      inputElement.onblur = function () {
        validate(inputElement, rule);
      };

      inputElement.oninput = function () {
        var errorElement = getParent(
          inputElement,
          options.formGroupSelector
        ).querySelector(options.errorSelecter);
        errorElement.innerText = "";
        getParent(inputElement, options.formGroupSelector).classList.remove(
          "invalid"
        );
      };
    }
  });
}

Validator.isRequired = function (selecter, messeage) {
  return {
    selecter: selecter,
    test: function (value) {
      return value.trim() ? undefined : messeage;
    },
  };
};

Validator.isEmail = function (selecter, messeage) {
  return {
    selecter: selecter,
    test: function (value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : messeage;
    },
  };
};

Validator.minLength = function (selecter, min, messeage) {
  return {
    selecter: selecter,
    test: function (value) {
      return value.length < min
        ? `Vui lòng nhập ít nhất ${min} kí tự`
        : undefined;
    },
  };
};

Validator.confirmValue = function (selecter, getConfirmValue, messeage) {
  return {
    selecter: selecter,
    test: function (value) {
      return value === getConfirmValue() ? undefined : messeage;
    },
  };
};
