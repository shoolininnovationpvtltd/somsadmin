import { Box, Modal, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import instance from '../../config/axios.config'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
const style = {
  position: 'absolute',
  top: '40%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  borderRadius: 2
};
const Vacancy = () => {
  const [accessss, setAccessss] = useState(localStorage.getItem('accesss'))
  const [open, setOpen] = React.useState(false);
  const [vac, setVac] = useState('')
  const [togbtn, setTogbtn] = useState(true)
  const [evac, setVace] = useState('')
  const [uid, setUid] = useState('')
  const [vaccc, setVaccc] = useState([])
  const handleOpen = () => { setOpen(true); setTogbtn(true) };
  const handleClose = () => setOpen(false);

  // post vacancy
  const submitHandler = () => {
    if (vac !== '') {
      const dateObj = new Date();
      const month = dateObj.getMonth() + 1;
      const day = dateObj.getDate();
      const year = dateObj.getFullYear();
      const newDate = year + "/" + month + "/" + day;
      const payLoad = { name: vac, createdAt: newDate };
      instance.post('/Vacancy/add', payLoad)
        .then((res) => {
          setVac('')
          setVace('')
          setOpen(false)
          getVacancy()
        }
        )
      // .catch((err) => {
      //     console.log("add contact failed", err)
      // })
    } else {
      setVace('Please fill the input**')
    }
  }

  // get vacancy
  const getVacancy = () => {
    instance.get('/vacancy/get').then((res) => {
      setVaccc(res.data)
    }).catch((e) => {
      console.log(e);
    })
  }
  // delete vacancy
  const deletevacancy = (deleteId) => {
    instance.delete(`/vacancy/delete/${deleteId}`).then((res) => {
      getVacancy()
    }
    ).catch((err) => {
      console.log("delete list failed", err)
    })
  }

  // udate vacancy
  function updatehandleropen(updateId) {
    setTogbtn(false)
    setOpen(true)
    setUid(updateId)
  }
  function updatehandler() {
    const payLoad = { name: vac };
    if (vac !== '') {
      instance.put(`/vacancy/update/${uid}`, payLoad).then((res) => {
        console.log('list update success')
        getVacancy()
        setTogbtn(true)
        setOpen(false)
        setVac('')
      }
      ).catch((err) => {
        console.log("update list failed", err)
      })
    } else {
      setVace('Please fill the input**')
    }
  }
  useEffect(() => {
    getVacancy()
  }, [])
  return (
    <div>
      <Box className='page_top'>
        <Typography className='page_head'>Vacancy</Typography>
        <button className='data_add_btn' onClick={handleOpen}>Add Vacancy</button>
      </Box>
      <Box className='paginate_holder'>
      </Box>
      <Box style={{ height: '62vh', overflowY: 'scroll' }}>
        <table className='table table-hover'>
          <thead>
            <tr className='tble_hd'>
              <th>POST NAME</th>
              <th>DATE</th>
              {
                accessss === 'Editer Access' ? (
                  <th>ACTION</th>
                ) : (null)
              }
            </tr>
          </thead>
          <tbody>
            {
              vaccc.map((e) => (
                <tr className='tble_bdy' key={e._id}>
                  <td>{e.name}</td>
                  <td>{e.createdAt}</td>
                  {
                    accessss === 'Editer Access' ? (
                      <td className='action_icon_holder'><EditIcon className='action_icon' style={{ color: '#003068' }} onClick={() => updatehandleropen(e._id)} /><DeleteIcon className='action_icon text-danger' onClick={() => deletevacancy(e._id)} /></td>
                    ) : (null)
                  }
                </tr>
              ))
            }

          </tbody>
        </table>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography className='modal_head'>ADD VACANCY</Typography>
            <input type='text' placeholder='POST NAME' className='text_modall' value={vac} onChange={(e) => setVac(e.target.value)} />
            <Typography style={{ color: 'red' }}>{evac}</Typography>
            {
              togbtn ? (
                <button className='sub_btnn' onClick={submitHandler}>SUBMIT</button>
              ) : (
                <button className='sub_btnn' onClick={updatehandler}>UPDATE</button>
              )
            }
          </Box>
        </Modal>
      </Box>
    </div>
  );
}

export default Vacancy;
