
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Verify from './components/Verify';
import SignIn from './pages/Signin';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './pages/Dashboard';

export default function App() {
 
  return (
    <BrowserRouter>

      <Header/>

      <Routes>

        <Route path='/' element={<Home/>} />

        <Route path='/sign-up' element={<SignUp/>} />

        <Route path='/verify' element={<Verify/>} />

        <Route path='/sign-in' element={<SignIn/>} />

        <Route element={<PrivateRoute />} >
        
          <Route path='/dashboard' element={<Dashboard />} />

        </Route>
      
        {/* <Route path='/about' element={<About/>} />

        

        <Route element={<OnlyAdminPrivateRoute />} >
        
          <Route path='/create-post' element={<CreatePost/>} />

          <Route path='/update-post/:postId' element={<UpdatePost />} />

        </Route>

        

        <Route path='/search' element={<Search />} />

        <Route path='/projects' element={<Projects/>} />
        
        <Route path='/post/:postSlug' element={<PostPage />} /> */}

      </Routes>
    
    </BrowserRouter>
  )
}
