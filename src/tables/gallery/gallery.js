import { Box, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './gallery.css'
import DeleteIcon from '@mui/icons-material/Delete';
import instance from '../../config/axios.config'
import { burl } from '../../config/axios.config'


const Gallery = () => {
    const [accessss, setAccessss] = useState(localStorage.getItem('accesss'))
    const [leftInput, setLeftInput] = useState(false)
    const [rightInput, setRighttInput] = useState(false)
    const [cur_section, setCurSection] = useState('')

    const [imgcat, setImgcat] = useState('')
    const [aboutt, setAboutt] = useState('')
    const [imgg, setImgg] = useState('')

    const [galcata, setGalcata] = useState([])
    const [gallery, setGallery] = useState([])

    // ----------------------------------------

    const activee = (x, y) => {
        setAboutt(x)
        setCurSection(y)
        console.log('active....', y);
    }

    // post image categories
    const submitHandler = () => {
        const payLoad = { name: imgcat.toUpperCase() };
        instance.post('/gc/add', payLoad)
            .then((res) => {
                setLeftInput(false)
                setImgcat('')
                getimgcat()
            }
            )
        // .catch((err) => {
        //     console.log("add contact failed", err)
        // })

    }
    // get image category
    const getimgcat = () => {
        instance.get('/gc/get').then((res) => {
            setGalcata(res.data)
            setAboutt(res.data[0].name)
            setCurSection(res.data[0]._id)
        }).catch((e) => {
            console.log(e);
        })
    }
    // delete image category
    const deleteimgcat = (deleteId) => {
        instance.delete(`/gc/delete/${deleteId}`).then((res) => {
            getimgcat()
        }
        ).catch((err) => {
            console.log("delete list failed", err)
        })
    }

    // post gallery
    const galleryHandler = () => {
        if (imgg !== '' && aboutt !== '') {
            const formData = new FormData();
            formData.append("description", aboutt)
            formData.append("file", imgg)
            instance.post("/gallery/add", formData, { headers: { "Content-Type": "multipart/form-data" } })
                .then((res) => {
                    getgallery()
                    setImgg('')
                    setRighttInput(false)
                }
                )
        } else {
            alert('Please pill all input fields')
        }

    }
    // get gallery
    const getgallery = () => {
        if (aboutt !== '') {
            instance.get(`/gallery/get/${aboutt}`).then((res) => {
                setGallery(res.data)
            }).catch((e) => {
                console.log(e);
            })
        }
    }
    // delete gallery
    const deletegallery = (deleteId) => {
        instance.delete(`/gallery/delete/${deleteId}`).then((res) => {
            getgallery()
        }
        ).catch((err) => {
            console.log("delete gallery failed", err)
        })
    }

    useEffect(() => {
        getimgcat()
    }, [])
    useEffect(() => {
        getgallery()
    }, [aboutt])
    // ----------------------------------------

    return (
        <div>
            <Box className='page_top'>
                <Typography className='page_head'>Gallery</Typography>
            </Box>
            <Box style={{ height: '80vh', overflowY: 'scroll' }}>
                <Box className='row m-0 mt-3'>
                    <Box className='col-lg-4 col-md-4 col-sm-12 border p-3'>
                        <button className='gallery_add_btn' onClick={() => setLeftInput(!leftInput)}>Add Gallery Type</button>
                        {
                            leftInput ? (
                                <Box className='data_form'>
                                    <input value={imgcat} onChange={(e) => setImgcat(e.target.value)} placeholder='ENTER IMAGE CATEGORY' type='text' className='data_form_inp' />
                                    <button className='data_form_add' onClick={() => submitHandler()}>SUBMIT</button>
                                </Box>
                            ) : (null)
                        }
                        <Box className='l_g_cont' style={{ marginTop: leftInput ? '47px' : 0 }}>
                            <table className='table table-hovered'>
                                <thead>
                                    <tr className='tble_hd'>
                                        <th>IMAGE CATEGORY</th>
                                        {
                                            accessss === 'Editer Access' ? (
                                                <th style={{ textAlign: 'right' }}>ACTION</th>
                                            ) : (null)
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        galcata.map((e) => (
                                            <tr key={e._id} className={e._id === cur_section ? "activeicat" : "inactiveicat"}>
                                                <td onClick={() => activee(e.name, e._id)} style={{ cursor: 'pointer' }}>{e.name}</td>
                                                {
                                                    accessss === 'Editer Access' ? (
                                                        <td className='action_icon_holder' style={{ border: 'unset', float: 'right' }}><DeleteIcon onClick={() => deleteimgcat(e._id)} className='action_icon text-danger' /></td>
                                                    ) : (null)
                                                }
                                            </tr>
                                        ))
                                    }

                                </tbody>
                            </table>
                        </Box>
                    </Box>
                    <Box className='col-lg-8 col-md-8 col-sm-12 border p-3'>
                        <button className='gallery_add_btn' onClick={() => setRighttInput(!rightInput)}>Add Gallery</button>
                        {
                            rightInput ? (
                                <Box className='data_form'>
                                    <input type='file' className='data_form_inp' onChange={(e) => setImgg(e.target.files[0])} />
                                    <button className='data_form_add' onClick={() => galleryHandler()}>SUBMIT</button>
                                </Box>
                            ) : (null)
                        }
                        <Box className='l_g_cont' style={{ marginTop: rightInput ? '47px' : 0 }}>
                            <table className='table table-hovered'>
                                <thead>
                                    <tr className='tble_hd'>
                                        <th>IMAGE (1280px/720px)</th>
                                        <th>IMAGE CATEGORY</th>
                                        {
                                            accessss === 'Editer Access' ? (
                                                <th style={{ textAlign: 'right' }}>ACTION</th>
                                            ) : (null)
                                        }

                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        gallery.map((e) => (
                                            <tr className='tble_bdy' key={e._id}>
                                                <td><img src={`${burl}galleryimg/${e.pdf}`} style={{ height: 65, width: 115 }} alt={e.imgg} /></td>
                                                <td>{e.description}</td>
                                                {
                                                    accessss === 'Editer Access' ? (
                                                        <td className='action_icon_holder' style={{ border: 'unset', float: 'right' }}><DeleteIcon className='action_icon text-danger' onClick={() => deletegallery(e._id)} /></td>
                                                    ) : (null)
                                                }
                                            </tr>
                                        ))
                                    }

                                </tbody>
                            </table>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </div>
    );
}

export default Gallery;
