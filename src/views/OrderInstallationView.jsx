/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-no-bind */
import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { API, Auth } from 'aws-amplify';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Stack from '@mui/material/Stack';
import styled from 'styled-components';
import { createInstallationOrder } from '../graphql/mutations';
import Announcement from '../components/Announcement';
import Footer from '../components/Footer';

function OrderInstallationView() {
  const location = useLocation();
  const { serviceId } = location.state;
  const [dateTime, setDateTime] = useState(new Date());

  const handleChangeDT = (newDateTime) => {
    setDateTime(newDateTime);
  };

  async function getUserId() {
    try {
      const userInfo = await Auth.currentUserInfo();
      return userInfo.id;
    } catch {
      return null;
    }
  }

  // const [formInput, setFormInput] = useState(
  //   {
  //     serviceId,
  //     userId: getUserId(),
  //     userName: '',
  //     phoneNumber: '',
  //     email: '',
  //     address: '',
  //     appointmentDate: new Date(),
  //     appointmentStatus: 'RESERVED',
  //   },
  // );

  // const handleInput = (e) => {
  //   const { name } = e.target;
  //   const newValue = e.target.value;
  //   setFormInput({ [name]: newValue });
  // };

  async function createOrder(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const userId = await getUserId();
    const data = {
      userId: String(userId) || '',
      serviceId,
      userName: form.get('userName'),
      phoneNumber: form.get('phoneNumber'),
      email: form.get('email'),
      address: form.get('address'),
      appointmentDate: dateTime,
      appointmentStatus: 'RESERVED',
    };
    await API.graphql({
      query: createInstallationOrder,
      variables: { input: data },
    });
  }

  const Container = styled.div``;

  const FormContainer = styled.div`
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  `;
  const OrderForm = styled.form`
    max-width: 50%;
    display: block;
    align-items: center;
    justify-content: center;
  `;
  const Title = styled.h1`
    margin: 20px;
  `;

  return (
    <Container>
      <Announcement />
      <Title>Agenda tu cita</Title>
      <FormContainer>
        <Stack spacing={3}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <OrderForm onSubmit={createOrder}>
              <TextField
                name="userName"
                label="Nombre completo"
                variant="outlined"
        // value={formInput.userName}
        // onChange={handleInput}
                required
              />
              <TextField
                name="phoneNumber"
                label="Número teléfono o celular"
                variant="outlined"
        // value={formInput.phoneNumber}
        // onChange={handleInput}
                required
              />
              <TextField
                name="email"
                label="Email"
                variant="outlined"
              />
              <TextField
                name="address"
                label="Domicilio"
                variant="outlined"
        // value={formInput.address}
        // onChange={handleInput}
                required
              />

              <DateTimePicker
                name="appointmentDate"
                label="Date and Time"
                value={dateTime}
                onChange={handleChangeDT}
                renderInput={(params) => <TextField {...params} />}
                required
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Agendar cita
                {' '}
              </Button>
            </OrderForm>
          </LocalizationProvider>
        </Stack>
      </FormContainer>
      <Footer />
    </Container>
  );
}

export default OrderInstallationView;
