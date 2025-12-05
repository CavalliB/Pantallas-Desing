import * as React from 'react';
import { Crud } from '@toolpad/core/Crud';
import { useParams, useNavigate } from 'react-router';
import { useGridApiRef } from '@mui/x-data-grid';
import { Button, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { salesDataSource, Sale, salesCache } from '../data/sales';
import BackButton from '../components/BackButton';
import SearchToolbar from '../components/SearchToolbar';
import SaleForm from '../components/SaleForm';
import {
    PageContainer,
    PageHeader,
    PageHeaderToolbar,
} from '@toolpad/core/PageContainer';
import { SearchContext, useSearchContext } from '../context/SearchContext';

// Components outside
const CustomToolbar = () => {
    const { searchText, handleSearch, placeholder, children } = useSearchContext();
    return (
        <SearchToolbar value={searchText} onChange={handleSearch} placeholder={placeholder}>
            {children}
        </SearchToolbar>
    );
};

const CustomPageHeader = (headerProps: any) => {
    return <PageHeader {...headerProps} slots={{ toolbar: CustomToolbar }} />;
};

const CustomPageContainer = (props: any) => {
    return <PageContainer {...props} slots={{ header: CustomPageHeader }} />;
};

export default function SalesCrudPage() {
    const { saleId } = useParams();
    const navigate = useNavigate();
    const apiRef = useGridApiRef();
    const [searchText, setSearchText] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [editData, setEditData] = React.useState<any>(null);

    React.useEffect(() => {
        if (saleId && saleId !== 'new') {
            setLoading(true);
            salesDataSource.getOne(Number(saleId)).then((data) => {
                setEditData(data);
                setLoading(false);
            }).catch(() => setLoading(false));
        } else {
            setEditData(null);
        }
    }, [saleId]);

    const handleSearch = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchText(value);
        if (apiRef.current) {
            apiRef.current.setFilterModel({
                items: [],
                quickFilterValues: value ? [value] : [],
            });
        }
    }, [apiRef]);

    const handleCreate = () => {
        navigate('/sales/new');
    };

    const contextValue = React.useMemo(() => ({
        searchText,
        handleSearch,
        placeholder: "Buscar por cliente...",
        children: (
            <>
                {saleId ? <BackButton to="/sales" /> : (
                    <Button startIcon={<AddIcon />} variant="contained" onClick={handleCreate}>
                        Nueva Venta
                    </Button>
                )}
            </>
        )
    }), [searchText, handleSearch, saleId]);

    const handleSubmit = async (data: any) => {
        if (saleId && saleId !== 'new') {
            await salesDataSource.updateOne(Number(saleId), data);
        } else {
            await salesDataSource.createOne(data);
        }
        navigate('/sales');
    };

    if (saleId) {
        if (loading) return <CircularProgress />;

        const formState = {
            values: editData || {
                items: [],
                status: 'pendiente',
                total: 0,
                paymentMethod: 'efectivo',
                date: new Date().toISOString(),
            }
        };

        return (
            <PageContainer slots={{ header: CustomPageHeader }}>
                <SaleForm formState={formState} onSubmit={handleSubmit} />
            </PageContainer>
        );
    }

    return (
        <SearchContext.Provider value={contextValue}>
            <Crud<Sale>
                dataSource={salesDataSource}
                dataSourceCache={salesCache}
                rootPath="/sales"
                initialPageSize={25}
                slots={{
                    pageContainer: CustomPageContainer,
                }}
                slotProps={{
                    list: {
                        dataGrid: {
                            apiRef,
                        }
                    }
                }}
            />
        </SearchContext.Provider>
    );
}
