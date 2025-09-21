import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./HomeDesign/Home";
import Loginpage from './LoginPage';
import DetailsPage from './Adddetailspage/addDetails';
import OrdersPage from './Myorders/orders';
import GarmentForm from './Adddetailspage/menitems/garmentfom';
import EarningsPage from './Earnings/EarningsPage';
export default function MainPageofTM() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Loginpage/>} />
        <Route path='/home' element={<Home />} />
        <Route path='/DetailsPage' element={<DetailsPage/>}/>
        <Route path='/OrdersPage' element={<OrdersPage/>}/>
        <Route path="/men/:garmentType" element={<GarmentForm />} />
        <Route path="/EarningsPage" element={<EarningsPage/>} />

        
      </Routes>
    </Router>
  );
}