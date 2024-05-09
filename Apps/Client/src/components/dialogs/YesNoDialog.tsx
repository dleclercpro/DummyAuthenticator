import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import useYesNoDialogStyles from './YesNoDialogStyles';

interface Props {
    open: boolean,
    title: string,
    text: string,
    handleYes: () => Promise<void> | void,
    handleNo: () => Promise<void> | void,
    handleClose: () => Promise<void> | void,
}

const YesNoDialog: React.FC<Props> = (props) => {
  const { open, title, text, handleYes, handleNo, handleClose } = props;

  const { classes } = useYesNoDialogStyles();

  return (
    <Dialog
      className={classes.root}
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {text}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleNo} color='secondary' autoFocus>No</Button>
        <Button onClick={handleYes} color='secondary'>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default YesNoDialog;