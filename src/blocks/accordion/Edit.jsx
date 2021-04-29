import { Component } from 'react'
import Accordion from '../../components/Accordion'
import Portal from '../../components/Portal'
import { IoAddCircleOutline } from 'react-icons/io5'
const { PlainText } = wp.blockEditor

import { CKEditor } from '@ckeditor/ckeditor5-react'
import BallonEditor from '@ckeditor/ckeditor5-build-balloon'

export default class Edit extends Component {
  constructor() {
    super(...arguments)

    this.resetState = this.resetState.bind(this)
    this.handleChangeInputTitle = this.handleChangeInputTitle.bind(this)
    this.handleChangeInputContent = this.handleChangeInputContent.bind(this)
    this.addNewItem = this.addNewItem.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.editItem = this.editItem.bind(this)
    this.handleEditItem = this.handleEditItem.bind(this)
    this.onItemsOrderChanged = this.onItemsOrderChanged.bind(this)

    this.state = {
      newItem: {
        id: Number,
        title: String,
        content: String
      },

      editor: {
        status: 'add',
        id: Number // for edit only
      },

      portal: {
        modal: false,
        delete: {
          open: false,
          id: Number
        }
      }
    }
  }

  resetState(type) {
    switch (type) {
      case 'all':
        this.setState({
          editor: { status: 'add' },
          newItem: { id: Number, title: '', content: '' },
          portal: {
            modal: false,
            delete: {
              open: false,
              id: Number
            }
          }
        })
        break

      default:
        return
    }
  }

  handleChangeInputTitle(event) {
    this.setState({
      newItem: { title: event, content: this.state.newItem.content }
    })
  }

  handleChangeInputContent(content) {
    this.setState({
      newItem: {
        title: this.state.newItem.title,
        content: content
      }
    })
  }

  async addNewItem() {
    const items = [...this.props.attributes.items]
    await this.setState({
      newItem: {
        id: items.length + 1,
        title: this.state.newItem.title,
        content: this.state.newItem.content
      }
    })
    items.push(this.state.newItem)
    await this.props.setAttributes({ items: items })

    this.resetState('all')
  }

  deleteItem(id) {
    this.setState({ portal: { modal: false, delete: { open: true, id } } })
  }

  async editItem(id) {
    const items = [...this.props.attributes.items]
    const item = items.find((item) => item.id == id)

    if (this.state.editor.status != 'edit') {
      await this.setState({ editor: { status: 'edit', id: id } })
    }

    await this.setState({ editor: { status: 'edit', id: id } })
    await this.setState({ newItem: item })
    this.setState({
      portal: {
        modal: true,
        delete: {
          open: false,
          id: Number
        }
      }
    })
  }

  async handleEditItem(id) {
    const items = [...this.props.attributes.items]
    const index = items.map((item) => item.id).indexOf(id)

    await this.setState({
      newItem: {
        id: id,
        title: this.state.newItem.title,
        content: this.state.newItem.content
      }
    })

    items[index] = this.state.newItem
    await this.props.setAttributes({ items: items })
    this.resetState('all')
  }

  onItemsOrderChanged(items) {
    this.props.setAttributes({ items: [...items] })
  }

  render() {
    const { newItem, editor } = this.state
    return (
      <>
        <div className={this.props.className}>
          <div className="erb-accordion__editor">
            <div className="erb-accordion__editor-head">
              <h3>Accordion - ERB</h3>
              <div className="action">
                <button
                  onClick={async () => {
                    await this.resetState('all')
                    this.setState({
                      portal: {
                        modal: true,
                        delete: {
                          open: false,
                          id: Number
                        }
                      }
                    })
                  }}
                >
                  Add
                  <IoAddCircleOutline />
                </button>
              </div>
            </div>

            <Accordion
              items={this.props.attributes.items}
              onDelete={(id) => this.deleteItem(id)}
              onEdit={(id) => this.editItem(id)}
              onItemsOrderChanged={this.onItemsOrderChanged}
              isEditor={true}
            />
          </div>
        </div>

        <Portal active={this.state.portal.modal}>
          <div
            className="erb-modal__bg"
            onClick={() => this.setState({ portal: { modal: false } })}
          ></div>
          <div className="erb-modal__content">
            <div className="erb-accordion__modal open">
              <h3 className="erb-text-center">
                {this.state.editor.status == 'add' ? 'Add' : 'Edit'} Item
              </h3>
              <div>
                <label>
                  <span className="erb-px-2 erb-text-base erb-font-medium erb-mb-2">
                    Title
                  </span>
                  <PlainText
                    value={newItem.title}
                    onChange={this.handleChangeInputTitle}
                    placeholder="Accordion title..."
                    className="erb-accordion__modal-title"
                  />
                </label>
                <label>
                  <span className="erb-px-2 erb-text-base erb-font-medium erb-mb-2">
                    Content
                  </span>
                  <CKEditor
                    editor={BallonEditor}
                    data={newItem.content}
                    className="erb-rounded-l-md"
                    config={{
                      toolbar: [
                        'bold',
                        'italic',
                        'link',
                        '|',
                        'numberedList',
                        'bulletedList',
                        '|',
                        'undo',
                        'redo'
                      ],
                      placeholder: 'Accordion content...'
                    }}
                    onChange={(_, editor) => {
                      const data = editor.getData()
                      this.handleChangeInputContent(data)
                    }}
                  />
                </label>
              </div>
              <button
                className="btn btn-black"
                type="button"
                onClick={() =>
                  editor.status == 'add'
                    ? this.addNewItem()
                    : this.handleEditItem(editor.id)
                }
              >
                {editor.status == 'add' ? 'Add' : 'Update'}
              </button>
            </div>
          </div>
        </Portal>

        <Portal active={this.state.portal.delete?.open}>
          <div
            className="erb-modal__bg"
            onClick={() => this.setState({ portal: { modal: false } })}
          ></div>
          <div className="erb-modal__content">
            <h3>
              {
                [...this.props.attributes.items].find(
                  (i) => i.id == this.state.portal.delete?.id
                )?.title
              }
            </h3>
            <h4 className="">Are you sure want to delete this item?</h4>

            <div className="erb-flex erb-gap-2">
              <button
                className="btn erb-bg-red-500 hover:erb-bg-red-600 erb-text-white"
                onClick={async () => {
                  const items = [...this.props.attributes.items]
                  const index = items
                    .map((item) => item.id)
                    .indexOf(this.state.portal.delete?.id)
                  items.splice(index, 1)
                  await this.props.setAttributes({ items })
                  this.resetState('all')
                }}
              >
                Sure, delete it!
              </button>
              <button
                className="btn btn-black"
                onClick={() => this.resetState('all')}
              >
                No, go back!
              </button>
            </div>
          </div>
        </Portal>
      </>
    )
  }
}
