import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Books from './books';
import Authors from './authors';
import { useHistory } from "react-router-dom";
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box p={3}>{children}</Box>}
        </Typography>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
    },
}));

export default function Home() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    let history = useHistory();
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const logOut = () => {
        localStorage.removeItem('token');
        history.push("/");
    }

    return (
        <div className={classes.root}>
            <Grid xs={12} container direction="row"
                justify="flex-end"
                alignItems="center">
                <div xs={2}><Button variant="contained" color="primary" onClick={logOut}>LogOut</Button></div>
            </Grid>
            <AppBar position="static">
                <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" centered variant="fullWidth">
                    <Tab label="Books" {...a11yProps(0)} />
                    <Tab label="Authors" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <Books/>
            </TabPanel>
            <TabPanel value={value} index={1}>
                <Authors/>
            </TabPanel>
        </div>
    );
}
