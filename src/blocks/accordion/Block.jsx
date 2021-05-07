import { BsCardText } from 'react-icons/bs'
import Edit from './Edit'
import Save from './Save'

const { __ } = wp.i18n
const { registerBlockType } = wp.blocks

registerBlockType('erb/block-accordion', {
  title: __('Accordion - ERB Block'),
  icon: <BsCardText />,
  category: 'common',
  attributes: {
    items: {
      type: 'array',
      default: []
    }
  },
  keywords: [__('Accordion - nvn Block'), __('nvn Block'), __('accordion')],

  edit: Edit,

  save: Save
})
