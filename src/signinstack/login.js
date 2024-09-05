import { Box, Typography } from '@mui/material';
import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import instance from '../config/axios.config'
import './login.css'
const Login = () => {
    const [id, setId] = useState(null)
    const [pass, setPass] = useState(null)
    const [passtype, astPassType] = useState(true)

    const adminLogin = () => {
        instance.get(`admin/login/${id}/${pass}`).then((res) => {
            console.log(res.data.status);
            if (res.data.status === 'true') {
                console.log('login success');
                console.log(res.data.logindata[0].access);
                localStorage.setItem('token', 'verified')
                localStorage.setItem('accesss',res.data.logindata[0].access)
                window.location.reload()
                setId(null)
                setPass(null)
            } else {
                toast.error('Invalid Credentials');
            }
        })

    }
    return (
        <Box id='login'>
            <Box className='login'>
                <Typography className='log_head'>Login Here</Typography>
                <Box className='log_cont'>
                    <input type='text' placeholder='ENTER ID' className='log_inpp' onChange={(e) => setId(e.target.value)} />
                    <input type={passtype ? 'password' : 'text'} placeholder='ENTER PASSWORD' className='log_inpp' onChange={(e) => setPass(e.target.value)} />
                    <Typography className='password' onClick={() => astPassType(!passtype)}>View Password</Typography>
                </Box>
                <button className='log_btnn' onClick={() => adminLogin()}>Login</button>
            </Box>
            <Toaster style={{ background: 'red' }} />
        </Box>
    );
}

export default Login;
