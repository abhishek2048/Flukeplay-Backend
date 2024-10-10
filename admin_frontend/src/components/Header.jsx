
import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';
import { AiOutlineSearch } from "react-icons/ai"
import { useDispatch, useSelector } from 'react-redux';
import { signoutSuccess } from '../redux/user/userslice';

export default function Header() {
    const dispatch = useDispatch();
    const path = useLocation().pathname;
    const { currentUser } = useSelector((state)=>state.user);
    const handleSignOut = async () => {
      try {
        const res = await fetch('/admin/signout',{
          method: "POST",
        });
        const data = await res.json();
        if(!res.ok){
          console.log(data.message);
        }else{
          dispatch(signoutSuccess());
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    return (
          <Navbar className='border-b-2 py-4 rounded-xl bg-inherit border-teal-500'>
              <Link to='/' className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold font-poppins' >
                  <span className='p-1 text-white bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl'>Wellness</span>
                  <span >Warriors</span>
              </Link>
              <form>
                  <TextInput 
                      type='text'
                      placeholder='Search...'
                      rightIcon={AiOutlineSearch}
                      className='hidden md:inline'
                  />
              </form>
              <Button className='w-12 h-10 md:hidden' color='gray' pill>
                  <AiOutlineSearch/>
              </Button>
              <div className='flex md:order-2'>
                {currentUser ? 
                  (
                    <Dropdown
                      arrowIcon={false}
                      inline
                      className='rounded-xl shadow-2xl'
                      label={
                        <Avatar alt='user' img={currentUser.imagePath} rounded className='h-10 w-16 object-cover' />
                      }
                    >
                      <Dropdown.Header className='rounded-lg'>
                        <span className='block text-sm'>@{currentUser.name}</span>
                        <span className='block text-sm font-medium truncate'>
                          {currentUser.email}
                        </span>
                      </Dropdown.Header>
                      <Link to={'/dashboard?tab=profile'}>
                        <Dropdown.Item className='rounded-lg'>Profile</Dropdown.Item>
                      </Link>
                      <Dropdown.Divider />
                      <Link to={'/dashboard'}>
                        <Dropdown.Item className='rounded-lg'>Dashboard</Dropdown.Item>
                      </Link>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={handleSignOut} className='rounded-lg'>Sign out</Dropdown.Item>
                    </Dropdown>
                  ) : (
                    <Link to='/sign-in'>
                      <Button gradientDuoTone="purpleToBlue" >
                        Sign In
                      </Button>
                    </Link>
                  )
                }
                <Navbar.Toggle/>
              </div>

              <Navbar.Collapse>
                  <Navbar.Link active={path === "/"} className='text-bold rounded-lg' as={'div'}>
                      <Link to="/">
                          Home
                      </Link>
                  </Navbar.Link>
                  <Navbar.Link active={path === "/about"} className='text-bold rounded-lg' as={'div'}>
                      <Link to="/about">
                      About
                      </Link>
                  </Navbar.Link>
                  <Navbar.Link active={path === "/dashboard"} className='text-bold rounded-lg' as={'div'}>
                      <Link to="/dashboard">
                          Dashboard
                      </Link>
                  </Navbar.Link>
              </Navbar.Collapse>
              
          </Navbar>
    )
}
