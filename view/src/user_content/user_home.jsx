import React from 'react';
import Typography from '@material-ui/core/Typography';

const UserContent = ({ userName }) => (
  <div>
    <Typography variant="h6">{`Hey ${userName}, welcome`}</Typography>
    {/* Add other user-related content here */}
  </div>
);

export default UserContent;
