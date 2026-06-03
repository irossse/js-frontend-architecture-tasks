// BEGIN
export default (laptops) => {
 
  const state = {
    filters: {
      processor_eq: '',
      memory_eq: '',
      frequency_gte: '',
      frequency_lte: '',
    },
  };

  const resultContainer = document.querySelector('.result')
  const form = document.querySelector('form')

  const render = (currentState) =>{

    const filteredLaptops = laptops.filter((laptop) => {
      
      return Object.entries(currentState.filters).every(([key, value]) => {

        if (value === '') {
          return true;
        }


        const [prop, matchType] = key.split('_');
        const laptopValue = laptop[prop];

   
        switch (matchType) {
          case 'eq':

            return String(laptopValue) === String(value)
          case 'gte':

            return Number(laptopValue) >= Number(value)
          case 'lte':
   
            return Number(laptopValue) <= Number(value)
          default:
            return true
        }
      })
    })


    if (filteredLaptops.length === 0) {
      resultContainer.innerHTML = ''
      return
    }


    const listItems = filteredLaptops.map((laptop) => `<li>${laptop.model}</li>`).join('');
    resultContainer.innerHTML = `<ul>${listItems}</ul>`;
  }


  form.addEventListener('input', (e) => {
    const { name, value } = e.target
    

    state.filters[name] = value
    

    render(state)
  })


  render(state);
};
// END