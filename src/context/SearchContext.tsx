import * as React from 'react';

interface SearchContextValue {
    searchText: string;
    handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    children?: React.ReactNode;
}

export const SearchContext = React.createContext<SearchContextValue>({
    searchText: '',
    handleSearch: () => {},
});

export const useSearchContext = () => React.useContext(SearchContext);
