import React, { useState, useMemo } from 'react';
import { debounce } from '../utils/debounce';
import { useGetWord } from '../hooks/useGetWords';
import { DEBOUNCE_LIMIT } from '../utils/constant';

// Material-UI imports
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';

function WordSearch() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

  // Debounced setter
  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => setDebouncedSearch(value), DEBOUNCE_LIMIT),
    []
  );

  const { data, isLoading, isError } = useGetWord({ query: debouncedSearch, limit: 10 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSetSearch(value);
  };

  const handleItemClick = (word: string, idx: number) => {
    setHighlightedIndex(idx);
    console.log('Word clicked is', word);
  };

  return (
    <Box sx={{ maxWidth: 500, margin: '2rem auto', padding: 2 }}>
      <TextField
        fullWidth
        label="Search words"
        variant="outlined"
        value={search}
        onChange={handleChange}
        sx={{
          backgroundColor: '#f5f5f5'
        }}
      />

      <Box sx={{ marginTop: 2, position: 'relative' }}>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {isError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            Failed to fetch words
          </Alert>
        )}

        {data && data.length === 0 && !isLoading && (
          <Alert severity="info" sx={{ mt: 2 }}>
            No matching word found
          </Alert>
        )}

        {/* Scrollable, fixed-height list */}
        {data && data.length > 0 && (
          <Box
            sx={{
              mt: 2,
              bgcolor: 'background.paper',
              borderRadius: 1,
              maxHeight: 300, // Fixed height
              overflowY: 'auto', // Scrollable
              border: '1px solid #ccc',
            }}
          >
            <List>
              {data.map((word: string, idx: number) => (
                <ListItemButton
                  key={idx}
                  selected={highlightedIndex === idx} // highlight selected item
                  onClick={() => handleItemClick(word, idx)}
                  sx={{
                    '&.Mui-selected': {
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                    },
                  }}
                >
                  <ListItemText primary={word} />
                </ListItemButton>
              ))}
            </List>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default WordSearch;
