import React from 'react';
import {
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText,
} from 'material-ui/Form';
import Checkbox from 'material-ui/Checkbox';


export class Work extends React.Component {
  render() {
    const { work, workViewContext } = this.props;
    const { activateWork, deactivateWork, isSelectedWork } = workViewContext;

    return (
      <FormControlLabel
        control={
          <Checkbox
            checked={isSelectedWork(work.id)}
            onChange={(event, checked) => {
              if (!isSelectedWork(work.id)) {
                activateWork(work.id)
              } else {
                deactivateWork(work.id)
              }
            }}
            value={work.title}
          />
        }
        label={work.title}
      />
    );
  }
}
