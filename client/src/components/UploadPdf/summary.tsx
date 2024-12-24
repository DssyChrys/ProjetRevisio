import React from 'react';

// Définir le type des props
interface SummaryProps {
  summary: string;
}

const Summary: React.FC<SummaryProps> = ({ summary }) => {
  return <div dangerouslySetInnerHTML={{ __html: summary }} />;
};

export default Summary;
