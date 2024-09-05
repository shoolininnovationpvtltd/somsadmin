import { Box, Modal, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import instance from '../../config/axios.config'
import DeleteIcon from '@mui/icons-material/Delete';
import { burl } from '../../config/axios.config'

const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '50%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  borderRadius: 2
};
const About = () => {
  const [open, setOpen] = React.useState(false);
  const [accessss, setAccessss] = useState(localStorage.getItem('accesss'))
  // ------------------
  const [imgg, setImgg] = useState('')
  const [aboutt, setAboutt] = useState('')
  const [gabout, setGabout] = useState([])
  // ----------------
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // post about
  const submitHandler = () => {
    if (imgg !== '' && aboutt !== '') {
      const formData = new FormData();
      formData.append("description", aboutt)
      formData.append("file", imgg)
      instance.post("/about/add", formData, { headers: { "Content-Type": "multipart/form-data" } })
        .then((res) => {
          console.log(res.data);
          setOpen(false)
          getAbout()
        }
        )
    } else {
      alert('Please pill all input fields')
    }

  }
  // get about
  const getAbout = () => {
    instance.get('/about/get').then((res) => {
      setGabout(res.data)
    })
  }
  // delete about
  const deleteabout = (deleteId) => {
    instance.delete(`/about/delete/${deleteId}`).then((res) => {
      getAbout()
    }
    ).catch((err) => {
      console.log("delete list failed", err)
    })
  }
  useEffect(() => {
    getAbout()
  }, [])
  return (
    <div>
      <Box className='page_top'>
        <Typography className='page_head'>About Us</Typography>
        <button className='data_add_btn' onClick={handleOpen}>Add About</button>
      </Box>
      <Box className='paginate_holder'>
      </Box>
      <Box style={{ height: '62vh', overflowY: 'scroll' }}>
        <table className='table table-hover'>
          <thead>
            <tr className='tble_hd'>
              <th>IMAGE (500px/500px)</th>
              <th>DESCRIPTION (To give space or enter between paragraps type "br" and write in next row)</th>
              {
                accessss === 'Editer Access' ? (
                  <th>ACTION</th>
                ) : (null)
              }
            </tr>
          </thead>
          {gabout.length > 0 ? (
            <tbody>
              {
                gabout.map((e) => (
                  <tr className='tble_bdy' key={e._id}>
                    <td><img src={`${burl}aboutimg/${e.pdf}`} style={{ width: 300 }} alt='captain' /></td>
                    <td>{e.description}</td>
                    {
                      accessss === 'Editer Access' ? (
                        <td className='action_icon_holder'><DeleteIcon onClick={() => deleteabout(e._id)} className='action_icon text-danger' style={{ color: '#003068' }} /></td>
                      ) : (null)
                    }
                  </tr>
                ))
              }
            </tbody>
          ) : (null)}

        </table>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography className='modal_head'>ADD ABOUT</Typography>
            <input type='file' className='text_modall' onChange={(e) => setImgg(e.target.files[0])} />
            <label>Description:</label>
            <textarea className='text_modall' rows={10} onChange={(e) => setAboutt(e.target.value)}></textarea>
            <button className='sub_btnn' onClick={submitHandler}>SUBMIT</button>
          </Box>
        </Modal>
      </Box>
    </div>
  );
}

export default About;
