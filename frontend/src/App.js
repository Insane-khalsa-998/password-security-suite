import React, { useState} from 'react';
import {
  TextField, Button, Typography, Box, CircularProgress,
  Card, Snackbar, Alert
} from '@mui/material';
import axios from 'axios';
import PasswordIcon from '@mui/icons-material/VpnKey';
import GenerateIcon from '@mui/icons-material/Autorenew';
import SecurityIcon from '@mui/icons-material/Security';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SearchIcon from '@mui/icons-material/Search';
import './App.css';

function App() {
  const [password, setPassword] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [length, setLength] = useState(16);
  const [quantumLength, setQuantumLength] = useState(24);
  const [quantumPassword, setQuantumPassword] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const checkPasswordStrength = async () => {
    if (password.length > 0) {
      setLoading(true);
      try {
        const response = await axios.post('http://localhost:5000/check_password', { password });
        setFeedback(response.data);
        if (response.data.leak_check.leaked) {
          setSnackbar({
            open: true,
            message: 'Warning: Password found in data breaches!',
            severity: 'error'
          });
        }
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Error checking password strength',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const generatePassword = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/generate_password`, {
        params: { length: parseInt(length) }
      });
      setGeneratedPassword(response.data.password);
      setSnackbar({
        open: true,
        message: 'New password generated!',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error generating password',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const generateQuantumSecurePassword = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/generate_quantum_secure_password`, {
        params: { length: parseInt(quantumLength) }
      });
      setQuantumPassword(response.data.password);
      setSnackbar({
        open: true,
        message: 'Quantum-secure password generated!',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error generating quantum-secure password',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordCheck = () => {
    setPassword('');
    setFeedback(null);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSnackbar({
      open: true,
      message: 'Password copied to clipboard!',
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ minHeight: '100vh', pb: 4 }}>
      <Box sx={{ p: 2, background: 'rgba(0, 0, 0, 0.2)', mb: 3 }}>
        <Typography variant="h3" className="main-heading">
          Password Security Suite
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Box className="info-box">
          
          
          </Box>
          <Box className="info-box">
           
            
          </Box>
        </Box>
      </Box>

      <div className="container">
        {/* Password Strength Checker Card */}
        <Card className="card">
          <Box sx={{ p: 3 }}>
            <Box className="card-header">
              <PasswordIcon sx={{ fontSize: 40 }} />
              <div>
                <Typography variant="h5">Password Strength Checker</Typography>
                <Typography className="card-description">
                  Analyze your password's strength, check for data breaches, and get detailed security feedback.
                  Uses advanced algorithms to evaluate complexity and resistance to attacks.
                </Typography>
              </div>
            </Box>

            <TextField
              fullWidth
              type="password"
              label="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
              className="password-input"
            />

            <Box className="button-group">
              <Button
                variant="contained"
                onClick={checkPasswordStrength}
                disabled={!password || loading}
                startIcon={<SearchIcon />}
              >
                Check Strength
              </Button>
              <Button
                variant="outlined"
                onClick={resetPasswordCheck}
                startIcon={<RestartAltIcon />}
              >
                Reset
              </Button>
            </Box>

            {loading && <CircularProgress />}

            {feedback && (
              <Box className="results-container">
                <Typography className={`strength-indicator strength-${feedback.strength.toLowerCase().replace(' ', '-')}`}>
                  Strength: {feedback.strength} ({feedback.score}/{feedback.max_score})
                </Typography>

                {feedback.leak_check && (
                  <Box className={`leak-check-box ${feedback.leak_check.leaked ? 'leaked' : 'safe'}`}>
                    <Typography variant="h6">
                      {feedback.leak_check.leaked ? (
                        <ErrorOutlineIcon color="error" />
                      ) : (
                        <CheckCircleOutlineIcon color="success" />
                      )}
                      {feedback.leak_check.leaked ? 'Password Compromised!' : 'Password Not Found in Breaches'}
                    </Typography>
                    
                    {feedback.leak_check.leaked && (
                      <>
                        <Typography>
                          Found in {feedback.leak_check.total_exposures.toLocaleString()} data breaches
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={generatePassword}
                          startIcon={<RefreshIcon />}
                        >
                          Generate New Secure Password
                        </Button>
                      </>
                    )}
                  </Box>
                )}

                <Box className="requirements-container">
                  {feedback.requirements_met.length > 0 && (
                    <div className="requirements-section met">
                      <Typography variant="h6">Requirements Met:</Typography>
                      <ul>
                        {feedback.requirements_met.map((req, index) => (
                          <li key={`met-${index}`}>
                            <CheckCircleOutlineIcon /> {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {feedback.requirements_failed.length > 0 && (
                    <div className="requirements-section failed">
                      <Typography variant="h6">Requirements Not Met:</Typography>
                      <ul>
                        {feedback.requirements_failed.map((req, index) => (
                          <li key={`failed-${index}`}>
                            <ErrorOutlineIcon /> {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </Card>

        {/* Password Generator Card */}
        <Card className="card">
          <Box sx={{ p: 3 }}>
            <Box className="card-header">
              <GenerateIcon sx={{ fontSize: 40 }} />
              <div>
                <Typography variant="h5">Complex Password Generator</Typography>
                <Typography className="card-description">
                  Generate strong passwords with a mix of uppercase, lowercase, numbers, and special characters.
                  Customizable length for different security requirements.
                </Typography>
              </div>
            </Box>

            <TextField
              type="number"
              label="Password Length"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              inputProps={{ min: 16, max: 100 }}
              fullWidth
              className="length-input"
            />

            <Button
              variant="contained"
              onClick={generatePassword}
              disabled={loading}
              startIcon={<GenerateIcon />}
              fullWidth
            >
              Generate Password
            </Button>

            {loading && <CircularProgress />}

            {generatedPassword && (
              <Box className="generated-password-box">
                <Typography variant="h6">Generated Password:</Typography>
                <Box className="password-display">
                  <Typography>{generatedPassword}</Typography>
                  <Box className="button-group">
                    <Button
                      variant="outlined"
                      startIcon={<ContentCopyIcon />}
                      onClick={() => copyToClipboard(generatedPassword)}
                    >
                      Copy
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      onClick={generatePassword}
                    >
                      Regenerate
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Card>

        {/* Quantum-Secure Generator Card */}
        <Card className="card">
          <Box sx={{ p: 3 }}>
            <Box className="card-header">
              <SecurityIcon sx={{ fontSize: 40 }} />
              <div>
                <Typography variant="h5">Quantum-Secure Generator</Typography>
                <Typography className="card-description">
                  Create ultra-secure passwords designed to resist quantum computing attacks.
                  Uses enhanced entropy and extended character sets for maximum security.
                </Typography>
              </div>
            </Box>

            <TextField
              type="number"
              label="Password Length"
              value={quantumLength}
              onChange={(e) => setQuantumLength(e.target.value)}
              inputProps={{ min: 24, max: 100 }}
              fullWidth
              className="length-input"
            />

            <Button
              variant="contained"
              onClick={generateQuantumSecurePassword}
              disabled={loading}
              startIcon={<SecurityIcon />}
              fullWidth
            >
              Generate Quantum-Secure Password
            </Button>

            {loading && <CircularProgress />}

            {quantumPassword && (
              <Box className="generated-password-box quantum">
                <Typography variant="h6">Quantum-Secure Password:</Typography>
                <Box className="password-display">
                  <Typography>{quantumPassword}</Typography>
                  <Box className="button-group">
                    <Button
                      variant="outlined"
                      startIcon={<ContentCopyIcon />}
                      onClick={() => copyToClipboard(quantumPassword)}
                    >
                      Copy
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<RefreshIcon />}
                      onClick={generateQuantumSecurePassword}
                    >
                      Regenerate
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>
        </Card>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;