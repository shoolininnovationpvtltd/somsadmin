import { Box, Modal, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import instance from '../../config/axios.config'
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
const Admin = () => {
    const [open, setOpen] = React.useState(false);
    const [togbtn, setTogbtn] = React.useState(true);
    const [addmin, setAddmin] = useState([])
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [access, setAccess] = useState('Editer Access')
    const [pass, setPass] = useState('')
    const [conpass, setConPass] = useState('')
    const [error, setError] = useState('')
    const [uid, setUid] = useState('')
    const handleOpen = () => { setOpen(true); setTogbtn(true) }
    const handleClose = () => setOpen(false);

    // post admin
    const submitHandler = () => {
        const payLoad = { name: name, email: email, access: access, apassword: pass };
        if (name !== '' && email !== '' && access !== '' && pass !== '' && conpass !== '') {
            if (pass === conpass) {
                instance.post('/admin/add', payLoad)
                    .then((res) => {
                        setOpen(false)
                        setName('')
                        setEmail('')
                        setAccess('')
                        setPass('')
                        setConPass('')
                        getAdmin()
                    }
                    )
                // .catch((err) => {
                //     console.log("add contact failed", err)
                // })
            } else {
                setError('Confirm password does not match**')
            }

        } else {
            setError('Please fill all fields**')
        }

    }
    // get admin
    const getAdmin = () => {
        instance.get('/admin/get').then((res) => {
            setAddmin(res.data)
        }).catch((e) => {
            console.log(e);
        })
    }
    // delete admin
    const deleteadmin = (deleteId) => {
        instance.delete(`/admin/delete/${deleteId}`).then((res) => {
            getAdmin()
        }
        ).catch((err) => {
            console.log("delete list failed", err)
        })
    }
    // update dialog
    const updateDiloge = (x) => {
        setTogbtn(false)
        setOpen(true)
        setUid(x)
    }

    function updatehandler() {
        const payLoad = { name: name, email: email, access: access, apassword: pass };
        if (name !== '' && email !== '' && access !== '' && pass !== '' && conpass !== '') {
            if (pass === conpass) {
                instance.put(`/admin/update/${uid}`, payLoad).then((res) => {
                    setOpen(false)
                    setName('')
                    setEmail('')
                    setAccess('Editer Access')
                    setPass('')
                    setConPass('')
                    getAdmin()
                }
                ).catch((err) => {
                    console.log("update list failed", err)
                })
            } else {
                setError('Confirm password does not match**')
            }

        } else {
            setError('Please fill all fields**')
        }
    }
    useEffect(() => {
        getAdmin()
    }, [])

    return (
        <div>
            <Box className='page_top'>
                <Typography className='page_head'>Admin</Typography>
                <button className='data_add_btn' onClick={handleOpen}>Add Admin</button>
            </Box>
            <Box className='paginate_holder'>
            </Box>
            <Box style={{ height: '62vh', overflowY: 'scroll' }}>
                <table className='table table-hover'>
                    <thead>
                        <tr className='tble_hd'>
                            <th>ADMIN NAME</th>
                            <th>ADMIN EMAIL</th>
                            <th>ADMIN ACCESS</th>
                            <th>ADMIN PASSWORD</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            addmin.map((e) => (
                                <tr className='tble_bdy' key={e._id}>
                                    <td>{e.name}</td>
                                    <td>{e.email}</td>
                                    <td>{e.access}</td>
                                    <td>{e.apassword}</td>
                                    <td className='action_icon_holder'><EditIcon className='action_icon' style={{ color: '#003068' }} onClick={()=>updateDiloge(e._id)} /><DeleteIcon className='action_icon text-danger' onClick={() => deleteadmin(e._id)} /></td>
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
                        <Typography className='modal_head'>ADD ADMIN</Typography>
                        <input value={name} onChange={(e) => setName(e.target.value)} type='text' placeholder='ADMIN NAME' className='text_modall' autoComplete='off' />
                        <input value={email} onChange={(e) => setEmail(e.target.value)} type='email' placeholder='ADMIN EMAIL' className='text_modall' autoComplete='off' />
                        <select value={access} className='text_modall' onChange={(e) => setAccess(e.target.value)}>
                            <option value='Editer Access'>Editer Access</option>
                            <option value='Viewer Access'>Viewer Access</option>
                        </select>
                        <input value={pass} onChange={(e) => setPass(e.target.value)} type='password' placeholder='PASSWORD' className='text_modall' autoComplete='off' />
                        <input value={conpass} onChange={(e) => setConPass(e.target.value)} type='password' placeholder='CONFIRM PASSWORD' className='text_modall' autoComplete='off' />
                        <Typography style={{ color: 'red' }}>{error}</Typography>
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

export default Admin;
