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
    Chip,
    useTheme,
    alpha,
    Stack,
    Divider,
} from '@mui/material';
import ShieldIcon from '@mui/icons-material/Shield';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SecurityIcon from '@mui/icons-material/Security';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

function LandingPage() {
    const theme = useTheme();

    const heroGradient = `radial-gradient(circle at 10% 20%, ${alpha(
        theme.palette.primary.main,
        0.18
    )} 0%, transparent 24%), radial-gradient(circle at 80% 0%, ${alpha(
        theme.palette.secondary.main,
        0.18
    )} 0%, transparent 26%), linear-gradient(135deg, #0b0f16 0%, #0f1724 60%, #0c121c 100%)`;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
            <AppBar position="sticky" elevation={0}>
                <Container maxWidth="lg">
                    <Toolbar sx={{ py: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexGrow: 1 }}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    '&:hover img': {
                                        transform: 'scale(1.05) rotate(5deg)',
                                    },
                                }}
                            >
                                <img
                                    src="/logo.png"
                                    alt="ZeroThreat"
                                    style={{
                                        height: 40,
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        filter: 'drop-shadow(0 0 8px rgba(124, 244, 194, 0.3))',
                                    }}
                                />
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                                    ZeroThreat
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Sécurité prédictive
                                </Typography>
                            </Box>
                        </Box>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Button component={Link} to="/login" color="inherit" sx={{ color: 'text.secondary' }}>
                                Connexion
                            </Button>
                            <Button component={Link} to="/register" variant="contained" startIcon={<RocketLaunchIcon />}>
                                Commencer
                            </Button>
                        </Stack>
                    </Toolbar>
                </Container>
            </AppBar>

            <Box
                className="animate-fade-in"
                sx={{
                    pt: { xs: 10, md: 14 },
                    pb: { xs: 10, md: 14 },
                    background: heroGradient,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: '-50%',
                        left: '-50%',
                        width: '200%',
                        height: '200%',
                        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 70%)`,
                        animation: 'float 20s ease-in-out infinite',
                    }
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={{ xs: 6, md: 4 }} alignItems="center">
                        <Grid item xs={12} md={7} className="animate-fade-in-up">
                            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                                <Chip
                                    icon={<ShieldIcon />}
                                    label="Surveillance continue"
                                    sx={{
                                        bgcolor: alpha(theme.palette.primary.main, 0.12),
                                        color: theme.palette.primary.contrastText,
                                        fontWeight: 700,
                                    }}
                                />
                                <Chip
                                    label="Nmap + SQLMap + Nikto"
                                    sx={{
                                        bgcolor: alpha(theme.palette.secondary.main, 0.14),
                                        color: theme.palette.text.primary,
                                        borderColor: alpha(theme.palette.text.primary, 0.12),
                                        borderWidth: 1,
                                        borderStyle: 'solid',
                                    }}
                                />
                            </Stack>
                            <Typography
                                variant="h1"
                                sx={{
                                    mb: 2.5,
                                    background: `linear-gradient(135deg, ${theme.palette.text.primary}, ${theme.palette.primary.main})`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Détectez les failles avant qu'elles ne deviennent des incidents.
                            </Typography>
                            <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: 720 }}>
                                ZeroThreat orchestre vos scans réseau, SQL et web dans une même interface. Lancez, surveillez
                                et partagez des rapports clairs sans scripts compliqués.
                            </Typography>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <Button
                                    component={Link}
                                    to="/register"
                                    variant="contained"
                                    size="large"
                                    startIcon={<RocketLaunchIcon />}
                                >
                                    Lancer un scan gratuit
                                </Button>
                                <Button href="#features" variant="outlined" size="large">
                                    Parcourir les capacités
                                </Button>
                            </Stack>
                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={3}
                                sx={{ mt: 5, color: 'text.secondary' }}
                            >
                                <Box>
                                    <Typography variant="h3">99.9%</Typography>
                                    <Typography>Uptime de l'API de scan</Typography>
                                </Box>
                                <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', sm: 'block' } }} />
                                <Box>
                                    <Typography variant="h3">12k+</Typography>
                                    <Typography>Analyses réseau consolidées</Typography>
                                </Box>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} md={5} className="animate-fade-in-up stagger-2">
                            <Card
                                className="hover-lift"
                                sx={{
                                    p: 3,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    background: `linear-gradient(145deg, ${alpha(
                                        theme.palette.background.paper,
                                        0.94
                                    )} 0%, ${alpha(theme.palette.background.paper, 0.86)} 100%)`,
                                    '&:hover': {
                                        '& .feature-icon': {
                                            transform: 'scale(1.1) rotate(5deg)',
                                        }
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: `radial-gradient(circle at 30% 20%, ${alpha(
                                            theme.palette.primary.main,
                                            0.12
                                        )}, transparent 40%), radial-gradient(circle at 90% 10%, ${alpha(
                                            theme.palette.secondary.main,
                                            0.12
                                        )}, transparent 35%)`,
                                        pointerEvents: 'none',
                                    }}
                                />
                                <Typography variant="overline" color="text.secondary">
                                    Instantané
                                </Typography>
                                <Typography variant="h5" sx={{ mb: 2 }}>
                                    Flux de détection unifié
                                </Typography>
                                <Stack spacing={2}>
                                    {[
                                        { title: 'Découverte réseau', value: 'Ports + services', icon: <SecurityIcon /> },
                                        { title: 'Surface web', value: 'Vulnérabilités Nikto', icon: <AutoAwesomeIcon /> },
                                        { title: 'Tests d’injection', value: 'SQLMap automatisé', icon: <QueryStatsIcon /> },
                                    ].map((item, idx) => (
                                        <Box
                                            key={item.title}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: alpha(theme.palette.common.white, 0.02),
                                                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Box
                                                    className="feature-icon"
                                                    sx={{
                                                        p: 1,
                                                        borderRadius: 2,
                                                        bgcolor: alpha(theme.palette.primary.main, 0.08),
                                                        color: theme.palette.primary.main,
                                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                                    }}
                                                >
                                                    {item.icon}
                                                </Box>
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                                        {item.title}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {item.value}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                            <Typography variant="subtitle2" color="text.secondary">
                                                Temps réel
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Box id="features" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.paper' }}>
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: 'center', mb: 8 }}>
                        <Chip
                            label="Conçu pour les équipes SecOps"
                            sx={{
                                bgcolor: alpha(theme.palette.primary.main, 0.12),
                                color: theme.palette.text.primary,
                                mb: 2,
                                fontWeight: 700,
                            }}
                        />
                        <Typography variant="h2" gutterBottom>
                            Tout votre arsenal, sans friction
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 720, mx: 'auto' }}>
                            Orchestration des scans, reporting clair et gouvernance des vulnérabilités en un seul endroit.
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        {[
                            {
                                title: 'Observabilité en direct',
                                desc: 'Suivez les ports ouverts, les services et les vulnérabilités en temps réel.',
                                badge: 'Live',
                            },
                            {
                                title: 'Rapports prêts à partager',
                                desc: 'Exports structurés pour les équipes produit, infra ou conformité.',
                                badge: 'Rapports',
                            },
                            {
                                title: 'Contrôle fin des cibles',
                                desc: 'Scannez une IP interne, un domaine public ou une URL spécifique.',
                                badge: 'Flex',
                            },
                        ].map((item) => (
                            <Grid item xs={12} md={4} key={item.title} className="animate-scale-in" sx={{ animationDelay: `${item.title === 'Observabilité en direct' ? '0.1s' : item.title === 'Rapports prêts à partager' ? '0.2s' : '0.3s'}` }}>
                                <Card className="hover-lift" sx={{ height: '100%', p: 3 }}>
                                    <Chip
                                        label={item.badge}
                                        sx={{
                                            bgcolor: alpha(theme.palette.primary.main, 0.12),
                                            color: theme.palette.primary.main,
                                            mb: 2,
                                            fontWeight: 700,
                                        }}
                                    />
                                    <Typography variant="h4" sx={{ mb: 1.5 }}>
                                        {item.title}
                                    </Typography>
                                    <Typography color="text.secondary">{item.desc}</Typography>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: alpha(theme.palette.background.paper, 0.7) }}>
                <Container maxWidth="lg">
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Card sx={{ p: 3, height: '100%' }}>
                                <Typography variant="overline" color="text.secondary">
                                    Fiabilité
                                </Typography>
                                <Typography variant="h3" sx={{ mb: 2 }}>
                                    Une couche de confiance pour vos pipelines
                                </Typography>
                                <Typography color="text.secondary">
                                    ZeroThreat s'intègre à vos environnements sans configurations lourdes. Les scans sont
                                    exécutés avec des limites maîtrisées et des journaux exploitables.
                                </Typography>
                                <Stack direction="row" spacing={2} sx={{ mt: 3, flexWrap: 'wrap' }}>
                                    {[
                                        { label: 'Alertes intelligentes', color: theme.palette.primary.main },
                                        { label: 'Priorisation automatique', color: theme.palette.secondary.main },
                                        { label: 'Vue consolidée', color: theme.palette.info.main },
                                    ].map((tag) => (
                                        <Chip
                                            key={tag.label}
                                            label={tag.label}
                                            sx={{
                                                bgcolor: alpha(tag.color, 0.14),
                                                color: tag.color,
                                                fontWeight: 700,
                                            }}
                                        />
                                    ))}
                                </Stack>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Card
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    background: `linear-gradient(145deg, ${alpha(
                                        theme.palette.primary.main,
                                        0.1
                                    )}, ${alpha(theme.palette.secondary.main, 0.08)})`,
                                }}
                            >
                                <Stack spacing={2}>
                                    {[
                                        { label: 'Scans réseau par jour', value: '450+' },
                                        { label: 'Règles de détection actives', value: '230' },
                                        { label: 'Temps moyen d’analyse', value: '02:10' },
                                        { label: 'Taux de faux positifs', value: '< 1.5%' },
                                    ].map((stat) => (
                                        <Box
                                            key={stat.label}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: alpha(theme.palette.common.white, 0.02),
                                                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                                            }}
                                        >
                                            <Typography color="text.secondary">{stat.label}</Typography>
                                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                                {stat.value}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            <Box
                sx={{
                    py: { xs: 8, md: 10 },
                    textAlign: 'center',
                    background: `linear-gradient(130deg, ${alpha(theme.palette.primary.main, 0.12)}, ${alpha(
                        theme.palette.secondary.main,
                        0.12
                    )})`,
                }}
            >
                <Container maxWidth="md">
                    <Typography variant="h2" gutterBottom>
                        Prêt à sécuriser votre surface d’attaque ?
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                        Lancer un scan prend moins de 30 secondes. Aucun script à maintenir, aucun détour.
                    </Typography>
                    <Button component={Link} to="/register" variant="contained" size="large" startIcon={<RocketLaunchIcon />}>
                        Démarrer maintenant
                    </Button>
                </Container>
            </Box>

            <Box
                component="footer"
                sx={{
                    py: 6,
                    bgcolor: 'background.paper',
                    borderTop: `1px solid ${alpha(theme.palette.text.primary, 0.08)}`,
                }}
            >
                <Container maxWidth="lg">
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                                <img src="/logo.png" alt="ZeroThreat" style={{ height: 32 }} />
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    ZeroThreat
                                </Typography>
                            </Box>
                            <Typography color="text.secondary">
                                Une plateforme de sécurité opérationnelle qui privilégie la clarté et la vitesse.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Stack direction="row" spacing={3} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                                <Button color="inherit" sx={{ color: 'text.secondary' }}>
                                    Confidentialité
                                </Button>
                                <Button color="inherit" sx={{ color: 'text.secondary' }}>
                                    Conditions
                                </Button>
                                <Button color="inherit" sx={{ color: 'text.secondary' }}>
                                    Contact
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 4, textAlign: 'center', color: 'text.secondary' }}>
                        &copy; {new Date().getFullYear()} ZeroThreat Security. Tous droits réservés.
                    </Box>
                </Container>
            </Box>
        </Box>
    );
}

export default LandingPage;
