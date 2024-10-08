// src/UserForm.js
import React, { useEffect } from 'react';
import { Box, Button, TextField, Drawer, Typography } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation schema using Yup
const schema = yup.object().shape({
  name: yup.string().required('Name is required').min(3, 'Name must be at least 3 characters'),
  username: yup.string().required('Username is required'),
  email: yup.string().required('Email is required').email('Email is not valid'),
  phone: yup.string().required('Phone is required').matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
  address: yup.object().shape({
    street: yup.string().required('Street is required'),
    city: yup.string().required('City is required')
  })
});

const UserForm = ({ open, onClose, onSave, user }) => {
  const { control, handleSubmit, setValue, formState: { errors }, watch, reset } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      phone: '',
      address: { street: '', city: '' }
    }
  });

  // Watch the "name" field value to generate username for new users
  const nameValue = watch("name");

  // Populate form fields when user prop is provided (i.e., editing an existing user)
  useEffect(() => {
    if (user) {
      // Reset form values with the existing user's data
      reset(user);
    } else {
      // If creating a new user, clear the form and set default username
      reset({ name: '', username: '', email: '', phone: '', address: { street: '', city: '' } });
    }
  }, [user, reset]);

  // Generate username dynamically when the name is changed for new users
  useEffect(() => {
    if (!user && nameValue && nameValue.length >= 3) {
      setValue('username', `USER-${nameValue}`);
    } else if (!user) {
      setValue('username', ''); // Clear username if name is empty or too short
    }
  }, [nameValue, user, setValue]);

  // Submit the form data
  const onSubmit = (data) => {
    onSave(data);
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box p={3} width={400}>
        <Typography variant="h6">{user ? 'Edit User' : 'Create User'}</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name Field */}
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Name"
                fullWidth
                margin="normal"
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />

          {/* Username Field - Read-Only, and dynamically generated for new users */}
          <Controller
            name="username"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Username"
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }} // Make the username read-only
                error={!!errors.username}
                helperText={errors.username?.message}
              />
            )}
          />

          {/* Email Field */}
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          {/* Phone Field */}
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Phone"
                fullWidth
                margin="normal"
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            )}
          />

          {/* Street Field */}
          <Controller
            name="address.street"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Street"
                fullWidth
                margin="normal"
                error={!!errors.address?.street}
                helperText={errors.address?.street?.message}
              />
            )}
          />

          {/* City Field */}
          <Controller
            name="address.city"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="City"
                fullWidth
                margin="normal"
                error={!!errors.address?.city}
                helperText={errors.address?.city?.message}
              />
            )}
          />

          <Button variant="contained" type="submit" fullWidth>
            {user ? 'Update' : 'Create'}
          </Button>
        </form>
      </Box>
    </Drawer>
  );
};

export default UserForm;
