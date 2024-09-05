import React, { useState } from 'react';
import './sidebar.css'
import logoo from '../../image/soms_website_log.webp'
import SchoolIcon from '@mui/icons-material/School';
import ApprovalIcon from '@mui/icons-material/Approval';
import ArticleIcon from '@mui/icons-material/Article';
import CollectionsIcon from '@mui/icons-material/Collections';
import InfoIcon from '@mui/icons-material/Info';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
const Sidebar = () => {
  const [accessss, setAccessss] = useState(localStorage.getItem('accesss'))
  const [tog, setTog] = useState(false)
  const logoutEvent = () => {
    localStorage.removeItem('token')
    window.location.reload()
  }
  return (
    <div id='sidebar'>
      <img src={logoo} alt='logoo' />
      <ul>
        {
          accessss === 'Editer Access' ? (
            <li><Link style={{ color: 'white', textDecoration: 'none', display: 'flex', gap: 10 }} to='/admin'><AdminPanelSettingsIcon /> Admin</Link></li>
          ) : (null)
        }
        <li onClick={() => setTog(!tog)} style={{ color: 'white', textDecoration: 'none' }}><Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}><Box><AutoStoriesIcon style={{ marginRight: 5 }} /> Pages</Box> {tog ? (<ArrowDropUpIcon onClick={() => setTog(!tog)} />) : (<ArrowDropDownIcon onClick={() => setTog(!tog)} />)}</Box></li>
        {
          tog ? (
            <li style={{ padding: 'unset' }}>
              <ul style={{ width: '100%', background: '#ccc' }}>
                <li style={{ background: 'unset' }}><Link style={{ color: 'black', textDecoration: 'none', display: 'flex', gap: 10 }} to='/vacancy'><ArticleIcon /> Vacancy</Link></li>
                <li style={{ background: 'unset' }}><Link style={{ color: 'black', textDecoration: 'none', display: 'flex', gap: 10 }} to='/gallery'><CollectionsIcon /> Gallery</Link></li>
                <li style={{ background: 'unset' }}><Link style={{ color: 'black', textDecoration: 'none', display: 'flex', gap: 10 }} to='/about'><InfoIcon /> About Us</Link></li>
                <li style={{ background: 'unset' }}><Link style={{ color: 'black', textDecoration: 'none', display: 'flex', gap: 10 }} to='/course'><LeaderboardIcon /> Course Lead</Link></li>
              </ul>
            </li>
          ) : (null)
        }

        <li><Link style={{ color: 'white', textDecoration: 'none', display: 'flex', gap: 10 }} to='/'><SchoolIcon /> Enquiry</Link></li>
        <li><Link style={{ color: 'white', textDecoration: 'none', display: 'flex', gap: 10 }} to='/career'><ApprovalIcon /> Career</Link></li>

      </ul>
      <Typography className='log_out_opt' onClick={logoutEvent}><LogoutIcon className='log_out_iconn' />LOGOUT</Typography>
    </div>
  );
}

export default Sidebar;
