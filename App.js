/* eslint-disable no-useless-constructor */
/* eslint-disable react/react-in-jsx-scope */
const { Component } = React;
const { render } = ReactDOM;
const root = document.getElementById('root');

class App extends Component {

    render() {
        return (
        <div id="app">
            <Game width={50} height={25} />
            <div className="footer">
                Made by Alex Morozoff at Fullstack Academy
            </div>
        </div>)
    }
}

render(<App />, root);
