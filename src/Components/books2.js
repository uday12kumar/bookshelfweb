import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import TableCell from '@material-ui/core/TableCell';
import { withStyles } from '@material-ui/core/styles';

import {
    DataTypeProvider,
    EditingState,
    FilteringState,
    IntegratedFiltering,
} from '@devexpress/dx-react-grid';
import {
    Grid,
    Table,
    TableHeaderRow,
    TableEditRow,
    TableEditColumn,
    TableFilterRow,
} from '@devexpress/dx-react-grid-material-ui';

import {
    generateRows,
    globalSalesValues,
} from '../demo-data/generator';

const top100Films = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
    { title: 'The Lord of the Rings: The Return of the King', year: 2003 },
    { title: 'The Good, the Bad and the Ugly', year: 1966 },
    { title: 'Fight Club', year: 1999 },
    { title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
    { title: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
    { title: 'Forrest Gump', year: 1994 },
    { title: 'Inception', year: 2010 },
    { title: 'The Lord of the Rings: The Two Towers', year: 2002 },
    { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { title: 'Goodfellas', year: 1990 },
    { title: 'The Matrix', year: 1999 },
    { title: 'Seven Samurai', year: 1954 },
    { title: 'Star Wars: Episode IV - A New Hope', year: 1977 },
    { title: 'City of God', year: 2002 },
    { title: 'Se7en', year: 1995 }
]

const getRowId = row => row.id;

//const BooleanFormatter = <ul>{[top100Films[13]].map((value, i) => (<li>{value.title}</li>))}</ul>;
const BooleanFormatter = ({ value }) => <ul>{[top100Films[13],top100Films[1]].map((item, i) => (<li>{item.title}</li>))}</ul>;
//const BooleanFormatter = ({ value }) => <Chip label={value ? 'Yes' : 'No'} />;

const BooleanEditor = ({ value, onValueChange }) => (
    <Autocomplete
        multiple
        id="tags-standard"
        options={top100Films}
        getOptionLabel={option => option.title}
        defaultValue={[top100Films[13], top100Films[1]]}
        //value={[top100Films[13], top100Films[1]]}
        renderInput={params => (
            <TextField
                {...params}
                variant="standard"
                label="Multiple values"
                placeholder="Favorites"
            />
        )}
    />
    //<Select
    //    input={<Input />}
    //    value={value ? 'Yes' : 'No'}
    //    onChange={event => onValueChange(event.target.value === 'Yes')}
    //    style={{ width: '100%' }}
    //>
    //    <MenuItem value="Yes">
    //        Yes
    //</MenuItem>
    //    <MenuItem value="No">
    //        No
    //</MenuItem>
    //</Select>
);

const BooleanTypeProvider = props => (
    <DataTypeProvider
        formatterComponent={BooleanFormatter}
        editorComponent={BooleanEditor}
        {...props}
    />
);


const styles = theme => ({
    cell: {
        width: '100%',
        padding: theme.spacing(1),
    },
    input: {
        fontSize: '14px',
        width: '100%',
    },
});

const UnitsFilterCellBase = ({ filter, onFilter, classes }) => (
    <TableCell className={classes.cell}>
        <Input
            className={classes.input}
            value={filter ? filter.value : ''}
            onChange={e => onFilter(e.target.value ? { value: e.target.value } : null)}
            placeholder="Filter..."
        />
    </TableCell>
);
const UnitsFilterCell = withStyles(styles, { name: 'UnitsFilterCell' })(UnitsFilterCellBase);

const FilterCell = (props) => {
    const { column } = props;
    if (column.name === 'shipped') {
        return <UnitsFilterCell {...props} />;
    }
    return <TableFilterRow.Cell {...props} />;
};


export default () => {
    const [columns] = useState([
        { name: 'customer', title: 'Customer' },
        { name: 'product', title: 'Product' },
        { name: 'units', title: 'Units' },
        { name: 'shipped', title: 'Shipped' },
    ]);
    const [rows, setRows] = useState(generateRows({
        columnValues: { id: ({ index }) => index, ...globalSalesValues },
        length: 8,
    }));
    const [booleanColumns] = useState(['shipped']);

    const commitChanges = ({ added, changed, deleted }) => {
        let changedRows;
        if (added) {
            const startingAddedId = rows.length > 0 ? rows[rows.length - 1].id + 1 : 0;
            changedRows = [
                ...rows,
                ...added.map((row, index) => ({
                    id: startingAddedId + index,
                    ...row,
                })),
            ];
        }
        if (changed) {
            changedRows = rows.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
        }
        if (deleted) {
            const deletedSet = new Set(deleted);
            changedRows = rows.filter(row => !deletedSet.has(row.id));
        }
        setRows(changedRows);
    };

    return (
        <Paper>
            <Grid
                rows={rows}
                columns={columns}
                getRowId={getRowId}
            >
                <BooleanTypeProvider
                    for={booleanColumns}
                    
                />
                <EditingState
                    onCommitChanges={commitChanges}                    
                />
                <FilteringState defaultFilters={[]} />
                <IntegratedFiltering />
                <Table />
                <TableHeaderRow />
                <TableEditRow />
                <TableEditColumn
                    showAddCommand
                    showEditCommand
                    showDeleteCommand
                />
                <TableFilterRow cellComponent={FilterCell}/>
            </Grid>
        </Paper>
    );
};
