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
import { Visibility, VisibilityOff, PersonAdd } from '@mui/icons-material';
import { authAPI } from '../services/api';

function Register({ setIsAuthenticated }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
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

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        setLoading(true);

        try {
            const response = await authAPI.register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setIsAuthenticated(true);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || "Erreur lors de l'inscription");
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
                background: `radial-gradient(circle at 10% 20%, ${alpha(theme.palette.primary.main, 0.14)} 0%, transparent 30%),
                    radial-gradient(circle at 80% 0%, ${alpha(theme.palette.secondary.main, 0.14)} 0%, transparent 30%),
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
                            Créer votre compte
                        </Typography>
                        <Typography color="text.secondary" sx={{ mb: 4 }}>
                            Rejoignez la plateforme pour lancer des scans, suivre les vulnérabilités et partager des rapports.
                        </Typography>
                        <Stack spacing={2} color="text.secondary">
                            <Stack direction="row" spacing={1}>
                                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: theme.palette.success.main, mt: '6px' }} />
                                <Typography>Aucune configuration complexe</Typography>
                            </Stack>
                            <Stack direction="row" spacing={1}>
                                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: theme.palette.info.main, mt: '6px' }} />
                                <Typography>Interface conçue pour les équipes SecOps</Typography>
                            </Stack>
                        </Stack>
                    </Box>
                    <CardContent sx={{ p: { xs: 4, md: 5 } }}>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <img src="/logo.png" alt="ZeroThreat" style={{ height: 64, marginBottom: 12 }} />
                            <Typography variant="h5">On sécurise quoi aujourd'hui ?</Typography>
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
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                sx={{ mb: 3 }}
                                autoComplete="email"
                            />

                            <TextField
                                fullWidth
                                label="Mot de passe"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                required
                                sx={{ mb: 3 }}
                                autoComplete="new-password"
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

                            <TextField
                                fullWidth
                                label="Confirmer le mot de passe"
                                name="confirmPassword"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                                sx={{ mb: 4 }}
                                autoComplete="new-password"
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading}
                                startIcon={<PersonAdd />}
                                sx={{ mb: 3, py: 1.4 }}
                            >
                                {loading ? "Inscription..." : "S'inscrire"}
                            </Button>

                            <Box sx={{ textAlign: 'center' }}>
                                <Typography color="text.secondary">
                                    Déjà un compte ?{' '}
                                    <Link
                                        to="/login"
                                        style={{
                                            color: theme.palette.primary.main,
                                            textDecoration: 'none',
                                            fontWeight: 700,
                                        }}
                                    >
                                        Se connecter
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

export default Register;
