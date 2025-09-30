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
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

function WordSearch() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [limit, setLimit] = useState('10'); 

  const debouncedSetSearch = useMemo(
    () => debounce((value: string) => setDebouncedSearch(value), DEBOUNCE_LIMIT),
    []
  );

  const { data, isLoading, isError } = useGetWord({ 
    query: debouncedSearch, 
    limit: parseInt(limit, 10)
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    debouncedSetSearch(value);
  };
  
  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimit(event.target.value);
  };

  const handleItemClick = (word: string, idx: number) => {
    setHighlightedIndex(idx);
    console.log('Word clicked is', word);
  };
  
  const statusMessage = useMemo(() => {
    if (isLoading) return "Loading search results.";
    if (isError) return "Failed to fetch words.";
    if (data && data.length === 0 && search.length > 0) return "No matching word found.";
    if (data && data.length > 0) return `${data.length} results found (Limit: ${limit}).`; 
    return "";
  }, [isLoading, isError, data, search.length, limit]);


  return (   
     <Box sx={{ maxWidth: 500, padding: 2, margin: '0 auto' }}> 
      
      <Typography variant="h5" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
        Reuters AutoComplete
      </Typography>

      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <FormLabel component="legend">Results Limit</FormLabel>
        <RadioGroup
          row
          name="result-limit-group"
          value={limit}
          onChange={handleLimitChange}
        >
          <FormControlLabel value="5" control={<Radio size="small" />} label="5" />
          <FormControlLabel value="10" control={<Radio size="small" />} label="10" />
          <FormControlLabel value="50" control={<Radio size="small" />} label="50" />
          <FormControlLabel value="100" control={<Radio size="small" />} label="100" />
        </RadioGroup>
      </FormControl>
 
      <TextField
        fullWidth
        label="Search words"
        variant="outlined"
        value={search}
        onChange={handleChange}
        sx={{
          backgroundColor: '#f5f5f5'
        }}
        inputProps={{
            maxLength : 30,
            role: 'combobox',
            'aria-autocomplete': 'list',
            'aria-controls': 'word-search-results',
            'aria-expanded': !!(data && data.length > 0)
        }}
      />
      
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