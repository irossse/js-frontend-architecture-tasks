import axios from 'axios'

const routes = {
  tasksPath: () => '/api/tasks',
}


export default async () => {

  const state = {
    tasks: [],
  }


  const form = document.querySelector('.form-inline')
  const input = document.querySelector('input[name="name"]')
  const tasksContainer = document.querySelector('#tasks')


  const render = () => {
    tasksContainer.innerHTML = ''
    

    state.tasks.forEach((task) => {
      const li = document.createElement('li')
      li.classList.add('list-group-item')
      li.textContent = task.name
      tasksContainer.appendChild(li)
    })
  }


  try {
    const response = await axios.get(routes.tasksPath())

    state.tasks = response.data.items
    render()
  } catch (error) {
    console.error('Ошибка при загрузке задач:', error)
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault(); 

    const taskName = input.value.trim()
    if (!taskName) return

    const data = { name: taskName }

    try {
      const response = await axios.post(routes.tasksPath(), data)

      if (response.status === 201) {

        state.tasks.unshift(data)
        

        render()
        
    
        form.reset()
        input.focus()
      }
    } catch (error) {
      console.error('Ошибка при добавлении задачи:', error)
    }
  })
}
// END