'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false); // Toggle med registracijo in prijavo
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [employmentType, setEmploymentType] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState(null); // Napake
  const router = useRouter();

  // Preverjanje, če je uporabnik že prijavljen (ob nalaganju strani)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/'); // Preusmeri na nadzorno ploščo, če je uporabnik že prijavljen
    }
  }, [router]);

  // Ob prijavi ali registraciji
  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = isRegister
      ? {
          username,
          fullName: `${firstName} ${lastName}`,
          email,
          password,
          phone,
          employmentType,
          jobTitle,
          isActive,
        }
      : { username, password };

    try {
      const endpoint = isRegister ? '/api/Account/register' : '/api/Account/login';
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || 'Napaka pri pošiljanju obrazca.');
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token); // Shrani žeton v lokalno shrambo
      router.push('/'); // Po uspešni prijavi preusmeri uporabnika na nadzorno ploščo
    } catch (err) {
      setError('Prišlo je do napake. Poskusite znova.');
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: 400,
          backgroundColor: 'white',
          padding: 3,
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {isRegister ? 'Ustvari račun' : 'Prijava'}
        </Typography>

        {/* Sporočilo o napaki */}
        {error && (
          <Typography color="error" mb={2}>
            {error}
          </Typography>
        )}

        {/* Polja za registracijo */}
        {isRegister && (
          <>
            <Box display="flex" gap={2}>
              <TextField
                label="Ime"
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <TextField
                label="Priimek"
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </Box>
            <TextField
              label="Telefon"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              sx={{ mt: 2 }}
              required
            />
            <TextField
              label="E-pošta"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mt: 2 }}
              required
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Vrsta zaposlitve</InputLabel>
              <Select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                required
              >
                <MenuItem value="Zaposlen">Zaposlen</MenuItem>
                <MenuItem value="Študent">Študent</MenuItem>
                <MenuItem value="Freelancer">Freelancer</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Delovno mesto"
              fullWidth
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              sx={{ mt: 2 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
              }
              label="Aktiven uporabnik"
              sx={{ mt: 2 }}
            />
          </>
        )}

        {/* Skupna polja za registracijo in prijavo */}
        <TextField
          label="Uporabniško ime"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mt: 2 }}
          required
        />
        <TextField
          label="Geslo"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mt: 2 }}
          required
        />

        {/* Gumb za oddajo */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ marginTop: 16 }}
        >
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ padding: 1 }}
          >
            {isRegister ? 'Registriraj se' : 'Prijava'}
          </Button>
        </motion.div>

        {/* Preklop med prijavo in registracijo */}
        <Typography
          onClick={() => setIsRegister(!isRegister)}
          sx={{
            mt: 2,
            textAlign: 'center',
            color: 'primary.main',
            cursor: 'pointer',
          }}
        >
          {isRegister ? 'Nazaj na prijavo' : 'Ustvari nov račun'}
        </Typography>
      </Box>
    </Box>
  );
}
