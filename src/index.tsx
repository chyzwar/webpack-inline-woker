import ReactDOM from 'react-dom';

const createWorker = () => {
  new Worker(new URL('./worker', import.meta.url))
}

const App = () => {
  createWorker();
  
  return <h1>Inline worker</h1>
}

ReactDOM.render(<App />, document.getElementById('root'));
