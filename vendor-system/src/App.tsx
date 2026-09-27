
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import './App.css'
import VendorLogin from './pages/VendorLogin'
import VendorDashboard from './pages/VendorDashboard'
import VendorProducts from './pages/VendorProducts'
import PDashboard from './pages/ParentDashboard'
import ComingSoon from './pages/ComingSoon'
import AddProduct from './pages/AddProduct'
import AddCategory from './pages/AddCategory'
function App() {
 

  return (
   <BrowserRouter>
   <Routes>
    <Route path="/" element={<VendorLogin/>}/>
    <Route path="/dashboard" element={<VendorDashboard/>}>
      <Route index element={<PDashboard/>}/>
      <Route path="Pdashboard" element={<PDashboard/>}/>
      <Route path="Products" element={<VendorProducts/>}/>
      <Route path="Addproducts" element={<AddProduct/>}/>
      <Route path="Addcategory" element={<AddCategory/>}/>
    
      <Route path="Cs" element={<ComingSoon/>}/>
    </Route>

   </Routes>
   </BrowserRouter>
  )
}

export default App
