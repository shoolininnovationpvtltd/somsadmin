
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Main from './main'
import Sidebar from '../component/sidebar/sidebar'
import Header from '../component/header/header'
import { Box } from '@mui/material';
import Enquiry from '../tables/enquiry/enquiry';
import Career from '../tables/career/career';
import Vacancy from '../tables/vacancy/vacancy';
import Gallery from '../tables/gallery/gallery';
import About from '../tables/about/about';
import Admin from '../tables/admin/admin';
import Login from '../signinstack/login';
import Courselead from '../tables/courses/courselead';
const Routing = () => {
    const [accessss, setAccessss] = useState(localStorage.getItem('accesss'))
    const [log, setLog] = useState(false)
    useEffect(() => {
        if (localStorage.getItem('token') !== null) {
            setLog(true)
        } else {
            setLog(false)
        }
    }, [log])
    return (
        <BrowserRouter>
            {
                log ?
                    (
                        <Box style={{ display: 'flex', alignItems: 'flex-start' }}>
                            <Sidebar />
                            <Box id='main_layout'>
                                <Header />
                                <Box className='layout_data'>
                                    <Routes>
                                        <Route path='/' element={<Main/>}/>
                                        <Route index element={<Enquiry/>}/>
                                        <Route path='/career' element={<Career/>}/>
                                        <Route path='/vacancy' element={<Vacancy/>}/>
                                        <Route path='/gallery' element={<Gallery/>}/>
                                        <Route path='/about' element={<About/>}/>
                                        <Route path='/admin' element={<Admin/>}/>
                                        <Route path='/course' element={<Courselead />}/>
                                    </Routes>
                                </Box>
                            </Box>
                        </Box>
                    ) :
                    (
                        <Login />
                    )
            }

        </BrowserRouter>
    );
}

export default Routing;
