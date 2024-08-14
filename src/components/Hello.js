export const selector = '.hello'

export function hydrate (element) {
  console.log(element.innerText)
  element.addEventListener('click', () => {
    console.log(element.innerText.replace('Hello', 'Hello again'))
  })

  return {
    destroy: () => console.log(element.innerText.replace('Hello', 'Bye'))
  }
}
