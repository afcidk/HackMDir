import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

import List from '@material-ui/core/List'
import ListNoteItem from './ListNoteItem.js'
import ListDirItem from './ListDirItem.js'

import Slide from '@material-ui/core/Slide'

import CircularProgress from '@material-ui/core/CircularProgress'
import OperationContent from './OperationContent.js'
import Collapse from '@material-ui/core/Collapse'

import API from '../../api/api.js'
import ListSubheader from '@material-ui/core/ListSubheader'

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
      fetching: false
    }
  }

  async componentDidMount () {
    await this.fetchData(this.props.tab)
  }

  async componentWillReceiveProps (nextProps) {
    if (this.props.tab === nextProps.tab) {
      return
    }
    await this.fetchData(nextProps.tab)
  }

  setAsyncState (newState) {
    return new Promise((resolve, reject) => this.setState(newState, () => resolve()))
  }

  async fetchData (tab) {
    try {
      await this.setAsyncState({ fetching: true })
      let result = []
      if (tab === 'Recent') {
        result = await API.getHistory()
      } else if (tab === 'Personal') {
        result = await API.getPersonal()
      } else if (tab === 'Directory') {
      }
      this.props.setItems(result)
      setTimeout(function () {
        this.setState({ fetching: false })
      }.bind(this), 200)
    } catch (error) {
      console.log(error)
      this.setState({ fetching: false })
    }
  }

  // the render function
  render () {
    // destructuring assignment
    const { list, selectedList, selectItem, unSelectItem, deleteItems, setSelected } = this.props
    return (
      <List className={this.props.classes.root}>
        <div key='spinner'
          className={this.props.classes.spinner}
          style={{ display: this.state.fetching ? 'flex' : 'none' }}>
          <CircularProgress />
        </div>
        <ListSubheader className={this.props.classes.header} key='operation-container'>
          <Collapse in={selectedList.length > 0} mountOnEnter unmountOnExit style={{ transformOrigin: '0 0 0' }}>
            <OperationContent tab={this.props.tab} list={list} selectedList={selectedList} deleteItemsEvent={deleteItems} setSelectedEvent={setSelected} />
          </Collapse>
        </ListSubheader>
        {list.map((target, index) => (
          this.props.tab === 'Directory' ? (
            <Slide
              in={!this.state.fetching}
              direction='right'
              mountOnEnter
              unmountOnExit
              timeout={150}
              key={`slide-${index}`}>
              <ListDirItem />
            </Slide>
          ) : (
            <Slide
              in={!this.state.fetching}
              direction='right'
              mountOnEnter
              unmountOnExit
              timeout={150}
              style={{ transitionDelay: `${50 / list.length}ms` }}
              key={`slide-${index}`}>
              <ListNoteItem title={target.title} href={target.href} displayCheckbox={selectedList.length > 0} checked={selectedList.findIndex(iter => iter.href === target.href) !== -1} selectItemEvent={selectItem} unSelectItemEvent={unSelectItem} />
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
