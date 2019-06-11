import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { useSnackbar } from 'notistack'

import Grid from '@material-ui/core/Grid'
import CloseIcon from '@material-ui/icons/Close'
import IconButton from '@material-ui/core/IconButton'

console.log(makeStyles)
const useStyles = makeStyles(theme => ({
  root: {
    width: '300px',
    height: '48px',
    fontSize: '12px',
    backgroundColor: '#333',
    borderRadius: '4px',
    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.18)',
    padding: '11px 16px',
    boxSizing: 'border-box'
  }
}))

const customSnackbar = (props) => {
  const classes = useStyles()
  const { closeSnackbar } = useSnackbar()
  const handleDismiss = () => {
    console.log(props.id)
    closeSnackbar(props.id)
  }

  return (
    <Grid container className={classes.root} justify='flex-start' alignContent='center' alignItems='center'>
      <Grid item xs={10}>
        <p style={{ padding: '0', margin: '0', textAlign: 'left' }}> {props.message} </p>
      </Grid>
      <Grid item xs={2}>
        <IconButton
          aria-label='Close message'
          onClick={handleDismiss}
        >
          <CloseIcon style={{ color: 'white' }} />
        </IconButton>
      </Grid>
    </Grid>
  )
}

export default customSnackbar
