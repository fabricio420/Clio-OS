import React from 'react';
import type { ModalView } from '../types';

interface ClioAIProps {
    activeView: ModalView | null;
    onDataReceived: (data: any) => void;
}

// Este componente foi desativado conforme solicitado.
const ClioAI: React.FC<ClioAIProps> = () => {
    return null;
};

export default ClioAI;