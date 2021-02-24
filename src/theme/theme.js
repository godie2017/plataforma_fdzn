import { createMuiTheme } from '@material-ui/core/styles';
import palette from './styles';

const Theme = createMuiTheme({
  typograpy : {
    useNextVariants: true
  },
  palette: {
    primary: palette.Primary,
    secondary: palette.Secondary,
    common:{
      white: 'FF4081'
    }
  },
  spacing: 10
})

const drawerWidth = 240; //240

const theme = {
  root: {
    display: 'flex',
  },
  drawer: {
    [Theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
      display: '', // al poner en none elimina el side bar
    },
  },
  appBar: {
    backgroundColor: Theme.palette.primary.main,
    [Theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      display: '', //al poner en none elimina la barra superior
    },
  },
  menuButton: {
    marginRight: Theme.spacing(2),
    [Theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: Theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: Theme.spacing(3),
  }
}

export  { theme, Theme}
