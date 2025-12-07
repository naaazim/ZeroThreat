import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Container,
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    InputAdornment,
    IconButton,
    alpha,
    useTheme,
    Stack,
} from '@mui/material';
import { Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import { authAPI } from '../services/api';

function Login({ setIsAuthenticated }) {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authAPI.login(formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setIsAuthenticated(true);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `radial-gradient(circle at 20% 10%, ${alpha(theme.palette.primary.main, 0.14)} 0%, transparent 30%),
                    radial-gradient(circle at 90% 20%, ${alpha(theme.palette.secondary.main, 0.14)} 0%, transparent 30%),
                    linear-gradient(135deg, #0b0f16 0%, #0f1724 100%)`,
                py: 6,
            }}
        >
            <Container maxWidth="md">
                <Card
                    className="animate-scale-in"
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                        overflow: 'hidden',
                    }}
                >
                    <Box
                        sx={{
                            p: 4,
                            borderRight: { md: `1px solid ${alpha(theme.palette.text.primary, 0.06)}` },
                            bgcolor: alpha(theme.palette.primary.main, 0.05),
                        }}
                    >
                        <Typography variant="overline" color="text.secondary">
                            ZeroThreat
                        </Typography>
                        <Typography variant="h3" sx={{ mb: 2 }}>
                            Connexion
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 4 }}>
                            Accédez au tableau de bord, relancez des scans ou consultez l’historique.
                        </Typography>
                        <Stack spacing={2} color="text.secondary">
                            <Stack direction="row" spacing={1}>
                                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: theme.palette.success.main, mt: '6px' }} />
                                <Typography>Infrastructure sécurisée en continu</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1}>
                                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: theme.palette.info.main, mt: '6px' }} />
                                <Typography>Rapports clairs et exploitables</Typography>
                            </Stack>
                        </Stack>
                    </Box>
                    <CardContent sx={{ p: { xs: 4, md: 5 } }}>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <img src="/logo.png" alt="ZeroThreat" style={{ height: 64, marginBottom: 12 }} />
                            <Typography variant="h5">Heureux de vous revoir</Typography>
                        </Box>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3 }}>
                                {error}
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                label="Nom d'utilisateur"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                sx={{ mb: 3 }}
                                autoComplete="username"
                            />

                            <TextField
                                fullWidth
                                label="Mot de passe"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                required
                                sx={{ mb: 4 }}
                                autoComplete="current-password"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                startIcon={<LoginIcon />}
                                sx={{ mb: 3, py: 1.4 }}
                            >
                                {loading ? 'Connexion...' : 'Se connecter'}
                            </Button>

                            <Box sx={{ textAlign: 'center' }}>
                                <Typography color="text.secondary">
                                    Pas encore de compte ?{' '}
                                    <Link
                                        to="/register"
                                        style={{
                                            color: theme.palette.primary.main,
                                            textDecoration: 'none',
                                            fontWeight: 700,
                                        }}
                                    >
                                        S'inscrire
                                    </Link>
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
}

export default Login;
