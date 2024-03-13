import React from 'react';
import './styles.css'; // Assuming styles.css is in the src folder
import { myFunction } from './script'; // Adjust the path as necessary

function App() {
  // Example use of an imported function
  React.useEffect(() => {
    myFunction();
  }, []);

  return (
    <div className="App">
      <h1>Hello, React!</h1>
    </div>
  );
}

export default App;
