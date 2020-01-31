// TodoBanner component
class TodoBanner extends React.Component {
    // render component
    render (){
        return (
            <h1 className="teal">ToDo-list with React</h1>
        )
    }
}

// TodoList component
class TodoList extends React.Component {
    // render component
    render () {
        return (
            <ul>
                {this.props.items.map((item, index) => 
                    <li key={index} >{item} <img src="images/delete.jpg" className="delete" onClick={() => this.props.removeItem(index)}/></li>)}
            </ul>
        )
    }
}

// TodoForm component
class TodoForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {item: ""};
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    // add new item => call parent
    handleSubmit (e) {
        // prevent normal submit event
        e.preventDefault();
        // add new item
        this.state.item = this.refs.item.value;
        // call parent
        this.props.onFormSubmit(this.state.item);
        // clear text input
        this.refs.item.value = "";
        // focus text input
        this.refs.item.focus();
    }
    // render component
    render (){
        return (
            <form onSubmit={this.handleSubmit}>
                <input type="text" ref="item"/>
                <input className="teal" type="submit" value="Add"/>
            </form>
        );
    }
}

// App component
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {items: []};
        this.addItem = this.addItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
    }
    // add new item
    addItem (newItem) {
        // add new item to items array
        let arr = this.state.items.slice();
        arr.push(newItem);
        // render again
        this.setState({items: arr})
        console.log(newItem);
    }
    // remove item
    removeItem (index){
        // remove from items array
        let arr = this.state.items.slice();
        arr.splice(index, 1);
        // render again
        this.setState({items: arr})
    }
    // render component
    render () {
        return (
            <div>
                <TodoBanner/>
                <TodoForm onFormSubmit={this.addItem}/>
                <TodoList items={this.state.items} removeItem={this.removeItem}/>
            </div>
        )
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById("toDo")
);