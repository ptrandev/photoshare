import { useContext } from 'react';
import TokenContext from '../contexts/TokenContext';

const useToken = () => useContext(TokenContext);

export default useToken;