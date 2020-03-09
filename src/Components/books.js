import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';


const APIBaseURL = 'http://ec2-13-235-103-88.ap-south-1.compute.amazonaws.com/api/v1';

export default class Books extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bookData: [],
            editDialogOpen: false,
            showNewAuthor: false,
            edit_name: '',
            edit_arrAuthors: [],
            edit_arrGenres: [],
            edit_id: 0,
            delete_id:0,
            genreData: [],
            authorData: [],
            newAuthorName: '',
            dialogHeader:'Edit Book',
            dialogButtonText: 'Update',
            filter_genre: null,
            filter_author:null
        }
        this.openEditDialog = this.openEditDialog.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.showHideField = this.showHideField.bind(this);
        this.saveNewAuthor = this.saveNewAuthor.bind(this);
        this.getData = this.getData.bind(this);
        this.onSelectTag_gen = this.onSelectTag_gen.bind(this);
        this.onSelectTag_auth = this.onSelectTag_auth.bind(this);
        this.handleChange = this.handleChange.bind(this);       
        this.updateBook = this.updateBook.bind(this);
        this.openDeleteDialog = this.openDeleteDialog.bind(this);
        this.deleteBook = this.deleteBook.bind(this);
        this.handleDelDialogClose = this.handleDelDialogClose.bind(this);
    }

    getData() {
        let local = this;
        axios.get(APIBaseURL + '/books/list/', {
            headers: {
                "authorization": localStorage.getItem('token')
            }
        })
            .then(function (response) {
                console.log(response);
                if (response.status == 200) {
                    local.setState({ bookData: response.data.results });
                }
            })
            .catch(function (error) {
                console.log(error);
            });

        axios.get(APIBaseURL+'/books/genres/', {
            headers: {
                "authorization": localStorage.getItem('token')
            }
        })
            .then(function (response) {
                console.log(response);
                if (response.status == 200) {
                    local.setState({ genreData: response.data.results });
                }
            })
            .catch(function (error) {
                console.log(error);
            });

        axios.get(APIBaseURL + '/users/authors/', {
            headers: {
                "authorization": localStorage.getItem('token')
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
    }

    componentDidMount() {
        this.getData();
    }

    openEditDialog(jsonData) {
        if (jsonData == null) {
            this.setState({
                editDialogOpen: true,
                edit_id: 0,
                edit_arrAuthors: [],
                edit_arrGenres: [],
                edit_name: '',
                dialogButtonText: 'Save',
                dialogHeader : 'Add Book'
            });
        }
        else {
            let data = JSON.parse(jsonData);
            this.setState({
                editDialogOpen: true,
                edit_id: data.id,
                edit_arrAuthors: data.author,
                edit_arrGenres: data.genre,
                edit_name: data.name,
                dialogButtonText: 'Update',
                dialogHeader: 'Edit Book'
            });
        }        
    }

    handleClose() {
        this.setState({ editDialogOpen: false });
    }

    showHideField(flag) {
        this.setState({ showNewAuthor: flag });
    }

    saveNewAuthor() {
        let local = this;
        let data = {
            "name":this.state.newAuthorName
        };

        axios.post(APIBaseURL+'/users/author/create', data, {
            headers: {
                'Content-Type': 'application/json',
                "authorization": localStorage.getItem('token')
            }
        })
            .then(function (response) {
                console.log(response);
                if (response.status == 201) {
                    local.setState({
                        authorData: [...local.state.authorData, response.data],
                        edit_arrAuthors: [...local.state.edit_arrAuthors, response.data],
                        newAuthorName: '',
                        showNewAuthor:false
                    })                                         
                    //localStorage.setItem('token', response.data.token);
                    //this.context.router.push('/home');
                }
            })
            .catch(function (error) {
                console.log(error.response);                
                    alert('something went wrong');
                //history.push("/home");
            });
    }

    handleChange = (event) => {
        let name = event.target.name;
        let value = event.target.value;

        this.setState({[name]:value});
    }
    
    onSelectTag_gen(e, value) {
        this.setState({
            edit_arrGenres: value
        })
    }

    onSelectTag_auth(e, value) {
        this.setState({
            edit_arrAuthors: value
        })
    }

    updateBook() {            
        let local = this;
        let arrAuthors = [], arrGenre = [];
        for (var i = 0; i < this.state.edit_arrAuthors.length; i++) {
            arrAuthors.push(this.state.edit_arrAuthors[i].id);
        }
        for (var j = 0; j < this.state.edit_arrGenres.length; j++) {
            arrGenre.push(this.state.edit_arrGenres[j].id);
        }

        let data = {
            "name": this.state.edit_name,
            "author": arrAuthors,
            "genre": arrGenre
        };   

        let url;

        if (this.state.edit_id > 0) {
            axios.put(APIBaseURL+'/books/' + this.state.edit_id +'/', data, {
                headers: {
                    'Content-Type': 'application/json',
                    "authorization": localStorage.getItem('token')
                }
            })
            .then(function (response) {
                console.log(response);
                if (response.status == 201) {   
                    local.setState({
                        editDialogOpen: false
                    });
                    local.getData();
                }
            })
                .catch(function (error) {
                    console.log(error.response);
                        alert('something went wrong');
                });
        }
        else {
            axios.post(APIBaseURL+'/books/', data, {
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': localStorage.getItem('token')
                }
            })
            .then(function (response) {
                console.log(response);
                if (response.status == 201) {
                    local.setState({
                        editDialogOpen: false
                    });
                    local.getData();
                }
            })
                .catch(function (error) {
                    console.log(error.response);
                        alert('something went wrong');
                });
        }
    }

    openDeleteDialog(Id) {        
            this.setState({
                deleteDialogOpen: true,
                delete_id:Id
            });
    }

    deleteBook() {
        let local = this;
        axios.delete(APIBaseURL + '/books/' + this.state.delete_id + '/', {
            headers: {
                'authorization': localStorage.getItem('token')
            }
        })
            .then(function (response) {
                console.log(response);
                if (response.status == 201) {
                    local.setState({
                        deleteDialogOpen: false
                    });
                    local.getData();
                }
            })
            .catch(function (error) {
                console.log(error.response);
                alert('something went wrong');
            });
    }

    handleDelDialogClose() {
        this.setState({
            deleteDialogOpen: false
        });
    }

    filterResult() {
        let local = this;

        let url = APIBaseURL+'/books/list/';

        if (this.state.filter_genre != null && this.state.filter_author != null)
            url += '?genre__id=' + this.state.filter_genre + '&author__id='+this.state.filter_author;
        else if (this.state.filter_genre != null)
            url += '?genre__id=' + this.state.filter_genre;
        else
            url += '?author__id='+this.state.filter_author;


        axios.get(url, {
            headers: {
                'authorization': localStorage.getItem('token')
            }
        })
            .then(function (response) {
                console.log(response);
                if (response.status == 200) {
                    local.setState({ bookData: response.data.results });
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
            width: 600,
            'background-color': '#f50057'
        };
        const paper1 = {
            'min-height': '40',
            width: 600,
            border: 1
        };   
        const select = {            
            width: 200,
            border: 1,
            margin : 20
        };   

        return (
            <div>
                <Grid xs={12} container direction="row"
                    justify="flex-end"
                    alignItems="center">
                    <div xs={2}><Button variant="contained" color="primary" onClick={() => { this.openEditDialog(null) }}>Add New Book</Button></div>
                </Grid>
                <Grid xs={12} container direction="row"
                    justify="flex-start"
                    alignItems="center">            
                    <span>Filter By: </span>

                    <FormControl>
                        <InputLabel id="demo-simple-select-label">Genre</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={this.state.filter_genre}
                            onChange={this.handleChange}
                            name="filter_genre"
                            style={select}
                        >
                            {
                                this.state.genreData.map((item, i) => (<MenuItem value={item.id}>{item.name}</MenuItem>))
                            }  
                        </Select>
                    </FormControl>               
                    <FormControl>
                        <InputLabel id="demo-simple-select-label1">Author</InputLabel>
                        <Select
                            labelId="demo-simple-select-label1"
                            id="demo-simple-select1"
                            value={this.state.filter_author}
                            onChange={this.handleChange}
                            name="filter_author"
                            style={select}
                        >
                            {
                                this.state.authorData.map((item, i) => (<MenuItem value={item.id}>{item.name}</MenuItem>))
                            }
                        </Select>
                    </FormControl>                    
                    <Button variant="contained" color="primary" onClick={() => { this.filterResult() }}>Apply Filters</Button>
                </Grid>
                <Grid container direction="row"
                    justify="flex-end"
                    alignItems="center" style={root} spacing="0">
                    <Grid item xs={9}>
                        <Paper style={paper} xs={12}>
                            <Grid container justify="center" spacing="0">
                                <Grid item xs={3}><span>Book</span></Grid>
                                <Grid item xs={3}><span>Author(s)</span></Grid>
                                <Grid item xs={3}><span>Genre(s)</span></Grid>
                                <Grid item xs={3}><span>Actions</span></Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    {this.state.bookData.map(value => (
                        <Grid item xs={9}>
                            <Paper style={paper1} xs={12}>
                                <Grid container justify="center" spacing="0">
                                    <Grid item xs={3}><span>{value.name}</span></Grid>
                                    <Grid item xs={3}><ul>{value.author.map((item, i) => (<li>{item.name}</li>))}</ul></Grid>
                                    <Grid item xs={3}><ul>{value.genre.map((item, i) => (<li>{item.name}</li>))}</ul></Grid>   
                                    <Grid item xs={3}><span><EditIcon onClick={() => { this.openEditDialog(JSON.stringify(value)) }} /><DeleteIcon onClick={() => { this.openDeleteDialog(value.id) }}/></span></Grid>
                                </Grid>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                <Dialog open={this.state.editDialogOpen} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">{this.state.dialogHeader}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                        </DialogContentText>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="Book"
                            label="Book"
                            type="text"
                            fullWidth
                            value={this.state.edit_name}   
                            onChange={this.handleChange}
                            name="edit_name"
                        />                       
                        <Autocomplete
                            multiple
                            id="tags-standard"
                            options={this.state.genreData}
                            getOptionLabel={option => option.name}
                            value={this.state.edit_arrGenres}
                            onChange={this.onSelectTag_gen}
                            filterSelectedOptions
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    label="Genere(s)"
                                    placeholder="Favorites"
                                />
                            )}
                        />
                        <Autocomplete
                            multiple
                            id="tags-standard"
                            options={this.state.authorData}
                            getOptionLabel={option => option.name}
                            value={this.state.edit_arrAuthors}
                            onChange={this.onSelectTag_auth}
                            filterSelectedOptions
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    variant="standard"
                                    label="Author(s)"
                                    placeholder="Favorites"
                                />
                            )}
                        />
                        {!this.state.showNewAuthor && <Button onClick={() => { this.showHideField(true) }} color="primary">
                            Add New Author
                        </Button>}
                        {this.state.showNewAuthor && <div>
                            <TextField
                                margin="dense"
                                id="txtNewAuthor"
                                label="Author name"
                                type="text"
                                name="newAuthorName"
                                fullWidth
                                value={this.state.newAuthorName}
                                onChange={this.handleChange}
                            />
                            <Button onClick={() => { this.showHideField(false) }} color="primary">
                                Cancel
                        </Button>
                            <Button onClick={() => { this.saveNewAuthor() }} color="primary">
                                Save Author
                        </Button>
                        </div>}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.updateBook} color="primary">
                            {this.state.dialogButtonText}
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog
                    open={this.state.deleteDialogOpen}
                    onClose={this.handleDelDialogClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">Delete Book</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Are you sure want to delete the selected book?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleDelDialogClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.deleteBook} color="primary" autoFocus>
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        )
    }
}