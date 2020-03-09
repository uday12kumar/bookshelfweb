export default class DeleteButton extends Component {
    render() {
        return (
            <span><button onClick={() => this.buttonClick(this.props.node)}>X</button></span>
        );
    }
}

buttonClick = (e) => {

        this.setState({
            visible: true
        })
    let deletedRow = this.props.node.data;
    e.gridApi.updateRowData({ remove: [deletedRow] })  
};