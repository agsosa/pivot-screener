import { Button } from 'antd';
import { React } from 'react';

export default function Contact() {
  return (
    <div>
      <Button
        type='link'
        onClick={() => {
          if (typeof window !== 'undefined') {
            window.open('mailto:aleej.gs@gmail.com', '_blank');
          }
        }}>
        <u>Contact</u>
      </Button>
    </div>
  );
}
