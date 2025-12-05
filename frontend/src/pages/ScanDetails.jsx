import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Container,
    AppBar,
    Toolbar,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    Alert,
    Paper,
    Divider,
    alpha,
    useTheme,
} from '@mui/material';
import { ArrowBack, Security, BugReport, Language } from '@mui/icons-material';
import { Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { scanAPI } from '../services/api';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ScanDetails() {
    const { id } = useParams();
    const [scan, setScan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const theme = useTheme();

    const fetchScanDetails = useCallback(async () => {
        try {
            const response = await scanAPI.getById(id);
            setScan(response.data);
        } catch (err) {
            setError('Erreur lors du chargement des détails');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchScanDetails();
    }, [fetchScanDetails]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !scan) {
        return (
            <Container maxWidth="md" sx={{ py: 8 }}>
                <Alert severity="error">{error || 'Scan introuvable'}</Alert>
                <Button onClick={() => navigate('/dashboard')} sx={{ mt: 2 }}>
                    Retour au tableau de bord
                </Button>
            </Container>
        );
    }

    const portChartData = {
        labels: scan.nmapResults?.map((r) => `Port ${r.port}`) || [],
        datasets: [
            {
                data: scan.nmapResults?.map(() => 1) || [],
                backgroundColor: [
                    alpha(theme.palette.primary.main, 0.8),
                    alpha(theme.palette.secondary.main, 0.8),
                    alpha(theme.palette.success.main, 0.8),
                    alpha(theme.palette.warning.main, 0.8),
                    alpha(theme.palette.error.main, 0.8),
                ],
                borderWidth: 0,
            },
        ],
    };

    const vulnChartData = {
        labels: ['SQL', 'Web'],
        datasets: [
            {
                label: 'Vulnérabilités',
                data: [scan.sqlMapResults?.length || 0, scan.niktoResults?.length || 0],
                backgroundColor: [alpha(theme.palette.error.main, 0.8), alpha(theme.palette.warning.main, 0.8)],
                borderWidth: 0,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: theme.palette.text.primary,
                },
            },
        },
        scales: {
            y: {
                ticks: { color: theme.palette.text.secondary },
                grid: { color: alpha(theme.palette.text.secondary, 0.1) },
            },
            x: {
                ticks: { color: theme.palette.text.secondary },
                grid: { color: alpha(theme.palette.text.secondary, 0.1) },
            },
        },
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            {/* Navbar */}
            <AppBar position="sticky" elevation={0}>
                <Container maxWidth="xl">
                    <Toolbar>
                        <Button startIcon={<ArrowBack />} onClick={() => navigate('/dashboard')} sx={{ mr: 2, color: 'text.primary' }}>
                            Retour
                        </Button>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                            <img src="/logo.png" alt="ZeroThreat" style={{ height: 40, marginRight: 12 }} />
                            <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                ZeroThreat
                            </Typography>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Content */}
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Header */}
                <Card sx={{ mb: 4 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                                <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                                    Scan #{scan.id}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                    <Typography
                                        sx={{
                                            fontFamily: 'monospace',
                                            color: 'primary.main',
                                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                                            px: 2,
                                            py: 0.5,
                                            borderRadius: 1,
                                        }}
                                    >
                                        {scan.target}
                                    </Typography>
                                    <Typography color="text.secondary">
                                        {new Date(scan.timestamp).toLocaleString('fr-FR')}
                                    </Typography>
                                </Box>
                            </Box>
                            <Chip
                                label={scan.status}
                                color={scan.status === 'COMPLETED' ? 'success' : 'info'}
                                sx={{ fontWeight: 600 }}
                            />
                        </Box>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            bgcolor: alpha(theme.palette.success.main, 0.1),
                                            color: theme.palette.success.main,
                                            mr: 2,
                                        }}
                                    >
                                        <Security />
                                    </Box>
                                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                        {scan.nmapResults?.length || 0}
                                    </Typography>
                                </Box>
                                <Typography color="text.secondary">Ports ouverts</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            bgcolor: alpha(theme.palette.error.main, 0.1),
                                            color: theme.palette.error.main,
                                            mr: 2,
                                        }}
                                    >
                                        <BugReport />
                                    </Box>
                                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                        {scan.sqlMapResults?.length || 0}
                                    </Typography>
                                </Box>
                                <Typography color="text.secondary">Vulnérabilités SQL</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            bgcolor: alpha(theme.palette.warning.main, 0.1),
                                            color: theme.palette.warning.main,
                                            mr: 2,
                                        }}
                                    >
                                        <Language />
                                    </Box>
                                    <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                        {scan.niktoResults?.length || 0}
                                    </Typography>
                                </Box>
                                <Typography color="text.secondary">Vulnérabilités Web</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Charts */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                    Distribution des ports
                                </Typography>
                                <Box sx={{ height: 300 }}>
                                    {scan.nmapResults?.length > 0 ? (
                                        <Pie data={portChartData} options={{ ...chartOptions, plugins: { legend: { display: false } } }} />
                                    ) : (
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                                            <Typography color="text.secondary">Aucune donnée</Typography>
                                        </Box>
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                    Vulnérabilités détectées
                                </Typography>
                                <Box sx={{ height: 300 }}>
                                    <Bar data={vulnChartData} options={chartOptions} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Results Tables */}
                <Grid container spacing={3}>
                    {/* Nmap Results */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                    Résultats Nmap
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                {scan.nmapResults?.length > 0 ? (
                                    <TableContainer component={Paper} variant="outlined">
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Port</TableCell>
                                                    <TableCell>Protocole</TableCell>
                                                    <TableCell>Service</TableCell>
                                                    <TableCell>Version</TableCell>
                                                    <TableCell>État</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {scan.nmapResults.map((result) => (
                                                    <TableRow key={result.id}>
                                                        <TableCell>{result.port}</TableCell>
                                                        <TableCell>{result.protocol}</TableCell>
                                                        <TableCell>{result.service}</TableCell>
                                                        <TableCell>{result.version}</TableCell>
                                                        <TableCell>
                                                            <Chip label={result.state} size="small" color="success" />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                ) : (
                                    <Typography color="text.secondary">Aucun résultat</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* SQLMap Results */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                    Résultats SQLMap
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                {scan.sqlMapResults?.length > 0 ? (
                                    <TableContainer component={Paper} variant="outlined">
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Type</TableCell>
                                                    <TableCell>Paramètre</TableCell>
                                                    <TableCell>Payload</TableCell>
                                                    <TableCell>Description</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {scan.sqlMapResults.map((result) => (
                                                    <TableRow key={result.id}>
                                                        <TableCell>
                                                            <Chip label={result.vulnerabilityType} size="small" color="error" />
                                                        </TableCell>
                                                        <TableCell>{result.parameter}</TableCell>
                                                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                                                            {result.payload}
                                                        </TableCell>
                                                        <TableCell>{result.description}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                ) : (
                                    <Typography color="text.secondary">Aucune vulnérabilité détectée</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Nikto Results */}
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                                    Résultats Nikto
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                {scan.niktoResults?.length > 0 ? (
                                    <TableContainer component={Paper} variant="outlined">
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>OSVDB ID</TableCell>
                                                    <TableCell>Méthode</TableCell>
                                                    <TableCell>URI</TableCell>
                                                    <TableCell>Description</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {scan.niktoResults.map((result) => (
                                                    <TableRow key={result.id}>
                                                        <TableCell>{result.osvdbId}</TableCell>
                                                        <TableCell>
                                                            <Chip label={result.method} size="small" />
                                                        </TableCell>
                                                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.875rem' }}>
                                                            {result.uri}
                                                        </TableCell>
                                                        <TableCell>{result.description}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                ) : (
                                    <Typography color="text.secondary">Aucune vulnérabilité détectée</Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default ScanDetails;
