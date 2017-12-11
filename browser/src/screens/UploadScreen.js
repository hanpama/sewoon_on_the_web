import React from 'react';

import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Label } from 'office-ui-fabric-react/lib/Label';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';


class UploadScreen extends React.Component {
  render() {
    return (
      <div>
        <Label htmlFor="kmzfile">KMZ File</Label>
        <input type="file" name="kmzfile" />

        <TextField label='Name'/>
        <TextField label='Description' multiline={true} />

        <div style={{ marginTop: '10px', textAlign: 'right' }}>
          <DefaultButton
            primary={ true }
            data-automation-id='test'
            text='Upload'
            onClick={ console.log('Uploading...') }
          />
        </div>
      </div>
    )
  }
}

export default UploadScreen;
