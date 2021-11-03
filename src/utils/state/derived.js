import { Writable } from './writable'

function derived (observables, cb) {
  const value = new Writable()

  const setValue = value.set.bind(value)
  delete value.set

  const isArray = Array.isArray(observables)
  let values = isArray ? (new Array(observables.length)) : null

  if (isArray) {
    for (let i = 0, l = observables.length; i < l; i++) {
      values[i] = observables[i].current
      observables[i].subscribe(function (v) {
        values[i] = v
        derive()
      })
    }
  } else {
    values = observables.current
    observables.subscribe(function (v) {
      values = v
      derive()
    })
  }

  derive()

  function derive () {
    const result = cb(values)
    if (result && result.then) result.then(setValue)
    else setValue(result)
  }

  return value
}

export default derived
