import keyBy from 'lodash/keyBy.js';
import has from 'lodash/has.js';
import isEmpty from 'lodash/isEmpty.js';
import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';

const routes = {
  usersPath: () => '/users',
};

const schema = yup.object().shape({
  name: yup.string().trim().required(),
  email: yup.string().required('email must be a valid email').email(),
  password: yup.string().required().min(6),
  passwordConfirmation: yup.string()
    .required('password confirmation is a required field')
    .oneOf(
      [yup.ref('password'), null],
      'password confirmation does not match to password',
    ),
});

// Этот объект можно использовать для того, чтобы обрабатывать ошибки сети.
// Это необязательное задание, но крайне рекомендуем попрактиковаться.
const errorMessages = {
  network: {
    error: 'Network Problems. Try again.',
  },
};

// Используйте эту функцию для выполнения валидации.
// Выведите в консоль её результат, чтобы увидеть, как получить сообщения об ошибках.
const validate = (fields) => {
  try {
    schema.validateSync(fields, { abortEarly: false });
    return {};
  } catch (e) {
    return keyBy(e.inner, 'path');
  }
};

// BEGIN
export default () => {
  const container = document.querySelector('[data-container="sign-up"]')
  const form = document.querySelector('[data-form="sign-up"]')
  const submitButton = form.querySelector('input[type="submit"]')

  const state = {
    registrationForm: {
      status: 'filling',
      valid: false,
      fields: {
        name: '',
        email: '',
        password: '',
        passwordConfirmation: '',
      },
      errors: {},
    },
  }

  const renderFieldError = (inputName, error) => {
    const input = form.querySelector(`input[name="${inputName}"]`)
    const nextEl = input.nextElementSibling
    
    if (nextEl && nextEl.classList.contains('invalid-feedback')) {
      nextEl.remove()
    }
    
    if (error) {
      input.classList.add('is-invalid')
      const feedback = document.createElement('div')
      feedback.classList.add('invalid-feedback')
      feedback.textContent = error.message
      input.after(feedback)
    } else {
      input.classList.remove('is-invalid')
    }
  }

  const watchedState = onChange(state, (path, value) => {
    if (path.startsWith('registrationForm.errors')) {
      const inputName = path.split('.').pop()
      if (inputName === 'errors') {
        const allFields = ['name', 'email', 'password', 'passwordConfirmation']
        allFields.forEach((field) => {
          renderFieldError(field, value[field])
        })
      } else {
        renderFieldError(inputName, value)
      }
    }

    if (path === 'registrationForm.valid') {
      if (value) {
        submitButton.removeAttribute('disabled')
      } else {
        submitButton.setAttribute('disabled', 'disabled')
      }
    }

    if (path === 'registrationForm.status') {
      switch (value) {
        case 'submitting':
          submitButton.setAttribute('disabled', 'disabled')
          break;
        case 'finished':
          container.innerHTML = 'User Created!'
          break;
        case 'filling':
          submitButton.removeAttribute('disabled')
          break;
        default:
          break;
      }
    }
  })

  form.addEventListener('input', (e) => {
    e.preventDefault()
    const target = e.target
    const name = target.name
    const value = target.value

    watchedState.registrationForm.fields[name] = value

    const errors = validate(watchedState.registrationForm.fields)
    
    watchedState.registrationForm.errors = errors
    watchedState.registrationForm.valid = isEmpty(errors)
  })

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    
    watchedState.registrationForm.status = 'submitting'

    axios.post(routes.usersPath(), watchedState.registrationForm.fields)
      .then(() => {
        watchedState.registrationForm.status = 'finished'
      })
      .catch((err) => {
        watchedState.registrationForm.status = 'filling'
        console.error(err)
      })
  })
}
// END
