import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import './App.css'
import WordSearch from './components/WordSearch'
// Step 1 : Call the API and display the return
//  step 2 : display the component
// step 3 : is implement the onChange functionality
//  step 4: Implement the onClick 
// step 5   Add Enabled to prevent refetch + debounce
// step6  : add loading, isError, And No word found state
// step 7  ; Add style to make it pretty


// question
//  if no component then should i display nothing
//  called when i display something

//-- Good to have
//  useDebounce


// -----__RPduction

// TEST : Units tests / Integration
// Caching ;
// Non function
//  FIX styles 
// Add some other Minor 
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#72d219ff',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <WordSearch />
    </ThemeProvider>
  )
}

export default App
