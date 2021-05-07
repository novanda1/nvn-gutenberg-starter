import { Component } from 'react'
import ReactDOM from 'react-dom'

const portal = document.createElement('div')
portal.setAttribute('id', 'nvn-portal')
document.body.appendChild(portal)

class Portal extends Component {
  constructor(props) {
    super(props)

    this.el = document.createElement('div')
    this.el.classList.add('nvn-modal')

    this.props.active
      ? this.el.classList.add('active')
      : this.el.classList.remove('active')
  }

  componentDidMount() {
    portal.appendChild(this.el)
  }

  componentWillUnmount() {
    portal.removeChild(this.el)
  }

  componentDidUpdate() {
    this.props.active
      ? this.el.classList.add('active')
      : this.el.classList.remove('active')
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el)
  }
}

export default Portal
