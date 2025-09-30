import { memo, useCallback } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

interface WordListItemProps {
  word: string;
  index: number;
  isSelected: boolean;
  onClick: (word: string, index: number) => void;
}

export const WordListItem = memo(({ 
  word, 
  index, 
  isSelected, 
  onClick 
}: WordListItemProps) => {
  const handleClick = useCallback(() => {
    onClick(word, index);
  }, [word, index, onClick]);

  return (
    <ListItemButton
      selected={isSelected}
      onClick={handleClick}
      role="option"
      aria-selected={isSelected}
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
  );
});

WordListItem.displayName = 'WordListItem';