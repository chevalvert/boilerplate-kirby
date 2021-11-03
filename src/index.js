import { Component, render } from 'utils/jsx'

class Hello extends Component {
  template (props) {
    return <h1>Hello from {props.from}</h1>
  }
}

console.log('Hello from JavaScript')
render(<Hello from='JavaScript' />, document.body)
