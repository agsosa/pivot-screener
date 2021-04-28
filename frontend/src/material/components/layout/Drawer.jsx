import React from 'react';
import PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import MaterialDrawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import TelegramIcon from '@material-ui/icons/Telegram';
import FavoriteIcon from '@material-ui/icons/Favorite';
import HomeIcon from '@material-ui/icons/Home';
import BuildIcon from '@material-ui/icons/Build';
import TocIcon from '@material-ui/icons/Toc';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import AppsIcon from '@material-ui/icons/Apps';
import DvrIcon from '@material-ui/icons/Dvr';
import Typography from '@material-ui/core/Typography';
import { headerSafePadding } from 'material/components/layout/Header';
import { useHistory } from 'react-router';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import DonateModal from 'material/components/misc/DonateModal';

export const menuWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {},
  drawer: {
    zIndex: 1,
    [theme.breakpoints.up('sm')]: {
      width: menuWidth,
      flexShrink: 0,
    },
  },
  // necessary for content to be below app bar theme.mixins.toolbar
  toolbar: {
    paddingTop: headerSafePadding,
    [theme.breakpoints.down('sm')]: {
      paddingTop: theme.spacing(2),
    },
  },
  drawerPaper: {
    width: menuWidth,
  },
  title: {
    textAlign: 'center',
    padding: 10,
    // color: theme.palette.primary.dark,
    fontWeight: 'bold',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const camScreenersLinks = [
  { text: 'Cryptocurrency', path: '/screener/camarilla/cryptocurrency' },
  { text: 'Forex', path: '/screener/camarilla/forex' },
  { text: 'Commodities', path: '/screener/camarilla/commodities' },
  { text: 'Indices', path: '/screener/camarilla/indices' },
  { text: 'Stocks', path: '/screener/camarilla/stocks', disabled: true },
];

const cprScreenersLinks = [
  { text: 'Cryptocurrency', path: '/screener/cpr/cryptocurrency' },
  { text: 'Forex', path: '/screener/cpr/forex' },
  { text: 'Commodities', path: '/screener/cpr/commodities' },
  { text: 'Indices', path: '/screener/cpr/indices' },
  { text: 'Stocks', path: '/screener/cpr/stocks', disabled: true },
];

function Drawer(props, ref) {
  const donateModalRef = React.createRef();
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [openChildren, setOpenChildren] = React.useState([]); // Array of strings to know which navLinks with children are open

  /* 
    navLinks items:
      {
        icon: Component to render between ListItemIcon (optional)
        text: String to display as title
        description: String to display as subtitle
        disabled: Boolean to indicate if it's disabled (optional)
        renderDividerBelow: Boolean to render a <Divider/> below this item (optional)

        The following props have to be used individually:
          onClick: Function to execute on click (optional)
          path: Path to navigate to (optional)
          children: Array of navLinks to display as children with <Collapse /> (optional)
      }
  */
  // This variable is here to be able to use donateModalRef
  const navLinks = [
    { icon: <HomeIcon />, text: 'Home (Chart)', path: '/' },
    { icon: <TocIcon />, text: 'CPR Screeners', children: cprScreenersLinks },
    {
      icon: <ShowChartIcon />,
      text: 'CAM Screeners',
      children: camScreenersLinks,
      renderDividerBelow: true,
    },
    { icon: <DvrIcon />, text: 'Live Feed', path: '/', disabled: true },
    { icon: <BuildIcon />, text: 'Backtest', path: '/', disabled: true },
    { icon: <AppsIcon />, text: 'Calculator', path: '/calculator', renderDividerBelow: true },
    { icon: <TelegramIcon />, text: 'Contact (Telegram)', onClick: () => window.open('https://t.me/xref1x', '_blank') },
    {
      icon: <FavoriteIcon />,
      text: 'Donate Crypto',
      onClick: () => {
        if (donateModalRef.current) donateModalRef.current.toggle();
      },
    },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  React.useImperativeHandle(ref, () => ({
    toggle: handleDrawerToggle,
  }));

  function handleNavLinkClick(navLink) {
    // Handle navLink.path
    if (navLink.path) {
      history.push(navLink.path);
    }

    // Handle navLink.onClick
    if (navLink.onClick && typeof navLink.onClick === 'function') navLink.onClick();

    // Handle navLink.children (open/close children list)
    if (navLink.children && Array.isArray(navLink.children))
      // Toggle (remember than openChildren is an array of strings containing navLink.text if this navLink is open)
      setOpenChildren((old) => {
        if (openChildren.find((q) => q === navLink.text)) return old.filter((q) => q !== navLink.text);
        else return [...old, navLink.text];
      });
    else if (mobileOpen) handleDrawerToggle();
  }

  function RenderNavLink({ navLink, isChildren, hasChildren, isCollapseOpen }) {
    return (
      <ListItem
        button
        onClick={() => handleNavLinkClick(navLink)}
        disabled={navLink.disabled}
        style={isChildren ? { paddingLeft: '8%' } : {}}>
        <ListItemIcon>{navLink.icon}</ListItemIcon>
        <ListItemText primary={navLink.text} secondary={navLink.description} />
        {/* Render expand icon if this navLink has children */}
        {
          (() => {
            // Inline func for this nested condition
            if (hasChildren) {
              if (isCollapseOpen) return <ExpandLess />;
              else return <ExpandMore />;
            }
          })() /* call the inline func */
        }
      </ListItem>
    );
  }

  const drawer = (
    <>
      <div className={classes.toolbar} /> {/* Div to position the drawer below the top appbar */}
      {/* Drawer header */}
      <Typography variant='h5' className={classes.title}>
        Pivot Screener
      </Typography>
      {/* Drawer links */}
      <List>
        {navLinks.map((navLink) => {
          const hasChildren = navLink.children && Array.isArray(navLink.children);
          const isCollapseOpen = openChildren.find((q) => q === navLink.text) ? true : false;

          return (
            <div key={navLink.text}>
              {/* Render nav link */}
              <RenderNavLink navLink={navLink} hasChildren={hasChildren} isCollapseOpen={isCollapseOpen} />

              {/* Render children array */}
              {hasChildren && (
                <Collapse in={isCollapseOpen} timeout='auto' unmountOnExit>
                  <List component='div' disablePadding>
                    {navLink.children.map((child) => (
                      <RenderNavLink key={child.text} navLink={child} isChildren />
                    ))}
                  </List>
                </Collapse>
              )}

              {/* Render divider */}
              {navLink.renderDividerBelow && <Divider />}
            </div>
          );
        })}
      </List>
    </>
  );

  return (
    <>
      <nav className={classes.drawer} aria-label='mailbox folders'>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation='css'>
          <MaterialDrawer
            variant='temporary'
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}>
            {drawer}
          </MaterialDrawer>
        </Hidden>
        <Hidden smDown implementation='css'>
          <MaterialDrawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant='permanent'
            open>
            {drawer}
          </MaterialDrawer>
        </Hidden>
      </nav>
      <DonateModal ref={donateModalRef} />
    </>
  );
}

export default React.forwardRef(Drawer);
