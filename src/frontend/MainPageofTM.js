import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./HomeDesign/Home";
import Loginpage from './LoginPage';
import ProtectedRoute from './ProtectedRoute';
import DetailsPage from './Adddetailspage/addDetails';
import OrdersPage from './Myorders/orders';
import GarmentForm from './Adddetailspage/menitems/garmentfom';
import EarningsPage from './Earnings/EarningsPage';
export default function MainPageofTM() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Loginpage/>} />
        <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path='/DetailsPage' element={<ProtectedRoute><DetailsPage/></ProtectedRoute>}/>
        <Route path='/OrdersPage' element={<ProtectedRoute><OrdersPage/></ProtectedRoute>}/>
        <Route path="/men/:garmentType" element={<ProtectedRoute><GarmentForm /></ProtectedRoute>} />
        <Route path="/EarningsPage" element={<ProtectedRoute><EarningsPage/></ProtectedRoute>} />

        
      </Routes>
    </Router>
  );
}