import Dashboard from './components/Dashboard';
import NavBar from './components/NavBar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AddNewInvestment from './components/AddNewInvestment';
import Grid from './components/Grid';

import './App.css';
import './index.css';

function App() {
	return (
		<BrowserRouter>
			<NavBar />
			<Routes>
				<Route path='/' element={<Dashboard />} />
				<Route path='/grid' element={<Grid />} />
				<Route path='/add-new' element={<AddNewInvestment />} />
				<Route path='*' element={<Dashboard />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
