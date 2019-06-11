import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    display: 'block',
    position: 'relative',
    width: '100%'
  },
  block: {
    margin: '2px',
    border: 'dashed grey 2px',
    backgroundColor: 'rgba(255,255,255,.8)',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999
  }
})

class DragAndDrop extends Component {
  constructor (props) {
    super(props)
    this.state = {
      dragging: false
    }
    this.handleDrag = this.handleDrag.bind(this)
    this.handleDragIn = this.handleDragIn.bind(this)
    this.handleDragOut = this.handleDragOut.bind(this)
    this.handleDrop = this.handleDrop.bind(this)

    this.dropRef = React.createRef()
  }

  handleDrag (e) {
    e.preventDefault()
    e.stopPropagation()
  }

  handleDragIn (e) {
    e.preventDefault()
    e.stopPropagation()
    this.dragCounter++
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      this.setState({ dragging: true })
    }
  }

  handleDragOut (e) {
    e.preventDefault()
    e.stopPropagation()
    this.dragCounter--
    if (this.dragCounter === 0) {
      this.setState({ dragging: false })
    }
  }

  handleDrop (e) {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ dragging: false })
    if (e.dataTransfer.getData('title')) {
      this.props.handleDrop(e.dataTransfer, this.props.dirId)
      e.dataTransfer.clearData()
      this.dragCounter = 0
    }
  }

  componentDidMount () {
    this.dragCounter = 0
    let div = this.dropRef.current
    div.addEventListener('dragenter', this.handleDragIn)
    div.addEventListener('dragleave', this.handleDragOut)
    div.addEventListener('dragover', this.handleDrag)
    div.addEventListener('drop', this.handleDrop)
  }

  componentWillUnmount () {
    let div = this.dropRef.current
    div.removeEventListener('dragenter', this.handleDragIn)
    div.removeEventListener('dragleave', this.handleDragOut)
    div.removeEventListener('dragover', this.handleDrag)
    div.removeEventListener('drop', this.handleDrop)
  }

  render () {
    return (
      <div
        className={this.props.classes.root}
        ref={this.dropRef}
      >
        {this.state.dragging && (
          <div className={this.props.classes.block} />
        )}
        {this.props.children}
      </div>
    )
  }
}
export default withStyles(styles)(DragAndDrop)
