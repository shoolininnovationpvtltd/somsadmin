import { Box, Typography } from '@mui/material';
import React, { useEffect, useState, useRef } from 'react';
import { useDownloadExcel } from 'react-export-table-to-excel';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import instance from '../../config/axios.config'
import { burl } from '../../config/axios.config'
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const Career = () => {
  const [accessss, setAccessss] = useState(localStorage.getItem('accesss'))
  const [filtvacancy, setfiltVacancy] = useState(null)
  const [careerData, setCareerData] = useState([])
  const [fitl, setFitl] = useState([])
  const [vacc, setVacc] = useState([])
  const [isChecked, setIsChecked] = useState(false)
  const [spagination, setSpagination] = useState(0)
  const [epagination, setEpagination] = useState(20)
  const tableRef = useRef(null);

  useEffect(() => {
    setFitl(
      isChecked ?
        (
          careerData.slice(0,).filter((e) =>
            filtvacancy !== null
              ? filtvacancy === 'All'
                ? e.requirement
                : e.requirement === filtvacancy ||
                e.name.toLowerCase().includes(filtvacancy.toLowerCase())
              : e.requirement
          )
        )
        :
        (
          careerData.slice(spagination, epagination).filter((e) =>
            filtvacancy !== null
              ? filtvacancy === 'All'
                ? e.requirement
                : e.requirement === filtvacancy ||
                e.name.toLowerCase().includes(filtvacancy.toLowerCase())
              : e.requirement
          )
        )

    )
  }, [filtvacancy, careerData, isChecked, spagination, epagination]);
  const paginate = (x) => {
    if (x === 'inc') {
      if (epagination < careerData.length) {
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
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: 'Users table',
    sheet: 'Users'
  })

  // get career
  const getCareer = () => {
    instance.get('/career/get').then((res) => {
      setCareerData(res.data)
    }).catch((e) => {
      console.log(e);
    })
  }
  // get vacancy
  const getVacancy = () => {
    instance.get('/vacancy/get').then((res) => {
      setVacc(res.data)
    }).catch((e) => {
      console.log(e);
    })
  }
  useEffect(() => {
    getCareer()
    getVacancy()
  }, [])

  // delete career
  const deletecareer = (deleteId) => {
    instance.delete(`/career/delete/${deleteId}`).then((res) => {
      getCareer()
    }
    ).catch((err) => {
      console.log("delete list failed", err)
    })
  }
  // ---------------
  const showPdf = (pdf) => {
    window.open(`${burl}careerpdf/${pdf}`)
  }

  return (
    <div>
      <Box className='page_top'>
        <Typography className='page_head'>Career</Typography>
        <FileDownloadIcon style={{ fontSize: 30, color: '#003068', cursor: 'pointer' }} onClick={onDownload} />
      </Box>
      <Box className='filter_box'>
        <input type='text' placeholder='FILTER BY NAME' className='text_filter' onChange={(e) => setfiltVacancy(e.target.value)} />
        <select className='text_filter' value={filtvacancy} onChange={(e) => setfiltVacancy(e.target.value)}>
          <option value='All'>All</option>
          {
            vacc.map((e) => (
              <option value={e.name}>{e.name}</option>
            ))
          }
        </select>
      </Box>
      {
        isChecked ?
          (
            <Box className='paginate_holder'>
              <Typography className='pagenitaion_con'>{fitl.length} DATA OUT OF {careerData.length}</Typography>
            </Box>
          ) :
          (
            <Box className='paginate_holder'>
              <Typography className='pagenitaion_con'>{spagination + 1}-{epagination} / {careerData.length}</Typography>
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
              <th style={{ width: '8%' }}>FULL NAME</th>
              <th>VACANCY</th>
              <th>EMAIL</th>
              <th>MESSAGE</th>
              <th>DATE</th>
              <th>FILE</th>
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
                  <td>{e.requirement}</td>
                  <td>{e.email}</td>
                  <td style={{ width: '30%' }}>{e.message}</td>
                  <td style={{ width: '10%' }}>{e.createdAt}</td>
                  <td style={{ cursor: 'pointer' }} onClick={() => showPdf(e.pdf)}>{`${burl}careerpdf/${e.pdf}`}</td>
                  {
                    accessss === 'Editer Access' ? (
                      <td className='action_icon_holder' style={{ borderTop: 'unset' }}><DeleteIcon onClick={() => deletecareer(e._id)} style={{ marginLeft: 'auto' }} className='action_icon text-danger' /></td>
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

export default Career;
