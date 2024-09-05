import { Box, Typography } from '@mui/material';
import React, { useRef, useState, useEffect } from 'react';
import { useDownloadExcel } from 'react-export-table-to-excel';
import instance from '../../config/axios.config'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const Courselead = () => {
    const tableRef = useRef(null);
    const [accessss, setAccessss] = useState(localStorage.getItem('accesss'))
    const [course, setCourse] = useState([])
    const [fitl, setFitl] = useState([])
    const [filt, setFilt] = useState(null)
    const [isChecked, setIsChecked] = useState(false)
    const [spagination, setSpagination] = useState(0)
    const [epagination, setEpagination] = useState(20)
    const { onDownload } = useDownloadExcel({
        currentTableRef: tableRef.current,
        filename: 'Users table',
        sheet: 'Users'
    })

    // get course
    const getCourse = () => {
        instance.get('/course/get').then((res) => {
            setCourse(res.data)
        }).catch((e) => {
            console.log(e);
        })
    }

    // delete course
    const deletecourse = (deleteId) => {
        instance.delete(`/course/delete/${deleteId}`).then((res) => {
            console.log("successful", res)
            getCourse()
        }
        ).catch((err) => {
            console.log("delete list failed", err)
        })
    }
    useEffect(() => {
        getCourse()
    }, [])

    useEffect(() => {
        setFitl(
            isChecked ?
                (
                    course.slice(0,).filter((e) =>
                        filt !== null
                            ? filt === 'ALL'
                                ? e.ctype
                                : e.ctype.toLowerCase() === filt.toLowerCase() ||
                                e.createdAt.toLowerCase() === filt.toLowerCase()
                            : e.ctype
                    )
                )
                :
                (
                    course.slice(spagination, epagination).filter((e) =>
                        filt !== null
                            ? filt === 'ALL'
                                ? e.ctype
                                : e.ctype.toLowerCase() === filt.toLowerCase() ||
                                e.createdAt.toLowerCase() === filt.toLowerCase()
                            : e.ctype
                    )
                )

        );
    }, [filt, course.length, spagination, epagination, isChecked]);
    const checkHandler = () => {
        setIsChecked(!isChecked);
    }
    const paginate = (x) => {
        if (x === 'inc') {
            if (epagination < course.length) {
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
                <Typography className='page_head'>Courses Lead</Typography>
                <FileDownloadIcon style={{ fontSize: 30, color: '#003068', cursor: 'pointer' }} onClick={onDownload} />
            </Box>
            <Box className='filter_box'>
                <input type='date' className='text_filter' onChange={(e) => setFilt(e.target.value)} value={filt} />
                <select className='text_filter' value={filt} onChange={(e) => setFilt(e.target.value)}>
                    <option>Course Type</option>
                    <option value='ALL'>All</option>
                    <option value='DG APPROVED COURSES'>DG APPROVED COURSES</option>
                    <option value='NON-DG APPROVED COURSES'>NON-DG APPROVED COURSES</option>
                </select>
            </Box>
            <Box className='paginate_holder'>
                {
                    isChecked ?
                        (
                            <Typography className='pagenitaion_con'>
                                {
                                    filt === null ? (
                                        `ALL ${course.length} DATA`
                                    ) : (
                                        `${fitl.length} OUT OF ${course.length} DATA`
                                    )
                                }
                            </Typography>
                        ) :
                        (
                            <Typography className='pagenitaion_con'>{spagination + 1}-{epagination} / {course.length}</Typography>
                        )
                }
                {
                    isChecked ? (null) : (
                        <ChevronLeftIcon className='pagi_icon' onClick={() => paginate('dec')} />
                    )
                }
                {
                    isChecked ? (null) : (
                        <ChevronRightIcon className='pagi_icon' onClick={() => paginate('inc')} />
                    )
                }

            </Box>
            <Box style={{ height: '62vh', overflowY: 'scroll' }}>
                <Box style={{ display: 'flex', gap: 5, marginBottom: 10, position: 'fixed', marginTop: '-42px' }}>
                    <input type='checkbox' checked={isChecked} onChange={checkHandler} />
                    <Typography style={{ fontSize: 14 }}>SELECT ALL</Typography>
                </Box>
                <table className='table table-hover' ref={tableRef}>
                    <thead>
                        <tr className='tble_hd'>
                            <th>FULL NAME</th>
                            <th>EMAIL</th>
                            <th>NUMBER</th>
                            <th>COURSE NAME</th>
                            <th>COURSE TYPE</th>
                            <th>STATE</th>
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
                                    <td>{e.email}</td>
                                    <td>{e.number}</td>
                                    <td>{e.cname}</td>
                                    <td>{e.ctype}</td>
                                    <td>{e.ustate}</td>
                                    <td>{e.createdAt}</td>
                                    {
                                        accessss === 'Editer Access' ? (
                                            <td className='action_icon_holder'><DeleteIcon className='action_icon text-danger' onClick={() => deletecourse(e._id)} /></td>
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

export default Courselead;
