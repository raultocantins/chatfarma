import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Typography from "@material-ui/core/Typography";

const FinishModal = ({ title, children, open, onClose, onConfirm, primaryText, secondaryText }) => {
	return (
		<Dialog
			open={open}
			onClose={() => onClose(false)}
			aria-labelledby="confirm-dialog"
		>
			<DialogTitle id="confirm-dialog">{title}</DialogTitle>
			<DialogContent dividers>
				<Typography>{children}</Typography>
			</DialogContent>
			<DialogActions>
				<Button
					variant="contained"
					onClick={() => {
						onClose(false);
						onConfirm(false)
					}
					}
					color="default"
				>
					{secondaryText}
				</Button>
				<Button
					variant="contained"
					onClick={() => {
						onClose(false);
						onConfirm(true);
					}}
					color="secondary"
				>
					{primaryText}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default FinishModal;
