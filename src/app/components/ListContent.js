import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import List from '@material-ui/core/List'
import ListNoteItem from './ListNoteItem.js'
import ListDirItem from './ListDirItem.js'

import Slide from '@material-ui/core/Slide'

import OperationContent from './OperationContent.js'
import Collapse from '@material-ui/core/Collapse'

import API from '../../api/api.js'
import ListSubheader from '@material-ui/core/ListSubheader'

// use memo to enhance the render performance
const MemoListNoteItem = React.memo(ListNoteItem, (prev, next) => prev.href === next.href)
const MemoListDirItem = React.memo(ListDirItem, (prev, next) => prev.href === next.href)

const styles = theme => ({
  root: {
    width: '320px',
    height: '651px',
    maxHeight: '651px',
    position: 'relative',
    overflow: 'auto',
    padding: '0'
  },
  spinner: {
    display: 'flex',
    justifyContent: 'center',
    justifyItems: 'center',
    alignContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '651px',
    backgroundColor: 'rgba(0, 0, 0, 0.18)'
  },
  header: {
    padding: '0'
  }
})

class ListContent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      changingTab: false
    }
  }
  componentDidMount () {
    this.fetchData(this.props.tab)
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.tab === nextProps.tab) {
      return
    }
    this.fetchData(nextProps.tab)
  }

  fetchData (tab) {
    let result = []
    this.setState({ changingTab: true })
    if (tab === 'Recent') {
      result = API.getData('history')
    } else if (tab === 'Personal') {
      result = API.getData('personal')
    } else if (tab === 'Directory') {
    }
    // deal with the transition delay
    setTimeout(function () {
      this.props.setItems([])
      setTimeout(function () {
        this.props.setItems(result)
        this.setState({ changingTab: false })
      }.bind(this), 150)
    }.bind(this), 150)
  }

  // the render function
  render () {
    // destructuring assignment
    const { list, selectedList, selectItem, unSelectItem, deleteItems, setSelected } = this.props
    return (
      <List className={this.props.classes.root}>
        <ListSubheader className={this.props.classes.header} key='operation-container'>
          <Collapse in={selectedList.length > 0} mountOnEnter unmountOnExit style={{ transformOrigin: '0 0 0' }}>
            <OperationContent tab={this.props.tab} list={list} selectedList={selectedList} deleteItemsEvent={deleteItems} setSelectedEvent={setSelected} />
          </Collapse>
        </ListSubheader>
        {list.map((target, index) => (
          this.props.tab === 'Directory' ? (
            <Slide
              in={!this.state.changingTab}
              direction='right'
              mountOnEnter
              unmountOnExit
              timeout={150}
              key={`slide-${index}`}>
              <MemoListDirItem title={target.title} href={target.href} displayCheckbox={selectedList.length > 0} checked={selectedList.findIndex(iter => iter.href === target.href) !== -1} selectItemEvent={selectItem} unSelectItemEvent={unSelectItem} />
            </Slide>
          ) : (
            <Slide
              in={!this.state.changingTab}
              direction='right'
              mountOnEnter
              unmountOnExit
              timeout={150}
              key={`slide-${index}`}>
              <MemoListNoteItem title={target.title} href={target.href} displayCheckbox={selectedList.length > 0} checked={selectedList.findIndex(iter => iter.href === target.href) !== -1} selectItemEvent={selectItem} unSelectItemEvent={unSelectItem} />
            </Slide>
          )
        ))}
      </List>
    )
  }
}

ListContent.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(ListContent)