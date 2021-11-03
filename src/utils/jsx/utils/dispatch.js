export function dispatch (component, cb, topDown) {
  const subs = component._collector && component._collector.components
  if (topDown) cb(component)
  if (subs) {
    for (let i = 0; i < subs.length; i++) dispatch(subs[i], cb)
  }
  if (!topDown) cb(component)
}

function callRefs (component) {
  for (let i = 0; i < component._collector.refs.length; i++) {
    component._collector.refs[i].fn(component._collector.refs[i].ref)
    // Is this really needed or a good thing ?
    component._collector.refs[i].ref = null
  }
}

function callStoreListeners (component) {
  for (let i = 0; i < component._collector.storeEvents.length; i++) {
    const event = component._collector.storeEvents[i]
    const oldfn = event.fn
		event.fn = function ( v ) { oldfn( v, event.el ) }; // eslint-disable-line
    event.store.subscribe(event.fn)
    if (event.init) event.fn(event.store.current)
  }
}

function callDomListeners (component) {
  if (component.test) console.log('call dom listeners', component._collector.domEvents)
  for (let i = 0; i < component._collector.domEvents.length; i++) {
    const event = component._collector.domEvents[i]
    event.el.addEventListener(event.evt, event.fn)
  }
}

export function dispatchRefs (component) {
  dispatch(component, callRefs)
}

export function dispatchListeners (component) {
  dispatch(component, callDomListeners)
  dispatch(component, callStoreListeners)
}
