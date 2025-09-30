import React, { useState, useMemo } from 'react';
import { debounce } from '../utils/debounce';
import { useGetWord } from '../hooks/useGetWords';
import { DEBOUNCE_LIMIT } from '../utils/constant';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

function WordSearch() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);

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
  
  const statusMessage = useMemo(() => {
    if (isLoading) return "Loading search results.";
    if (isError) return "Failed to fetch words.";
     if (data && data.length === 0 && search.length > 0) return "No matching word found.";
    if (data && data.length > 0) return `${data.length} results found.`;
    return "";
  }, [isLoading, isError, data, search.length]);


  return (   
     <Box sx={{ maxWidth: 500, padding: 2 }}>
      <TextField
        fullWidth
        label="Search words"
        variant="outlined"
        value={search}
        onChange={handleChange}
        sx={{
          backgroundColor: '#f5f5f5',
          width: 500
        }}
        inputProps={{
            role: 'combobox',
            'aria-autocomplete': 'list',
            'aria-controls': 'word-search-results',
            'aria-expanded': !!(data && data.length > 0)
        }}
      />
      {search && (
          <Typography gutterBottom sx={{ textAlign: 'center', py: 2   }}>
              Current Selected term is {search}
          </Typography>
      )}
      
      <Box sx={{ marginTop: 2, position: 'fixed' , width:500}}>
        <Box 
          aria-live="polite" 
          role="status" 
          sx={{ 
            position: 'absolute', 
            clip: 'rect(0 0 0 0)',
            width: 1, 
            height: 1, 
            overflow: 'hidden' 
          }}
        >
          {statusMessage}
        </Box>

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

        {data && data.length > 0 && (
          <Box
            id="word-search-results" 
            sx={{
              mt: 2,
              bgcolor: 'background.paper',
              borderRadius: 1,
              maxHeight: 300, 
              maxWidth:500,
              overflowY: 'auto', 
              border: '1px solid #ccc',
            }}
          >

            <List role="listbox">
              {data.map((word: string, idx: number) => (
                <ListItemButton
                  key={idx}
                  selected={highlightedIndex === idx}
                  onClick={() => handleItemClick(word, idx)}
                  role="option" 
                  aria-selected={highlightedIndex === idx} 
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
