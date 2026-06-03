// BEGIN
export default (companies) => {
  const container = document.querySelector('.container')

  const state = {
    selectedCompanyId: null
  }

  const render = () => {
    container.innerHTML = ''

    companies.forEach((company) => {
      const button = document.createElement('button')
      button.classList.add('btn', 'btn-primary', 'me-2', 'm-1')
      button.textContent = company.name

      button.addEventListener('click', () => {
        if (state.selectedCompanyId === company.id) {
          state.selectedCompanyId = null
        } else {
          state.selectedCompanyId = company.id
        }
        render()
      })

      container.appendChild(button)
    })

    if (state.selectedCompanyId !== null) {
      const activeCompany = companies.find((c) => c.id === state.selectedCompanyId)
      const descriptionDiv = document.createElement('div')
      descriptionDiv.textContent = activeCompany.description
      container.appendChild(descriptionDiv)
    }
  }

  render()
}
// END