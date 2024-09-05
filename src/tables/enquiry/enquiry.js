import { Box, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import instance from '../../config/axios.config'
import { useDownloadExcel } from 'react-export-table-to-excel';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const Enquiry = () => {
    const [accessss, setAccessss] = useState(localStorage.getItem('accesss'))
    const [contacts, setContacts] = useState([])
    const [filtvacancy, setfiltVacancy] = useState(null)
    const [fitl, setFitl] = useState([])
    const [isChecked, setIsChecked] = useState(false)
    const [spagination, setSpagination] = useState(0)
    const [epagination, setEpagination] = useState(20)
    const tableRef = useRef(null);
    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: 'Users table',
        sheet: 'Users'
    })


    // get contact
    const getContact = () => {
        instance.get('/contact/get').then((res) => {
            setContacts(res.data)
        }).catch((e) => {
            console.log(e);
        })
    }

    const deleteContact = (deleteId) => {
        instance.delete(`/contact/delete/${deleteId}`).then((res) => {
            getContact()
        }
        ).catch((err) => {
            console.log("delete list failed", err)
        })
    }

    useEffect(() => {
        getContact()
    }, [])
    useEffect(() => {
        isChecked ? (
            setFitl(
                contacts.slice(0,).filter((e) =>
                    filtvacancy !== null
                        ? filtvacancy === 'All'
                            ? e.usertype
                            : e.createdAt === filtvacancy ||
                            e.name.toLowerCase().includes(filtvacancy.toLowerCase()) ||
                            e.usertype.toLowerCase() === filtvacancy.toLowerCase()
                        : e.usertype
                )
            )
        ) : (
            setFitl(
                contacts.slice(spagination, epagination).filter((e) =>
                    filtvacancy !== null
                        ? filtvacancy === 'All'
                            ? e.usertype
                            : e.createdAt === filtvacancy ||
                            e.name.toLowerCase().includes(filtvacancy.toLowerCase()) ||
                            e.usertype.toLowerCase() === filtvacancy.toLowerCase()
                        : e.usertype
                )
            )
        )

    }, [filtvacancy, contacts, isChecked, epagination, spagination])
    const paginate = (x) => {
        if (x === 'inc') {
            if (epagination < contacts.length) {
                setSpagination(spagination + 20)
                setEpagination(epagination + 20)
            }
        }
        if (x === 'dec') {
            if (spagination === 0) {
                setSpagination(0)
                setEpagination(20)
            } else {
                setSpagination(spagination - 20)
                setEpagination(epagination - 20)
            }

        }
    }
    return (
        <div>
            <Box className='page_top'>
                <Typography className='page_head'>Enquiry</Typography>
                <FileDownloadIcon style={{ fontSize: 30, color: '#003068', cursor: 'pointer' }} onClick={onDownload} />
            </Box>
            <Box className='filter_box'>
                <input type='text' placeholder='FILTER BY NAME' className='text_filter' onChange={(e) => setfiltVacancy(e.target.value)} />
                <input type='date' className='text_filter' onChange={(e) => setfiltVacancy(e.target.value)} />
                <select className='text_filter' value={filtvacancy} onChange={(e) => setfiltVacancy(e.target.value)}>
                    <option value='All'>All</option>
                    <option value='Student'>Student</option>
                    <option value='Other'>Other</option>
                </select>
            </Box>
            {
                isChecked ?
                    (
                        <Box className='paginate_holder'>
                            <Typography className='pagenitaion_con'>{fitl.length} DATA OUT OF {contacts.length}</Typography>
                        </Box>
                    ) :
                    (
                        <Box className='paginate_holder'>
                            <Typography className='pagenitaion_con'>{spagination + 1}-{epagination} / {contacts.length}</Typography>
                            <ChevronLeftIcon className='pagi_icon' onClick={() => paginate('dec')} />
                            <ChevronRightIcon className='pagi_icon' onClick={() => paginate('inc')} />
                        </Box>
                    )
            }
            <Box style={{ height: '62vh', overflowY: 'scroll' }}>
                <Box style={{ display: 'flex', gap: 5, marginBottom: 10, position: 'fixed', marginTop: '-42px' }}>
                    <input type='checkbox' checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
                    <Typography style={{ fontSize: 14 }}>SELECT ALL</Typography>
                </Box>
                <table className='table table-hover' ref={tableRef}>
                    <thead>
                        <tr className='tble_hd'>
                            <th>FULL NAME</th>
                            <th>USER TYPE</th>
                            <th>EMAIL</th>
                            <th>MESSAGE</th>
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
                            fitl.map((e) => (
                                <tr className='tble_bdy' key={e._id}>
                                    <td>{e.name}</td>
                                    <td>{e.usertype}</td>
                                    <td>{e.email}</td>
                                    <td style={{ width: '40%' }}>{e.message}</td>
                                    <td>{e.createdAt}</td>
                                    {
                                        accessss === 'Editer Access' ? (
                                            <td className='action_icon_holder'><DeleteIcon className='action_icon text-danger' onClick={() => deleteContact(e._id)} /></td>
                                        ) : (null)
                                    }
                                </tr>
                            ))
                        }

                    </tbody>
                </table>
            </Box>
        </div>
    );
}

export default Enquiry;
