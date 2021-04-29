import { Component } from 'react'
import { Flipper, Flipped } from 'react-flip-toolkit'
import { BsPencil, BsTrash } from 'react-icons/bs'
import { MdRemove, MdAdd } from 'react-icons/md'

import { IoIosArrowUp, IoIosArrowDown } from 'react-icons/io'

class Accordion extends Component {
  constructor(props) {
    super(props)

    this.state = {
      active: -1,
      items: []
    }

    this.move = this.move.bind(this)
    this.setStateFromProps = this.setStateFromProps.bind(this)
    this.toggleAccordion = this.toggleAccordion.bind(this)
    this.onOrder = this.onOrder.bind(this)
  }

  componentDidMount() {
    this.setStateFromProps()
  }

  componentDidUpdate(prevProps) {
    if (this.state.items != prevProps.items) this.setStateFromProps()
  }

  resetState(type) {
    switch (type) {
      case 'accordion':
        this.setState({ active: -1 })
      default:
        return
    }
  }

  move = (from, to) => {
    const items = this.state.items

    items.splice(to, 0, items.splice(from, 1)[0])
    return items
  }

  setStateFromProps() {
    this.setState({ items: this.props.items })
  }

  setPropsFromState() {
    this.props.onItemsOrderChanged(this.state.items)
  }

  toggleAccordion(index) {
    if (this.state.active == index) {
      this.setState({ active: -1 })
      return
    }
    this.setState({ active: index })
  }

  onOrder(type, index) {
    this.resetState('accordion')
    const items = [...this.state.items]
    let newIndex

    if (type == 'up') newIndex = index > 0 ? index - 1 : items.length - 1
    else if (type == 'down')
      newIndex = index === items.length - 1 ? 0 : index + 1

    this.setState({ items: this.move(index, newIndex) })
    this.setPropsFromState()
  }

  render() {
    const { isEditor } = this.props
    const accordionTogglerId = (id) =>
      isEditor ? 'accordion-toggler' : `accordion-toggler-${id}`

    return (
      <div className="erb-accordion">
        {isEditor ? (
          <Flipper flipKey={this.state.items.map((i) => i.id).join('')}>
            {this.state.items.map((item, index) => (
              <Flipped key={item.id} flipId={item.id}>
                <div key={index} className="erb-accordion__single">
                  <div
                    className={`erb-accordion__single-head ${
                      this.state.active == index ? 'active' : ''
                    }`}
                    onClick={(e) => {
                      if (e.target.className != 'erb-accordion__title') return
                      this.toggleAccordion(index)
                    }}
                    id={accordionTogglerId(item.id)}
                    aria-expanded="false"
                  >
                    <h3 className="erb-accordion__title">{item.title}</h3>
                    {isEditor ? (
                      <div className="erb-accordion__action">
                        <button
                          className="up"
                          onClick={() => this.onOrder('up', index)}
                        >
                          <IoIosArrowUp />
                        </button>
                        <button
                          className="down"
                          onClick={() => this.onOrder('down', index)}
                        >
                          <IoIosArrowDown />
                        </button>
                        <button
                          className="edit"
                          onClick={() => this.props.onEdit(item.id)}
                        >
                          <BsPencil color="green" />
                        </button>
                        <button
                          className="delete"
                          onClick={() => this.props.onDelete(item.id)}
                        >
                          <BsTrash color="red" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div
                          className="erb-accordion__toggleIcon"
                          tabIndex="1"
                          aria-controls={`accordion-panel` + item.id}
                        >
                          <div className="plus">
                            <MdAdd color="#03a0b0" />
                          </div>
                          <div className="dash">
                            <MdRemove color="#00636E" />
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div
                    id={`accordion-panel` + item.id}
                    className="erb-accordion__content"
                    aria-label={item.title}
                    dangerouslySetInnerHTML={{ __html: item.content }}
                  ></div>
                </div>
              </Flipped>
            ))}
          </Flipper>
        ) : (
          <>
            {this.props.items.map((item, index) => (
              <div key={index} className="erb-accordion__single">
                <div
                  className={`erb-accordion__single-head ${
                    this.state.active == index ? 'active' : ''
                  }`}
                  onClick={(e) => {
                    if (e.target.className != 'erb-accordion__title') return
                    this.toggleAccordion(index)
                  }}
                  id={accordionTogglerId(item.id)}
                  aria-expanded="false"
                >
                  <h3 className="erb-accordion__title">{item.title}</h3>
                  <div
                    className="erb-accordion__toggleIcon"
                    tabIndex="1"
                    aria-controls={`accordion-panel` + item.id}
                  >
                    <div className="plus">
                      <MdAdd color="#03a0b0" />
                    </div>
                    <div className="dash">
                      <MdRemove color="#00636E" />
                    </div>
                  </div>
                </div>
                <div
                  id={`accordion-panel` + item.id}
                  className="erb-accordion__content"
                  aria-label={item.title}
                  dangerouslySetInnerHTML={{ __html: item.content }}
                ></div>
              </div>
            ))}
          </>
        )}
      </div>
    )
  }
}

export default Accordion
