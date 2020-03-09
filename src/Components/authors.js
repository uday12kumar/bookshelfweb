import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';

const APIBaseURL = 'http://ec2-13-235-103-88.ap-south-1.compute.amazonaws.com/api/v1';
export default class Authors extends Component {

    constructor(props) {
        super(props);
        this.state = {
            authorData: [],
            authorData_nob: []
        }    
    }

    componentDidMount() {
        let local = this;
        axios.get(APIBaseURL+'/books/author/1', {
            headers: {
                'authorization': localStorage.getItem('token')
            }
        })
            .then(function (response) {
                console.log(response);
                if (response.status == 200) {
                    local.setState({ authorData: response.data.results });
                }
            })
            .catch(function (error) {
                console.log(error);
            });

        axios.get(APIBaseURL+'/books/author/0', {
            headers: {
                'authorization': localStorage.getItem('token')
            }
        })
            .then(function (response) {
                console.log(response);
                if (response.status == 200) {
                    local.setState({ authorData_nob: response.data.results });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {

        const root = {
            flexGrow: 1,
        };
        const paper = {
            height: 40,
            width: 500,
            'background-color': '#f50057'
        };
        const paper1 = {
            
            width: 500
        };


        return (
            <div>
                <Grid container style={root} spacing="0">
                    <Grid item xs={6}>
                        <h3>Authors with books</h3>
                    <Grid item xs={10}>
                        <Paper style={paper}>
                            <Grid container justify="center" spacing="0">                                
                                <Grid item xs={6}><span>Author Name</span></Grid>
                                <Grid item xs={6}><span>List of Books</span></Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                        {this.state.authorData.map(value => (
                            <Grid item xs={10}>
                                <Paper style={paper1} xs={12}>
                                    <Grid container justify="center" spacing="0">
                                        <Grid item xs={6}><span>{value.name}</span></Grid>
                                        <Grid item xs={6}><ul>{value.books.map((item, i) => (<li>{item.name}</li>))}</ul></Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        ))}                        
                    </Grid>
                    <Grid item xs={6}>
                        <h3>Authors without books</h3>
                        <Grid item xs={10}>
                            <Paper style={paper}>
                                <Grid container justify="center" spacing="0">
                                    <Grid item xs={6}><span>Author Name</span></Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                        {this.state.authorData_nob.map(value => (
                            <Grid item xs={10}>
                                <Paper style={paper1} xs={12}>
                                    <Grid container justify="center" spacing="0">
                                        <Grid item xs={6}><span>{value.name}</span></Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </div>
        )
    }
}