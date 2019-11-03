/* eslint-disable no-useless-constructor */
/* eslint-disable react/react-in-jsx-scope */
const { Component } = React;
const { render } = ReactDOM;
const root = document.getElementById('root');

class App extends Component {

    render() {
        return <Game width={25} height={25} />
    }
}

render(<App />, root);
