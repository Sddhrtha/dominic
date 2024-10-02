import { Routes, Route} from 'react-router-dom';
import Home  from './component/Home';
import Track from './component/page/Track';
import OrderProcess from './component/page/OrderProcess';
import Login from './component/page/login';
import Dashboard from './component/page/dashboard';
import Inventory from './component/page/inventory';
import ContractorsPage from './component/page/contractors';
import OrderPage from './component/page/orderPage';
import useAuth from './hooks/useAuth';
import RequireAuth from './component/page/requireAuth';

function App() {

  const ROLES = {
    'Manager': 'manager',
    'Contractor': 'contractor',
    'Site': 'site'
  }
  return (
    <Routes>
      {/*  Public Route */}
      <Route exact path='/login' element={<Login/>}/>
      {/* Private Route */}
      <Route element={<RequireAuth allowedRoles ={[ROLES.Manager]} />} >
        <Route path='/' element={<Home/>}>
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/inventory' element={<Inventory />} />
              <Route path='/contractors' element={<ContractorsPage />} />
              <Route path='/orders' element={<OrderPage />} />
        </Route>
      </Route>
      <Route element={<RequireAuth allowedRoles ={[ROLES.Site]} />} >
        <Route path='/track' element= {<Track />} />
      </Route>
      <Route element={<RequireAuth allowedRoles ={[ROLES.Contractor]} />} >
        <Route path='/process' element={<OrderProcess />} />
      </Route>
    </Routes>
  );
}

export default App;
