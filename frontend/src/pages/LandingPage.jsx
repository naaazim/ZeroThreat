import { Link } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Box,
    Grid,
    Card,
    CardContent,
    Chip,
    useTheme,
    alpha,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import SpeedIcon from '@mui/icons-material/Speed';
import AssessmentIcon from '@mui/icons-material/Assessment';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ShieldIcon from '@mui/icons-material/Shield';

function LandingPage() {
    const theme = useTheme();

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Navbar */}
            <AppBar position="sticky" elevation={0}>
                <Container maxWidth="lg">
                    <Toolbar sx={{ py: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                            <img src="/logo.png" alt="ZeroThreat" style={{ height: 40, marginRight: 12 }} />
                            <Typography variant="h5" component="div" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                ZeroThreat
                            </Typography>
                        </Box>
                        <Button component={Link} to="/login" sx={{ mr: 2, color: 'text.secondary' }}>
                            Connexion
                        </Button>
                        <Button component={Link} to="/register" variant="contained">
                            Commencer
                        </Button>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Hero Section */}
            <Box
                sx={{
                    pt: 15,
                    pb: 12,
                    background: `radial-gradient(circle at 20% 50%, ${alpha(theme.palette.primary.main, 0.1)} 0%, transparent 50%),
                       radial-gradient(circle at 80% 80%, ${alpha(theme.palette.secondary.main, 0.1)} 0%, transparent 50%)`,
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={6} alignItems="center">
                        <Grid item xs={12} md={7}>
                            <Chip
                                icon={<ShieldIcon />}
                                label="Plateforme de Cybersécurité"
                                color="primary"
                                sx={{ mb: 3, fontWeight: 600 }}
                            />
                            <Typography
                                variant="h1"
                                sx={{
                                    mb: 3,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                }}
                            >
                                Analysez. Détectez. Sécurisez.
                            </Typography>
                            <Typography variant="h5" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6 }}>
                                Plateforme de scan de vulnérabilités nouvelle génération. Protégez vos infrastructures avec
                                Nmap, SQLMap et Nikto.
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                <Button
                                    component={Link}
                                    to="/register"
                                    variant="contained"
                                    size="large"
                                    startIcon={<RocketLaunchIcon />}
                                    sx={{ px: 4, py: 1.5 }}
                                >
                                    Lancer un scan gratuit
                                </Button>
                                <Button href="#features" variant="outlined" size="large" sx={{ px: 4, py: 1.5 }}>
                                    En savoir plus
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={5}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    '&::before': {
                                        content: '""',
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        width: '120%',
                                        height: '120%',
                                        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.2)} 0%, transparent 70%)`,
                                        animation: 'pulse 3s ease-in-out infinite',
                                    },
                                    '@keyframes pulse': {
                                        '0%, 100%': { opacity: 0.5, transform: 'translate(-50%, -50%) scale(1)' },
                                        '50%': { opacity: 1, transform: 'translate(-50%, -50%) scale(1.1)' },
                                    },
                                }}
                            >
                                <img
                                    src="/logo.png"
                                    alt="Security"
                                    style={{
                                        width: '100%',
                                        height: 'auto',
                                        position: 'relative',
                                        filter: 'drop-shadow(0 0 30px rgba(0, 243, 255, 0.5))',
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Features Section */}
            <Box id="features" sx={{ py: 12, bgcolor: alpha(theme.palette.background.paper, 0.5) }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Typography variant="h2" gutterBottom>
                            Fonctionnalités Puissantes
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                            Une suite complète d'outils pour identifier et corriger les vulnérabilités
                        </Typography>
                    </Box>
                    <Grid container spacing={4}>
                        {[
                            {
                                icon: <SecurityIcon sx={{ fontSize: 50 }} />,
                                title: 'Scan Multi-Vecteurs',
                                description:
                                    'Combinez Nmap pour le réseau, SQLMap pour les bases de données et Nikto pour le web.',
                                color: theme.palette.primary.main,
                            },
                            {
                                icon: <SpeedIcon sx={{ fontSize: 50 }} />,
                                title: 'Temps Réel',
                                description: 'Suivez vos scans en direct et recevez des alertes immédiates.',
                                color: theme.palette.secondary.main,
                            },
                            {
                                icon: <AssessmentIcon sx={{ fontSize: 50 }} />,
                                title: 'Rapports Détaillés',
                                description: 'Visualisez vos données avec des graphiques et exportez des rapports.',
                                color: theme.palette.success.main,
                            },
                        ].map((feature, index) => (
                            <Grid item xs={12} md={4} key={index}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        textAlign: 'center',
                                        p: 3,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'inline-flex',
                                            p: 2,
                                            borderRadius: '50%',
                                            bgcolor: alpha(feature.color, 0.1),
                                            color: feature.color,
                                            mb: 2,
                                        }}
                                    >
                                        {feature.icon}
                                    </Box>
                                    <CardContent>
                                        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                                            {feature.title}
                                        </Typography>
                                        <Typography color="text.secondary">{feature.description}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Stats Section */}
            <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4} sx={{ textAlign: 'center' }}>
                        {[
                            { value: '10K+', label: 'Scans Effectués' },
                            { value: '5K+', label: 'Vulnérabilités Détectées' },
                            { value: '99.9%', label: 'Précision' },
                            { value: '24/7', label: 'Support' },
                        ].map((stat, index) => (
                            <Grid item xs={6} md={3} key={index}>
                                <Typography
                                    variant="h2"
                                    sx={{
                                        fontWeight: 700,
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                    }}
                                >
                                    {stat.value}
                                </Typography>
                                <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
                                    {stat.label}
                                </Typography>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* CTA Section */}
            <Box
                sx={{
                    py: 12,
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(
                        theme.palette.secondary.main,
                        0.1
                    )})`,
                    textAlign: 'center',
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h2" gutterBottom>
                        Prêt à sécuriser votre infrastructure ?
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                        Commencez votre premier scan gratuitement dès maintenant
                    </Typography>
                    <Button
                        component={Link}
                        to="/register"
                        variant="contained"
                        size="large"
                        startIcon={<RocketLaunchIcon />}
                        sx={{ px: 6, py: 2 }}
                    >
                        Démarrer maintenant
                    </Button>
                </Container>
            </Box>

            {/* Footer */}
            <Box component="footer" sx={{ py: 6, bgcolor: 'background.paper', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <img src="/logo.png" alt="ZeroThreat" style={{ height: 30, marginRight: 12 }} />
                                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                    ZeroThreat
                                </Typography>
                            </Box>
                            <Typography color="text.secondary">
                                Plateforme de cybersécurité professionnelle pour protéger vos infrastructures.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', gap: 3, justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                                <Button color="inherit" sx={{ color: 'text.secondary' }}>
                                    Confidentialité
                                </Button>
                                <Button color="inherit" sx={{ color: 'text.secondary' }}>
                                    Conditions
                                </Button>
                                <Button color="inherit" sx={{ color: 'text.secondary' }}>
                                    Contact
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid rgba(255,255,255,0.05)', textAlign: 'center' }}>
                        <Typography color="text.secondary">
                            &copy; {new Date().getFullYear()} ZeroThreat Security. Tous droits réservés.
                        </Typography>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}

export default LandingPage;
