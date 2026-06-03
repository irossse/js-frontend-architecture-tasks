// BEGIN
export default function app() {
  const form = document.querySelector('form')
  const input = form.querySelector('input[name="number"]')
  const result = document.getElementById('result')
  const resetButton = form.querySelector('button')

  let sum = 0

  const render = () => {
    result.textContent = sum
    input.value = ''
    input.focus()
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault()

    const value = parseInt(input.value, 10)
    if (!Number.isNaN(value)) {
      sum += value;
    }

    render();
  });

  resetButton.addEventListener('click', () => {
    sum = 0
    form.reset()
    render()
  });

  render()
}
// END