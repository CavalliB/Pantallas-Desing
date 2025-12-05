import * as React from 'react';
import {
    Box,
    Button,
    Paper,
    TextField,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    IconButton,
    MenuItem,
    Alert,
    Autocomplete,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Sale } from '../data/sales';
import { getProductsStore } from '../data/products';
import { getCustomersStore } from '../data/customers';

interface SaleFormProps {
    // CrudForm props might be passed, but we might not use all of them
    // We mainly need initial data if editing, and a way to save.
    // Crud passes `formState`, `onFieldChange`, `onSubmit` usually.
    // But since we are replacing the whole form, we can manage state internally
    // and call `onSubmit` with the final object.

    // Actually, `slots.form` in `Crud` expects a component that receives `CrudFormProps`.
    // Let's type it loosely to verify.
    formState?: any;
    onFieldChange?: any;
    onSubmit?: (data: any) => void;
    // We might get `dataSource` too.
}

export default function SaleForm(props: SaleFormProps) {
    const { formState, onSubmit } = props;
    const initialValues = formState?.values || {};

    const [date, setDate] = React.useState(initialValues.date || new Date().toISOString().split('T')[0]); // YYYY-MM-DD
    const [customerName, setCustomerName] = React.useState(initialValues.customerName || '');
    const [paymentMethod, setPaymentMethod] = React.useState(initialValues.paymentMethod || 'efectivo');
    const [status, setStatus] = React.useState(initialValues.status || 'pendiente');

    // Auto-generate receipt if new and empty
    const generateReceipt = () => `CMP-${Date.now().toString().slice(-6)}`;
    const [comprobante, setComprobante] = React.useState(
        initialValues.comprobante || (initialValues.id ? '' : generateReceipt())
    );

    // Items state
    // initialValues.items might be undefined if creating new
    const [items, setItems] = React.useState<any[]>(initialValues.items || []);

    const [availableProducts] = React.useState(() => getProductsStore());
    const [availableCustomers] = React.useState(() => getCustomersStore());

    const total = React.useMemo(
        () => items.reduce((acc, it) => acc + (it.quantity * it.price || 0), 0),
        [items]
    );

    const addItem = () => {
        setItems((s) => [
            ...s,
            {
                id: Date.now() + Math.floor(Math.random() * 1000),
                productName: '', // This will be the selected product ID or Name? Name for now to match logic.
                // Wait, logic in sales.ts uses productName.
                // Better to use productId if possible, but existing data uses productName.
                // Let's stick to productName for compatibility but use a dropdown.
                quantity: 1,
                price: 0,
            },
        ]);
    };

    const removeItem = (idx: number) => {
        setItems((s) => s.filter((_, i) => i !== idx));
    };

    const updateItem = (idx: number, field: string, value: any) => {
        setItems((s) => s.map((it, i) => {
            if (i === idx) {
                const updated = { ...it, [field]: value };
                // If product changed, update price
                if (field === 'productName') {
                    const prod = availableProducts.find(p => p.nombre === value);
                    if (prod) {
                        updated.price = prod.precio;
                        updated.unit = prod.unidad; // store unit just in case
                    }
                }
                return updated;
            }
            return it;
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const saleData: Partial<Sale> = {
            ...initialValues,
            date: new Date(date).toISOString(),
            customerName,
            paymentMethod,
            status,
            comprobante,
            items,
            total,
        };
        if (onSubmit) {
            await onSubmit(saleData);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap={2} p={2}>
                <Typography variant="h6">Detalles de la Venta</Typography>

                <Box display="flex" gap={2}>
                    <TextField
                        label="Fecha"
                        type="date"
                        value={new Date(date).toISOString().split('T')[0]} // Handle date string format
                        onChange={(e) => setDate(e.target.value)}
                        slotProps={{ inputLabel: { shrink: true } }}
                    />

                    <Autocomplete
                        freeSolo
                        options={availableCustomers.map((c) => c.name)}
                        value={customerName}
                        onInputChange={(_, newValue) => setCustomerName(newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Cliente"
                                required={!customerName}
                                style={{ minWidth: 200 }}
                            />
                        )}
                        style={{ minWidth: 200 }}
                    />

                    <TextField
                        select
                        label="Método de Pago"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        style={{ minWidth: 150 }}
                    >
                        {['efectivo', 'tarjeta', 'transferencia'].map((m) => (
                            <MenuItem key={m} value={m}>{m}</MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        label="Estado"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        style={{ minWidth: 150 }}
                    >
                        {['pendiente', 'completada', 'cancelada'].map((s) => (
                            <MenuItem key={s} value={s}>{s}</MenuItem>
                        ))}
                    </TextField>
                </Box>

                 <TextField
                    label="Comprobante"
                    value={comprobante}
                    slotProps={{ input: { readOnly: true } }}
                    fullWidth
                />

                <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    <Typography variant="h6">Productos</Typography>
                    <Button startIcon={<AddIcon />} variant="outlined" onClick={addItem}>
                        Agregar Producto
                    </Button>
                </Box>

                <Paper variant="outlined">
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Producto</TableCell>
                                <TableCell width={100}>Cantidad</TableCell>
                                <TableCell width={100}>Precio</TableCell>
                                <TableCell width={100}>Subtotal</TableCell>
                                <TableCell width={50}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Typography color="textSecondary">No hay productos agregados</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                            {items.map((it, idx) => (
                                <TableRow key={it.id || idx}>
                                    <TableCell>
                                        <TextField
                                            select
                                            value={it.productName}
                                            onChange={(e) => updateItem(idx, 'productName', e.target.value)}
                                            fullWidth
                                            size="small"
                                            variant="standard"
                                        >
                                            {availableProducts.map((p) => (
                                                <MenuItem key={p.id} value={p.nombre}>
                                                    {p.nombre} (Stock: {p.stock})
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            value={it.quantity}
                                            onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))}
                                            size="small"
                                            variant="standard"
                                            slotProps={{ htmlInput: { min: 1 } }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            type="number"
                                            value={it.price}
                                            onChange={(e) => updateItem(idx, 'price', Number(e.target.value))}
                                            size="small"
                                            variant="standard"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        ${(it.quantity * it.price).toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton size="small" onClick={() => removeItem(idx)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>

                <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Typography variant="h5">Total: ${total.toFixed(2)}</Typography>
                </Box>

                <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
                    <Button variant="contained" type="submit">
                        Guardar Venta
                    </Button>
                </Box>
            </Box>
        </form>
    );
}
