import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Grid, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import axios from 'axios';
import { useAuth } from '../../hooks/useAuth';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const UpdateUsernameSchema = z.object({

    username: z.string().trim()
        .min(1, { message: 'Username required' })
        .max(50, { message: 'Username cannot exceed 50 characters in length' })
        .regex(/^[a-zA-Z][a-zA-Z0-9-_]{0,49}$/, { message: 'Username must start with a letter and can only contain letters, numbers, hypens, and underscores' })
        .refine((name) => name.trim().length > 0, { message: 'Username cannot be just whitespace' }),

});

type UpdateUsernameSchema = z.infer<typeof UpdateUsernameSchema>;

export default function UpdatePasswordForm() {
    
    // Define State
    const [serverResponseMessage, setServerResponseMessage] = useState('');         // Holds server error messages
    const [isLoading, setIsLoading] = useState(false);                              // Disables the register button while form is handling a submit
    const [serverResponseCode, setServerResponseCode] = useState(0);                // State to track server response code
    const [showAlert, setShowAlert] = useState(false);

    // Get auth state
    const { logout } = useAuth();

    // React Hook Form Configuration
    const { handleSubmit, control, formState: { errors, isValid }, setError } = useForm<UpdateUsernameSchema>({
        mode: 'all',
        defaultValues: { username: '' },
        resolver: zodResolver(UpdateUsernameSchema),
    });

    // Form submission handler
    const handleUsernameChange = async (values: UpdateUsernameSchema) => {
        try {
            setIsLoading(true);

            // Retrieve the auth token from local storage
            const token = localStorage.getItem('token');
            
            if (!token) {
                logout();
            }

            // Attempt to change user's name
            const response = await axios.patch('/api/user/update-username', values, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Set the server response message
            setServerResponseMessage(response.data.message);

            // Set the response code
            setServerResponseCode(response.data.code);

            // Make sure to set the show alert
            setShowAlert(true);
            
        } 
        
        catch (error) {
            
            if (axios.isAxiosError(error) && error.response) {
                
                // Get the error response
                const response = error.response.data;

                // Check if the error is due to an invalid or expired token

                if (response.code === 401 || response.code === 403) {

                    logout(); 

                }

                // Set server error message
                setServerResponseMessage(response.message);

                // Set the response code
                setServerResponseCode(response.code);

            } 

            else {

                setServerResponseMessage('An unexpected error occurred');

                // Set the response code
                setServerResponseCode(500);
            }

            // Make sure to set the show alert
            setShowAlert(true);
            
        } 
        
        finally {
            setIsLoading(false);
        }
    };

    // Auto-dismiss alert after 5 seconds
    useEffect(() => {

        if (showAlert) {

            const timer = setTimeout(() => setShowAlert(false), 5000);
            return () => clearTimeout(timer);

        }

    }, [showAlert]);


    return (
        
        <Box component="form" noValidate onSubmit={handleSubmit(handleUsernameChange)} sx={{ mt: 4, maxWidth: 800, mx: 'auto' }}>
            
            <Typography variant="h5" component="h2" gutterBottom>
                Update Password
            </Typography>

            {/* Server Error */}
            <Box sx={{ mb: 2 }}>
                {showAlert && (
                    <Alert severity={serverResponseCode === 200 ? 'success' : 'error'}>
                        {serverResponseMessage}
                    </Alert>
                )}
            </Box>

            <Grid container spacing={2}>
                {/* Current Password Input */}
                <Grid item xs={12} md={4}>
                    <Controller
                        control={control}
                        name='username'
                        render={({ field }) => (
                            <TextField
                                {...field}
                                required
                                fullWidth
                                id='username'
                                name='username'
                                label='Username'
                                autoComplete='username-name'
                                error={!!errors.username}
                                helperText={errors.username?.message}
                            />
                        )}
                    />
                </Grid>

                {/* Update Button */}
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' }, mt: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ width: { xs: '100%', sm: 'auto' }, minWidth: 200 }}
                            disabled={!isValid || isLoading}
                        >
                            Update Username
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>

    );
}
