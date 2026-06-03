import uniqueId from 'lodash/uniqueId.js';

// BEGIN
export default () => {
  const generalListId = uniqueId()
  const state = {
    activeListId: generalListId,
    lists: [
      { id: generalListId, name: 'General' }
    ],
    tasks: []
  }

  const listsContainer = document.querySelector('[data-container="lists"]')
  const tasksContainer = document.querySelector('[data-container="tasks"]')
  
  const newListForm = document.querySelector('[data-container="new-list-form"]')
  const newTaskForm = document.querySelector('[data-container="new-task-form"]')

  const render = () => {
    if (state.lists.length === 0) {
      listsContainer.innerHTML = ''
    } else {
      const ul = document.createElement('ul')
      state.lists.forEach((list) => {
        const li = document.createElement('li')
        if (list.id === state.activeListId) {
          const b = document.createElement('b')
          b.textContent = list.name
          li.append(b)
        } else {
          const a = document.createElement('a')
          a.href = `#${list.name.toLowerCase()}`
          a.textContent = list.name
          a.addEventListener('click', (e) => {
            e.preventDefault()
            state.activeListId = list.id
            render()
          })
          li.append(a)
        }
        ul.append(li)
      })
      listsContainer.innerHTML = ''
      listsContainer.append(ul)
    }

    const currentTasks = state.tasks.filter((task) => task.listId === state.activeListId)
    
    if (currentTasks.length === 0) {
      tasksContainer.innerHTML = ''
    } else {
      const ul = document.createElement('ul')
      currentTasks.forEach((task) => {
        const li = document.createElement('li')
        li.textContent = task.name
        ul.append(li)
      })
      tasksContainer.innerHTML = ''
      tasksContainer.append(ul)
    }
  }

  newListForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const listName = formData.get('name').trim()
    
    const listExists = state.lists.some((list) => list.name.toLowerCase() === listName.toLowerCase())
    
    if (listName && !listExists) {
      const newList = {
        id: uniqueId(),
        name: listName
      }
      state.lists.push(newList)
      newListForm.reset()
      render()
    } else {
      newListForm.reset()
    }
  })

  newTaskForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const taskName = formData.get('name').trim()

    if (taskName) {
      const newTask = {
        id: uniqueId(),
        listId: state.activeListId,
        name: taskName
      }
      state.tasks.push(newTask)
      newTaskForm.reset()
      render()
    }
  })

  render()
}
// END