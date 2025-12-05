import * as React from 'react';
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { PageHeaderToolbar } from '@toolpad/core/PageContainer';

interface SearchToolbarProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    children?: React.ReactNode;
}

export default function SearchToolbar({ value, onChange, placeholder = "Buscar...", children }: SearchToolbarProps) {
    return (
        <PageHeaderToolbar>
            <TextField
                variant="outlined"
                size="small"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                slotProps={{
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }
                }}
            />
            {children}
        </PageHeaderToolbar>
    );
}
