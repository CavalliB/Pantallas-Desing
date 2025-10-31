import * as React from 'react';
import { Crud } from '@toolpad/core/Crud';
import { useParams, useLocation } from 'react-router';
import {
    Button,
    TextField,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    IconButton,
    Paper,
    Box,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { salesDataSource, Sale, salesCache } from '../data/sales';
import BackButton from '../components/BackButton';
import {
    PageContainer,
    PageHeader,
    PageHeaderToolbar,
} from '@toolpad/core/PageContainer';

export default function SalesCrudPage() {
    const { saleId } = useParams();
    const location = useLocation();

    const currentId = saleId ?? (() => {
        const m = location.pathname.match(/\/sales\/(\d+)/);
        return m ? m[1] : undefined;
    })();

    const [items, setItems] = React.useState<any[]>([]);
    const [loadingItems, setLoadingItems] = React.useState(false);

    const total = React.useMemo(
        () => items.reduce((acc, it) => acc + (it.quantity * it.price || 0), 0),
        [items]
    );

    React.useEffect(() => {
        const load = async () => {
            if (currentId && !isNaN(Number(currentId))) {
                setLoadingItems(true);
                try {
                    if (salesDataSource && typeof salesDataSource.getOne === 'function') {
                        const record = await salesDataSource.getOne(Number(currentId));
                        const rawItems = Array.isArray((record as any).items)
                            ? (record as any).items
                            : [];
                        const normalized = rawItems.map((it: any, idx: number) => ({
                            id: it.id ?? Date.now() + idx,
                            productName: it.productName ?? '',
                            quantity:
                                typeof it.quantity === 'number'
                                    ? it.quantity
                                    : Number(it.quantity) || 0,
                            price:
                                typeof it.price === 'number'
                                    ? it.price
                                    : Number(it.price) || 0,
                        }));
                        setItems(normalized);
                    } else {
                        setItems([]);
                    }
                } finally {
                    setLoadingItems(false);
                }
            } else {
                setItems([]);
            }
        };
        load();
    }, [location.pathname, saleId]);

    const addItem = () =>
        setItems((s) => [
            ...s,
            {
                id: Date.now() + Math.floor(Math.random() * 1000),
                productName: '',
                quantity: 0,
                price: 0,
            },
        ]);

    const removeItem = (idx: number) => setItems((s) => s.filter((_, i) => i !== idx));

    const updateItem = (idx: number, field: string, value: any) =>
        setItems((s) => s.map((it, i) => (i === idx ? { ...it, [field]: value } : it)));

    const saveItems = async (id: number) => {
        try {
            if (salesDataSource && typeof salesDataSource.updateOne === 'function') {
                await salesDataSource.updateOne(Number(id), { items, total });
                window.location.reload();
            }
        } catch {
        }
    };

    const CustomToolbar = () => (
        <PageHeaderToolbar>
            {currentId && <BackButton to="/sales" />}
        </PageHeaderToolbar>
    );

    const CustomPageHeader = (headerProps: any) => {
        return <PageHeader {...headerProps} slots={{ toolbar: CustomToolbar }} />;
    };

    const CustomPageContainer = (props: any) => {
        return <PageContainer {...props} slots={{ header: CustomPageHeader }} />;
    };

    return (
        <>
            <Crud<Sale>
                dataSource={salesDataSource}
                dataSourceCache={salesCache}
                rootPath="/sales"
                initialPageSize={25}
                defaultValues={{
                    itemCount: 1,
                    items: [],
                    status: 'pendiente',
                    total: 0,
                }}
                pageTitles={{
                    show: `Venta ${saleId}`,
                    create: 'Nueva Venta',
                    edit: `Venta ${saleId} - Editar`,
                }}
                slots={{
                    pageContainer: CustomPageContainer,
                }}
            />

            {currentId && !isNaN(Number(currentId)) && Number(currentId) > 0 && (
                <Paper style={{ marginTop: 16, padding: 16 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">Productos</Typography>
                        <div>
                            <Button
                                startIcon={<AddIcon />}
                                variant="outlined"
                                onClick={addItem}
                                style={{ marginRight: 8 }}
                            >
                                Añadir
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => saveItems(Number(currentId))}
                                disabled={loadingItems}
                            >
                                Guardar Productos
                            </Button>
                        </div>
                    </Box>

                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Producto</TableCell>
                                <TableCell>Cantidad</TableCell>
                                <TableCell>Precio</TableCell>
                                <TableCell>Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {(items ?? []).map((it, idx) => (
                                <TableRow key={it.id ?? idx}>
                                    <TableCell>
                                        <TextField
                                            value={it.productName}
                                            onChange={(e) => updateItem(idx, 'productName', e.target.value)}
                                            placeholder="Nombre del producto"
                                            fullWidth
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            value={it.quantity}
                                            onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))}
                                            slotProps={{
                                                htmlInput: {
                                                    min: 0
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            value={it.price}
                                            onChange={(e) => updateItem(idx, 'price', Number(e.target.value))}
                                            slotProps={{
                                                htmlInput: {
                                                    min: 0,
                                                    step: '0.01'
                                                }
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => removeItem(idx)} size="small">
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Typography variant="h6">
                            Total: ${total.toFixed(2)}
                        </Typography>
                    </Box>
                </Paper>
            )}
        </>
    );
}