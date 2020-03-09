import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignUp() {
    const classes = useStyles();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [password2, setPassword2] = React.useState('');
    const [firstName, setfName] = React.useState('');
    const [lastName, setlName] = React.useState('');

    let history = useHistory();
    let form = React.useRef();
    const handleSubmit = (event) => {
        let data = {
            "first_name": firstName,
            "last_name":lastName,
            "email": email,
            "password": password,
            "password2": password2
        };
        axios.post('http://ec2-13-235-103-88.ap-south-1.compute.amazonaws.com/api/v1/users/register/', data, {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(function (response) {
                console.log(response);
                if (response.status == 201) {
                    //localStorage.setItem('token', response.data.token);
                    //this.context.router.push('/home');
                    alert('your account created');
                    history.push("/");
                }
            })
            .catch(function (error) {
                console.log(error.response);
                if (error.response.status == 400 && error.response.data != undefined && error.response.data != null) {
                    alert(error.response.data.email[0]);
                }
                else
                    alert('something went wrong');
                //history.push("/home");
            });

        // alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
    }
    const handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        switch (name) {
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                break;
            case 'password2':
                setPassword2(value);
                break;
            case 'firstName':
                setfName(value);
                break;
            case 'lastName':
                setlName(value);
                break;
        }        
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <ValidatorForm ref={form} className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextValidator
                                name="firstName"
                                variant="outlined"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                                value={firstName}
                                onChange={handleChange}
                                validators={['required']}
                                errorMessages={['this field is required']}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextValidator
                                variant="outlined"
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                value={lastName}
                                onChange={handleChange}
                                validators={['required']}
                                errorMessages={['this field is required']}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextValidator
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                value={email}
                                onChange={handleChange}
                                validators={['required', 'isEmail']}
                                errorMessages={['this field is required', 'email is not valid']}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextValidator
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password" 
                                value={password}
                                onChange={handleChange}
                                validators={['required']}
                                errorMessages={['this field is required']}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextValidator
                                variant="outlined"
                                required
                                fullWidth
                                name="password2"
                                label="Confirm Password"
                                type="password"
                                value={password2}
                                onChange={handleChange}
                                validators={['required']}
                                errorMessages={['this field is required']}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign Up
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link href="/" variant="body2">
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </ValidatorForm>
            </div>
        </Container>
    );
}